export class AlreadyFollowError extends Error {
  constructor(message: string = '이미 팔로우 중입니다.') {
    super(message);
    this.name = 'AlreadyFollowError';
  }
}
