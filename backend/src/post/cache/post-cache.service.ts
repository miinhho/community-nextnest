import { PagedPost, PagedPostHotScore } from '@/post/post.types';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { compact } from 'es-toolkit';
import Redis from 'ioredis';

/**
 * 핫 게시글을 저장하는 Redis 키
 */
export const REDIS_KEY_HOT_POSTS = 'hot-posts' as const;

/**
 * 게시글 ID를 기반으로 Redis 키를 생성하는 함수
 */
const getRedisPostKey = (postId: string) => `post:${postId}`;

@Injectable()
export class PostCacheService {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  /**
   * 게시글을 Redis 에 저장합니다.
   *
   * 게시글 ID와 핫 스코어를 제외한 나머지 데이터를 저장합니다.
   *
   * 핫 스코어와 게시글 ID 는 별도로 Redis Sorted Set 에 저장됩니다.
   */
  private async setPost(post: PagedPostHotScore) {
    const { id, hotScore, ...postData } = post;
    const postKey = getRedisPostKey(post.id);
    const postDataJson = JSON.stringify(postData);

    await this.redis.set(postKey, postDataJson);
    await this.redis.expire(postKey, 60 * 60 * 24); // 24시간 후 만료
  }

  /**
   * 게시글 ID를 기반으로 Redis 에서 게시글 데이터를 가져옵니다.
   *
   * 게시글이 존재하지 않으면 `null` 을 반환합니다.
   */
  private async getPost(postId: string): Promise<Omit<PagedPost, 'hotScore'> | null> {
    const postKey = getRedisPostKey(postId);
    const postDataJson = await this.redis.get(postKey);
    return postDataJson ? JSON.parse(postDataJson) : null;
  }

  /**
   * 핫 게시글을 Redis Sorted Set 에 저장합니다.
   *
   * 게시글의 핫 스코어와 ID 를 저장합니다.
   */
  async setHotPost(posts: PagedPostHotScore[]) {
    const args: (string | number)[] = [];
    for (const post of posts) {
      const { hotScore, id } = post;
      args.push(hotScore, id);
      await this.setPost(post);
    }

    await this.redis.zadd(REDIS_KEY_HOT_POSTS, ...args);
  }

  /**
   * 핫 게시글을 Redis Sorted Set 에서 가져옵니다.
   *
   * `start` 부터 `end` 까지의 핫 게시글을 가져옵니다.
   */
  async getHotPosts(start: number, end: number): Promise<Omit<PagedPost, 'hotScore'>[]> {
    const postsId = await this.redis.zrevrange(REDIS_KEY_HOT_POSTS, start, end);
    const posts = await Promise.all(postsId.map((id) => this.getPost(id)));
    return compact(posts);
  }

  /**
   * 핫 게시글의 개수를 Redis Sorted Set 에서 가져옵니다.
   *
   * 핫 게시글의 개수를 반환합니다.
   */
  async getHotPostSize() {
    return this.redis.zcard(REDIS_KEY_HOT_POSTS);
  }
}
