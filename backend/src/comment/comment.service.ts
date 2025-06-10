import { PrismaService } from '@/common/database/prisma.service';
import { commentSelections, userSelections } from '@/common/database/select';
import { LikeStatus } from '@/common/status/like-status';
import { ResultStatus } from '@/common/status/result-status';
import { Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(postId: string, authorId: string, content: string) {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          content,
          authorId,
          postId,
        },
        select: {
          id: true,
        },
      });

      await this.prisma.post.update({
        where: { id: postId },
        data: {
          commentCount: { increment: 1 },
        },
      });
      return comment;
    } catch {
      return null;
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
      const comment = await this.prisma.comment.create({
        data: {
          content,
          postId,
          authorId,
          parentId: commentId,
        },
        select: {
          id: true,
        },
      });

      await this.prisma.post.update({
        where: { id: postId },
        data: {
          commentCount: { increment: 1 },
        },
      });

      return comment;
    } catch {
      return null;
    }
  }

  async updateComment(commentId: string, content: string, userId: string) {
    try {
      const comment = await this.findCommentById(commentId);
      if (!comment) {
        return ResultStatus.NOT_FOUND;
      }
      if (comment.authorId !== userId) {
        return ResultStatus.ACCESS_DENIED;
      }

      await this.prisma.comment.update({
        where: { id: commentId },
        data: {
          content,
        },
      });
      return ResultStatus.SUCCESS;
    } catch {
      return ResultStatus.ERROR;
    }
  }

  async findCommentById(id: string) {
    try {
      const selections = {
        ...commentSelections,
        author: {
          select: {
            ...userSelections,
          },
        },
      };

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
      return comment;
    } catch {
      return null;
    }
  }

  async findCommentsByUserId(userId: string, page: number = 0, size: number = 10) {
    try {
      const comments = await this.prisma.comment.findMany({
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
        skip: page * size,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return comments;
    } catch {
      return null;
    }
  }

  async findCommentsByPostId(postId: string, page: number = 0, size: number = 10) {
    try {
      const comments = await this.prisma.comment.findMany({
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
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      });
      return comments;
    } catch {
      return null;
    }
  }

  async findRepliesByCommentId(commentId: string, page: number = 0, size: number = 10) {
    try {
      const replies = await this.prisma.comment.findMany({
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
        skip: page * size,
        take: size,
      });
      return replies;
    } catch {
      return null;
    }
  }

  async deleteCommentById(commentId: string, userId: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return ResultStatus.NOT_FOUND;
      }
      if (comment.authorId !== userId) {
        return ResultStatus.ACCESS_DENIED;
      }

      await this.prisma.$transaction([
        this.prisma.comment.delete({
          where: { id: commentId },
        }),
        this.prisma.post.update({
          where: { id: comment.postId },
          data: {
            commentCount: { decrement: 1 },
          },
        }),
      ]);
      return ResultStatus.SUCCESS;
    } catch {
      return ResultStatus.ERROR;
    }
  }

  async addCommentLikes(
    userId: string,
    commentId: string,
    toggle: boolean = true,
  ): Promise<LikeStatus> {
    try {
      await this.prisma.$transaction([
        this.prisma.commentLikes.create({
          data: {
            userId,
            commentId,
          },
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: {
            likesCount: { increment: 1 },
          },
        }),
      ]);
      return LikeStatus.PLUS_SUCCESS;
    } catch (err: any) {
      if (toggle && err.code === PrismaError.UniqueConstraintViolation) {
        return this.minusCommentLikes(userId, commentId);
      }
      return LikeStatus.PLUS_FAIL;
    }
  }

  async minusCommentLikes(userId: string, commentId: string): Promise<LikeStatus> {
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

      return LikeStatus.MINUS_SUCCESS;
    } catch {
      return LikeStatus.MINUS_FAIL;
    }
  }
}
