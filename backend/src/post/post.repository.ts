import { PrismaService } from '@/common/database/prisma.service';
import { postSelections, userSelections } from '@/common/database/select';
import { PageParams, toPageData } from '@/common/utils/page';
import { AlreadyLikeError } from '@/post/error/already-like.error';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class PostRepository {
  private readonly logger = new Logger(PostRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPost({ authorId, content }: { authorId: string; content: string }) {
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
    } catch (err) {
      this.logger.error('게시글 작성 중 오류 발생', err.stack, { authorId, content });
      throw new InternalServerErrorException('게시글 작성에 실패했습니다.');
    }
  }

  async updatePost({ id, content }: { id: string; content: string }) {
    try {
      await this.prisma.post.update({
        where: { id },
        data: { content },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('존재하지 않는 게시글입니다.');
      }

      this.logger.error('게시글 수정 중 오류 발생', err.stack, { id, content });
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

      this.logger.error('게시글 조회 중 오류 발생', err.stack, { postId: id });
      throw new InternalServerErrorException('게시글 조회에 실패했습니다.');
    }
  }

  async findPostAuthorId(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        select: { authorId: true },
      });
      if (!post) {
        throw new NotFoundException('존재하지 않는 게시글입니다.');
      }
      return post.authorId;
    } catch (err) {
      this.logger.error('게시글 작성자 ID 조회 중 오류 발생', err.stack, { postId: id });
      throw new InternalServerErrorException('게시글 작성자 ID 조회에 실패했습니다.');
    }
  }

  async findPostsByPage({ page = 1, size = 10 }: PageParams) {
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

      return toPageData<typeof posts>({ data: posts, totalCount, page, size });
    } catch (err) {
      this.logger.error('게시글 목록 조회 중 오류 발생', err.stack, { page, size });
      throw new InternalServerErrorException('게시글 목록 조회에 실패했습니다.');
    }
  }

  async findPostCountByUserId(userId: string) {
    try {
      const count = await this.prisma.post.count({
        where: { authorId: userId },
      });
      return count;
    } catch (err) {
      this.logger.error('사용자 게시글 수 조회 중 오류 발생', err.stack, { userId });
      throw new InternalServerErrorException('사용자 게시글 수 조회에 실패했습니다.');
    }
  }

  async findPostsByUserId(userId: string, { page = 1, size = 10 }: PageParams) {
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

      return toPageData<typeof posts>({
        data: posts,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      this.logger.error('사용자 게시글 조회 중 오류 발생', err.stack, {
        userId,
      });
      throw new InternalServerErrorException('사용자 게시글 조회에 실패했습니다.');
    }
  }

  async deletePostById(id: string) {
    try {
      const deletedPost = await this.prisma.post.delete({
        where: { id },
        select: {
          id: true,
          content: true,
          authorId: true,
        },
      });
      return deletedPost;
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('존재하지 않는 게시글입니다.');
      }

      this.logger.error('게시글 삭제 중 오류 발생', err.stack, { postId: id });
      throw new InternalServerErrorException('게시글 삭제 중 오류가 발생했습니다.');
    }
  }

  async addPostLikes({ userId, postId }: { userId: string; postId: string }) {
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
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new AlreadyLikeError(postId, userId);
      }

      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('존재하지 않는 게시글입니다.');
      }

      this.logger.error('게시글 좋아요 추가 중 오류 발생', err.stack, { userId, postId });
      throw new InternalServerErrorException('게시글 좋아요 추가에 실패했습니다.');
    }
  }

  async minusPostLikes({ userId, postId }: { userId: string; postId: string }) {
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
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException(
          '게시물이 없거나, 해당 게시물에 좋아요를 누르지 않아서 취소할 수 없습니다.',
        );
      }

      this.logger.error('게시글 좋아요 취소 중 오류 발생', err.stack, { userId, postId });
      throw new InternalServerErrorException('게시글 좋아요 취소에 실패했습니다.');
    }
  }

  async validatePostExists(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }
  }
}
