/**
 * 좋아요 작업의 결과 상태
 */
export enum LikeStatus {
  /** 좋아요 추가 */
  PLUS = 'PLUS',
  /** 좋아요 취소 */
  MINUS = 'MINUS',
}

/**
 * 팔로우 작업의 결과 상태
 */
export enum FollowStatus {
  /** 팔로우 완료 */
  FOLLOW = 'FOLLOW',
  /** 언팔로우 완료 */
  UNFOLLOW = 'UNFOLLOW',
}
