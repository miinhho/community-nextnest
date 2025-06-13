import { PrismaService } from '@/common/database/prisma.service';
import { commentSelections, userSelections } from '@/common/database/select';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentRepository {
  private readonly logger = new Logger(CommentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createComment(postId: string, authorId: string, content: string) {
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

  async updateComment(commentId: string, content: string) {
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

  async findCommentsByUserId(userId: string, page: number = 1, size: number = 10) {
    try {
      return this.prisma.$transaction([
        this.prisma.comment.findMany({
          where: { authorId: userId },
          select: {
            ...commentSelections,
            postId: true,
            post: {
              select: {
                id: true,
                content: true,
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
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      this.logger.error('사용자 댓글 조회 중 오류 발생', err.stack, { userId });
      throw new InternalServerErrorException('댓글 조회에 실패했습니다.');
    }
  }

  async findCommentsByPostId(postId: string, page: number = 1, size: number = 10) {
    try {
      return this.prisma.$transaction([
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
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      this.logger.error('게시글 댓글 조회 중 오류 발생', err.stack, { postId });
      throw new InternalServerErrorException('댓글 조회에 실패했습니다.');
    }
  }

  async findRepliesByCommentId(commentId: string, page: number = 1, size: number = 10) {
    try {
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
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      this.logger.error('댓글 답글 조회 중 오류 발생', err.stack, { commentId });
      throw new InternalServerErrorException('댓글 답글 조회에 실패했습니다.');
    }
  }

  async deleteCommentById(comment: Comment) {
    try {
      const commentId = comment.id;
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
          where: { id: comment.postId },
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
        commentId: comment.id,
        userId: comment.authorId,
      });
      throw new InternalServerErrorException('댓글 삭제에 실패했습니다.');
    }
  }

  async addCommentLike(userId: string, commentId: string) {
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
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw err; // 이미 좋아요가 추가된 경우, 예외를 던져 호출자에게 처리하도록 함.
      }

      this.logger.error('댓글 좋아요 추가 중 오류 발생', err.stack, {
        userId,
        commentId,
      });
      throw new InternalServerErrorException('댓글 좋아요 추가에 실패했습니다.');
    }
  }

  async minusCommentLike(userId: string, commentId: string) {
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
