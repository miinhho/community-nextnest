import { apiGet, apiPatch } from '@/lib/axios';
import { PageParams } from '@/lib/types/page.types';
import { BaseTimestamp, CommentSchema, PostSchema, UserSchema } from '@/lib/types/schema.types';
import { useMutation, useQuery } from '@tanstack/react-query';

// User Get Query
interface UserData extends UserSchema, BaseTimestamp {
  followersCount: number;
  followingCount: number;
  postCount: number;
  role: string;
  emailVerified: Date | null;
}
export const userQueryFn = async (userId: string) => {
  const response = await apiGet<UserData>(`user/${userId}`);
  return response.data;
};
export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: () => userQueryFn(userId),
  });

// User Followers Get Query
interface UserFollowersData {
  followers: UserSchema[];
}
export const userFollowersQueryFn = async (userId: string, { page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<UserFollowersData>(
    `user/${userId}/followers?page=${page}&size=${size}`,
  );
  return {
    followers: response.data.followers,
    meta: response.meta!,
  };
};
export const useUserFollowersQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: ['user', userId, 'followers', params],
    queryFn: () => userFollowersQueryFn(userId, params),
  });

// User Following Get Query
interface UserFollowingData {
  following: UserSchema[];
}
export const userFollowingQueryFn = async (userId: string, { page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<UserFollowingData>(
    `user/${userId}/following?page=${page}&size=${size}`,
  );
  return {
    following: response.data.following,
    meta: response.meta!,
  };
};
export const useUserFollowingQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: ['user', userId, 'following', params],
    queryFn: () => userFollowingQueryFn(userId, params),
  });

// User Post Get Query
interface UserPostData {
  posts: Omit<PostSchema, 'author'>[];
}
export const userPostQueryFn = async (userId: string, { page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<UserPostData>(`user/${userId}/posts?page=${page}&size=${size}`);
  return {
    posts: response.data.posts,
    meta: response.meta!,
  };
};
export const useUserPostQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: ['user', userId, 'posts', params],
    queryFn: () => userPostQueryFn(userId, params),
  });

// User Comment Get Query
interface UserCommentData {
  comments: CommentSchema & { post: Omit<PostSchema, 'author'> }[];
}
export const userCommentQueryFn = async (userId: string, { page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<UserCommentData>(
    `user/${userId}/comments?page=${page}&size=${size}`,
  );
  return {
    comments: response.data.comments,
    meta: response.meta!,
  };
};
export const useUserCommentQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: ['user', userId, 'comments', params],
    queryFn: () => userCommentQueryFn(userId, params),
  });

// User Patch Query
interface UserPatchParams {
  userId: string;
  name: string;
  image: string;
}
export const userPatchQueryFn = async ({ userId, name, image }: UserPatchParams) => {
  const response = await apiPatch<UserData>(`user/${userId}`, {
    image,
    name,
  });
  return response;
};
export const useUserPatchQuery = () =>
  useMutation({
    mutationFn: (params: UserPatchParams) => userPatchQueryFn(params),
  });

// User Delete Query
interface UserDeleteData {
  id: string;
  name: string;
  image: string | null;
  email: string;
}
export const userDeleteQueryFn = async (userId: string) => {
  const response = await apiGet<UserDeleteData>(`user/${userId}/delete`);
  return response.data;
};
export const useUserDeleteQuery = () =>
  useMutation({
    mutationFn: (userId: string) => userDeleteQueryFn(userId),
  });
