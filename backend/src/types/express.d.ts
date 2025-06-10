import { UserData } from '@/common/user';

declare module 'express' {
  interface Request {
    user?: UserData;
  }
}
