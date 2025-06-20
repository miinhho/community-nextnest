import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/axios';
import { PageParams } from '@/lib/types/page.types';
import { CommentSchema } from '@/lib/types/schema.types';
import { LikeStatus } from '@/lib/types/status.types';
import { useMutation, useQuery } from '@tanstack/react-query';

// Commment Get Query
interface CommentData extends CommentSchema {
  postId: string;
  replies: CommentSchema[];
  parent?: CommentSchema;
}
export const commentQueryFn = async (commentId: string) => {
  const response = await apiGet<CommentData>(`comment/${commentId}`);
  return response.data;
};
export const useCommentQuery = (commentId: string) =>
  useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => commentQueryFn(commentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

// Replies Get Query
interface RepliesData {
  replies: CommentSchema[];
}
export const repliesQueryFn = async (commentId: string, { page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<RepliesData>(
    `comment/${commentId}/replies?page=${page}&size=${size}`,
  );
  return {
    replies: response.data.replies,
    meta: response.meta!,
  };
};
export const useRepliesQuery = (commentId: string, params: PageParams) =>
  useQuery({
    queryKey: ['replies', commentId, params],
    queryFn: () => repliesQueryFn(commentId, params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

// Comment Create Query
interface CommentCreateParams {
  postId: string;
  content: string;
}
interface CommentCreateData {
  commentId: string;
  postId: string;
  authorId: string;
}
export const commentCreateQueryFn = async (params: CommentCreateParams) => {
  const response = await apiPost<CommentCreateData>('comment', params);
  return response.data;
};
export const useCommentCreateQuery = () =>
  useMutation({
    mutationFn: (params: CommentCreateParams) => commentCreateQueryFn(params),
  });

// Reply Create Query
interface ReplyCreateParams {
  postId: string;
  content: string;
  commentId: string;
}
interface ReplyCreateData {
  replyId: string;
  postId: string;
  authorId: string;
}
export const replyCreateQueryFn = async (params: ReplyCreateParams) => {
  const response = await apiPost<ReplyCreateData>('reply', params);
  return response.data;
};
export const useReplyCreateQuery = () =>
  useMutation({
    mutationFn: (params: ReplyCreateParams) => replyCreateQueryFn(params),
  });

// Comment Update Query
interface CommentPutParams {
  commentId: string;
  content: string;
}
interface CommentPutData {
  commentId: string;
}
export const commentPutQueryFn = async ({ commentId, content }: CommentPutParams) => {
  const response = await apiPut<CommentPutData>(`comment/${commentId}`, { content });
  return response.data;
};
export const useCommentPutQuery = () =>
  useMutation({
    mutationFn: (params: CommentPutParams) => commentPutQueryFn(params),
  });

// Comment Delete Query
export const commentDeleteQueryFn = async (commentId: string) => {
  const response = await apiDelete(`comment/${commentId}`);
  return response.data;
};
export const useCommentDeleteQuery = () =>
  useMutation({
    mutationFn: (commentId: string) => commentDeleteQueryFn(commentId),
  });

// Comment Like Query
interface CommentLikeData {
  id: string;
  status: LikeStatus;
}
export const commentLikeQueryFn = async (commentId: string) => {
  const response = await apiPost<CommentLikeData>(`comment/${commentId}/like`);
  return response.data;
};
export const useCommentLikeQuery = () =>
  useMutation({
    mutationFn: (commentId: string) => commentLikeQueryFn(commentId),
  });
