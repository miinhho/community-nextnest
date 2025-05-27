import { ProviderType } from "next-auth/providers";
import prisma from "../prisma";

export async function createUser({
  email,
  name,
  provider,
  password,
  image,
}: {
  email: string;
  name: string;
  provider: ProviderType;
  password?: string;
  image?: string;
}) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      provider,
      password,
      image,
    },
  });

  return user;
}

export async function updateUserById(
  id: string,
  dataToUpdate: {
    name?: string;
    email?: string;
    provider?: ProviderType;
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
  });

  return user;
}

export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

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
    omit: {
      password: true,
    },
    skip: page * pageSize,
    take: pageSize,
  });

  return user;
}

export async function deleteUserById(id: string) {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return user;
}
