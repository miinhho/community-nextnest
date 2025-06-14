import { CommentRepository } from '@/comment/comment.repository';
import { LikeStatus } from '@/common/status/like-status';
import { PostService } from '@/post/post.service';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

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

  async updateComment(commentId: string, content: string) {
    await this.commentRepository.updateComment(commentId, content);
  }

  async findCommentById(id: string) {
    return this.commentRepository.findCommentById(id);
  }

  async findCommentsByUserId(userId: string, page: number = 1, size: number = 10) {
    await this.userService.validateUserExists(userId);
    return this.commentRepository.findCommentsByUserId(userId, page, size);
  }

  async findCommentsByPostId(postId: string, page: number = 1, size: number = 10) {
    await this.postService.validatePostExists(postId);
    return this.commentRepository.findCommentsByPostId(postId, page, size);
  }

  async findRepliesByCommentId(commentId: string, page: number = 1, size: number = 10) {
    await this.commentRepository.validateCommentExists(commentId);
    return this.commentRepository.findRepliesByCommentId(commentId, page, size);
  }

  async deleteCommentById(commentId: string) {
    const postId = await this.commentRepository.findPostIdByCommentId(commentId);
    return this.commentRepository.deleteCommentById(commentId, postId);
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

  async validateCommentExists(id: string) {
    return this.commentRepository.validateCommentExists(id);
  }
}
