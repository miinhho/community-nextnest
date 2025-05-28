import prisma from "../prisma";
import { postContentDto } from "../validation/post-validate";

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
  });

  return post;
}

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
      id: id,
    },
    data: {
      title: title,
      content: content,
    },
  });

  return post;
}

export async function findPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
    },
  });

  return post;
}

/**
 * @param page - 기본값: 0
 * @param pageSize - 기본값: 10
 */
export async function findPostsByPage({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    skip: page * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}

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
    include: {
      author: true,
    },
    skip: page * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}

export async function deletePostById(id: string) {
  const post = await prisma.post.delete({
    where: {
      id: id,
    },
  });

  return post;
}
