import { paths } from '@/types/api-types'

export type ApiResponse<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  responses: {
    200: { content: { 'application/json': infer R } }
  }
}
  ? R
  : paths[T][M] extends {
        responses: {
          201: { content: { 'application/json': infer R } }
        }
      }
    ? R
    : unknown

export type ApiRequest<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  requestBody: {
    content: {
      'application/json': infer R
    }
  }
}
  ? R
  : never

export type PathParams<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  parameters: {
    path: infer P
  }
}
  ? P
  : {}

export type QueryParams<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  parameters: {
    query: infer Q
  }
}
  ? Q
  : {}
