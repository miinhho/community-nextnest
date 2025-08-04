import { getBlockFilter } from '@/block/utils/block-filter';
import { AlreadyLikeError } from '@/common/error/already-like.error';
import { postSelections, userSelections } from '@/common/select';
import { INITIAL_PAGE, PageQueryType, toPageData } from '@/common/utils/page';
import { PrismaErrorHandler } from '@/prisma/prisma-error.interceptor';
import { PrismaService } from '@/prisma/prisma.service';
import { PostRecommendService } from '@/recommend/post-recommend.service';
import { Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class PostRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recommendService: PostRecommendService,
  ) {}

  /**
   * 새로운 게시글을 생성합니다.
   * @param params.authorId - 작성자 ID
   * @param params.content - 게시글 내용
   * @returns 생성된 게시글의 ID를 포함하는 객체
   * @throws {InternalServerErrorException} 게시글 작성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '게시글 작성에 실패했습니다.',
  })
  async createPost({ authorId, content }: { authorId: string; content: string }) {
    return this.prisma.post.create({
      data: {
        content,
        authorId,
      },
      select: {
        id: true,
      },
    });
  }

  /**
   * 기존 게시글을 수정합니다.
   * @param params.id - 수정할 게시글 ID
   * @param params.content - 새로운 게시글 내용
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 게시글 수정 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 게시글입니다.',
    Default: '게시글 수정에 실패했습니다.',
  })
  async updatePost({ id, content }: { id: string; content: string }) {
    await this.prisma.post.update({
      where: { id },
      data: { content },
      select: {},
    });
  }

  /**
   * ID를 통해 특정 게시글을 조회합니다.
   * @param id - 조회할 게시글 ID
   * @param viewerId - 게시글을 조회하는 사용자의 ID (선택)
   * @throws {NotFoundException} 게시글을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 게시글 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '게시글을 찾을 수 없습니다.',
    Default: '게시글 조회에 실패했습니다.',
  })
  async findPostById(id: string, viewerId?: string) {
    return this.prisma.post.findUniqueOrThrow({
      where: {
        id,
        ...getBlockFilter(viewerId),
      },
      select: {
        content: true,
        createdAt: true,
        updatedAt: true,
        likeCount: true,
        commentCount: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            isPrivate: true,
          },
        },
      },
    });
  }

  /**
   * 게시글의 작성자 ID를 조회합니다.
   * @param id - 게시글 ID
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 게시글입니다.',
    Default: '게시글 작성자 조회에 실패했습니다',
  })
  async findPostAuthorId(id: string) {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id },
      select: { authorId: true },
    });
    return post.authorId;
  }

  /**
   * 페이지네이션을 적용하여 게시글 목록을 조회합니다.
   * @param params - 페이지네이션 정보 (page, size)
   * @throws {InternalServerErrorException} 목록 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '게시글 목록 조회에 실패했습니다.',
  })
  async findPostsByPage({ page, size }: PageQueryType = INITIAL_PAGE, viewerId?: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        author: {
          isPrivate: false,
          ...getBlockFilter(viewerId),
        },
      },
      select: {
        ...postSelections,
        commentCount: true,
        author: {
          select: {
            ...userSelections,
          },
        },
      },
      skip: page * size,
      take: size,
      orderBy: {
        hotScore: 'desc',
      },
    });

    return toPageData<typeof posts>({ data: posts, page, size });
  }

  /**
   * 특정 사용자가 작성한 게시글 목록을 페이지네이션으로 조회합니다.
   * @param userId - 조회할 사용자 ID
   * @param params - 페이지네이션 정보 (page, size)
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '사용자 게시글 조회에 실패했습니다.',
  })
  async findPostsByUserId(userId: string, { page, size }: PageQueryType = INITIAL_PAGE) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        ...postSelections,
        commentCount: true,
      },
      skip: page * size,
      take: size,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return toPageData<typeof posts>({
      data: posts,
      page,
      size,
    });
  }

  /**
   * 게시글의 비공개 여부를 조회합니다.
   * @param postId - 게시글 ID
   * @returns 게시글 작성자의 비공개 설정 여부 (true/false)
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 게시글입니다.',
    Default: '게시글 비공개 여부 조회에 실패했습니다.',
  })
  async isPostPrivate(postId: string) {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id: postId },
      select: {
        author: {
          select: {
            id: true,
            isPrivate: true,
          },
        },
      },
    });
    return {
      authorId: post.author.id,
      isPrivate: post.author.isPrivate,
    };
  }

  /**
   * ID를 통해 게시글을 삭제합니다.
   * @param id - 삭제할 게시글 ID
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 게시글입니다.',
    Default: '게시글 삭제 중 오류가 발생했습니다.',
  })
  async deletePostById(id: string) {
    return this.prisma.post.delete({
      where: { id },
      select: {
        id: true,
        content: true,
        authorId: true,
      },
    });
  }

  /**
   * 게시글에 좋아요를 추가합니다.
   * @param params.userId - 좋아요를 누르는 사용자 ID
   * @param params.postId - 좋아요를 받을 게시글 ID
   * @throws {AlreadyLikeError} 이미 좋아요를 누른 경우
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {InternalServerErrorException} 좋아요 추가 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 게시글입니다.',
    Default: '게시글 좋아요 추가에 실패했습니다.',
  })
  async addPostLikes({ userId, postId }: { userId: string; postId: string }) {
    try {
      const filter = {
        id: postId,
        ...getBlockFilter(userId),
      };
      return this.prisma.$transaction(async (tx) => {
        const post = await tx.post.findUniqueOrThrow({
          where: {
            ...filter,
          },
          select: {
            ...this.recommendService.recommendSelection,
          },
        });

        await tx.postLikes.create({
          data: {
            userId,
            postId,
          },
          select: {},
        });

        const newHotScore = this.recommendService.calculateHotScore({
          ...post,
          action: 'LIKE_ADD',
        });

        await tx.post.update({
          where: {
            ...filter,
          },
          data: {
            likeCount: { increment: 1 },
            hotScore: newHotScore,
          },
          select: {},
        });
      });
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new AlreadyLikeError(postId, userId);
      }
      throw err;
    }
  }

  /**
   * 게시글의 좋아요를 취소합니다.
   * @param params.userId - 좋아요를 취소하는 사용자 ID
   * @param params.postId - 좋아요를 취소할 게시글 ID
   * @throws {NotFoundException} 게시물이 없거나 좋아요를 누르지 않은 경우
   * @throws {InternalServerErrorException} 좋아요 취소 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound:
      '게시물이 없거나, 해당 게시물에 좋아요를 누르지 않아서 취소할 수 없습니다.',
    Default: '게시글 좋아요 취소에 실패했습니다.',
  })
  async minusPostLikes({ userId, postId }: { userId: string; postId: string }) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUniqueOrThrow({
        where: {
          id: postId,
        },
        select: {
          ...this.recommendService.recommendSelection,
        },
      });

      await tx.postLikes.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        select: {},
      });

      const newHotScore = this.recommendService.calculateHotScore({
        ...post,
        action: 'LIKE_MINUS',
      });

      await tx.post.update({
        where: { id: postId },
        data: {
          likeCount: { decrement: 1 },
          hotScore: newHotScore,
        },
        select: {},
      });
    });
  }

  /**
   * 게시글 조회수를 추가합니다.
   * @param params.postId - 게시글 ID
   * @param params.userId - 사용자 ID (선택)
   * @param params.ipAddress - IP 주소 (선택)
   * @param params.userAgent - User-Agent (선택)
   * @throws {InternalServerErrorException} 게시글 조회 추가 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '게시글 조회 추가에 실패했습니다.',
  })
  async addPostView({
    userId,
    postId,
    ipAddress,
    userAgent,
  }: {
    userId?: string;
    postId: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // userId 를 우선적으로 사용하고, 없으면 ipAddress와 userAgent를 사용
    const uniqueKey = userId ? { postId, userId } : { postId, ipAddress, userAgent };
    try {
      return this.prisma.$transaction(async (tx) => {
        const post = await tx.post.findUniqueOrThrow({
          where: {
            id: postId,
          },
          select: {
            ...this.recommendService.recommendSelection,
          },
        });
        await tx.postView.create({
          data: {
            ...uniqueKey,
          },
          select: {},
        });

        const newHotScore = this.recommendService.calculateHotScore({
          ...post,
          action: 'VIEW_ADD',
        });

        await tx.post.update({
          where: { id: postId },
          data: {
            viewCount: { increment: 1 },
            hotScore: newHotScore,
          },
          select: {},
        });
      });
    } catch (err) {
      // 이미 조회한 게시글인 경우 무시
      if (err.code === PrismaError.UniqueConstraintViolation) {
        return;
      }
      throw err;
    }
  }

  /**
   * 특정 게시글에 대한 조회 기록이 24시간 이내에 존재하는지 확인합니다.
   * @param params.postId - 조회할 게시글 ID
   * @param params.userId - 조회를 시도한 사용자 ID (선택)
   * @param params.ipAddress - 조회를 시도한 IP 주소 (선택)
   * @param params.userAgent - 조회를 시도한 User-Agent (선택)
   * @returns 조회 기록이 존재하는지 여부
   * @throws {InternalServerErrorException} 조회 여부 확인 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '게시글 조회 여부 확인에 실패했습니다.',
  })
  async isExistingPostView({
    userId,
    postId,
    ipAddress,
    userAgent,
  }: {
    postId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // userId 를 우선적으로 사용하고, 없으면 ipAddress와 userAgent를 사용
    const uniqueKey = userId ? { postId, userId } : { postId, ipAddress, userAgent };
    const view = await this.prisma.postView.findFirst({
      where: {
        ...uniqueKey,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
    return !!view;
  }
}
