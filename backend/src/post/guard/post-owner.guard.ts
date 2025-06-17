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

/**
 * 게시글 소유권을 확인하는 Guard 클래스
 * 현재 사용자가 게시글의 작성자이거나 관리자인지 검증합니다.
 */
@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly postRepository: PostRepository) {}

  /**
   * 사용자가 게시글에 대한 권한이 있는지 확인합니다.
   * @param context - 실행 컨텍스트 (HTTP 요청 정보 포함)
   * @returns 권한이 있으면 true, 없으면 예외 발생
   * @throws {ForbiddenException} 로그인하지 않은 경우
   * @throws {BadRequestException} 게시글 ID가 없는 경우
   * @throws {ForbiddenException} 게시글 수정 권한이 없는 경우
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우 (postRepository에서 발생)
   */
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

/**
 * 게시글 소유권 검증 데코레이터
 * 컨트롤러 메서드에 적용하여 게시글 작성자 또는 관리자만 접근할 수 있도록 제한합니다.
 *
 * @example
 *```
 * ＠PostOwner()
 * ＠Put('post/:id')
 * async updatePost(＠IdParam() postId: string) {
 *    게시글 작성자 또는 관리자만 접근 가능
 * }
 *```
 */
export function PostOwner() {
  return UseGuards(PostOwnerGuard);
}
