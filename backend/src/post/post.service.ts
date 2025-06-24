import { AlreadyLikeError } from '@/common/error/already-like.error';
import { LikeStatus } from '@/common/status';
import { UserData } from '@/common/user';
import { PageParams } from '@/common/utils/page';
import { PostRepository } from '@/post/post.repository';
import { PrivateService } from '@/private/private.service';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly privateService: PrivateService,
  ) {}

  /**
   * 새로운 게시글을 생성합니다.
   * @param props.authorId - 작성자 ID
   * @param props.content - 게시글 내용
   * @returns 생성된 게시글의 ID를 포함하는 객체
   * @throws {InternalServerErrorException} 게시글 작성 중 오류 발생 시
   */
  async createPost(props: { authorId: string; content: string }) {
    return this.postRepository.createPost(props);
  }

  /**
   * 기존 게시글을 수정합니다.
   * @param props.id - 수정할 게시글 ID
   * @param props.content - 새로운 게시글 내용
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 게시글 수정 중 오류 발생 시
   */
  async updatePost(props: { id: string; content: string }) {
    return this.postRepository.updatePost(props);
  }

  /**
   * ID를 통해 특정 게시글을 조회합니다.
   * @param id - 조회할 게시글 ID
   * @returns 게시글 정보 (내용, 생성/수정 시간, 작성자 정보, 좋아요/댓글 수)
   * @throws {NotFoundException} 게시글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 게시글 조회 중 오류 발생 시
   */
  async findPostById(id: string, user?: UserData) {
    const post = await this.postRepository.findPostById(id);
    if (!post.author.isPrivate) {
      return post;
    }
    if (!user) {
      throw new UnauthorizedException('비공개 게시글입니다, 로그인이 필요합니다.');
    }

    const { id: userId, role } = user;
    if (role === Role.ADMIN || userId === post.author.id) {
      return post;
    }

    const isAvailable = await this.privateService.isUserAvailable({
      userId: userId,
      targetId: post.author.id,
    });
    if (!isAvailable) {
      throw new ForbiddenException('해당 게시글에 접근할 수 없습니다.');
    }

    return post;
  }

  /**
   * 페이지네이션을 적용하여 게시글 목록을 조회합니다.
   * @param pageParams.page - 페이지 번호 (기본값: 1)
   * @param pageParams.size - 페이지 크기 (기본값: 10)
   * @returns 페이지네이션이 적용된 게시글 목록과 총 개수 정보
   * @throws {InternalServerErrorException} 목록 조회 중 오류 발생 시
   */
  async findPostsByPage(pageParams: PageParams) {
    return this.postRepository.findPostsByPage(pageParams);
  }

  /**
   * 특정 사용자가 작성한 게시글 목록을 페이지네이션으로 조회합니다.
   * @param userId - 조회할 사용자 ID
   * @param pageParams.page - 페이지 번호 (기본값: 1)
   * @param pageParams.size - 페이지 크기 (기본값: 10)
   * @returns 해당 사용자의 게시글 목록과 총 개수 정보
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {UnauthorizedException} 비공개 게시글에 접근하려는 경우
   * @throws {ForbiddenException} 해당 사용자의 게시글에 접근할 수 없는 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findPostsByUserId(userId: string, pageParams: PageParams, user?: UserData) {
    const isPrivate = await this.privateService.isUserPrivate(userId);
    if (isPrivate) {
      if (!user) {
        throw new UnauthorizedException('비공개 게시글입니다, 로그인이 필요합니다.');
      }
      const isAvailable = await this.privateService.isUserAvailable({
        userId: user?.id,
        targetId: userId,
      });
      if (!isAvailable) {
        throw new ForbiddenException('해당 사용자의 게시글에 접근할 수 없습니다.');
      }
    }
    return this.postRepository.findPostsByUserId(userId, pageParams);
  }

  /**
   * ID를 통해 게시글을 삭제합니다.
   * @param postId - 삭제할 게시글 ID
   * @returns 삭제된 게시글의 정보 (ID, 내용, 작성자 ID)
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  async deletePostById(postId: string) {
    return this.postRepository.deletePostById(postId);
  }

  /**
   * 게시글에 좋아요를 추가하거나 토글 기능을 수행합니다.
   * @param props.userId - 좋아요를 누르는 사용자 ID
   * @param props.postId - 좋아요를 받을 게시글 ID
   * @param props.toggle - 이미 좋아요를 누른 경우 취소할지 여부 (기본값: true)
   * @returns 좋아요 상태 (PLUS: 추가, MINUS: 취소)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {AlreadyLikeError} 이미 좋아요를 누른 경우 (toggle이 false일 때)
   * @throws {InternalServerErrorException} 좋아요 처리 중 오류 발생 시
   */
  async addPostLikes({
    user,
    postId,
    toggle = true,
  }: {
    user: UserData;
    postId: string;
    toggle?: boolean;
  }) {
    try {
      const { id: userId, role } = user;

      // 사용자 유효성 및 게시글 비공개 여부 검증
      const { isPrivate, authorId } = await this.postRepository.isPostPrivate(postId);
      if (isPrivate || role !== Role.ADMIN) {
        const isAvailable = await this.privateService.isUserAvailable({
          userId,
          targetId: authorId,
        });
        if (!isAvailable) {
          throw new ForbiddenException('해당 사용자의 게시글에 접근할 수 없습니다.');
        }
      }

      await this.postRepository.addPostLikes({
        userId,
        postId,
      });
      return LikeStatus.PLUS;
    } catch (err) {
      // 이미 좋아요를 누른 경우 toggle 이 true 이면 좋아요를 취소
      if (toggle && err instanceof AlreadyLikeError) {
        return this.minusPostLikes({
          userId: user.id,
          postId,
        });
      }
      throw err;
    }
  }

  /**
   * 게시글의 좋아요를 취소합니다.
   * @param props.userId - 좋아요를 취소하는 사용자 ID
   * @param props.postId - 좋아요를 취소할 게시글 ID
   * @returns 좋아요 취소 상태 (MINUS)
   * @throws {NotFoundException} 게시물이 없거나 좋아요를 누르지 않은 경우
   * @throws {InternalServerErrorException} 좋아요 취소 중 오류 발생 시
   */
  async minusPostLikes(props: { userId: string; postId: string }) {
    await this.postRepository.minusPostLikes(props);
    return LikeStatus.MINUS;
  }
}
