import { ActionType } from "@/types/action";
import { PrismaError } from "prisma-error-enum";
import prisma from "../prisma";

export async function createComment({
  postId,
  content,
  authorId,
}: {
  postId: string;
  content: string;
  authorId: string;
}): Promise<ActionType> {
  try {
    await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
      },
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
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
  }
): Promise<ActionType> {
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
export async function toggleCommentLikes({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}): Promise<ActionType> {
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
    return { success: true };
  } catch (err: any) {
    // 좋아요 중복 시 좋아요 취소되도록 설정
    if ((err.code = PrismaError.UniqueConstraintViolation)) {
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
    }
    return { success: false };
  }
}

/**
 * @returns
 * - 댓글: ID, 내용, 생성 날짜, 수정 날짜, 좋아요 숫자
 * - 댓글 작성자: ID
 * - 글: ID
 */
export async function findCommentById(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: {
      id: true,
      content: true,
      likesCount: true,
      postId: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return comment;
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
  page?: number;
  pageSize?: number;
}) {
  const comments = await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      likesCount: true,
      postId: true,
      post: {
        select: {
          content: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    skip: page * pageSize,
    take: pageSize,
    where: { authorId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
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
  page?: number;
  pageSize?: number;
}) {
  const comments = await prisma.comment.findMany({
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
    where: { postId },
    skip: page * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
}

export async function deleteCommentById(id: string): Promise<ActionType> {
  try {
    await prisma.comment.delete({
      where: { id },
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
