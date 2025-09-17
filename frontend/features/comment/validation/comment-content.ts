import { z } from 'zod'

export const COMMENT_LEN = {
  MIN: 5,
  MAX: 10_000,
} as const

export const commentContentData = z.object({
  content: z
    .string()
    .min(COMMENT_LEN.MIN, '내용을 더 적어주세요.')
    .max(COMMENT_LEN.MAX, '더이상 내용을 적을 수 없습니다.')
    .nonempty('내용을 입력해주세요'),
})
export type CommentContentData = z.infer<typeof commentContentData>
