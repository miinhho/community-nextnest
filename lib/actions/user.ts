import prisma from "../prisma";

export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });

  return user;
}

export async function findUserById(id: number) {
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
    omit: {
      password: true,
    },
  });

  return user;
}

export async function findUsersByName(
  name: string,
  page: number = 0,
  pageSize: number = 10
) {
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

export async function deleteUserById(id: number) {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return user;
}
