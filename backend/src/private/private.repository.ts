import { PrismaErrorHandler } from '@/prisma/prisma-error.interceptor';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrivateRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 공개 여부를 업데이트합니다.
   * @param id - 업데이트할 사용자 ID
   * @param isPrivate - 공개 여부 (true: 비공개, false: 공개)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 업데이트 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 공개 여부 업데이트에 실패했습니다.',
  })
  async updateUserPrivacyById(id: string, isPrivate: boolean) {
    await this.prisma.user.update({
      where: { id },
      data: {
        isPrivate,
      },
      select: {},
    });
  }

  /**
   * ID를 통해 사용자 공개 여부를 조회합니다.
   * @param id - 조회할 사용자 ID
   * @returns 사용자 공개 여부 (true: 비공개, false: 공개)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 공개 여부 조회에 실패했습니다.',
  })
  async isUserPrivate(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        isPrivate: true,
      },
    });
    return !user.isPrivate;
  }

  /**
   * 특정 사용자에 해당 사용자가 접근할 수 있는지 확인합니다.
   * 사용자가 공개 상태이거나 비공개 상태이면서 사용자가 팔로워인 경우 true를 반환합니다.
   * @param props.userId - 요청하는 사용자 ID
   * @param props.targetId - 확인할 대상 사용자 ID
   * @returns 대상 사용자가 공개 상태이면 true, 비공개 상태이면서 팔로워인 경우에도 true, 그 외에는 false
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 공개 여부 확인에 실패했습니다.',
  })
  async isUserAvailable({ userId, targetId }: { userId: string; targetId: string }) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: targetId },
      select: {
        isPrivate: true,
        followers: {
          where: { followerId: userId },
        },
      },
    });
    return !user.isPrivate || user.followers.length > 0;
  }
}
