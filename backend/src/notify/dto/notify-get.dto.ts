import { PageMetaResponseDto } from '@/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NotifyResponseDto } from './notify.dto';

export class GetNotifiesByUserIdResponseDto {
  @ApiProperty({
    description: '알람 목록',
    type: [NotifyResponseDto],
    isArray: true,
  })
  notifies: NotifyResponseDto[];

  @ApiProperty({
    description: '페이지네이션 메타데이터',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}

export class GetNotifyByIdResponseDto extends NotifyResponseDto {}
