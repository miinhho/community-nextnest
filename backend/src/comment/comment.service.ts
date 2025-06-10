import { PrismaService } from '@/common/database/prisma.service';
import { commentSelections, userSelections } from '@/common/database/select';
import { LikeStatus } from '@/common/status/like-status';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(postId: string, authorId: string, content: string) {
    try {
      const comment = await this.prisma.$transaction([
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
      return comment[0];
    } catch {
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
      const comment = await this.prisma.$transaction([
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

      return comment[0];
    } catch {
      throw new InternalServerErrorException('댓글 답글 작성에 실패했습니다.');
    }
  }

  /**
   * @throws {ForbiddenException, NotFoundException, InternalServerErrorException}
   */
  async updateComment(
    commentId: string,
    content: string,
    userId: string,
    isAdmin: boolean = false,
  ) {
    try {
      const comment = await this.findCommentById(commentId);
      if (!isAdmin && comment.authorId !== userId) {
        throw new ForbiddenException('댓글 수정 권한이 없습니다.');
      }

      await this.prisma.comment.update({
        where: { id: commentId },
        data: {
          content,
        },
        select: {},
      });
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new InternalServerErrorException('댓글 수정에 실패했습니다.');
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
      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }
      return comment;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('댓글 조회에 실패했습니다.');
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
    } catch (err) {
      throw new InternalServerErrorException('사용자 댓글 조회에 실패했습니다.');
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
    } catch (err) {
      throw new InternalServerErrorException('댓글 조회에 실패했습니다.');
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
    } catch (err) {
      throw new InternalServerErrorException('댓글 답글 조회에 실패했습니다.');
    }
  }

  async deleteCommentById(commentId: string, userId: string, isAdmin: boolean = false) {
    try {
      const comment = await this.findCommentById(commentId);
      if (!isAdmin && comment.authorId !== userId) {
        throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
      }

      const deletedComment = await this.prisma.$transaction([
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
      return deletedComment[0];
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new InternalServerErrorException('댓글 삭제에 실패했습니다.');
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
      return LikeStatus.PLUS;
    } catch (err) {
      if (toggle && err.code === PrismaError.UniqueConstraintViolation) {
        return this.minusCommentLikes(userId, commentId);
      }
      throw new InternalServerErrorException('댓글 좋아요 추가에 실패했습니다.');
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

      return LikeStatus.MINUS;
    } catch {
      throw new InternalServerErrorException('댓글 좋아요 취소에 실패했습니다.');
    }
  }
}
