import { apiPost } from '@/lib/axios';
import { FollowStatus } from '@/lib/types/status.types';
import { useMutation } from '@tanstack/react-query';

// Follow Toggle Query
interface FollowData {
  status: FollowStatus;
  targetId: string;
}
export const followQueryFn = async (targetId: string) => {
  const response = await apiPost<FollowData>(`follow-toggle/${targetId}`);
  return response.data;
};
export const useFollowQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followQueryFn(targetId),
  });
