import { AsyncActionType } from '@/types/action';
import { LikeStatus, ValidateStatus } from '@/types/action.status';
import { Post } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';
import { ZodError } from 'zod/v4';
import prisma from '../prisma';
import { postContentDto } from '../validation/post.validate';

export async function createPost(
  authorId: string,
  content: string,
): AsyncActionType<Post, ValidateStatus> {
  try {
    postContentDto.parse({ content });

    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      data: post,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        status: ValidateStatus.FAIL,
        message: err.message,
      };
    }
    return {
      success: false,
      status: ValidateStatus.SUCCESS,
    };
  }
}

/**
 * 주어진 게시글 ID에 해당하는 게시글의 내용을 수정한다.
 *
 * 절차:
 * 1. 입력된 content 값이 유효한지 Zod 스키마(postContentDto)를 통해 검증한다.
 * 2. 유효한 경우, Prisma를 통해 해당 게시글의 content 필드를 DB에서 업데이트한다.
 * 3. 업데이트에 성공하면 { success: true }를 반환한다.
 *
 * 예외 처리:
 * - ZodError 발생 시: 입력값이 유효하지 않음을 나타내며, 실패 응답과 검증 실패 상태(ValidateStatus.FAIL)를 반환한다.
 * - 기타 에러 발생 시: 실패 응답과 성공 상태(ValidateStatus.SUCCESS)를 반환한다 (이 부분은 로직상 다소 혼동의 여지가 있음).
 */
export async function updatePostContent(
  id: string,
  content: string,
): AsyncActionType<void, ValidateStatus> {
  try {
    postContentDto.parse({ content });

    await prisma.post.update({
      where: { id },
      data: { content },
    });
    return { success: true };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        status: ValidateStatus.FAIL,
        message: err.message,
      };
    }
    return {
      success: false,
      status: ValidateStatus.SUCCESS,
    };
  }
}

/**
 * 글의 좋아요를 +1 시키며, 중복된 요청이 들어오면 -1 시킨다.
 */
export async function togglePostLikes(
  userId: string,
  postId: string,
): AsyncActionType<void, LikeStatus> {
  try {
    const result = await increasePostLikes(userId, postId);
    return result;
  } catch (err: any) {
    if (err.code === PrismaError.UniqueConstraintViolation) {
      const result = await decreasePostLikes(userId, postId);
      return result;
    }
    return {
      success: false,
      status: LikeStatus.UNKNOWN_FAIL,
    };
  }
}

/**
 * 좋아요를 +1 시킨다.
 * 이미 해당 글에 좋아요를 누른 유저라면 Prisma Unique constraint error ("P2002") 를 반환한다.
 */
async function increasePostLikes(
  userId: string,
  postId: string,
): AsyncActionType<void, LikeStatus> {
  try {
    await prisma.$transaction([
      prisma.postLikes.create({
        data: {
          userId,
          postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: { increment: 1 },
        },
      }),
    ]);
    return {
      success: true,
      status: LikeStatus.ADD_SUCCESS,
    };
  } catch (err: any) {
    if (err.code === PrismaError.UniqueConstraintViolation) {
      throw err;
    }
    return {
      success: false,
      status: LikeStatus.ADD_FAIL,
    };
  }
}

/**
 * 좋아요를 -1 시킨다.
 */
async function decreasePostLikes(
  userId: string,
  postId: string,
): AsyncActionType<void, LikeStatus> {
  try {
    await prisma.$transaction([
      prisma.postLikes.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: { decrement: 1 },
        },
      }),
    ]);
    return {
      success: true,
      status: LikeStatus.MINUS_SUCCESS,
    };
  } catch (err) {
    return {
      success: false,
      status: LikeStatus.MINUS_FAIL,
    };
  }
}

/**
 * @returns
 * - 글: ID, 내용, 생성 날짜, 수정 날짜, 좋아요 숫자
 * - 작성자: ID, 이름, 프로필 사진
 */
export async function findPostById(id: string): AsyncActionType {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        likeCount: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      data: post!,
    };
  } catch (err) {
    return { success: false };
  }
}

/**
 * @param page - 기본값: 0
 * @param pageSize - 기본값: 10
 * @returns
 * - 글: ID, 내용, 생성 날짜, 수정 날짜, 좋아요 숫자
 * - 작성자: ID, 이름, 프로필 사진
 */
export async function findPostsByPage({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}): AsyncActionType {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        likeCount: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (err) {
    return { success: false };
  }
}

export async function deletePostById(id: string): AsyncActionType {
  try {
    await prisma.post.delete({
      where: { id },
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
