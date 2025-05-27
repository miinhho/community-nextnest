import { z } from "zod/v4";

export const PostContentDto = z.object({
  title: z
    .string()
    .min(5, "5글자 이상의 제목을 지어주세요")
    .max(50, "제목은 50글자를 넘길 수 없습니다."),
  content: z
    .string()
    .min(10, "10글자 이상의 내용을 적어주세요.")
    .max(1_000_000, "1,000,000 글자 이상의 내용을 적을 수 없습니다."),
});
