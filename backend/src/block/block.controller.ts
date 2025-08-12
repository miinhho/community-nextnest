import { BlockRepository } from '@/block/block.repository';
import { ApiBlockUser, ApiUnblockUser } from '@/block/block.swagger';
import { User } from '@/common/decorator/user.decorator';
import { ApiBlockTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { Body, Controller, Delete, Post } from '@nestjs/common';

@ApiBlockTags()
@Controller('block')
export class BlockController {
  constructor(private readonly blockRepository: BlockRepository) {}

  @Post()
  @ApiBlockUser()
  async blockUser(@Body('targetId') targetId: string, @User() { id: userId }: UserData) {
    await this.blockRepository.blockUser({ userId, targetId });
    return {
      success: true,
    };
  }

  @Delete()
  @ApiUnblockUser()
  async unblockUser(@Body('targetId') targetId: string, @User() { id: userId }: UserData) {
    await this.blockRepository.unblockUser({ userId, targetId });
    return {
      success: true,
    };
  }
}
