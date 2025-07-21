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
   * @throws {PrismaDBError} 차단 여부 확인 중 오류 발생 시
   */
  async isUserBlocked(props: { userId: string; targetId: string }, throwError = false) {
    const { userBlocked, targetBlocked } =
      await this.blockRepository.isUserBlocked(props);

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

  /**
   * 두 사용자가 한 명이라도 차단했는지 확인합니다.
   * @param props.userId - 첫 번째 사용자 ID
   * @param props.otherUserId - 두 번째 사용자 ID
   * @returns 두 사용자가 한 명이라도 차단했는지 여부 (true: 차단됨, false: 차단되지 않음)
   * @throws {PrismaDBError} 차단 여부 확인 중 오류 발생 시
   */
  async eachUserBlocked(props: { userId: string; otherUserId: string }) {
    return this.blockRepository.eachUserBlocked(props);
  }

  /**
   * 다른 사용자를 차단합니다.
   * @param props.userId - 차단하는 사용자 ID
   * @param props.targetId - 차단되는 사용자 ID
   * @throws {BadRequestException} 이미 차단된 사용자인 경우
   * @throws {PrismaDBError} 차단 중 오류 발생 시
   */
  async blockUser(props: { userId: string; targetId: string }) {
    return this.blockRepository.blockUser(props);
  }

  /**
   * 사용자가 차단한 사용자의 차단을 해제합니다.
   * @param props.userId - 차단 해제하는 사용자 ID
   * @param props.targetId - 차단 해제되는 사용자 ID
   * @throws {NotFoundException} 차단되지 않은 사용자인 경우
   * @throws {PrismaDBError} 차단 해제 중 오류 발생 시
   */
  async unblockUser(props: { userId: string; targetId: string }) {
    return this.blockRepository.unblockUser(props);
  }

  /**
   * 사용자가 차단한 사용자 목록을 조회합니다.
   * @param userId - 차단한 사용자 ID
   * @throws {PrismaDBError} 차단 목록 조회 중 오류 발생 시
   */
  async getBlockedUsers(userId: string) {
    return this.blockRepository.getBlockedUsers(userId);
  }

  /**
   * 사용자가 차단한 사용자 ID 목록을 Set 형태로 반환합니다.
   * @param userId - 차단한 사용자 ID
   * @throws {PrismaDBError} 차단 목록 조회 중 오류 발생 시
   */
  async getBlockedUsersId(userId: string) {
    const blockedUsers = await this.blockRepository.getBlockedUsers(userId);
    return new Set(blockedUsers.map((user) => user.blocked.id));
  }

  /**
   * 사용자를 차단한 사용자 목록을 조회합니다.
   * @param userId - 차단한 사용자 ID
   * @throws {PrismaDBError} 차단 목록 조회 중 오류 발생 시
   */
  async getBlockedByUsers(userId: string) {
    return this.blockRepository.getBlockedByUsers(userId);
  }

  /**
   * 사용자를 차단한 사용자 ID 목록을 Set 형태로 반환합니다.
   * @param userId - 차단한 사용자 ID
   * @throws {PrismaDBError} 차단 목록 조회 중 오류 발생 시
   */
  async getBlockedByUsersId(userId: string) {
    const blockedByUsers = await this.blockRepository.getBlockedByUsers(userId);
    return new Set(blockedByUsers.map((user) => user.blocker.id));
  }
}
