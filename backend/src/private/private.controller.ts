import { IdParam } from '@/common/decorator/id.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiIdParam } from '@/common/swagger/id-param.swagger';
import { ApiUserTags } from '@/common/swagger/tags.swagger';
import { GetPrivateResponseDto, UpdatePrivateBodyDto } from '@/private/dto/private.dto';
import { PrivateRepository } from '@/private/private.repository';
import { PrivateService } from '@/private/private.service';
import { UserOwner } from '@/user/guard/user-owner.guard';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller()
@ApiUserTags()
export class PrivateController {
  constructor(
    private readonly privateService: PrivateService,
    private readonly privateRepository: PrivateRepository,
  ) {}

  @ApiOperation({
    summary: '사용자 공개 여부 수정',
    description: '사용자의 공개 여부를 수정합니다.',
  })
  @Post('user/:id/privacy')
  @UserOwner()
  @ApiJwtAuth()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiBody({
    type: UpdatePrivateBodyDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async updateUserPrivacy(
    @IdParam() id: string,
    @Body() body: UpdatePrivateBodyDto,
  ): Promise<void> {
    await this.privateRepository.updateUserPrivacy(id, body.isPrivate);
  }

  @ApiOperation({
    summary: '사용자 공개 여부 조회',
    description: '사용자의 공개 여부를 조회합니다.',
  })
  @Get('user/:id/privacy')
  @Public()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GetPrivateResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async getUserIsPrivate(@IdParam() id: string): Promise<GetPrivateResponseDto> {
    const isPrivate = await this.privateService.isUserPrivate(id);
    return { isPrivate };
  }
}
