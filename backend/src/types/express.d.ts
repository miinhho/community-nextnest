import { UserData } from '@/common/user.data';

declare module 'express' {
  interface Request {
    user?: UserData;
  }
}
