import { PrismaService } from '@/common/database/prisma.service';
import {
  commentSelections,
  postSelections,
  userSelections,
} from '@/common/database/select';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class UserService {
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
    } catch {
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
    } catch {
      throw new InternalServerErrorException('사용자 정보 업데이트에 실패했습니다.');
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          posts: {
            select: {
              ...postSelections,
              commentCount: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          comments: {
            select: {
              ...commentSelections,
              postId: true,
            },
          },
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
          posts: true,
          createdAt: true,
          updatedAt: true,
          comments: true,
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
      throw new InternalServerErrorException('사용자 조회에 실패했습니다.');
    }
  }

  async findUsersByName(name: string, page: number = 1, size: number = 10) {
    try {
      const [totalCount, user] = await this.prisma.$transaction([
        this.prisma.user.count({
          where: {
            name: {
              startsWith: name,
            },
          },
        }),
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
          take: size,
        }),
      ]);

      if (totalCount === 0) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      return {
        users: user,
        totalCount,
        totalPage: Math.ceil(totalCount / size),
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
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
      throw new InternalServerErrorException('사용자 삭제에 실패했습니다.');
    }
  }
}
