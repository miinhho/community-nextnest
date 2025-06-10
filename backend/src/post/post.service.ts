import { PrismaService } from '@/common/database/prisma.service';
import { postSelections, userSelections } from '@/common/database/select';
import { LikeStatus } from '@/common/status/like-status';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new InternalServerErrorException('게시글 작성에 실패했습니다.');
    }
  }

  async updatePost(
    id: string,
    content: string,
    userId: string,
    isAdmin: boolean = false,
  ) {
    try {
      const post = await this.findPostById(id);
      if (!isAdmin && post.authorId !== userId) {
        throw new ForbiddenException('게시글 수정 권한이 없습니다.');
      }

      await this.prisma.post.update({
        where: { id },
        data: { content },
        select: {},
      });
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new InternalServerErrorException('게시글 수정에 실패했습니다.');
    }
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
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }
      return post;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('게시글 조회에 실패했습니다.');
    }
  }

  async findPostsByPage(page: number = 1, size: number = 10) {
    try {
      const [posts, totalCount] = await this.prisma.$transaction([
        this.prisma.post.findMany({
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
          skip: (page - 1) * size,
          take: size,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.post.count(),
      ]);
      return {
        totalCount,
        totalPage: Math.ceil(totalCount / size),
        posts,
      };
    } catch (err) {
      throw new InternalServerErrorException('게시글 목록 조회에 실패했습니다.');
    }
  }

  async findPostCountByUserId(userId: string) {
    try {
      const count = await this.prisma.post.count({
        where: { authorId: userId },
      });
      return count;
    } catch {
      throw new InternalServerErrorException('사용자 게시글 수 조회에 실패했습니다.');
    }
  }

  async findPostsByUserId(userId: string, page: number = 1, size: number = 10) {
    try {
      const [posts, totalCount] = await this.prisma.$transaction([
        this.prisma.post.findMany({
          where: { authorId: userId },
          select: {
            ...postSelections,
            createdAt: true,
            updatedAt: true,
            authorId: true,
            commentCount: true,
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.post.count({
          where: { authorId: userId },
        }),
      ]);
      return {
        totalCount,
        totalPage: Math.ceil(totalCount / size),
        posts,
      };
    } catch (err) {
      throw new InternalServerErrorException('사용자 게시글 조회에 실패했습니다.');
    }
  }

  async deletePostById(postId: string, userId: string, isAdmin: boolean = false) {
    try {
      const post = await this.findPostById(postId);
      if (!isAdmin && post.authorId !== userId) {
        throw new ForbiddenException('게시글 삭제 권한이 없습니다.');
      }

      const deletedPost = await this.prisma.post.delete({
        where: { id: postId },
        select: {
          id: true,
          content: true,
          authorId: true,
        },
      });
      return deletedPost;
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new InternalServerErrorException('게시글 삭제 중 오류가 발생했습니다.');
    }
  }

  async addPostLikes(userId: string, postId: string, toggle: boolean = true) {
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
      return LikeStatus.PLUS;
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        if (toggle) {
          return this.minusPostLikes(userId, postId);
        }
      }
      throw new InternalServerErrorException('게시글 좋아요 추가에 실패했습니다.');
    }
  }

  async minusPostLikes(userId: string, postId: string) {
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
      return LikeStatus.MINUS;
    } catch {
      throw new InternalServerErrorException('게시글 좋아요 취소에 실패했습니다.');
    }
  }
}
