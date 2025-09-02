import { IdParam } from '@/common/decorator/id.decorator';
import { OptionalAuth } from '@/common/decorator/optional-auth.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiIdParam } from '@/common/swagger/id-param.swagger';
import { ApiUserTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import {
  DeleteUserResponseDto,
  GetMyInfoResponseDto,
  GetUserByIdResponseDto,
} from '@/user/dto/user-find.dto';
import { UpdateUserDto } from '@/user/dto/user-update.dto';
import { UserOwner } from '@/user/guard/user-owner.guard';
import { UserRepository } from '@/user/user.repository';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiUserTags()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: '현재 사용자 정보 조회',
    description: '현재 로그인한 사용자의 정보를 조회합니다.',
  })
  @ApiJwtAuth()
  @ApiOkResponse({
    type: GetMyInfoResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiInternalServerErrorResponse()
  async getMyInfo(@User() user: UserData): Promise<GetMyInfoResponseDto> {
    const userData = await this.userRepository.findUserById(user.id);
    return {
      ...userData,
    };
  }

  @ApiOperation({
    summary: '사용자 조회',
    description:
      'ID로 특정 사용자의 정보를 조회합니다. 비공개 사용자의 경우, 요청자가 팔로우한 사용자만 조회할 수 있습니다.',
  })
  @Get('/:id')
  @OptionalAuth()
  @ApiJwtAuth()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiOkResponse({
    type: GetUserByIdResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiUnauthorizedResponse({ description: '비공개 사용자 조회는 인증이 요구됨' })
  @ApiForbiddenResponse({
    description: '비공개 사용자의 경우, 팔로우한 사용자만 조회 가능',
  })
  @ApiInternalServerErrorResponse()
  async getUserById(
    @IdParam() id: string,
    @User() user?: UserData,
  ): Promise<GetUserByIdResponseDto> {
    const userData = await this.userService.findUserById(id, user);
    return {
      ...userData,
    };
  }

  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자의 프로필 정보를 수정합니다. 본인과 관리자만 수정할 수 있습니다.',
  })
  @Patch('/:id')
  @UserOwner()
  @ApiJwtAuth()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async updateUser(@IdParam() id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.updateUserById(id, updateUserDto);
  }

  @ApiOperation({
    summary: '사용자 삭제',
    description: 'ID로 특정 사용자를 삭제합니다. 본인과 관리자만 삭제할 수 있습니다.',
  })
  @Delete('/:id')
  @UserOwner()
  @ApiJwtAuth()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: DeleteUserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async deleteUser(@IdParam() id: string): Promise<DeleteUserResponseDto> {
    const deletedUser = await this.userRepository.deleteUserById(id);
    return {
      ...deletedUser,
    };
  }
}
