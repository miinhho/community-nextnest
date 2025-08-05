import { BlockService } from '@/block/block.service';
import { ClientInfoType } from '@/common/decorator/client-info.decorator';
import { AlreadyLikeError } from '@/common/error/already-like.error';
import { LikeStatus } from '@/common/status';
import { UserData } from '@/common/user';
import { PageData, PageQueryType } from '@/common/utils/page';
import { PostCacheService } from '@/post/cache/post-cache.service';
import { PostRepository } from '@/post/post.repository';
import { PagedPost } from '@/post/post.types';
import { PrivateAuthError } from '@/private/error/private-auth.error';
import { PrivateService } from '@/private/private.service';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly privateService: PrivateService,
    private readonly blockService: BlockService,
    private readonly postCacheService: PostCacheService,
  ) {}

  /**
   * 새로운 게시글을 생성합니다.
   * @returns 생성된 게시글의 ID를 포함하는 객체
   * @throws {InternalServerErrorException} 게시글 작성 중 오류 발생 시
   */
  async createPost(props: { authorId: string; content: string }) {
    return this.postRepository.createPost(props);
  }

  /**
   * 기존 게시글을 수정합니다.
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 게시글 수정 중 오류 발생 시
   */
  async updatePost(props: { postId: string; content: string }) {
    return this.postRepository.updatePost(props);
  }

  /**
   * ID를 통해 특정 게시글을 조회합니다.
   * @throws {NotFoundException} 게시글을 찾을 수 없는 경우
   * @throws {UnauthorizedException} 비공개 게시글에 접근하려는 경우
   * @throws {ForbiddenException} 해당 게시글에 접근할 수 없는 경우
   * @throws {InternalServerErrorException} 게시글 조회 중 오류 발생 시
   */
  async findPostById(
    id: string,
    user?: UserData,
    { ipAddress, userAgent }: Partial<ClientInfoType> = {},
  ) {
    const post = await this.postRepository.findPostById(id);

    // 게시글이 비공개인 경우
    if (!post.author.isPrivate) {
      if (!user) {
        throw new PrivateAuthError();
      }
      const { id: userId, role } = user;
      // 비공개 게시글에 접근할 수 있는지 확인
      if (role !== Role.ADMIN && userId !== post.author.id) {
        await this.privateService.isUserAvailable(
          {
            userId: userId,
            targetId: post.author.id,
          },
          true,
        );
      }
    }

    // 24시간 이내 조회 여부 확인
    const isExistingView = await this.postRepository.isExistingPostView({
      userId: user?.id,
      postId: id,
      ipAddress,
      userAgent,
    });

    // 중복 조회 방지: 이미 조회한 경우 조회수 증가하지 않음
    if (!isExistingView) {
      await this.postRepository.addPostView({
        postId: id,
        userId: user?.id,
        ipAddress,
        userAgent,
      });
    }

    return post;
  }

  /**
   * 페이지네이션을 적용하여 게시글 목록을 조회합니다.
   *
   * 캐시된 게시글이 충분한 경우 캐시에서 조회하고, 그렇지 않은 경우 데이터베이스에서 조회합니다.
   * @throws {InternalServerErrorException} 목록 조회 중 오류 발생 시
   */
  async findPostsByPage(
    pageParams: PageQueryType,
    user?: UserData,
  ): Promise<PageData<PagedPost[]>> {
    const cachedPostSize = await this.postCacheService.getHotPostSize();
    if (cachedPostSize >= (pageParams.page + 1) * pageParams.size) {
      // 캐시된 핫 게시글이 충분한 경우 캐시에서 조회
      const cachedPosts = await this.postCacheService.getHotPosts(
        pageParams.page * pageParams.size,
        (pageParams.page + 1) * pageParams.size - 1,
      );
      return {
        data: cachedPosts,
        meta: {
          ...pageParams,
        },
      };
    }

    const posts = await this.postRepository.findPostsByPage(pageParams, user?.id);
    // 캐시된 핫 게시글 업데이트
    await this.postCacheService.setHotPost(posts.data);
    // hotScore 필드 제거
    const filteredPosts: PagedPost[] = posts.data.map(({ hotScore, ...post }) => ({
      ...post,
    }));

    return {
      data: filteredPosts,
      meta: {
        ...posts.meta,
      },
    };
  }

  /**
   * 특정 사용자가 작성한 게시글 목록을 페이지네이션으로 조회합니다.
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {PrivateAuthError} 비공개 사용자에 접근하려는 경우
   * @throws {PrivateDeniedError} 비공개 게시글에 접근하려는 경우
   * @throws {UserBlockedError} 내가 상대방을 차단한 경우
   * @throws {BlockedError} 상대방이 나를 차단한 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findPostsByUserId(userId: string, pageParams: PageQueryType, user?: UserData) {
    // 비공개 사용자 여부 확인
    const isPrivate = await this.privateService.isUserPrivate(userId);
    if (isPrivate) {
      if (!user) {
        throw new PrivateAuthError();
      }
      await this.privateService.isUserAvailable(
        {
          userId: user?.id,
          targetId: userId,
        },
        true,
      );
    }

    // 유저 정보가 존재할 시 차단 여부 확인
    if (user) {
      await this.blockService.isUserBlocked(
        {
          userId: user?.id,
          targetId: userId,
        },
        true,
      );
    }

    return this.postRepository.findPostsByUserId(userId, pageParams);
  }

  /**
   * ID를 통해 게시글을 삭제합니다.
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
   * @throws {ForbiddenException} 비공개 게시글이나 차단한 유저의 게시글에 접근하려는 경우
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
      if (isPrivate && role !== Role.ADMIN) {
        await this.privateService.isUserAvailable(
          {
            userId,
            targetId: authorId,
          },
          true,
        );
      }

      // 차단 여부 확인
      await this.blockService.isUserBlocked(
        {
          userId: user.id,
          targetId: authorId,
        },
        true,
      );

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
