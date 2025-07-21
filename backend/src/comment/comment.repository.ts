import { getBlockFilter } from '@/block/utils/block-filter';
import { AlreadyLikeError } from '@/common/error/already-like.error';
import { commentSelections, postSelections, userSelections } from '@/common/select';
import { PageParams, toPageData } from '@/common/utils/page';
import { PrismaDBError } from '@/prisma/error/prisma-db.error';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentRepository {
  private readonly logger = new Logger(CommentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 새 댓글을 생성합니다.
   * @param params.postId - 게시글 ID
   * @param params.authorId - 작성자 ID
   * @param params.content - 댓글 내용
   * @returns 생성된 댓글의 ID
   * @throws {NotFoundException} 게시글을 찾을 수 없는 경우
   * @throws {PrismaDBError} 댓글 작성 실패 시
   */
  async createComment({
    postId,
    authorId,
    content,
  }: {
    postId: string;
    authorId: string;
    content: string;
  }) {
    try {
      const result = await this.prisma.$transaction([
        this.prisma.comment.create({
          data: {
            content,
            authorId,
            postId,
          },
          select: {
            id: true,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            commentCount: { increment: 1 },
          },
          select: {},
        }),
      ]);
      return result[0];
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      this.logger.error('댓글 작성 중 오류 발생', err.stack, {
        postId,
        authorId,
      });
      throw new PrismaDBError('댓글 작성에 실패했습니다.', err.code);
    }
  }

  /**
   * 댓글에 대한 답글을 생성합니다.
   * @param params.authorId - 작성자 ID
   * @param params.postId - 게시글 ID
   * @param params.commentId - 부모 댓글 ID
   * @param params.content - 답글 내용
   * @returns 생성된 답글의 ID
   * @throws {NotFoundException} 게시글 또는 댓글을 찾을 수 없는 경우
   * @throws {PrismaDBError} 답글 작성 실패 시
   */
  async createCommentReply({
    authorId,
    postId,
    commentId,
    content,
  }: {
    authorId: string;
    postId: string;
    commentId: string;
    content: string;
  }) {
    try {
      const result = await this.prisma.$transaction([
        this.prisma.comment.create({
          data: {
            content,
            postId,
            authorId,
            parentId: commentId,
          },
          select: {
            id: true,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            commentCount: { increment: 1 },
          },
          select: {},
        }),
      ]);
      return result[0];
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('게시글 또는 댓글을 찾을 수 없습니다.');
      }

      this.logger.error('댓글 답글 작성 중 오류 발생', err.stack, {
        authorId,
        postId,
        commentId,
      });
      throw new PrismaDBError('댓글 답글 작성에 실패했습니다.', err.code);
    }
  }

  /**
   * 댓글 내용을 수정합니다.
   * @param params.commentId - 댓글 ID
   * @param params.content - 수정할 내용
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {PrismaDBError} 댓글 수정 실패 시
   */
  async updateComment({ commentId, content }: { commentId: string; content: string }) {
    try {
      await this.prisma.comment.update({
        where: { id: commentId },
        data: {
          content,
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      this.logger.error('댓글 수정 중 오류 발생', err.stack, {
        commentId,
      });
      throw new PrismaDBError('댓글 수정에 실패했습니다.', err.code);
    }
  }

  /**
   * ID로 댓글을 조회합니다.
   * @param id - 댓글 ID
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {PrismaDBError} 댓글 조회 실패 시
   */
  async findCommentById(id: string, viewerId?: string) {
    const selections = {
      ...commentSelections,
      author: {
        select: {
          ...userSelections,
          isPrivate: true,
        },
      },
    };
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          id,
          ...getBlockFilter(viewerId),
        },
        select: {
          ...selections,
          parent: {
            select: {
              ...selections,
            },
          },
          postId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      return comment;
    } catch (err) {
      this.logger.error('댓글 조회 중 오류 발생', err.stack, { id });
      throw new PrismaDBError('댓글 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 특정 사용자가 작성한 댓글 목록을 페이지네이션으로 조회합니다.
   * @param userId - 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {PrismaDBError} 댓글 조회 실패 시
   */
  async findCommentsByUserId(
    userId: string,
    { page = 1, size = 10 }: PageParams,
    viewerId?: string,
  ) {
    try {
      const filter = {
        authorId: userId,
        ...getBlockFilter(viewerId),
      };
      const [comments, totalCount] = await this.prisma.$transaction([
        this.prisma.comment.findMany({
          where: filter,
          select: {
            ...commentSelections,
            post: {
              select: {
                ...postSelections,
              },
            },
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.comment.count({
          where: filter,
        }),
      ]);

      return toPageData<typeof comments>({
        data: comments,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      this.logger.error('사용자 댓글 조회 중 오류 발생', err.stack, { userId });
      throw new PrismaDBError('댓글 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 특정 게시글의 최상위 댓글 목록을 페이지네이션으로 조회합니다.
   * @param postId - 게시글 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {PrismaDBError} 댓글 조회 실패 시
   */
  async findCommentsByPostId(
    postId: string,
    { page = 1, size = 10 }: PageParams,
    viewerId?: string,
  ) {
    try {
      const filter = {
        postId,
        parentId: null,
        ...getBlockFilter(viewerId),
      };
      const [comments, totalCount] = await this.prisma.$transaction([
        this.prisma.comment.findMany({
          where: filter,
          select: {
            ...commentSelections,
            author: {
              select: {
                ...userSelections,
              },
            },
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.comment.count({
          where: filter,
        }),
      ]);

      return toPageData<typeof comments>({
        data: comments,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      this.logger.error('게시글 댓글 조회 중 오류 발생', err.stack, { postId });
      throw new PrismaDBError('댓글 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 특정 댓글의 답글 목록을 페이지네이션으로 조회합니다.
   * @param commentId - 댓글 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {PrismaDBError} 답글 조회 실패 시
   */
  async findRepliesByCommentId(
    commentId: string,
    { page = 1, size = 10 }: PageParams,
    viewerId?: string,
  ) {
    try {
      const filter = {
        parentId: commentId,
        ...getBlockFilter(viewerId),
      };
      const [replies, totalCount] = await this.prisma.$transaction([
        this.prisma.comment.findMany({
          where: filter,
          select: {
            replies: {
              select: {
                ...commentSelections,
                author: {
                  select: {
                    ...userSelections,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
          skip: (page - 1) * size,
          take: size,
        }),
        this.prisma.comment.count({
          where: filter,
        }),
      ]);

      return toPageData<typeof replies>({
        data: replies,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      this.logger.error('댓글 답글 조회 중 오류 발생', err.stack, { commentId });
      throw new PrismaDBError('댓글 답글 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 댓글 ID로 해당 댓글이 속한 게시글의 ID를 조회합니다.
   * @param commentId - 댓글 ID
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {PrismaDBError} 게시글 ID 조회 실패 시
   */
  async findPostIdByCommentId(commentId: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
        select: { postId: true },
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      return comment.postId;
    } catch (err) {
      this.logger.error('댓글의 게시글 ID 조회 중 오류 발생', err.stack, { commentId });
      throw new PrismaDBError('게시글 ID 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 댓글을 삭제합니다.
   * @param params.commentId - 댓글 ID
   * @param params.postId - 게시글 ID
   * @returns 삭제된 댓글 정보
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우
   * @throws {PrismaDBError} 댓글 삭제 실패 시
   */
  async deleteCommentById({ commentId, postId }: { commentId: string; postId: string }) {
    try {
      const result = await this.prisma.$transaction([
        this.prisma.comment.delete({
          where: { id: commentId },
          select: {
            postId: true,
            authorId: true,
            content: true,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            commentCount: { decrement: 1 },
          },
          select: {},
        }),
      ]);
      return result[0];
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      this.logger.error('댓글 삭제 중 오류 발생', err.stack, {
        commentId,
        postId,
      });
      throw new PrismaDBError('댓글 삭제에 실패했습니다.', err.code);
    }
  }

  /**
   * 댓글에 좋아요를 추가합니다.
   * @param params.userId - 사용자 ID
   * @param params.commentId - 댓글 ID
   * @throws {AlreadyLikeError} 이미 좋아요를 누른 경우
   * @throws {NotFoundException} 댓글을 찾을 수 없거나 차단된 경우
   * @throws {PrismaDBError} 좋아요 추가 실패 시
   */
  async addCommentLike({ userId, commentId }: { userId: string; commentId: string }) {
    try {
      await this.prisma.$transaction([
        this.prisma.comment.findUniqueOrThrow({
          where: {
            id: commentId,
            ...getBlockFilter(userId),
          },
          select: {},
        }),
        this.prisma.commentLikes.create({
          data: {
            userId,
            commentId,
          },
          select: {},
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: {
            likesCount: { increment: 1 },
          },
          select: {},
        }),
      ]);
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new AlreadyLikeError(commentId, userId);
      }

      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      this.logger.error('댓글 좋아요 추가 중 오류 발생', err.stack, {
        userId,
        commentId,
      });
      throw new PrismaDBError('댓글 좋아요 추가에 실패했습니다.', err.code);
    }
  }

  /**
   * 댓글의 좋아요를 취소합니다.
   * @param params.userId - 좋아요를 취소하는사용자 ID
   * @param params.commentId - 좋아요를 취소할 댓글 ID
   * @throws {NotFoundException} 댓글을 찾을 수 없거나 좋아요를 누르지 않은 경우
   * @throws {PrismaDBError} 좋아요 취소 실패 시
   */
  async minusCommentLike({ userId, commentId }: { userId: string; commentId: string }) {
    try {
      await this.prisma.$transaction([
        this.prisma.commentLikes.delete({
          where: {
            userId_commentId: {
              userId,
              commentId,
            },
          },
          select: {},
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: {
            likesCount: { decrement: 1 },
          },
          select: {},
        }),
      ]);
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException(
          '댓글이 없거나, 해당 댓글에 좋아요를 누르지 않아서 취소할 수 없습니다.',
        );
      }

      this.logger.error('댓글 좋아요 취소 중 오류 발생', err.stack, {
        userId,
        commentId,
      });
      throw new PrismaDBError('댓글 좋아요 취소에 실패했습니다.', err.code);
    }
  }

  /**
   * 댓글 조회수를 증가시킵니다.
   * @param params.commentId - 댓글 ID
   * @param params.userId - 사용자 ID (선택)
   * @param params.ipAddress - IP 주소 (선택)
   * @param params.userAgent - User-Agent (선택)
   * @throws {PrismaDBError} 조회수 증가 실패 시
   */
  async addCommentView({
    userId,
    commentId,
    ipAddress,
    userAgent,
  }: {
    commentId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // userId 를 우선적으로 사용하고, 없으면 ipAddress와 userAgent를 사용
    const uniqueKey = userId
      ? { commentId, userId }
      : { commentId, ipAddress, userAgent };
    try {
      await this.prisma.$transaction([
        this.prisma.commentView.create({
          data: {
            ...uniqueKey,
          },
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: {
            viewCount: { increment: 1 },
          },
          select: {},
        }),
      ]);
    } catch (err) {
      // 이미 조회한 댓글인 경우 무시
      if (err.code === PrismaError.UniqueConstraintViolation) {
        return;
      }

      this.logger.error('댓글 조회수 증가 중 오류 발생', err.stack, {
        userId,
        commentId,
        ipAddress,
        userAgent,
      });
      throw new PrismaDBError('댓글 조회수 증가에 실패했습니다.', err.code);
    }
  }

  /**
   * 특정 댓글에 대한 조회 기록이 24시간 이내에 존재하는지 확인합니다.
   * @param params.commentId - 조회할 댓글 ID
   * @param params.userId - 조회를 시도한 사용자 ID (선택)
   * @param params.ipAddress - 조회를 시도한 IP 주소 (선택)
   * @param params.userAgent - 조회를 시도한 User-Agent (선택)
   * @returns 조회 기록이 존재하는지 여부
   * @throws {PrismaDBError} 조회 기록 확인 실패 시
   */
  async isExistingCommentView({
    userId,
    commentId,
    ipAddress,
    userAgent,
  }: {
    commentId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // userId 를 우선적으로 사용하고, 없으면 ipAddress와 userAgent를 사용
    const uniqueKey = userId
      ? { commentId, userId }
      : { commentId, ipAddress, userAgent };

    try {
      // 24시간 이내에 조회한 기록이 있는지 확인
      const view = await this.prisma.commentView.findFirst({
        where: {
          ...uniqueKey,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });
      return !!view;
    } catch (err) {
      this.logger.error('댓글 조회 기록 확인 중 오류 발생', err.stack, {
        userId,
        commentId,
        ipAddress,
        userAgent,
      });
      throw new PrismaDBError('댓글 조회 기록 확인에 실패했습니다.', err.code);
    }
  }
}
