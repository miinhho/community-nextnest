import { CommentRepository } from '@/comment/comment.repository';
import { LikeStatus } from '@/common/status/like-status';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(postId: string, authorId: string, content: string) {
    return this.commentRepository.createComment(postId, authorId, content);
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
    return this.commentRepository.createCommentReply({
      authorId,
      postId,
      commentId,
      content,
    });
  }

  async updateComment(
    commentId: string,
    content: string,
    userId: string,
    isAdmin: boolean = false,
  ) {
    const comment = await this.findCommentById(commentId);
    if (!isAdmin && comment.authorId !== userId) {
      throw new ForbiddenException('댓글 수정 권한이 없습니다.');
    }

    await this.commentRepository.updateComment(commentId, content);
  }

  async findCommentById(id: string) {
    return this.commentRepository.findCommentById(id);
  }

  async findCommentsByUserId(userId: string, page: number = 1, size: number = 10) {
    const [comments, totalCount] = await this.commentRepository.findCommentsByUserId(
      userId,
      page,
      size,
    );

    return {
      totalCount,
      totalPage: Math.ceil(totalCount / size),
      comments,
    };
  }

  async findCommentsByPostId(postId: string, page: number = 1, size: number = 10) {
    const [comments, totalCount] = await this.commentRepository.findCommentsByPostId(
      postId,
      page,
      size,
    );

    return {
      totalCount,
      totalPage: Math.ceil(totalCount / size),
      comments,
    };
  }

  async findRepliesByCommentId(commentId: string, page: number = 1, size: number = 10) {
    return this.commentRepository.findRepliesByCommentId(commentId, page, size);
  }

  async deleteCommentById(commentId: string, userId: string, isAdmin: boolean = false) {
    const comment = await this.findCommentById(commentId);
    if (!isAdmin && comment.authorId !== userId) {
      throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
    }

    return this.commentRepository.deleteCommentById(comment);
  }

  async addCommentLikes(userId: string, commentId: string, toggle: boolean = true) {
    try {
      await this.commentRepository.addCommentLike(userId, commentId);
      return LikeStatus.PLUS;
    } catch (err) {
      if (toggle && err.code === PrismaError.UniqueConstraintViolation) {
        return this.minusCommentLikes(userId, commentId);
      }
      throw err;
    }
  }

  async minusCommentLikes(userId: string, commentId: string) {
    await this.commentRepository.minusCommentLike(userId, commentId);
    return LikeStatus.MINUS;
  }
}
