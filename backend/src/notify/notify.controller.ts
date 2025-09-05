import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiIdParam } from '@/common/swagger/id-param.swagger';
import { ApiPageQuery } from '@/common/swagger/page.swagger';
import { ApiNotifyTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import { GetNotifiesByUserIdResponseDto, GetNotifyByIdResponseDto } from '@/notify/dto';
import { NotifyRepository } from '@/notify/notify.repository';
import { NotifyService } from '@/notify/notify.service';
import { Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiNotifyTags()
@Controller('notify')
export class NotifyController {
  constructor(
    private readonly notifyService: NotifyService,
    private readonly notifyRepository: NotifyRepository,
  ) {}

  @ApiOperation({
    summary: '사용자 알람 전체 읽음 처리',
    description: '특정 사용자의 모든 알람을 읽음 처리합니다.',
  })
  @Patch('user/read-all')
  @ApiJwtAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiInternalServerErrorResponse()
  async readAllNotifiesByUserId(@User() user: UserData): Promise<void> {
    await this.notifyRepository.markAllAsRead(user.id);
  }

  @ApiOperation({
    summary: '사용자 알람 목록 조회',
    description: '특정 사용자의 알람 목록을 조회합니다.',
  })
  @Get('user/:id')
  @ApiJwtAuth()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiPageQuery()
  @ApiOkResponse({
    type: GetNotifiesByUserIdResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiForbiddenResponse({ description: '다른 사용자의 알람을 조회할 수 없음' })
  @ApiInternalServerErrorResponse()
  async getNotifiesByUserId(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
    @User() user: UserData,
  ): Promise<GetNotifiesByUserIdResponseDto> {
    const { data: notifies, meta } = await this.notifyService.findNotifiesByUserId(
      id,
      pageQuery,
      user,
    );
    return {
      notifies,
      meta,
    };
  }

  @ApiOperation({
    summary: '알람 상세 조회',
    description: '특정 알람의 상세 정보를 조회합니다.',
  })
  @Get(':id')
  @ApiJwtAuth()
  @ApiIdParam({
    description: '알람 ID',
  })
  @ApiOkResponse({
    type: GetNotifyByIdResponseDto,
  })
  @ApiNotFoundResponse({ description: '알람을 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async getNotifyById(
    @IdParam() id: string,
    @User() user: UserData,
  ): Promise<GetNotifyByIdResponseDto> {
    return this.notifyService.findNotifyById(id, user);
  }

  @ApiOperation({
    summary: '알람 읽음 처리',
    description: '특정 알람을 읽음 처리합니다.',
  })
  @Patch(':id/read')
  @ApiJwtAuth()
  @ApiIdParam({
    description: '알람 ID',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: '알람을 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async readNotifyById(@IdParam() id: string, @User() user: UserData): Promise<void> {
    await this.notifyRepository.markAsRead(id, user.id);
  }
}
