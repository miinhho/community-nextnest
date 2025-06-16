import { PrismaService } from '@/common/database/prisma.service';
import {
  commentSelections,
  postSelections,
  userSelections,
} from '@/common/database/select';
import { AlreadyLikeError } from '@/common/error/already-like.error';
import { PageParams, toPageData } from '@/common/utils/page';
import { ValidateService } from '@/common/validate/validate.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentRepository {
  private readonly logger = new Logger(CommentRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly validateService: ValidateService,
  ) {}

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
      throw new InternalServerErrorException('댓글 작성에 실패했습니다.');
    }
  }

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
      throw new InternalServerErrorException('댓글 답글 작성에 실패했습니다.');
    }
  }

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
      throw new InternalServerErrorException('댓글 수정에 실패했습니다.');
    }
  }

  async findCommentById(id: string) {
    const selections = {
      ...commentSelections,
      author: {
        select: {
          ...userSelections,
        },
      },
    };

    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
        select: {
          ...selections,
          parent: {
            select: {
              ...selections,
            },
          },
          replies: {
            select: {
              ...selections,
            },
            orderBy: { createdAt: 'desc' },
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
      throw new InternalServerErrorException('댓글 조회에 실패했습니다.');
    }
  }

  async findCommentsByUserId(userId: string, { page = 1, size = 10 }: PageParams) {
    try {
      await this.validateService.validateUserExists(userId);

      const [comments, totalCount] = await this.prisma.$transaction([
        this.prisma.comment.findMany({
          where: { authorId: userId },
          select: {
            ...commentSelections,
            postId: true,
            post: {
              select: {
                ...postSelections,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.comment.count({
          where: { authorId: userId },
        }),
      ]);

      return toPageData<typeof comments>({
        data: comments,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error('사용자 댓글 조회 중 오류 발생', err.stack, { userId });
      throw new InternalServerErrorException('댓글 조회에 실패했습니다.');
    }
  }

  async findCommentsByPostId(postId: string, { page = 1, size = 10 }: PageParams) {
    try {
      await this.validateService.validatePostExists(postId);

      const [comments, totalCount] = await this.prisma.$transaction([
        this.prisma.comment.findMany({
          where: { postId, parentId: null },
          select: {
            ...commentSelections,
            author: {
              select: {
                ...userSelections,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.comment.count({
          where: { postId, parentId: null },
        }),
      ]);

      return toPageData<typeof comments>({
        data: comments,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      this.logger.error('게시글 댓글 조회 중 오류 발생', err.stack, { postId });
      throw new InternalServerErrorException('댓글 조회에 실패했습니다.');
    }
  }

  async findRepliesByCommentId(commentId: string, { page = 1, size = 10 }: PageParams) {
    try {
      await this.validateService.validateCommentExists(commentId);

      return this.prisma.comment.findMany({
        where: { id: commentId },
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
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error('댓글 답글 조회 중 오류 발생', err.stack, { commentId });
      throw new InternalServerErrorException('댓글 답글 조회에 실패했습니다.');
    }
  }

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
      throw new InternalServerErrorException('게시글 ID 조회에 실패했습니다.');
    }
  }

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
      throw new InternalServerErrorException('댓글 삭제에 실패했습니다.');
    }
  }

  async addCommentLike({ userId, commentId }: { userId: string; commentId: string }) {
    try {
      await this.prisma.$transaction([
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
      throw new InternalServerErrorException('댓글 좋아요 추가에 실패했습니다.');
    }
  }

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
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: {
            likesCount: { decrement: 1 },
          },
        }),
      ]);
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      this.logger.error('댓글 좋아요 취소 중 오류 발생', err.stack, {
        userId,
        commentId,
      });
      throw new InternalServerErrorException('댓글 좋아요 취소에 실패했습니다.');
    }
  }
}
