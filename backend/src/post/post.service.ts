import { LikeStatus } from '@/common/status/like-status';
import { AlreadyLikeError } from '@/post/error/already-like.error';
import { PostRepository } from '@/post/post.repository';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  async createPost(authorId: string, content: string) {
    return this.postRepository.createPost(authorId, content);
  }

  async updatePost(id: string, content: string) {
    return this.postRepository.updatePost(id, content);
  }

  async findPostById(id: string) {
    return this.postRepository.findPostById(id);
  }

  async findPostsByPage(page: number = 1, size: number = 10) {
    return this.postRepository.findPostsByPage(page, size);
  }

  async findPostCountByUserId(userId: string) {
    await this.userService.validateUserExists(userId);
    return this.postRepository.findPostCountByUserId(userId);
  }

  async findPostsByUserId(userId: string, page: number = 1, size: number = 10) {
    await this.userService.validateUserExists(userId);
    return this.postRepository.findPostsByUserId(userId, page, size);
  }

  async deletePostById(postId: string) {
    return this.postRepository.deletePostById(postId);
  }

  async addPostLikes(userId: string, postId: string, toggle: boolean = true) {
    try {
      await this.userService.validateUserExists(userId);
      await this.postRepository.addPostLikes(userId, postId);
      return LikeStatus.PLUS;
    } catch (err) {
      if (toggle && err instanceof AlreadyLikeError) {
        return this.minusPostLikes(userId, postId);
      }
      throw err;
    }
  }

  async minusPostLikes(userId: string, postId: string) {
    await this.postRepository.minusPostLikes(userId, postId);
    return LikeStatus.MINUS;
  }

  async validatePostExists(id: string) {
    return this.postRepository.validatePostExists(id);
  }
}
