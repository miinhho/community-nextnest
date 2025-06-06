/**
 * Zod Validation 의 결과를 나타내는 열거형
 */
export enum ValidateStatus {
  SUCCESS,
  FAIL,
}

/**
 * 좋아요 작업의 결과를 나타내는 열거형=
 */
export enum LikeStatus {
  /** 좋아요 추가 성공 */
  ADD_SUCCESS,
  /** 알 수 없는 오류로 좋아요 추가 실패 */
  ADD_FAIL,
  /** 좋아요 취소 성공 */
  MINUS_SUCCESS,
  /** 알 수 없는 오류로 좋아요 취소 실패 */
  MINUS_FAIL,
  /** 알 수 없는 오류로 모두 실패 */
  UNKNOWN_FAIL,
}

/**
 * 팔로우 작업의 결과를 나타내는 열거형
 */
export enum FollowStatus {
  /** 팔로우 성공 */
  FOLLOW_SUCCESS,
  /** 알 수 없는 오류로 팔로우 실패 */
  FOLLOW_FAILED,
  /** 이미 팔로우한 유저, 팔로우 실패 */
  FOLLOW_DUPLICATED,
  /** 언팔로우 성공 */
  UNFOLLOW_SUCCESS,
  /** 언팔로우 실패 */
  UNFOLLOW_FAILED,
}
