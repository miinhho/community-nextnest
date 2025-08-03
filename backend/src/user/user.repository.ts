import { userSelections } from '@/common/select';
import { PageParams, toPageData } from '@/common/utils/page';
import { PrismaErrorHandler } from '@/prisma/prisma-error.interceptor';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 새로운 사용자를 생성합니다.
   * @param params.email - 사용자 이메일
   * @param params.password - 사용자 비밀번호
   * @param params.name - 사용자 이름
   * @returns 생성된 사용자 정보
   * @throws {ConflictException} 이미 사용 중인 이메일인 경우
   * @throws {InternalServerErrorException} 사용자 생성 중 오류 발생 시
   */
  @PrismaErrorHandler({
    UniqueConstraintViolation: '이미 사용 중인 이메일입니다.',
    Default: '유저 생성에 실패했습니다.',
  })
  async createUser({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    return this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
      select: {
        id: true,
        role: true,
      },
    });
  }

  /**
   * 사용자 정보를 업데이트합니다.
   * @param id - 업데이트할 사용자 ID
   * @param dataToUpdate.name - 사용자 이름 (선택사항)
   * @param dataToUpdate.image - 사용자 프로필 이미지 (선택사항)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 업데이트 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 정보 업데이트에 실패했습니다.',
  })
  async updateUserById(id: string, dataToUpdate: { name?: string; image?: string }) {
    await this.prisma.user.update({
      where: { id },
      data: {
        ...dataToUpdate,
      },
      select: {},
    });
  }

  /**
   * ID를 통해 사용자 역할을 조회합니다.
   * @param id - 조회할 사용자 ID
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 역할 조회에 실패했습니다.',
  })
  async findUserRoleById(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        role: true,
      },
    });
    return user.role;
  }

  /**
   * ID를 통해 사용자 상세 정보를 조회합니다.
   * @param id - 조회할 사용자 ID
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 조회에 실패했습니다.',
  })
  async findUserById(id: string) {
    const [user, followingCount, followerCount, postCount] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          ...userSelections,
          role: true,
          email: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          isPrivate: true,
        },
      }),
      this.prisma.follow.count({ where: { followingId: id } }),
      this.prisma.follow.count({ where: { followerId: id } }),
      this.prisma.post.count({ where: { authorId: id } }),
    ]);

    return {
      ...user,
      followingCount,
      followerCount,
      postCount,
    };
  }

  /**
   * 이메일을 통해 사용자를 조회합니다.
   * @param email - 조회할 사용자 이메일
   * @param password - 비밀번호 포함 여부 (기본값: false)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 조회에 실패했습니다.',
  })
  async findUserByEmail(email: string, password: boolean = false) {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
      select: {
        ...userSelections,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        password: password,
      },
    });
  }

  /**
   * 이메일로 사용자 존재 여부를 확인합니다.
   * @param email - 확인할 사용자 이메일
   * @returns 사용자 존재 여부 (true/false)
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '사용자 존재 여부 조회에 실패했습니다.',
  })
  async findUserExistsByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });
    return !!user;
  }

  /**
   * 이름으로 사용자를 검색합니다 (페이지네이션 적용).
   * @param name - 검색할 사용자 이름 (부분 매칭)
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '사용자 조회에 실패했습니다.',
  })
  async findUsersByName(name: string, { page = 1, size = 10 }: PageParams) {
    const [user, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          name: {
            startsWith: name,
          },
        },
        select: {
          ...userSelections,
        },
        skip: (page - 1) * size,
      }),
      this.prisma.user.count({
        where: {
          name: {
            startsWith: name,
          },
        },
      }),
    ]);

    return toPageData<typeof user>({
      data: user,
      totalCount,
      page,
      size,
    });
  }

  /**
   * ID를 통해 사용자를 삭제합니다.
   * @param id - 삭제할 사용자 ID
   * @returns 삭제된 사용자 정보
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 삭제에 실패했습니다.',
  })
  async deleteUserById(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
  }

  /**
   * 이메일을 통해 사용자를 삭제합니다.
   * @param email - 삭제할 사용자 이메일
   * @returns 삭제된 사용자 정보
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자를 찾을 수 없습니다.',
    Default: '사용자 삭제에 실패했습니다.',
  })
  async deleteUserByEmail(email: string) {
    return this.prisma.user.delete({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
  }
}
