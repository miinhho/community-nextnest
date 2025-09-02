import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiIdParam } from '@/common/swagger/id-param.swagger';
import { ApiPageQuery } from '@/common/swagger/page.swagger';
import { ApiUserTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import {
  GetFollowersCountResponseDto,
  GetFollowersResponseDto,
  GetFollowingCountResponseDto,
  GetFollowingResponseDto,
  ToggleFollowResponseDto,
} from '@/follow/dto';
import { FollowRepository } from '@/follow/follow.repository';
import { Controller, Delete, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FollowService } from './follow.service';

@Controller()
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly followRepository: FollowRepository,
  ) {}

  @ApiOperation({
    summary: '팔로우 토글',
    description: '사용자의 팔로우 상태를 토글합니다.',
  })
  @Post('user/:id/follow')
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiIdParam({
    description: '팔로우할 사용자 ID',
  })
  @ApiOkResponse({
    type: ToggleFollowResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async toggleFollowUser(
    @IdParam() targetId: string,
    @User() user: UserData,
  ): Promise<ToggleFollowResponseDto> {
    const status = await this.followService.followUser({
      userId: user.id,
      targetId,
    });

    return {
      targetId,
      status,
    };
  }

  @ApiOperation({
    summary: '팔로우 요청',
    description: '사용자에게 팔로우 요청을 보냅니다.',
  })
  @Post('user/:id/follow/request')
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiIdParam({
    description: '팔로우 요청할 사용자 ID',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async sendFollowRequest(@IdParam('id') targetId: string, @User() user: UserData): Promise<void> {
    await this.followService.sendFollowRequest({
      userId: user.id,
      targetId,
    });
  }

  @ApiOperation({
    summary: '팔로우 요청 거절',
    description: '사용자의 팔로우 요청을 거절합니다.',
  })
  @Delete('user/:id/follow/request')
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiIdParam({
    description: '팔로우 요청을 거절할 사용자 ID',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async rejectFollowRequest(
    @IdParam('id') targetId: string,
    @User() user: UserData,
  ): Promise<void> {
    await this.followService.rejectFollowRequest({
      userId: user.id,
      targetId,
    });
  }

  @ApiOperation({
    summary: '팔로잉 수 조회',
    description: '특정 사용자가 팔로우하는 사용자 수를 조회합니다.',
  })
  @Get('user/:id/following-count')
  @Public()
  @ApiUserTags()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiOkResponse({
    type: GetFollowingCountResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async getUserFollowingCount(@IdParam() id: string): Promise<GetFollowingCountResponseDto> {
    const followingCount = await this.followRepository.getFollowingCount(id);
    return {
      followingCount,
    };
  }

  @ApiOperation({
    summary: '팔로워 수 조회',
    description: '특정 사용자의 팔로워 수를 조회합니다.',
  })
  @Get('user/:id/followers-count')
  @Public()
  @ApiUserTags()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiOkResponse({
    type: GetFollowersCountResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async getUserFollowersCount(@IdParam() id: string): Promise<GetFollowersCountResponseDto> {
    const followersCount = await this.followRepository.getFollowersCount(id);
    return {
      followersCount,
    };
  }

  @ApiOperation({
    summary: '팔로워 목록 조회',
    description: '특정 사용자의 팔로워 목록을 페이지네이션으로 조회합니다.',
  })
  @Get('user/:id/followers')
  @Public()
  @ApiUserTags()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiPageQuery()
  @ApiOkResponse({
    type: GetFollowersResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async getUserFollowers(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
  ): Promise<GetFollowersResponseDto> {
    const { data: followers, meta } = await this.followRepository.getFollowers(id, pageQuery);
    return {
      followers,
      meta,
    };
  }

  @ApiOperation({
    summary: '팔로잉 목록 조회',
    description: '특정 사용자가 팔로우하는 사용자 목록을 페이지네이션으로 조회합니다.',
  })
  @Get('user/:id/following')
  @Public()
  @ApiUserTags()
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiPageQuery()
  @ApiOkResponse({
    type: GetFollowingResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async getUserFollowing(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
  ): Promise<GetFollowingResponseDto> {
    const { data: following, meta } = await this.followRepository.getFollowing(id, pageQuery);
    return {
      following,
      meta,
    };
  }
}
