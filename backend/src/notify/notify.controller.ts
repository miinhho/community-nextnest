import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiNotifyTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import { NotifyService } from '@/notify/notify.service';
import { ApiGetNotifiesByUserId, ApiGetNotifyById } from '@/notify/notify.swagger';
import { Controller, Get, Patch } from '@nestjs/common';

@ApiNotifyTags()
@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Get(':id')
  @ApiGetNotifyById()
  async getNotifyById(@IdParam() id: string, @User() user: UserData) {
    const notify = await this.notifyService.findNotifyById(id, user);
    return {
      success: true,
      data: notify,
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

  @Patch(':id/read')
  @ApiGetNotifyById()
  async readNotifyById(@IdParam() id: string, @User() user: UserData) {
    await this.notifyService.markAsRead(id, user.id);
    return {
      success: true,
    };
  }

  @Patch('user/read-all')
  @ApiGetNotifiesByUserId()
  async readAllNotifiesByUserId(@User() user: UserData) {
    await this.notifyService.markAllAsRead(user.id);
    return {
      success: true,
    };
  }
}
