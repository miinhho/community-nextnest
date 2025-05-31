import prisma from "../prisma";
import { postContentDto } from "../validation/post.validate";

/**
 * @returns
 * - 글: ID
 * - 작성자: ID, 이름
 */
export async function createPost({
  content,
  authorId,
}: {
  content: string;
  authorId: string;
}) {
  postContentDto.parse({ content });

  const post = await prisma.post.create({
    data: {
      content,
      authorId,
    },

    select: {
      id: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return post;
}

/**
 * @returns
 * - 작성자: ID, 이름
 */
export async function updatePost({
  id,
  content,
}: {
  id: string;
  content?: string;
}) {
  postContentDto.parse({ content });

  const post = await prisma.post.update({
    where: {
      id,
    },

    data: {
      content,
    },

    select: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return post;
}

/**
 * @returns
 * - 글: 내용, 생성 날짜, 수정 날짜
 * - 작성자: ID, 이름, 프로필 사진
 */
export async function findPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },

    select: {
      content: true,
      createdAt: true,
      updatedAt: true,

      authorId: true,
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
 * - 글: ID
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

      authorId: true,
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

/**
 * @returns
 * - 작성자: ID, 이름
 */
export async function deletePostById(id: string) {
  const post = await prisma.post.delete({
    where: {
      id: id,
    },

    select: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return post;
}
