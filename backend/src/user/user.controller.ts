import { IdParam } from '@/common/decorator/id.decorator';
import { Owner } from '@/common/decorator/owner.decorator';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(':id')
  @Owner()
  async updateUser(@IdParam() id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUserById(id, updateUserDto);
    return {
      success: true,
      message: '사용자 정보가 성공적으로 업데이트되었습니다.',
      data: updatedUser,
    };
  }

  @Get(':id')
  async findUserById(@IdParam() id: string) {
    const user = await this.userService.findUserById(id);
    return {
      success: true,
      data: user,
    };
  }

  @Delete(':id')
  @Owner()
  async deleteUser(@IdParam() id: string) {
    const deletedUser = await this.userService.deleteUserById(id);
    return {
      success: true,
      message: '사용자가 성공적으로 삭제되었습니다.',
      data: deletedUser,
    };
  }
}
