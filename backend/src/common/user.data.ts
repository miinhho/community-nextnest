import { Role } from '@prisma/client';

export interface UserData {
  id: string;
  role: Role;
}
