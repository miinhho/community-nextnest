import { UserData } from '@/common/user';
import { PrivateService } from '@/private/private.service';
import { UserRepository } from '@/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
   * @throws {BadRequestException} 이미 사용 중인 이메일인 경우
   * @throws {InternalServerErrorException} 사용자 생성 중 오류 발생 시
   */
  async createUser(props: { email: string; password: string; name: string }) {
    return this.userRepository.createUser(props);
  }

  /**
   * ID를 통해 사용자 상세 정보를 조회합니다 (관리자 권한).
   * @param id - 조회할 사용자 ID
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserByIdAsAdmin(id: string) {
    return this.userRepository.findUserById(id);
  }

  /**
   * ID를 통해 사용자 역할을 조회합니다.
   * @param id - 조회할 사용자 ID
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserRoleById(id: string) {
    return this.userRepository.findUserRoleById(id);
  }

  /**
   * ID를 통해 사용자 상세 정보를 조회합니다.
   * @param id - 조회할 사용자 ID
   * @param user - 현재 로그인한 사용자 정보 (선택)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {UnauthorizedException} 비공개 사용자 정보에 접근하려는 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserById(id: string, user?: UserData) {
    const { isPrivate, ...userData } = await this.userRepository.findUserById(id);
    // 공개이거나, 관리자 권한을 가진 사용자이거나, 요청자가 본인인 경우
    if (!isPrivate || user?.role === Role.ADMIN || user?.id === id) {
      return userData;
    }

    if (!user) {
      throw new UnauthorizedException('사용자 정보에 접근할 수 없습니다. 인증이 필요합니다.');
    }

    // 비공개 사용자 정보에 접근하려는 경우
    await this.privateService.isUserAvailable(
      {
        userId: user.id,
        targetId: id,
      },
      true,
    );

    return userData;
  }
  /**
   * 이메일을 통해 사용자를 조회합니다.
   * @param email - 조회할 사용자 이메일
   * @param password - 비밀번호 포함 여부 (기본값: false)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserByEmail(email: string, password: boolean = false) {
    return this.userRepository.findUserByEmail(email, password);
  }
}
