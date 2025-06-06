import { PrismaService } from '@/lib/database/prisma.service';
import { postSelections, userSelections } from '@/lib/database/select';
import { LikeStatus } from '@/lib/status/like-status';
import { Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(authorId: string, content: string) {
    try {
      const post = await this.prisma.post.create({
        data: {
          content,
          authorId,
        },
        select: {
          id: true,
        },
      });

      return post;
    } catch {
      return null;
    }
  }

  async updatePost(id: string, content: string) {
    await this.prisma.post.update({
      where: { id },
      data: { content },
    });
  }

  async findPostById(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        select: {
          content: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          likeCount: true,
          commentCount: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      return post;
    } catch {
      return null;
    }
  }

  async findPostsByPage(page: number = 0, pageSize: number = 10) {
    try {
      const posts = await this.prisma.post.findMany({
        select: {
          ...postSelections,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          commentCount: true,
          author: {
            select: {
              ...userSelections,
            },
          },
        },
        skip: page * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return posts;
    } catch {
      return null;
    }
  }

  async deletePostById(id: string) {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async addPostLikes(userId: string, postId: string, toggle: boolean = true): Promise<LikeStatus> {
    try {
      await this.prisma.$transaction([
        this.prisma.postLikes.create({
          data: {
            userId,
            postId,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            likeCount: { increment: 1 },
          },
        }),
      ]);
      return LikeStatus.PLUS_SUCCESS;
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        if (toggle) {
          return this.minusPostLikes(userId, postId);
        }
      }
      return LikeStatus.PLUS_FAIL;
    }
  }

  async minusPostLikes(userId: string, postId: string): Promise<LikeStatus> {
    try {
      await this.prisma.$transaction([
        this.prisma.postLikes.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            likeCount: { decrement: 1 },
          },
        }),
      ]);
      return LikeStatus.MINUS_SUCCESS;
    } catch {
      return LikeStatus.MINUS_FAIL;
    }
  }
}
