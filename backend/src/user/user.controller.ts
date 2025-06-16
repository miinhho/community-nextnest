import { IdParam } from '@/common/decorator/id.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { UserOwner } from '@/user/guard/user-owner.guard';
import { ApiDeleteUser, ApiGetUserById, ApiUpdateUser } from '@/user/user.swagger';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get(':id')
  @ApiGetUserById()
  async getUserById(@IdParam() id: string) {
    const user = await this.userService.findUserById(id);
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
