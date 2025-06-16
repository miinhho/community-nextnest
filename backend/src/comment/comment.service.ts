import { CommentRepository } from '@/comment/comment.repository';
import { AlreadyLikeError } from '@/common/error/already-like.error';
import { LikeStatus } from '@/common/status/like-status';
import { PageParams } from '@/common/utils/page';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(props: { postId: string; authorId: string; content: string }) {
    return this.commentRepository.createComment(props);
  }

  async createCommentReply(props: {
    authorId: string;
    postId: string;
    commentId: string;
    content: string;
  }) {
    return this.commentRepository.createCommentReply(props);
  }

  async updateComment(props: { commentId: string; content: string }) {
    await this.commentRepository.updateComment(props);
  }

  async findCommentById(id: string) {
    return this.commentRepository.findCommentById(id);
  }

  async findCommentsByUserId(userId: string, pageParams: PageParams) {
    return this.commentRepository.findCommentsByUserId(userId, pageParams);
  }

  async findCommentsByPostId(postId: string, pageParams: PageParams) {
    return this.commentRepository.findCommentsByPostId(postId, pageParams);
  }

  async findRepliesByCommentId(commentId: string, pageParams: PageParams) {
    return this.commentRepository.findRepliesByCommentId(commentId, pageParams);
  }

  async deleteCommentById(commentId: string) {
    const postId = await this.commentRepository.findPostIdByCommentId(commentId);
    return this.commentRepository.deleteCommentById({
      commentId,
      postId,
    });
  }

  async addCommentLikes({
    userId,
    commentId,
    toggle = true,
  }: {
    userId: string;
    commentId: string;
    toggle?: boolean;
  }) {
    try {
      await this.commentRepository.addCommentLike({
        userId,
        commentId,
      });
      return LikeStatus.PLUS;
    } catch (err) {
      // 이미 좋아요를 누른 경우 toggle 이 true 이면 좋아요를 취소
      if (toggle && err instanceof AlreadyLikeError) {
        return this.minusCommentLikes({
          userId,
          commentId,
        });
      }
      throw err;
    }
  }

  async minusCommentLikes(props: { userId: string; commentId: string }) {
    await this.commentRepository.minusCommentLike(props);
    return LikeStatus.MINUS;
  }
}
