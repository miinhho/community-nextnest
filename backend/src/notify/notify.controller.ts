import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiNotifyTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import {
  MARK_ALL_AS_READ_NOTIFY,
  MARK_AS_READ_NOTIFY,
} from '@/notify/event/types/notify.key';
import { NotifyService } from '@/notify/notify.service';
import { ApiGetNotifiesByUserId, ApiGetNotifyById } from '@/notify/notify.swagger';
import { Controller, Get, Patch } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiNotifyTags()
@Controller('notify')
export class NotifyController {
  constructor(
    private readonly notifyService: NotifyService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
    this.eventEmitter.emit(MARK_AS_READ_NOTIFY, user.id, id);
    return {
      success: true,
    };
  }

  @Patch('user/read-all')
  @ApiGetNotifiesByUserId()
  async readAllNotifiesByUserId(@User() user: UserData) {
    await this.notifyService.markAllAsRead(user.id);
    this.eventEmitter.emit(MARK_ALL_AS_READ_NOTIFY, user.id);
    return {
      success: true,
    };
  }
}
