import { CONTENT_LEN } from '@/lib/constant'
import { z } from 'zod/v4'

export const postContentData = z.object({
  content: z
    .string()
    .min(CONTENT_LEN.MIN, '내용을 더 적어주세요.')
    .max(CONTENT_LEN.MAX, '더이상 내용을 적을 수 없습니다.'),
})

export type PostContentData = z.infer<typeof postContentData>
