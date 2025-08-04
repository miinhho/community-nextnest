import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import { NotifyRepository } from '@/notify/notify.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class NotifyService {
  constructor(private readonly notifyRepository: NotifyRepository) {}

  /**
   * 알림 ID로 알림을 조회합니다.
   *
   * 알림 타입에 따라 필요한 필드만 선택적으로 반환합니다.
   * @param id - 알림 ID
   *
   * @throws {NotFoundException} - 알림을 찾을 수 없는 경우
   * @throws {ForbiddenException} - 사용자가 해당 알림을 조회할 권한이 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   *
   * @type `POST_LIKE`: 게시글 좋아요 알림
   * @type `POST_COMMENT`: 게시글 댓글 알림
   * @type `COMMENT_LIKE`: 댓글 좋아요 알림
   * @type `COMMENT_REPLY`: 댓글 답글 알림
   * @type `FOLLOW`: 팔로우 알림
   * @type `SYSTEM`: 시스템 알림
   */
  async findNotifyById(id: string, user: UserData) {
    const notify = await this.notifyRepository.findNotifyById(id);
    if (notify?.user.id !== user.id) {
      throw new ForbiddenException('해당 알림을 조회할 권한이 없습니다.');
    }
    return notify;
  }

  /**
   * 사용자 ID로 알림 목록을 조회합니다.
   *
   * 페이지네이션을 지원하며, 기본적으로 최신 알림부터 반환합니다.
   *
   * @param userId - 사용자 ID
   * @param pageParams - 페이지네이션 정보 (page, size)
   * @throws {ForbiddenException} - 다른 사용자의 알림을 조회하려고 할 때
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  async findNotifiesByUserId(userId: string, pageParams: PageQueryType, user: UserData) {
    if (userId !== user.id) {
      throw new ForbiddenException('다른 사용자의 알림을 조회할 수 없습니다.');
    }
    return this.notifyRepository.findNotifiesByUserId(userId, pageParams);
  }

  /**
   * 게시글 좋아요 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param postId - 좋아요가 눌린 게시글 ID
   * @param viewerId - 좋아요를 누른 사용자 ID
   * @throws {NotFoundException} - 게시글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  async createPostLikeNotify(props: {
    userId: string;
    postId: string;
    viewerId: string;
  }) {
    return this.notifyRepository.createPostLikeNotify(props);
  }

  /**
   * 게시글 댓글 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param commentId - 댓글 ID
   * @throws {NotFoundException} - 게시글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  async createCommentNotify(props: { userId: string; commentId: string }) {
    return this.notifyRepository.createCommentNotify(props);
  }

  /**
   * 댓글 좋아요 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param commentId - 좋아요가 눌린 댓글 ID
   * @param viewerId - 좋아요를 누른 사용자 ID
   * @throws {NotFoundException} - 댓글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  async createCommentLikeNotify(props: {
    userId: string;
    commentId: string;
    viewerId: string;
  }) {
    return this.notifyRepository.createCommentLikeNotify(props);
  }

  /**
   * 댓글 답글 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param commentId - 댓글 ID
   * @param replyId - 답글 ID
   * @throws {NotFoundException} - 답글 또는 사용자를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  async createReplyNotify(props: { userId: string; commentId: string; replyId: string }) {
    return this.notifyRepository.createReplyNotify(props);
  }

  /**
   * 팔로우 알림을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param followerId - 팔로우한 사용자 ID
   * @throws {NotFoundException} - 사용자 또는 팔로워를 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  async createFollowNotify(props: { userId: string; followerId: string }) {
    return this.notifyRepository.createFollowNotify(props);
  }

  /**
   * 시스템 알람을 생성합니다.
   * @param userId - 알림을 받을 사용자 ID
   * @param title - 알림 제목
   * @param content - 알림 내용
   * @throws {InternalServerErrorException} - 알림 생성 중 오류 발생 시
   */
  async createSystemNotify(props: { userId: string; title: string; content: string }) {
    return this.notifyRepository.createSystemNotify(props);
  }

  /**
   * 알림을 읽음 처리합니다.
   * @param id - 알림 ID
   * @throws {NotFoundException} - 알림을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} - 알림 업데이트 중 오류 발생 시
   */
  async markAsRead(id: string, userId: string) {
    return this.notifyRepository.markAsRead(id, userId);
  }

  /**
   * 사용자의 모든 알림을 읽음 처리합니다.
   * @param userId - 사용자 ID
   * @throws {InternalServerErrorException} - 알림 업데이트 중 오류 발생 시
   */
  async markAllAsRead(userId: string) {
    return this.notifyRepository.markAllAsRead(userId);
  }
}
