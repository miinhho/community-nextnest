import { IdParam } from '@/common/decorator/id.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { PrivateService } from '@/private/private.service';
import { ApiGetUserIsPrivate, ApiUpdateUserPrivacy } from '@/private/private.swagger';
import { UserOwner } from '@/user/guard/user-owner.guard';
import { Body, Controller, Get, ParseBoolPipe, Post } from '@nestjs/common';

@Controller()
export class PrivateController {
  constructor(private readonly privateService: PrivateService) {}

  @UserOwner()
  @Post('user/:id/privacy')
  @ApiUpdateUserPrivacy()
  async updateUserPrivacy(
    @IdParam() id: string,
    @Body('isPrivate', new ParseBoolPipe()) isPrivate: boolean,
  ) {
    await this.privateService.updateUserPrivacy(id, isPrivate);
    return {
      success: true,
    };
  }

  @Public()
  @Get('user/:id/privacy')
  @ApiGetUserIsPrivate()
  async getUserIsPrivate(@IdParam() id: string) {
    const isPrivate = await this.privateService.isUserPrivate(id);
    return {
      success: true,
      data: { isPrivate },
    };
  }
}
