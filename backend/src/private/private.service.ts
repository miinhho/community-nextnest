import { PrivateRepository } from '@/private/private.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrivateService {
  constructor(private readonly privateRepository: PrivateRepository) {}

  /**
   * 사용자 공개 여부를 업데이트합니다.
   * @param id - 업데이트할 사용자 ID
   * @param isPrivate - 공개 여부 (true: 비공개, false: 공개)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 업데이트 중 오류 발생 시
   */
  async updateUserPrivacy(id: string, isPrivate: boolean) {
    return this.privateRepository.updateUserPrivacyById(id, isPrivate);
  }

  /**
   * ID를 통해 사용자 공개 여부를 조회합니다.
   * @param id - 조회할 사용자 ID
   * @returns 사용자 공개 여부 (true: 비공개, false: 공개)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async isUserPrivate(id: string) {
    return this.privateRepository.isUserPrivate(id);
  }

  /**
   * 특정 사용자에 해당 사용자가 접근할 수 있는지 확인합니다.
   * 사용자가 공개 상태이거나 비공개 상태이면서 사용자가 팔로워인 경우 true를 반환합니다.
   * @param params.userId - 요청하는 사용자 ID
   * @param params.targetId - 확인할 대상 사용자 ID
   * @returns 대상 사용자가 공개 상태이면 true, 비공개 상태이면서 팔로워인 경우에도 true, 그 외에는 false
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async isUserAvailable(params: { userId: string; targetId: string }) {
    return this.privateRepository.isUserAvailable(params);
  }
}
