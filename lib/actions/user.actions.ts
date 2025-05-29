import prisma from "../prisma";

/**
 * @returns
 * - 유저: 이름, 프로필 사진, 이메일
 */
export async function createUser({
  email,
  name,
  password,
  image,
}: {
  email: string;
  password: string;
  name?: string;
  image?: string;
}) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password,
      image,
    },

    select: {
      name: true,
      image: true,
      email: true,
    },
  });

  return user;
}

/**
 * @param dataToUpdate - 변경할 이름, 이메일, 프로필 사진
 * @returns
 * - 유저: 이름, 이메일, 프로필 사진
 */
export async function updateUserById(
  id: string,
  dataToUpdate: {
    name?: string;
    email?: string;
    image?: string;
  }
) {
  const user = await prisma.user.update({
    where: {
      id,
    },

    data: {
      ...dataToUpdate,
    },

    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  return user;
}

/**
 * @returns
 * - 유저: ID, 이름, 이메일, 이메일 인증 날짜, 프로필 사진, OAuth 계정, 글, 생성 날짜, 수정 날짜, 댓글
 */
export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      accounts: true,
      posts: true,
      createdAt: true,
      updatedAt: true,
      comment: true,
    },
  });

  return user;
}

/**
 * @returns
 * - 유저: ID, 이름, 이메일 인증 날짜, 프로필 사진, OAuth 계정, 글, 생성 날짜, 수정 날짜, 댓글
 */
export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },

    select: {
      id: true,
      name: true,
      emailVerified: true,
      image: true,
      accounts: true,
      posts: true,
      createdAt: true,
      updatedAt: true,
      comment: true,
    },
  });

  return user;
}

/**
 * @param page - 기본값: 0
 * @param pageSize - 기본값: 10
 * @returns
 * - 유저: ID, 이름, 프로필 사진, 이메일
 */
export async function findUsersByName({
  name,
  page = 0,
  pageSize = 10,
}: {
  name: string;
  page?: number;
  pageSize?: number;
}) {
  const user = await prisma.user.findMany({
    where: {
      name: {
        startsWith: name,
      },
    },

    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
    skip: page * pageSize,
    take: pageSize,
  });

  return user;
}

/**
 * @returns
 * - 유저: ID, 이름, 이메일, 프로필 사진
 */
export async function deleteUserById(id: string) {
  const user = await prisma.user.delete({
    where: {
      id,
    },

    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return user;
}
