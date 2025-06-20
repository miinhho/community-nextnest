import { apiDelete, apiGet, apiPost } from '@/lib/axios';
import { PageParams } from '@/lib/types/page.types';
import { CommentSchema, PostSchema } from '@/lib/types/schema.types';
import { LikeStatus } from '@/lib/types/status.types';
import { useMutation, useQuery } from '@tanstack/react-query';

// Post Get Paging Query
interface PostListData {
  posts: PostSchema[];
}
export const postListQueryFn = async ({ page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<PostListData>(`post?page=${page}&size=${size}`);
  return {
    posts: response.data.posts,
    meta: response.meta!,
  };
};
export const usePostListQuery = (params: PageParams) =>
  useQuery({
    queryKey: ['postList', params],
    queryFn: () => postListQueryFn(params),
  });

// Post Get Query
export const postQueryFn = async (postId: string) => {
  const response = await apiGet<PostSchema>(`post/${postId}`);
  return response.data;
};
export const usePostQuery = (postId: string) =>
  useQuery({
    queryKey: ['post', postId],
    queryFn: () => postQueryFn(postId),
  });

// Post Update Query
interface PostPutData {
  id: string;
  authorId: string;
  content: string;
}
interface PostPutParams {
  postId: string;
}
interface PostPutBody {
  content: string;
}
export const postPutQueryFn = async ({ postId, content }: PostPutParams & PostPutBody) => {
  const response = await apiPost<PostPutData>(`post/${postId}`, {
    content,
  });
  return response.data;
};
export const usePostPutQuery = () =>
  useMutation({
    mutationFn: (params: PostPutParams & PostPutBody) => postPutQueryFn(params),
  });

// Post Create Query
interface PostCreateData {
  postId: string;
  authorId: string;
}
export const postCreateQueryFn = async (content: string) => {
  const response = await apiPost<PostCreateData>('post', {
    content,
  });
  return response.data;
};
export const usePostCreateQuery = () =>
  useMutation({
    mutationFn: (content: string) => postCreateQueryFn(content),
  });

// Post Like Query
interface PostLikeData {
  id: string;
  status: LikeStatus;
}
export const postLikeQueryFn = async (postId: string) => {
  const response = await apiPost<PostLikeData>(`post/${postId}/like`);
  return response.data;
};
export const usePostLikeQuery = () =>
  useMutation({
    mutationFn: (postId: string) => postLikeQueryFn(postId),
  });

// Post Delete Query
interface PostDeleteData {
  id: string;
  authorId: string;
  content: string;
}
export const postDeleteQueryFn = async (postId: string) => {
  const response = await apiDelete<PostDeleteData>(`post/${postId}`);
  return response.data;
};
export const usePostDeleteQuery = () =>
  useMutation({
    mutationFn: (postId: string) => postDeleteQueryFn(postId),
  });

// Post Comment Get Paging Query
interface PostCommentData {
  postId: string;
  comments: CommentSchema[];
}
export const postCommentQueryFn = async (postId: string, { page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<PostCommentData>(
    `post/${postId}/comment?page=${page}&size=${size}`,
  );
  return {
    comments: response.data.comments,
    meta: response.meta!,
  };
};
export const usePostCommentQuery = (postId: string, params: PageParams) =>
  useQuery({
    queryKey: ['postComment', postId, params],
    queryFn: () => postCommentQueryFn(postId, params),
  });
