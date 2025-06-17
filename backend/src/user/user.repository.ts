import { PrismaService } from '@/common/database/prisma.service';
import { userSelections } from '@/common/database/select';
import { PageParams, toPageData } from '@/common/utils/page';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 새로운 사용자를 생성합니다.
   * @param params.email - 사용자 이메일
   * @param params.password - 사용자 비밀번호
   * @param params.name - 사용자 이름
   * @returns 생성된 사용자 정보
   * @throws {InternalServerErrorException} 사용자 생성 중 오류 발생 시
   */
  async createUser({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password,
        },
      });
      return user;
    } catch (err) {
      this.logger.error('유저 생성 중 오류 발생', err.stack, { email, name });
      throw new InternalServerErrorException('유저 생성에 실패했습니다');
    }
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
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          ...dataToUpdate,
        },
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      this.logger.error('사용자 정보 업데이트 중 오류 발생', err.stack, {
        userId: id,
        dataToUpdate,
      });
      throw new InternalServerErrorException('사용자 정보 업데이트에 실패했습니다.');
    }
  }

  /**
   * ID를 통해 사용자 상세 정보를 조회합니다.
   * @param id - 조회할 사용자 ID
   * @returns 사용자 정보 (팔로워/팔로잉/게시글 수 포함)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserById(id: string) {
    try {
      const [user, followingCount, followerCount, postCount] =
        await this.prisma.$transaction([
          this.prisma.user.findUnique({
            where: { id },
            select: {
              ...userSelections,
              role: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          }),
          this.prisma.follow.count({
            where: { followingId: id },
          }),
          this.prisma.follow.count({
            where: { followerId: id },
          }),
          this.prisma.post.count({
            where: { authorId: id },
          }),
        ]);
      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }
      return {
        ...user,
        followingCount,
        followerCount,
        postCount,
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      this.logger.error('사용자 조회 중 오류 발생', err.stack, { userId: id });
      throw new InternalServerErrorException('사용자 조회에 실패했습니다.');
    }
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
    try {
      const user = await this.prisma.user.findUnique({
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
      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      this.logger.error('사용자 조회 중 오류 발생', err.stack, { email });
      throw new InternalServerErrorException('사용자 조회에 실패했습니다.');
    }
  }

  /**
   * 이메일로 사용자 존재 여부를 확인합니다.
   * @param email - 확인할 사용자 이메일
   * @returns 사용자 존재 여부 (true/false)
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUserExistsByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
        },
      });
      return !!user;
    } catch (err) {
      this.logger.error('사용자 존재 여부 조회 중 오류 발생', err.stack, { email });
      throw new InternalServerErrorException('사용자 존재 여부 조회에 실패했습니다.');
    }
  }

  /**
   * 이름으로 사용자를 검색합니다 (페이지네이션 적용).
   * @param name - 검색할 사용자 이름 (부분 매칭)
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @returns 페이지네이션이 적용된 사용자 목록과 총 개수 정보
   * @throws {InternalServerErrorException} 조회 중 오류 발생 시
   */
  async findUsersByName(name: string, { page = 1, size = 10 }: PageParams) {
    try {
      const [user, totalCount] = await this.prisma.$transaction([
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
    } catch (err) {
      this.logger.error('사용자 목록 조회 중 오류 발생', err.stack, { name });
      throw new InternalServerErrorException('사용자 조회에 실패했습니다.');
    }
  }

  /**
   * ID를 통해 사용자를 삭제합니다.
   * @param id - 삭제할 사용자 ID
   * @returns 삭제된 사용자 정보 (ID, 이메일, 이름, 이미지)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  async deleteUserById(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });
      return user;
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      this.logger.error('사용자 삭제 중 오류 발생', err.stack, { userId: id });
      throw new InternalServerErrorException('사용자 삭제에 실패했습니다.');
    }
  }

  /**
   * 이메일을 통해 사용자를 삭제합니다.
   * @param email - 삭제할 사용자 이메일
   * @returns 삭제된 사용자 정보 (ID, 이메일, 이름, 이미지)
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 삭제 중 오류 발생 시
   */
  async deleteUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });
      return user;
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      this.logger.error('사용자 삭제 중 오류 발생', err.stack, { email });
      throw new InternalServerErrorException('사용자 삭제에 실패했습니다.');
    }
  }
}
