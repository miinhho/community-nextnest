import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const postContentDto = z.object({
  content: z
    .string()
    .min(5, '5글자 이상의 내용을 적어주세요.')
    .max(1_000_000, '최대 글자 수에 도달했습니다.'),
});

export class PostContentDto extends createZodDto(postContentDto) {}
