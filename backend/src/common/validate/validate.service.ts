import { PrismaService } from '@/common/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ValidateService {
  constructor(private readonly prisma: PrismaService) {}

  async validateCommentExists(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
  }

  async validatePostExists(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }
  }

  async validateUserExists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
  }
}
