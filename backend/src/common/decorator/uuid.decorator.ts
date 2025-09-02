import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export const IsIdUUID = ({ description }: { description: string }) =>
  applyDecorators(
    IsUUID(4, {
      message: '유효하지 않은 ID입니다.',
    }),
    ApiProperty({
      type: String,
      description,
    }),
  );
