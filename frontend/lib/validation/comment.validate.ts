import { COMMENT_LEN } from '@/lib/constant';
import { z } from 'zod/v4';

export const commentContentData = z.object({
  content: z
    .string()
    .min(COMMENT_LEN.MIN, '내용을 더 적어주세요.')
    .max(COMMENT_LEN.MAX, '더이상 내용을 적을 수 없습니다.'),
});
export type CommentContentData = z.infer<typeof commentContentData>;
