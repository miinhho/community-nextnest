import { BlockRepository } from '@/block/block.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockService {
  constructor(private readonly blockRepository: BlockRepository) {}

  /**
   * 특정 사용자가 다른 사용자를 차단했는지 확인합니다.
   * @param props.userId - 차단 여부를 확인할 사용자 ID
   * @param props.targetId - 차단된 사용자의 ID
   * @returns 특정 사용자와 다른 사용자의 차단 관계 (true: 차단됨, false: 차단되지 않음)
   * @throws {InternalServerErrorException} 차단 여부 확인 중 오류 발생 시
   */
  async isUserBlocked(props: { userId: string; targetId: string }) {
    return this.blockRepository.isUserBlocked(props);
  }

  /**
   * 두 사용자가 한 명이라도 차단했는지 확인합니다.
   * @param props.userId - 첫 번째 사용자 ID
   * @param props.otherUserId - 두 번째 사용자 ID
   * @returns 두 사용자가 서로 차단했는지 여부 (true: 차단됨, false: 차단되지 않음)
   * @throws {InternalServerErrorException} 차단 여부 확인 중 오류 발생 시
   */
  async eachUserBlocked(props: { userId: string; otherUserId: string }) {
    return this.blockRepository.eachUserBlocked(props);
  }

  /**
   * 다른 사용자를 차단합니다.
   * @param props.userId - 차단하는 사용자 ID
   * @param props.targetId - 차단되는 사용자 ID
   * @throws {BadRequestException} 이미 차단된 사용자인 경우
   * @throws {InternalServerErrorException} 차단 중 오류 발생 시
   */
  async blockUser(props: { userId: string; targetId: string }) {
    return this.blockRepository.blockUser(props);
  }

  /**
   * 사용자가 차단한 사용자의 차단을 해제합니다.
   * @param props.userId - 차단 해제하는 사용자 ID
   * @param props.targetId - 차단 해제되는 사용자 ID
   * @throws {NotFoundException} 차단되지 않은 사용자인 경우
   * @throws {InternalServerErrorException} 차단 해제 중 오류 발생 시
   */
  async unblockUser(props: { userId: string; targetId: string }) {
    return this.blockRepository.unblockUser(props);
  }
}
