import prisma from "../prisma";
import { postContentDto } from "../validation/post.validate";

/**
 * @returns
 * - 글: ID, 제목
 * - 작성자: ID, 이름
 */
export async function createPost({
  title,
  content,
  authorId,
}: {
  title: string;
  content: string;
  authorId: string;
}) {
  postContentDto.parse({ title, content });

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },

    select: {
      id: true,
      title: true,
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
  title,
  content,
}: {
  id: string;
  title?: string;
  content?: string;
}) {
  postContentDto.parse({ title, content });

  const post = await prisma.post.update({
    where: {
      id,
    },

    data: {
      title,
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
 * - 글: 이름, 내용, 생성 날짜, 수정 날짜
 * - 작성자: ID, 이름, 프로필 사진
 */
export async function findPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },

    select: {
      title: true,
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
 * - 글: ID, 제목
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
      title: true,

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
 * @param page - 기본값: 0
 * @param pageSize - 기본값: 10
 * @returns
 * - 글: ID, 제목
 * - 작성자: ID, 이름, 프로필 사진
 */
export async function findPostsByTitle({
  title,
  page = 0,
  pageSize = 10,
}: {
  title: string;
  page: number;
  pageSize: number;
}) {
  const posts = await prisma.post.findMany({
    where: {
      title: {
        startsWith: title,
      },
    },

    select: {
      id: true,
      title: true,

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
 * - 글: 제목
 * - 작성자: ID, 이름
 */
export async function deletePostById(id: string) {
  const post = await prisma.post.delete({
    where: {
      id: id,
    },

    select: {
      title: true,
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
