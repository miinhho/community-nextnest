import { CommonPost, CommonUser } from '@/common/select';
import { Post } from '@prisma/client';

/**
 * 페이지네이션시 반환되는 게시글 타입
 *
 * 게시글의 기본 정보와 작성자 정보를 포함합니다.
 */
export type PagedPost = {
  commentCount: Post['commentCount'];
} & CommonPost & {
    author: CommonUser;
  };

/**
 * 페이지네이션시 반환되는 게시글 타입에 핫 스코어를 포함한 타입
 *
 * 핫 스코어는 게시글의 인기 정도를 나타내는 지표입니다.
 */
export type PagedPostHotScore = PagedPost & {
  hotScore: Post['hotScore'];
};
