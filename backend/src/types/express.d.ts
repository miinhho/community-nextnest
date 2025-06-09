import { UserData } from '@/types/user.data';

declare module 'express' {
  interface Request {
    user?: UserData;
  }
}
