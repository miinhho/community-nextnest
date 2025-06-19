import { apiDelete, apiGet, apiPost } from '@/lib/axios';
import { PageParams } from '@/lib/types/page.types';
import { Comment, Post } from '@/lib/types/schema.types';
import { LikeStatus } from '@/lib/types/status.types';
import { parseDates, parseDatesArray } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';

interface PostListData {
  posts: Post[];
}
export const usePostList = ({ page = 1, size = 10 }: PageParams) =>
  useQuery({
    queryKey: ['postList', page, size],
    queryFn: async () => {
      const response = await apiGet<PostListData>(`post?page=${page}&size=${size}`);
      return parseDatesArray(response.data.posts);
    },
  });

export const usePost = (postId: string) =>
  useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await apiGet<Post>(`post/${postId}`);
      return parseDates(response.data);
    },
  });

interface PostPutData {
  id: string;
  authorId: string;
  content: string;
}
export const usePostPut = (postId: string, content: string) =>
  useMutation({
    mutationFn: async () => {
      const response = await apiPost<PostPutData>(`post/${postId}`, {
        content,
      });
      return response.data;
    },
  });

interface PostCreateData {
  postId: string;
  authorId: string;
}
export const usePostCreate = (content: string) =>
  useMutation({
    mutationFn: async () => {
      const response = await apiPost<PostCreateData>('post', {
        content,
      });
      return response.data;
    },
  });

interface PostLikeData {
  id: string;
  status: LikeStatus;
}
export const usePostLike = (postId: string) =>
  useMutation({
    mutationFn: async () => {
      const response = await apiPost<PostLikeData>(`post/${postId}/like`);
      return response.data;
    },
  });

interface PostDeleteData {
  id: string;
  authorId: string;
  content: string;
}
export const usePostDelete = (postId: string) =>
  useMutation({
    mutationFn: async () => {
      const response = await apiDelete<PostDeleteData>(`post/${postId}`);
      return response.data;
    },
  });

interface PostCommentData {
  postId: string;
  comments: Comment[];
}
export const usePostComment = (postId: string, { page = 1, size = 10 }: PageParams) =>
  useQuery({
    queryKey: ['postComment', postId, page, size],
    queryFn: async () => {
      const response = await apiGet<PostCommentData>(
        `post/${postId}/comment?page=${page}&size=${size}`,
      );
      return {
        ...response.data,
        comments: parseDatesArray(response.data.comments),
      };
    },
  });
