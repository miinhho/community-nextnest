import prisma from "../prisma";

/**
 * @returns
 * - 댓글: ID, 내용, 생성 날짜
 * - 댓글 작성자: ID
 * - 글: ID
 */
export async function createComment({
  postId,
  content,
  authorId,
}: {
  postId: string;
  content: string;
  authorId: string;
}) {
  const comment = await prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
    },

    select: {
      id: true,
      content: true,
      postId: true,
      authorId: true,
      createdAt: true,
    },
  });

  return comment;
}

/**
 * @param dataToUpdate - 변경할 내용, 글 ID, 작성자 ID
 * @returns
 * - 작성자: 이름
 * - 글: ID
 */
export async function updateCommentById(
  id: string,
  dataToUpdate: {
    content?: string;
    postId?: string;
    authorId?: string;
  }
) {
  const comment = await prisma.comment.update({
    where: {
      id,
    },

    data: {
      ...dataToUpdate,
    },

    select: {
      post: {
        select: {
          author: {
            select: {
              name: true,
            },
          },
        },
      },
      postId: true,
    },
  });

  return comment;
}

/**
 * @returns
 * - 댓글: ID, 내용, 생성 날짜, 수정 날짜
 * - 댓글 작성자: ID
 * - 글: ID
 */
export async function findCommentById(id: string) {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      content: true,
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
 * - 글: ID
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
      content: true,
      post: {
        select: {
          id: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    skip: page * pageSize,
    take: pageSize,

    where: {
      authorId,
    },

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
 * - 댓글: ID, 내용,
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

    where: {
      postId,
    },

    skip: page * pageSize,
    take: pageSize,

    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
}

/**
 * @returns
 * - 글: ID
 */
export async function deleteCommentById(id: string) {
  const comment = await prisma.comment.delete({
    where: {
      id,
    },

    select: {
      post: {
        select: {
          id: true,
        },
      },
    },
  });

  return comment;
}
