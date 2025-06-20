import { apiGet } from '@/lib/axios';
import { BaseTimestamp, User } from '@/lib/types/schema.types';
import { useQuery } from '@tanstack/react-query';

interface UserData extends User, BaseTimestamp {
  followersCount: number;
  followingCount: number;
  postCount: number;
  role: string;
  emailVerified: Date | null;
}
export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await apiGet<UserData>(`user/${userId}`);
      return response.data;
    },
  });
