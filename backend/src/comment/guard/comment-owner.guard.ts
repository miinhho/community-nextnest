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

/**
 * 다음 조건 중 하나라도 만족하면 접근을 허용합니다:
 * - 사용자가 관리자인 경우
 * - 댓글 작성자와 요청자가 동일한 경우
 */
@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(private readonly commentRepository: CommentRepository) {}

  /**
   * 댓글 소유자 권한을 확인합니다.
   *
   * @param {ExecutionContext} context - NestJS 실행 컨텍스트
   * @throws {ForbiddenException} 로그인이 필요하거나 댓글 수정 권한이 없는 경우
   * @throws {BadRequestException} 댓글 ID가 제공되지 않은 경우
   * @throws {NotFoundException} 댓글을 찾을 수 없는 경우 (commentRepository에서 발생)
   * @throws {InternalServerErrorException} 댓글 조회 실패 시 (commentRepository에서 발생)
   */
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

/**
 * 댓글 소유자만 접근할 수 있도록 제한합니다.
 *
 * URL 파라미터의 'id' 또는 요청 본문의 'commentId'를 통해 댓글을 식별합니다.
 *
 * @example
 * ```
 * ＠CommentOwner()
 * ＠Put(':id')
 * async updateComment(＠Param('id') id: string, ＠Body() dto: UpdateCommentDto) {
 *   // 댓글 작성자 또는 관리자만 접근 가능
 * }
 *
 * ＠CommentOwner()
 * ＠Delete()
 * async deleteComment(＠Body() dto: { commentId: string }) {
 *   // 댓글 작성자 또는 관리자만 접근 가능
 * }
 * ```
 */
export const CommentOwner = () => UseGuards(CommentOwnerGuard);
