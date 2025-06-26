import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ValidateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 댓글이 존재하는지 검증합니다.
   * @param id - 댓글 ID
   * @returns 댓글 정보
   * @throws {NotFoundException} 댓글이 존재하지 않는 경우
   */
  async validateCommentExists(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
    return comment;
  }

  /**
   * 게시글이 존재하는지 검증합니다.
   * @param id - 게시글 ID
   * @returns 게시글 정보
   * @throws {NotFoundException} 게시글이 존재하지 않는 경우
   */
  async validatePostExists(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }
    return post;
  }

  /**
   * 사용자가 존재하는지 검증합니다.
   * @param id - 사용자 ID
   * @returns 사용자 정보
   * @throws {NotFoundException} 사용자가 존재하지 않는 경우
   */
  async validateUserExists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }
}
