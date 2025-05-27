import { User } from "@/generated/prisma";
import prisma from "../prisma";

export async function createPost(title: string, content: string, author: User) {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: author.id,
      published: true,
    },
  });

  return post;
}

export async function updatePost(id: string, title?: string, content?: string) {
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
export async function findPostsByPage(page: number = 0, pageSize: number = 10) {
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

export async function findPostsByTitle(
  title: string,
  page: number = 0,
  pageSize: number = 10
) {
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
