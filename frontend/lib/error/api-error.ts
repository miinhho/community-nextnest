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
