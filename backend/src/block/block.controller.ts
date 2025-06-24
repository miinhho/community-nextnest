import { BlockService } from '@/block/block.service';
import { ApiBlockUser, ApiIsUserBlocked, ApiUnblockUser } from '@/block/block.swagger';
import { IdParam } from '@/common/decorator/id.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiBlockTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { Body, Controller, Delete, Get, Post } from '@nestjs/common';

@ApiBlockTags()
@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @ApiBlockUser()
  async blockUser(@Body('targetId') targetId: string, @User() { id: userId }: UserData) {
    await this.blockService.blockUser({ userId, targetId });
    return {
      success: true,
    };
  }

  @Delete()
  @ApiUnblockUser()
  async unblockUser(
    @Body('targetId') targetId: string,
    @User() { id: userId }: UserData,
  ) {
    await this.blockService.unblockUser({ userId, targetId });
    return {
      success: true,
    };
  }

  @Get(':id')
  @ApiIsUserBlocked()
  async isUserBlocked(@IdParam() targetId: string, @User() { id: userId }: UserData) {
    const isBlocked = await this.blockService.isUserBlocked({
      userId,
      targetId,
    });
    return {
      success: true,
      data: {
        isBlocked,
      },
    };
  }
}
