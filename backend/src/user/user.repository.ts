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

  async findUserById(id: string) {
    try {
      const [user, followingCount, followerCount, postCount] =
        await this.prisma.$transaction([
          this.prisma.user.findUnique({
            where: { id },
            select: {
              ...userSelections,
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

  async findUserByEmail(email: string, password: boolean = false) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          ...userSelections,
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
