import { ActionType } from "@/types/action";
import { PrismaError } from "prisma-error-enum";
import { ZodError } from "zod/v4";
import prisma from "../prisma";
import { postContentDto } from "../validation/post.validate";

export async function createPost(
  authorId: string,
  content: string
): Promise<ActionType> {
  try {
    postContentDto.parse({ content });

    await prisma.post.create({
      data: {
        content,
        authorId,
      },
    });
    return { success: true };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        error: err.message,
      };
    }
    return { success: false };
  }
}

export async function updatePostContent(
  id: string,
  content: string
): Promise<ActionType> {
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
        error: err.message,
      };
    }
    return { success: false };
  }
}

/**
 * 글의 좋아요를 +1 시키며, 중복된 요청이 들어오면 -1 시킨다.
 */
export async function togglePostLikes(
  userId: string,
  postId: string
): Promise<ActionType> {
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
    return { success: true };
  } catch (err: any) {
    if (err.code === PrismaError.UniqueConstraintViolation) {
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
    }
    return { success: false };
  }
}

/**
 * @returns
 * - 글: ID, 내용, 생성 날짜, 수정 날짜, 좋아요 숫자
 * - 작성자: ID, 이름, 프로필 사진
 */
export async function findPostById(id: string) {
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

  return post;
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
}) {
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
      createdAt: "desc",
    },
  });

  return posts;
}

export async function deletePostById(id: string): Promise<ActionType> {
  try {
    await prisma.post.delete({
      where: { id },
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
