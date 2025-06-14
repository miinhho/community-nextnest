import { LikeStatus } from '@/common/status/like-status';
import { PageParams } from '@/common/utils/page';
import { ValidateService } from '@/common/validate/validate.service';
import { AlreadyLikeError } from '@/post/error/already-like.error';
import { PostRepository } from '@/post/post.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly validateService: ValidateService,
  ) {}

  async createPost({ authorId, content }: { authorId: string; content: string }) {
    return this.postRepository.createPost({
      authorId,
      content,
    });
  }

  async updatePost({ id, content }: { id: string; content: string }) {
    return this.postRepository.updatePost({
      id,
      content,
    });
  }

  async findPostById(id: string) {
    return this.postRepository.findPostById(id);
  }

  async findPostsByPage(pageParams: PageParams) {
    return this.postRepository.findPostsByPage(pageParams);
  }

  async findPostCountByUserId(userId: string) {
    await this.validateService.validateUserExists(userId);
    return this.postRepository.findPostCountByUserId(userId);
  }

  async findPostsByUserId(userId: string, pageParams: PageParams) {
    await this.validateService.validateUserExists(userId);
    return this.postRepository.findPostsByUserId(userId, pageParams);
  }

  async deletePostById(postId: string) {
    return this.postRepository.deletePostById(postId);
  }

  async addPostLikes({
    userId,
    postId,
    toggle = true,
  }: {
    userId: string;
    postId: string;
    toggle?: boolean;
  }) {
    try {
      await this.validateService.validateUserExists(userId);
      await this.postRepository.addPostLikes({
        userId,
        postId,
      });
      return LikeStatus.PLUS;
    } catch (err) {
      if (toggle && err instanceof AlreadyLikeError) {
        return this.minusPostLikes({
          userId,
          postId,
        });
      }
      throw err;
    }
  }

  async minusPostLikes({ userId, postId }: { userId: string; postId: string }) {
    await this.postRepository.minusPostLikes({
      userId,
      postId,
    });
    return LikeStatus.MINUS;
  }
}
