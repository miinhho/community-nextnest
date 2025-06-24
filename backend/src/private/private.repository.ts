import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class PrivateRepository {
  private readonly logger = new Logger(PrivateRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 공개 여부를 업데이트합니다.
   * @param id - 업데이트할 사용자 ID
   * @param isPrivate - 공개 여부 (true: 비공개, false: 공개)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 업데이트 중 오류 발생 시
   */
  async updateUserPrivacyById(id: string, isPrivate: boolean) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          isPrivate,
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      this.logger.error('사용자 공개 여부 업데이트 중 오류 발생', err.stack, {
        userId: id,
      });
      throw new InternalServerErrorException('사용자 공개 여부 업데이트에 실패했습니다.');
    }
  }

  /**
   * ID를 통해 사용자 공개 여부를 조회합니다.
   * @param id - 조회할 사용자 ID
   * @returns 사용자 공개 여부 (true: 비공개, false: 공개)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async isUserPrivate(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          isPrivate: true,
        },
      });
      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      return !user.isPrivate;
    } catch (err) {
      this.logger.error('사용자 공개 여부 조회 중 오류 발생', err.stack, { userId: id });
      throw new InternalServerErrorException('사용자 공개 여부 조회에 실패했습니다.');
    }
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
  async isUserAvailable({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: targetId },
        select: {
          isPrivate: true,
          followers: {
            where: { followerId: userId },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      return !user.isPrivate || user.followers.length > 0;
    } catch (err) {
      this.logger.error('사용자 공개 여부 확인 중 오류 발생', err.stack, {
        userId,
        targetId,
      });
      throw new InternalServerErrorException('사용자 공개 여부 확인에 실패했습니다.');
    }
  }
}
