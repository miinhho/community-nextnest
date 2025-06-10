import { Role } from '@prisma/client';

export interface UserData {
  id: string;
  role: Role;
}

export const isAdmin = (user: UserData): boolean => {
  return user.role === Role.ADMIN;
};
