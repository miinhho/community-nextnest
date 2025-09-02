import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdatePrivateBodyDto {
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: '사용자의 공개 여부 (true: 비공개, false: 공개)',
  })
  isPrivate: boolean;
}

export class GetPrivateResponseDto {
  @ApiProperty({
    type: Boolean,
    description: '사용자의 공개 여부 (true: 비공개, false: 공개)',
  })
  isPrivate: boolean;
}
