import { UserResponseDto } from '@/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDetail extends UserResponseDto {
  @ApiProperty({
    description: '유저 이메일',
  })
  email: string;

  @ApiProperty({
    description: '이메일 인증 날짜',
    nullable: true,
  })
  emailVerified: Date | null;

  @ApiProperty({
    description: '팔로잉 수',
  })
  followingCount: number;

  @ApiProperty({
    description: '팔로워 수',
  })
  followerCount: number;

  @ApiProperty({
    description: '게시글 수',
  })
  postCount: number;

  @ApiProperty({
    description: '유저 역할',
    enum: [Role.ADMIN, Role.USER],
  })
  role: Role;

  @ApiProperty({
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
  })
  updatedAt: Date;
}

export class GetUserByIdResponseDto extends UserDetail {}
export class GetMyInfoResponseDto extends UserDetail {}

export class DeleteUserResponseDto extends UserResponseDto {
  @ApiProperty({
    description: '삭제된 사용자 이메일',
  })
  email: string;
}
