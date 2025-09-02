import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UnBlockUserDto {
  @IsString()
  @ApiProperty({
    description: '차단 해제할 사용자 ID',
  })
  targetId: string;
}
