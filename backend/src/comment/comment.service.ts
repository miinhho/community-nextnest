import { PrismaService } from '@/lib/database/prisma.service';
import { commentSelections, userSelections } from '@/lib/database/select';
import { LikeStatus } from '@/lib/status/like-status';
import { Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(postId: string, authorId: string, content: string) {
    try {
      await this.prisma.$transaction([
        this.prisma.comment.create({
          data: {
            content,
            authorId,
            postId,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            commentCount: { increment: 1 },
          },
        }),
      ]);
      return true;
    } catch {
      return false;
    }
  }

  async createCommentReply({
    authorId,
    postId,
    commentId,
    content
  }: {
      authorId: string,
      postId: string,
      commentId: string,
    content: string,
  }) {
    try {
      await this.prisma.$transaction([
        this.prisma.comment.create({
          data: {
            content,
            postId,
            authorId,
            parentId: commentId,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            commentCount: { increment: 1 },
          },
        }),
      ]);
      return true;
    } catch {
      return false;
    }
  }

  async updateComment(
    id: string,
    dataToUpdate: {
      content?: string;
      postId?: string;
      authorId?: string;
    },
  ) {
    try {
      await this.prisma.comment.update({
        where: { id },
        data: {
          ...dataToUpdate,
        },
      });
      return true;
    } catch {
      return false;
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

  async findCommentsByUser(userId: string, page: number = 0, pageSize: number = 10) {
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
        skip: page * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return comments;
    } catch {
      return null;
    }
  }

  async findCommentsByPost(postId: string, page: number = 0, pageSize: number = 10) {
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
        skip: page * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });
      return comments;
    } catch {
      return null;
    }
  }

  async findRepliesByComment(commentId: string, page: number = 0, pageSize: number = 10) {
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
        skip: page * pageSize,
        take: pageSize,
      });
      return replies;
    } catch {
      return null;
    }
  }

  async deleteCommentById(commentId: string, postId: string) {
    try {
      await this.prisma.$transaction([
        this.prisma.comment.delete({
          where: { id: commentId },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            commentCount: { decrement: 1 },
          },
        }),
      ]);
      return true;
    } catch {
      return false;
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
            likesCount: { increment: 1 },
          },
        }),
      ]);

      return LikeStatus.MINUS_SUCCESS;
    } catch {
      return LikeStatus.MINUS_FAIL;
    }
  }
}
