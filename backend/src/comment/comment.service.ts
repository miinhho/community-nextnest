import { CommentRepository } from '@/comment/comment.repository';
import { ClientInfoType } from '@/common/decorator/client-info.decorator';
import { AlreadyLikeError } from '@/common/error/already-like.error';
import { LikeStatus } from '@/common/status';
import { UserData } from '@/common/user';
import { NotifyPublisher } from '@/notify/event/notify.publisher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly notifyPublisher: NotifyPublisher,
  ) {}

  /**
   * 새 댓글을 생성합니다.
   * @param props.postId - 게시글 ID
   * @param props.authorId - 작성자 ID
   * @param props.content - 댓글 내용
   * @returns 생성된 댓글의 ID
   * @throws {NotFoundException} 게시글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 댓글 작성 실패 시
   */
  async createComment(props: { postId: string; authorId: string; content: string }) {
    const { id: commentId } = await this.commentRepository.createComment(props);
    // 댓글 작성 후 게시글 작성자에게 댓글 알림 발행
    this.notifyPublisher.commentNofify(props.authorId, {
      commentId,
    });
    return commentId;
  }

  /**
   * 댓글에 대한 답글을 생성합니다.
   * @param props.authorId - 작성자 ID
   * @param props.postId - 게시글 ID
   * @param props.commentId - 부모 댓글 ID
   * @param props.content - 답글 내용
   * @returns 생성된 답글의 ID
   * @throws {NotFoundException} 게시글 또는 댓글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 답글 작성 실패 시
   */
  async createCommentReply(props: {
    authorId: string;
    postId: string;
    commentId: string;
    content: string;
  }) {
    const { id: replyId } = await this.commentRepository.createCommentReply(props);
    // 답글 작성 후 부모 댓글 작성자에게 답글 알림 발행
    this.notifyPublisher.commentReplyNotify(props.authorId, {
      replyId,
      commentId: props.commentId,
    });
  }

  /**
   * ID로 댓글을 조회합니다.
   * @param id - 댓글 ID
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 댓글 조회 실패 시
   */
  async findCommentById(
    id: string,
    user?: UserData,
    { ipAddress, userAgent }: Partial<ClientInfoType> = {},
  ) {
    // 24시간 이내 조회 여부 확인
    const isExistingView = await this.commentRepository.isExistingCommentView({
      commentId: id,
      userId: user?.id,
      ipAddress,
      userAgent,
    });

    // 중복 조회 방지: 이미 조회한 경우 조회수 증가하지 않음
    if (!isExistingView) {
      await this.commentRepository.addCommentView({
        commentId: id,
        userId: user?.id,
        ipAddress,
        userAgent,
      });
    }

    return this.commentRepository.findCommentById(id, user?.id);
  }

  /**
   * 댓글을 삭제합니다.
   * @param commentId - 삭제할 댓글 ID
   * @returns 삭제된 댓글 정보
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 댓글 삭제 실패 시
   */
  async deleteCommentById(commentId: string) {
    const postId = await this.commentRepository.findPostIdByCommentId(commentId);
    return this.commentRepository.deleteCommentById({
      commentId,
      postId,
    });
  }

  /**
   * 댓글에 좋아요를 추가합니다. 이미 좋아요가 있는 경우 토글 옵션에 따라 처리됩니다.
   * @param params.userId - 사용자 ID
   * @param params.commentId - 댓글 ID
   * @param params.toggle - 이미 좋아요가 있을 때 취소 여부 (기본값: true)
   * @returns 좋아요 상태 (PLUS 또는 MINUS)
   * @throws {AlreadyLikeError} 이미 좋아요를 누른 경우 (toggle이 false일 때)
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 좋아요 추가 실패 시
   */
  async addCommentLikes({
    userId,
    commentId,
    toggle = true,
  }: {
    userId: string;
    commentId: string;
    toggle?: boolean;
  }) {
    try {
      const { authorId } = await this.commentRepository.addCommentLike({
        userId,
        commentId,
      });
      // 좋아요 추가 후 댓글 작성자에게 좋아요 알림 발행
      this.notifyPublisher.commentLikeNotify(authorId, {
        viewerId: userId,
        commentId,
      });
      return LikeStatus.PLUS;
    } catch (err) {
      // 이미 좋아요를 누른 경우 toggle 이 true 이면 좋아요를 취소
      if (toggle && err instanceof AlreadyLikeError) {
        return this.minusCommentLikes({
          userId,
          commentId,
        });
      }
      throw err;
    }
  }

  /**
   * 댓글의 좋아요를 취소합니다.
   * @param props.userId - 사용자 ID
   * @param props.commentId - 댓글 ID
   * @returns 좋아요 상태 (MINUS)
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 좋아요 취소 실패 시
   */
  async minusCommentLikes(props: { userId: string; commentId: string }) {
    await this.commentRepository.minusCommentLike(props);
    return LikeStatus.MINUS;
  }
}
