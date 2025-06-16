import { CommentRepository } from '@/comment/comment.repository';
import { isAdmin } from '@/common/user';
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
export class CommentOwnerGuard implements CanActivate {
  constructor(private readonly commentRepository: CommentRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = (request as Request).user;
    const commentId = request.params.id || request.body.commentId;

    if (!user) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }

    if (!commentId) {
      throw new BadRequestException('댓글 ID가 필요합니다.');
    }

    if (isAdmin(user)) {
      return true;
    }

    const comment = await this.commentRepository.findCommentById(commentId);
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('댓글 수정 권한이 없습니다.');
    }

    return true;
  }
}

export function CommentOwner() {
  return UseGuards(CommentOwnerGuard);
}
