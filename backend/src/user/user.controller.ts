import { IdParam } from '@/common/decorator/id.decorator';
import { OptionalAuth } from '@/common/decorator/optional-auth.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiUserTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { UserOwner } from '@/user/guard/user-owner.guard';
import { ApiDeleteUser, ApiGetUserById, ApiUpdateUser } from '@/user/user.swagger';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@ApiUserTags()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OptionalAuth()
  @Get(':id')
  @ApiGetUserById()
  async getUserById(@IdParam() id: string, @User() { id: userId, role }: UserData) {
    const user = await this.userService.findUserById(id, {
      requesterId: userId || null,
      role: role || null,
    });
    return {
      success: true,
      data: {
        ...user,
      },
    };
  }

  @UserOwner()
  @Patch(':id')
  @ApiUpdateUser()
  async updateUser(@IdParam() id: string, @Body() { name, image }: UpdateUserDto) {
    await this.userService.updateUserById(id, { name, image });
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
