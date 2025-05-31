import { z } from "zod/v4";

export const postContentDto = z.object({
  content: z
    .string()
    .min(10, "10글자 이상의 내용을 적어주세요.")
    .max(1_000_000, "1,000,000 글자 이상의 내용을 적을 수 없습니다."),
});
