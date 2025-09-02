import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BlockUserDto {
  @IsString()
  @ApiProperty({
    description: '차단할 사용자 ID',
  })
  targetId: string;
}
