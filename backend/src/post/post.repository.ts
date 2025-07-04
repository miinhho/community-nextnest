import { getBlockFilter } from '@/block/utils/block-filter';
import { AlreadyLikeError } from '@/common/error/already-like.error';
import { postSelections, userSelections } from '@/common/select';
import { PageParams, toPageData } from '@/common/utils/page';
import { PrismaDBError } from '@/prisma/error/prisma-db.error';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class PostRepository {
  private readonly logger = new Logger(PostRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 새로운 게시글을 생성합니다.
   * @param params.authorId - 작성자 ID
   * @param params.content - 게시글 내용
   * @returns 생성된 게시글의 ID를 포함하는 객체
   * @throws {PrismaDBError} 게시글 작성 중 오류 발생 시
   */
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
      throw new PrismaDBError('게시글 작성에 실패했습니다.', err.code);
    }
  }

  /**
   * 기존 게시글을 수정합니다.
   * @param params.id - 수정할 게시글 ID
   * @param params.content - 새로운 게시글 내용
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {PrismaDBError} 게시글 수정 중 오류 발생 시
   */
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
      throw new PrismaDBError('게시글 수정에 실패했습니다.', err.code);
    }
  }

  /**
   * ID를 통해 특정 게시글을 조회합니다.
   * @param id - 조회할 게시글 ID
   * @returns 게시글 정보 (내용, 생성/수정 시간, 작성자 정보, 좋아요/댓글 수)
   * @throws {NotFoundException} 게시글을 찾을 수 없는 경우
   * @throws {PrismaDBError} 게시글 조회 중 오류 발생 시
   */
  async findPostById(id: string) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id },
        select: {
          content: true,
          createdAt: true,
          updatedAt: true,
          likeCount: true,
          commentCount: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              isPrivate: true,
            },
          },
        },
      });
      return post;
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      this.logger.error('게시글 조회 중 오류 발생', err.stack, { postId: id });
      throw new PrismaDBError('게시글 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 게시글의 작성자 ID를 조회합니다.
   * @param id - 게시글 ID
   * @returns 게시글 작성자의 ID
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {PrismaDBError} 조회 중 오류 발생 시
   */
  async findPostAuthorId(id: string) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id },
        select: { authorId: true },
      });
      return post.authorId;
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('존재하지 않는 게시글입니다.');
      }
      this.logger.error('게시글 작성자 ID 조회 중 오류 발생', err.stack, { postId: id });
      throw new PrismaDBError('게시글 작성자 ID 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 페이지네이션을 적용하여 게시글 목록을 조회합니다.
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @returns 페이지네이션이 적용된 게시글 목록과 총 개수 정보
   * @throws {PrismaDBError} 목록 조회 중 오류 발생 시
   */
  async findPostsByPage({ page = 1, size = 10 }: PageParams, viewerId?: string) {
    try {
      const filter = {
        author: {
          isPrivate: false,
          ...getBlockFilter(viewerId),
        },
      };
      const [posts, totalCount] = await this.prisma.$transaction([
        this.prisma.post.findMany({
          where: filter,
          select: {
            ...postSelections,
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
        this.prisma.post.count({ where: filter }),
      ]);

      return toPageData<typeof posts>({ data: posts, totalCount, page, size });
    } catch (err) {
      this.logger.error('게시글 목록 조회 중 오류 발생', err.stack, { page, size });
      throw new PrismaDBError('게시글 목록 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 특정 사용자가 작성한 게시글 목록을 페이지네이션으로 조회합니다.
   * @param userId - 조회할 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @returns 해당 사용자의 게시글 목록과 총 개수 정보
   * @throws {PrismaDBError} 조회 중 오류 발생 시
   */
  async findPostsByUserId(userId: string, { page = 1, size = 10 }: PageParams) {
    try {
      const filter = {
        authorId: userId,
      };
      const [posts, totalCount] = await this.prisma.$transaction([
        this.prisma.post.findMany({
          where: filter,
          select: {
            ...postSelections,
            commentCount: true,
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.post.count({
          where: filter,
        }),
      ]);

      return toPageData<typeof posts>({
        data: posts,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      this.logger.error('사용자 게시글 조회 중 오류 발생', err.stack, { userId });
      throw new PrismaDBError('사용자 게시글 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * 게시글의 비공개 여부를 조회합니다.
   * @param postId - 게시글 ID
   * @returns 게시글 작성자의 비공개 설정 여부 (true/false)
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {PrismaDBError} 조회 중 오류 발생 시
   */
  async isPostPrivate(postId: string) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id: postId },
        select: {
          author: {
            select: {
              id: true,
              isPrivate: true,
            },
          },
        },
      });
      return {
        authorId: post.author.id,
        isPrivate: post.author.isPrivate,
      };
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('존재하지 않는 게시글입니다.');
      }

      this.logger.error('게시글 비공개 여부 조회 중 오류 발생', err.stack, { postId });
      throw new PrismaDBError('게시글 비공개 여부 조회에 실패했습니다.', err.code);
    }
  }

  /**
   * ID를 통해 게시글을 삭제합니다.
   * @param id - 삭제할 게시글 ID
   * @returns 삭제된 게시글의 정보 (ID, 내용, 작성자 ID)
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {PrismaDBError} 삭제 중 오류 발생 시
   */
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
      throw new PrismaDBError('게시글 삭제 중 오류가 발생했습니다.', err.code);
    }
  }

  /**
   * 게시글에 좋아요를 추가합니다.
   * @param params.userId - 좋아요를 누르는 사용자 ID
   * @param params.postId - 좋아요를 받을 게시글 ID
   * @throws {AlreadyLikeError} 이미 좋아요를 누른 경우
   * @throws {NotFoundException} 존재하지 않는 게시글인 경우
   * @throws {PrismaDBError} 좋아요 추가 중 오류 발생 시
   */
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
      throw new PrismaDBError('게시글 좋아요 추가에 실패했습니다.', err.code);
    }
  }

  /**
   * 게시글의 좋아요를 취소합니다.
   * @param params.userId - 좋아요를 취소하는 사용자 ID
   * @param params.postId - 좋아요를 취소할 게시글 ID
   * @throws {NotFoundException} 게시물이 없거나 좋아요를 누르지 않은 경우
   * @throws {PrismaDBError} 좋아요 취소 중 오류 발생 시
   */
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
          select: {},
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            likeCount: { decrement: 1 },
          },
          select: {},
        }),
      ]);
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException(
          '게시물이 없거나, 해당 게시물에 좋아요를 누르지 않아서 취소할 수 없습니다.',
        );
      }

      this.logger.error('게시글 좋아요 취소 중 오류 발생', err.stack, { userId, postId });
      throw new PrismaDBError('게시글 좋아요 취소에 실패했습니다.', err.code);
    }
  }

  async addPostView({
    userId,
    postId,
    ipAddress,
    userAgent,
  }: {
    userId?: string;
    postId: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.$transaction([
        this.prisma.postView.create({
          data: {
            userId,
            postId,
            ipAddress,
            userAgent,
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            viewCount: { increment: 1 },
          },
        }),
      ]);
    } catch (err) {
      // 이미 조회한 게시글인 경우 무시
      if (err.code === PrismaError.UniqueConstraintViolation) {
        return;
      }

      this.logger.error('게시글 조회 추가 중 오류 발생', err.stack, {
        userId,
        postId,
        ipAddress,
        userAgent,
      });
      throw new PrismaDBError('게시글 조회 추가에 실패했습니다.', err.code);
    }
  }
}
