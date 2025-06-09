import { PrismaService } from '@/lib/database/prisma.service';
import { commentSelections, postSelections, userSelections } from '@/lib/database/select';
import { Injectable } from '@nestjs/common';

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
    name?: string;
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
      return null;
    }
  }

  async updateUserById(
    id: string,
    dataToUpdate: { name?: string; email?: string; image?: string },
  ) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          ...dataToUpdate,
        },
      });
      return true;
    } catch {
      return false;
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
      return user;
    } catch {
      return null;
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
      return user;
    } catch {
      return null;
    }
  }

  async findUsersByName(name: string, page: number = 0, pageSize: number = 10) {
    try {
      const user = await this.prisma.user.findMany({
        where: {
          name: {
            startsWith: name,
          },
        },
        select: {
          ...userSelections,
        },
        skip: page * pageSize,
        take: pageSize,
      });
      return user;
    } catch {
      return null;
    }
  }

  async deleteUserById(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteUserByEmail(email: string) {
    try {
      await this.prisma.user.delete({
        where: { email },
      });
      return true;
    } catch {
      return false;
    }
  }
}
