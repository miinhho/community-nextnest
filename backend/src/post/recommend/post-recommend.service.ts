import recommend from '@/config/recommend.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

type PostAction =
  | 'DEFAULT'
  | 'VIEW_ADD'
  | 'COMMENT_ADD'
  | 'COMMENT_MINUS'
  | 'LIKE_ADD'
  | 'LIKE_MINUS';

type PostRecommendParams = {
  likeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: Date;
};

@Injectable()
export class PostRecommendService {
  constructor(
    @Inject(recommend.KEY)
    private readonly recommendConfig: ConfigType<typeof recommend>,
  ) {}

  /**
   * hot score 계산 시 필요한 정보
   *
   * prisma select 에 사용되는 객체입니다.
   */
  recommendSelection: Record<keyof PostRecommendParams, boolean> = {
    likeCount: true,
    viewCount: true,
    createdAt: true,
    commentCount: true,
  };

  /**
   * 게시물의 hot score 을 계산합니다.
   * @param params.likeCount - 좋아요 갯수
   * @param params.viewCount - 조회수
   * @param params.commentCount - 댓글 갯수
   * @param params.createdAt - 생성 일자
   * @param params.action - 계산 시의 상황
   *
   * @example
   * ```
   * // likeCount 를 -1 한 값으로 hot score 을 계산합니다.
   * const hotScore = calculateHotScore({
   *  likeCount,
   *  viewCount,
   *  commentCount,
   *  action = 'LIKE_MINUS',
   * });
   * ```
   */
  calculateHotScore(
    props: {
      action: PostAction;
    } & PostRecommendParams,
  ): number {
    const { likeCount, viewCount, commentCount } = this.handleActionType(props);
    const createdAt = props.createdAt;

    const engagementRate = viewCount > 0 ? (likeCount + commentCount * 2) / viewCount : 0;

    const popularityScore = Math.log(viewCount + 1) * 0.3;
    const qualityScore = engagementRate * viewCount * 0.7;

    const standardDate = this.recommendConfig.recommendationStandardDate;
    const hoursSince = (new Date(createdAt).getTime() - standardDate) / (1000 * 60 * 60);

    return (popularityScore + qualityScore) / Math.pow(hoursSince + 2, 1.5);
  }

  /**
   *
   * 게시물의 hot score 계산에 사용될 값을 정해진 action 에 따라 조정해서 반환합니다.
   * @param params.likeCount - 좋아요 갯수
   * @param params.viewCount - 조회수
   * @param params.commentCount - 댓글 갯수
   * @param params.action - 계산 시의 상황
   */
  private handleActionType({
    likeCount,
    viewCount,
    commentCount,
    action = 'DEFAULT',
  }: {
    action: PostAction;
  } & Omit<PostRecommendParams, 'createdAt'>): Omit<PostRecommendParams, 'createdAt'> {
    switch (action) {
      case 'COMMENT_ADD':
        return {
          likeCount,
          viewCount,
          commentCount: commentCount + 1,
        };
      case 'COMMENT_MINUS':
        return {
          likeCount,
          viewCount,
          commentCount: commentCount - 1,
        };
      case 'LIKE_ADD':
        return {
          viewCount,
          commentCount,
          likeCount: likeCount + 1,
        };
      case 'LIKE_MINUS':
        return {
          viewCount,
          commentCount,
          likeCount: likeCount - 1,
        };
      case 'VIEW_ADD':
        return {
          commentCount,
          likeCount,
          viewCount: viewCount + 1,
        };
      case 'DEFAULT':
      default:
        return {
          commentCount,
          likeCount,
          viewCount,
        };
    }
  }
}
