import { Comment, Post, User } from '@prisma/client';

/**
 * 댓글 조회 시 선택할 필드들을 정의하는 객체
 *
 * Prisma select 옵션에서 사용되어 댓글의 필수 정보만 조회합니다.
 */
export const commentSelections = {
  id: true,
  content: true,
  likesCount: true,
  createdAt: true,
  updatedAt: true,
};

export type CommonComment = {
  [K in keyof typeof commentSelections]: Comment[K];
};

/**
 * 게시글 조회 시 선택할 필드들을 정의하는 객체
 *
 * Prisma select 옵션에서 사용되어 게시글의 필수 정보만 조회합니다.
 */
export const postSelections = {
  id: true,
  content: true,
  likeCount: true,
  createdAt: true,
  updatedAt: true,
};

export type CommonPost = {
  [K in keyof typeof postSelections]: Post[K];
};

/**
 * 사용자 조회 시 선택할 필드들을 정의하는 객체
 *
 * - Prisma select 옵션에서 사용되어 사용자의 공개 정보만 조회합니다.
 * - 비밀번호 등 민감한 정보는 제외됩니다.
 */
export const userSelections = {
  id: true,
  name: true,
  image: true,
};

export type CommonUser = {
  [K in keyof typeof userSelections]: User[K];
};
