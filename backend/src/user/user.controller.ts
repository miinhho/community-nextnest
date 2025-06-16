import { IdParam } from '@/common/decorator/id.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { UserOwner } from '@/user/guard/user-owner.guard';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get(':id')
  async getUserById(@IdParam() id: string) {
    const user = await this.userService.findUserById(id);
    return {
      success: true,
      data: user,
    };
  }

  @UserOwner()
  @Patch(':id')
  async updateUser(@IdParam() id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUserById(id, updateUserDto);
    return {
      success: true,
      data: updatedUser,
    };
  }

  @UserOwner()
  @Delete(':id')
  async deleteUser(@IdParam() id: string) {
    const deletedUser = await this.userService.deleteUserById(id);
    return {
      success: true,
      data: deletedUser,
    };
  }
}
