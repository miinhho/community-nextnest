import { ActionType } from "@/types/action";
import { ZodError } from "zod/v4";
import prisma from "../prisma";
import { userLoginDto } from "../validation/user.validate";

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
}): Promise<ActionType> {
  try {
    userLoginDto.parse({ email, password });

    await prisma.user.create({
      data: {
        email,
        name,
        password,
        image,
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

/**
 * @param dataToUpdate - 변경할 이름, 이메일, 프로필 사진
 */
export async function updateUserById(
  id: string,
  dataToUpdate: {
    name?: string;
    email?: string;
    image?: string;
  }
): Promise<ActionType> {
  try {
    await prisma.user.update({
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
 * @returns
 * - 유저: ID, 이름, 이메일, 이메일 인증 날짜, 프로필 사진, OAuth 계정, 글, 생성 날짜, 수정 날짜, 댓글
 */
export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
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
    where: { email },
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
 * 비밀번호를 포함해서 반환하니 로그인 로직에서 호출하거나, 조심해서 사용해야 합니다.
 * @returns
 * - 유저: ID, 이름, 이메일 인증 날짜, 프로필 사진, OAuth 계정, 글, 생성 날짜, 수정 날짜, 댓글, 비밀번호
 */
export async function findUserWithPasswordByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
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
      password: true,
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
export async function deleteUserById(id: string): Promise<ActionType> {
  try {
    await prisma.user.delete({
      where: { id },
    });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
