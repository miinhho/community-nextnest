/**
 * API 에러를 정의하는 클래스
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
