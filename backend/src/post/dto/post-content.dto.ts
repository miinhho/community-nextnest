import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const postContentDto = z.object({
  content: z
    .string()
    .min(5, '5글자 이상의 내용을 적어주세요.')
    .max(1_000_000, '1,000,000 글자 이상의 내용을 적을 수 없습니다.'),
});

export class PostContentDto extends createZodDto(postContentDto) {}
