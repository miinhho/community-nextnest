import { PageParams } from '@/common/utils/page';
import { PrivateService } from '@/private/private.service';
import { UserRepository } from '@/user/user.repository';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly privateService: PrivateService,
  ) {}

  /**
   * 새로운 사용자를 생성합니다.
   * @param props.email - 사용자 이메일
   * @param props.password - 사용자 비밀번호
   * @param props.name - 사용자 이름
   * @returns 생성된 사용자 정보
   * @throws {InternalServerErrorException} 사용자 생성 중 오류 발생 시
   */
  async createUser(props: { email: string; password: string; name: string }) {
    return this.userRepository.createUser(props);
  }

  /**
   * 사용자 정보를 업데이트합니다.
   * @param id - 업데이트할 사용자 ID
   * @param dataToUpdate.name - 사용자 이름 (선택사항)
   * @param dataToUpdate.image - 사용자 프로필 이미지 (선택사항)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 업데이트 중 오류 발생 시
   */
  async updateUserById(id: string, dataToUpdate: { name?: string; image?: string }) {
    return this.userRepository.updateUserById(id, dataToUpdate);
  }

  /**
   * ID를 통해 사용자 상세 정보를 조회합니다.
   * @param id - 조회할 사용자 ID
   * @returns 사용자 정보 (팔로워/팔로잉/게시글 수 포함)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserById(
    id: string,
    {
      requesterId,
      role,
    }: {
      requesterId?: string | null;
      role?: Role;
    },
  ) {
    const { isPrivate, ...user } = await this.userRepository.findUserById(id);
    // 공개이거나, 관리자 권한을 가진 사용자이거나, 요청자가 본인인 경우
    if (!isPrivate || role === Role.ADMIN || requesterId === id) {
      return user;
    }

    if (!requesterId) {
      throw new UnauthorizedException(
        '사용자 정보에 접근할 수 없습니다. 인증이 필요합니다.',
      );
    }

    const isAvailable = await this.privateService.isUserAvailable({
      userId: requesterId,
      targetId: id,
    });

    if (!isAvailable) {
      throw new ForbiddenException('사용자 정보에 접근할 수 없습니다.');
    }

    // 팔로워인 경우에만 비공개 사용자 정보 반환
    return user;
  }

  /**
   * 이메일을 통해 사용자를 조회합니다.
   * @param email - 조회할 사용자 이메일
   * @param password - 비밀번호 포함 여부 (기본값: false)
   * @returns 사용자 정보
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserByEmail(email: string, password: boolean = false) {
    return this.userRepository.findUserByEmail(email, password);
  }

  /**
   * 이메일로 사용자 존재 여부를 확인합니다.
   * @param email - 확인할 사용자 이메일
   * @returns 사용자 존재 여부 (true/false)
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserExistsByEmail(email: string) {
    return this.userRepository.findUserExistsByEmail(email);
  }

  /**
   * 이름으로 사용자를 검색합니다 (페이지네이션 적용).
   * @param name - 검색할 사용자 이름 (부분 매칭)
   * @param pageParams.page - 페이지 번호 (기본값: 1)
   * @param pageParams.size - 페이지 크기 (기본값: 10)
   * @returns 페이지네이션이 적용된 사용자 목록과 총 개수 정보
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUsersByName(name: string, pageParams: PageParams) {
    return this.userRepository.findUsersByName(name, pageParams);
  }

  /**
   * ID를 통해 사용자를 삭제합니다.
   * @param id - 삭제할 사용자 ID
   * @returns 삭제된 사용자 정보 (ID, 이메일, 이름, 이미지)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  async deleteUserById(id: string) {
    return this.userRepository.deleteUserById(id);
  }

  /**
   * 이메일을 통해 사용자를 삭제합니다.
   * @param email - 삭제할 사용자 이메일
   * @returns 삭제된 사용자 정보 (ID, 이메일, 이름, 이미지)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  async deleteUserByEmail(email: string) {
    return this.userRepository.deleteUserByEmail(email);
  }
}
