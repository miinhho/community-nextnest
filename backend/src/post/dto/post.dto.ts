import { IsContent } from '@/common/decorator/content.decorator';
import { CONTENT_LEN } from '@/common/utils/content';

export class PostContentDto {
  @IsContent(CONTENT_LEN.MIN, CONTENT_LEN.MAX)
  content: string;
}
