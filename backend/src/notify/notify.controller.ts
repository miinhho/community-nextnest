import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiNotifyTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import { NotifyRepository } from '@/notify/notify.repository';
import { NotifyService } from '@/notify/notify.service';
import { ApiGetNotifiesByUserId, ApiGetNotifyById } from '@/notify/notify.swagger';
import { Controller, Get, Patch } from '@nestjs/common';

@ApiNotifyTags()
@Controller('notify')
export class NotifyController {
  constructor(
    private readonly notifyService: NotifyService,
    private readonly notifyRepository: NotifyRepository,
  ) {}

  @Patch('user/read-all')
  @ApiGetNotifiesByUserId()
  async readAllNotifiesByUserId(@User() user: UserData) {
    await this.notifyRepository.markAllAsRead(user.id);
    return {
      success: true,
    };
  }

  @Get('user/:id')
  @ApiGetNotifiesByUserId()
  async getNotifiesByUserId(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
    @User() user: UserData,
  ) {
    const { data: notifies, meta } = await this.notifyService.findNotifiesByUserId(
      id,
      pageQuery,
      user,
    );
    return {
      success: true,
      data: {
        notifies,
        meta,
      },
    };
  }

  @Get(':id')
  @ApiGetNotifyById()
  async getNotifyById(@IdParam() id: string, @User() user: UserData) {
    const notify = await this.notifyService.findNotifyById(id, user);
    return {
      success: true,
      data: notify,
    };
  }

  @Patch(':id/read')
  @ApiGetNotifyById()
  async readNotifyById(@IdParam() id: string, @User() user: UserData) {
    await this.notifyRepository.markAsRead(id, user.id);
    return {
      success: true,
    };
  }
}
