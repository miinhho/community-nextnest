import { PageMetaResponseDto, UserResponseDto } from '@/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetFollowersResponseDto {
  @ApiProperty({
    description: '팔로워 목록',
    type: [UserResponseDto],
    isArray: true,
  })
  followers: UserResponseDto[];

  @ApiProperty({
    description: '페이지네이션 메타데이터',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}

export class GetFollowersCountResponseDto {
  @ApiProperty({
    description: '팔로워 수',
  })
  followersCount: number;
}
