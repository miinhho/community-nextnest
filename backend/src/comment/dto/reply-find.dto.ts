import { CommentWithAuthorDto, PageMetaResponseDto } from '@/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetRepliesResponseDto {
  @ApiProperty({
    description: '댓글 답글 목록',
    type: [CommentWithAuthorDto],
    isArray: true,
  })
  replies: CommentWithAuthorDto[];

  @ApiProperty({
    description: '페이지네이션 정보',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}
