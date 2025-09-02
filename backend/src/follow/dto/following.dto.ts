import { PageMetaResponseDto, UserResponseDto } from '@/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetFollowingResponseDto {
  @ApiProperty({
    description: '팔로잉 목록',
    type: [UserResponseDto],
    isArray: true,
  })
  following: UserResponseDto[];

  @ApiProperty({
    description: '페이지네이션 메타데이터',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}

export class GetFollowingCountResponseDto {
  @ApiProperty({
    description: '팔로잉 수',
  })
  followingCount: number;
}
