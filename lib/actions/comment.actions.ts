import { AsyncActionType } from '@/types/action';
import { LikeStatus } from '@/types/action.status';
import { PrismaError } from 'prisma-error-enum';
import prisma from '../prisma';

export async function createComment({
  postId,
  authorId,
  content,
}: {
  postId: string;
  authorId: string;
  content: string;
}): AsyncActionType {
  try {
    await prisma.$transaction([
      prisma.comment.create({
        data: {
          content,
          authorId,
          postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          commentCount: { increment: 1 },
        },
      }),
    ]);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function createCommentReply({
  postId,
  commentId,
  authorId,
  content,
}: {
  postId: string;
  commentId: string;
  authorId: string;
  content: string;
}) {
  try {
    await prisma.$transaction([
      prisma.comment.create({
        data: {
          content,
          postId,
          authorId,
          parentId: commentId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          commentCount: { increment: 1 },
        },
      }),
    ]);
  } catch {}
}

/**
 * @param dataToUpdate - 댓글 내용, 글 ID, 댓글 작성자 ID
 */
export async function updateCommentContent(
  id: string,
  dataToUpdate: {
    content?: string;
    postId?: string;
    authorId?: string;
  },
): AsyncActionType {
  try {
    await prisma.comment.update({
      where: { id },
      data: {
        ...dataToUpdate,
      },
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

/**
 * 댓글의 좋아요를 +1 시키며, 중복된 요청이 들어오면 -1 시킨다.
 */
export async function toggleCommentLikes(
  userId: string,
  commentId: string,
): AsyncActionType<void, LikeStatus> {
  try {
    const result = await increaseCommentLikes(userId, commentId);
    return result;
  } catch (err: any) {
    // 좋아요 중복 시 좋아요 취소되도록 설정
    if ((err.code = PrismaError.UniqueConstraintViolation)) {
      const result = await minusCommentLikes(userId, commentId);
      return result;
    }
    return {
      success: false,
      status: LikeStatus.UNKNOWN_FAIL,
    };
  }
}

async function increaseCommentLikes(
  userId: string,
  commentId: string,
): AsyncActionType<void, LikeStatus> {
  try {
    await prisma.$transaction([
      prisma.commentLikes.create({
        data: {
          userId,
          commentId,
        },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: { increment: 1 },
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

async function minusCommentLikes(
  userId: string,
  commentId: string,
): AsyncActionType<void, LikeStatus> {
  try {
    await prisma.$transaction([
      prisma.commentLikes.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: { decrement: 1 },
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
 * - 댓글: ID, 내용, 생성 날짜, 수정 날짜, 좋아요 숫자
 * - 댓글 작성자: ID
 * - 글: ID
 */
export async function findCommentById(id: string): AsyncActionType {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        parent: {
          select: {
            id: true,
            likesCount: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        replies: {
          select: {
            id: true,
            likesCount: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        likesCount: true,
        postId: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: comment!,
    };
  } catch {
    return { success: false };
  }
}

/**
 * @param page - 기본값: 0
 * @param pageSize - 기본값: 10
 * @returns
 * - 댓글: 내용, 수정 날짜, 생성 날짜
 * - 글: ID, 내용
 */
export async function findCommentsByUser({
  authorId,
  page = 0,
  pageSize = 10,
}: {
  authorId: string;
  page: number;
  pageSize: number;
}): AsyncActionType {
  try {
    const comments = await prisma.comment.findMany({
      where: { authorId },
      select: {
        id: true,
        content: true,
        likesCount: true,
        postId: true,
        post: {
          select: {
            id: true,
            content: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: comments,
    };
  } catch {
    return { success: false };
  }
}

/**
 * @param page - 기본값: 0
 * @param pageSize - 기본값: 10
 * @returns
 * - 댓글: ID, 내용, 좋아요 숫자
 * - 댓글 작성자: ID, 이름, 프로필 사진
 */
export async function findCommentsByPost({
  postId,
  page = 0,
  pageSize = 10,
}: {
  postId: string;
  page: number;
  pageSize: number;
}): AsyncActionType {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      select: {
        id: true,
        content: true,
        likesCount: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: comments,
    };
  } catch {
    return { success: false };
  }
}

export async function findRepliesFromComment({
  commentId,
  page = 0,
  pageSize = 10,
}: {
  commentId: string;
  page: number;
  pageSize: number;
}): AsyncActionType {
  try {
    const replies = await prisma.comment.findMany({
      where: { id: commentId },
      select: {
        replies: {
          select: {
            id: true,
            content: true,
            likesCount: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      skip: page * pageSize,
      take: pageSize,
    });

    return {
      success: true,
      data: replies,
    };
  } catch {
    return { success: false };
  }
}

export async function deleteCommentById(commentId: string, postId: string): AsyncActionType {
  try {
    await prisma.$transaction([
      prisma.comment.delete({
        where: { id: commentId },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          commentCount: { decrement: 1 },
        },
      }),
    ]);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
