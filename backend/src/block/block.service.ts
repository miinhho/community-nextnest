import { BlockRepository } from '@/block/block.repository';
import { BlockedError } from '@/block/error/blocked.error';
import { UserBlockedError } from '@/block/error/user-blocked.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockService {
  constructor(private readonly blockRepository: BlockRepository) {}

  /**
   * 특정 사용자가 다른 사용자를 차단했는지 확인합니다.
   * @param props.userId - 차단 여부를 확인할 사용자 ID
   * @param props.targetId - 차단된 사용자의 ID
   * @param throwError - `false` 인 경우 boolean 정보만 반환하고, `true` 인 경우 예외를 발생시킴
   * @returns 특정 사용자와 다른 사용자의 차단 관계
   * - `userBlocked`: 내가 차단했는지 여부
   * - `targetBlocked`: 상대방이 나를 차단했는지 여부
   * @throws {UserBlockedError} 내가 상대방을 차단한 경우 (`throwError`가 `true` 일 때)
   * @throws {BlockedError} 상대방이 나를 차단한 경우 (`throwError`가 `true` 일 때)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 차단 여부 확인 중 오류 발생 시
   */
  async isUserBlocked(props: { userId: string; targetId: string }, throwError = false) {
    const { userBlocked, targetBlocked } = await this.blockRepository.isUserBlocked(props);

    if (throwError) {
      if (userBlocked) {
        throw new UserBlockedError(props.userId, props.targetId);
      }
      if (targetBlocked) {
        throw new BlockedError(props.userId, props.targetId);
      }
    }

    return {
      userBlocked,
      targetBlocked,
    };
  }
}
