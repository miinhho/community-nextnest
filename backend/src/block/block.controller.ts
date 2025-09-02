import { BlockRepository } from '@/block/block.repository';
import { BlockUserDto, UnBlockUserDto } from '@/block/dto';
import { User } from '@/common/decorator/user.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiBlockTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiBlockTags()
@Controller('block')
export class BlockController {
  constructor(private readonly blockRepository: BlockRepository) {}

  @ApiOperation({
    summary: '사용자 차단',
    description:
      '특정 사용자를 차단합니다. 차단된 사용자는 차단한 사용자로부터의 모든 상호작용이 제한됩니다.',
  })
  @Post()
  @ApiJwtAuth()
  @ApiBody({
    description: '차단할 사용자 ID',
    type: BlockUserDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConflictResponse({ description: '이미 차단된 사용자' })
  @ApiInternalServerErrorResponse()
  async blockUser(
    @Body() { targetId }: BlockUserDto,
    @User() { id: userId }: UserData,
  ): Promise<void> {
    await this.blockRepository.blockUser({ userId, targetId });
  }

  @ApiOperation({
    summary: '사용자 차단 해제',
    description: '차단된 사용자의 차단을 해제합니다.',
  })
  @Delete()
  @ApiJwtAuth()
  @ApiBody({
    description: '차단 해제할 사용자 ID',
    type: UnBlockUserDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({ description: '차단되지 않은 사용자' })
  @ApiInternalServerErrorResponse()
  async unblockUser(
    @Body() { targetId }: UnBlockUserDto,
    @User() { id: userId }: UserData,
  ): Promise<void> {
    await this.blockRepository.unblockUser({ userId, targetId });
  }
}
