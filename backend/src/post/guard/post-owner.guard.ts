import { isAdmin } from '@/common/user';
import { PostRepository } from '@/post/post.repository';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly postRepository: PostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = (request as Request).user;
    const postId = request.params.id || request.body.postId;

    if (!user) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }

    if (!postId) {
      throw new BadRequestException('게시글 ID가 필요합니다.');
    }

    if (isAdmin(user)) {
      return true;
    }

    const authorId = await this.postRepository.findPostAuthorId(postId);
    if (authorId !== user.id) {
      throw new ForbiddenException('게시글 수정 권한이 없습니다.');
    }
    return true;
  }
}

export function PostOwner() {
  return UseGuards(PostOwnerGuard);
}
