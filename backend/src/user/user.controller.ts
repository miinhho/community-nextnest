import { IdParam } from '@/common/decorator/id.decorator';
import { OptionalAuth } from '@/common/decorator/optional-auth.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiUserTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { UserOwner } from '@/user/guard/user-owner.guard';
import {
  ApiDeleteUser,
  ApiGetMyInfo,
  ApiGetUserById,
  ApiUpdateUser,
} from '@/user/user.swagger';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@ApiUserTags()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OptionalAuth()
  @Get(':id')
  @ApiGetUserById()
  async getUserById(@IdParam() id: string, @User() user?: UserData) {
    const userData = await this.userService.findUserById(id, user);
    return {
      success: true,
      data: {
        ...userData,
      },
    };
  }

  @Get('me')
  @ApiGetMyInfo()
  async getMyInfo(@User() user: UserData) {
    const userData = await this.userService.findMyInfo(user);
    return {
      success: true,
      data: {
        ...userData,
      },
    };
  }

  @UserOwner()
  @Patch(':id')
  @ApiUpdateUser()
  async updateUser(@IdParam() id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateUserById(id, updateUserDto);
    return {
      success: true,
    };
  }

  @UserOwner()
  @Delete(':id')
  @ApiDeleteUser()
  async deleteUser(@IdParam() id: string) {
    const deletedUser = await this.userService.deleteUserById(id);
    return {
      success: true,
      data: {
        ...deletedUser,
      },
    };
  }
}
