import { User } from '@/common/decorator/user.decorator';
import { ResultStatus } from '@/common/status/result-status';
import { isAdmin, UserData } from '@/common/user';
import { UpdateUserDto } from '@/user/dto/user.dto';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    if (!isAdmin(user) && user.id !== id) {
      throw new ForbiddenException('자신의 계정만 수정할 수 있습니다.');
    }

    const status = await this.userService.updateUserById(id, updateUserDto);

    switch (status) {
      case ResultStatus.ERROR:
        throw new InternalServerErrorException('사용자 정보 업데이트에 실패했습니다.');
      case ResultStatus.SUCCESS:
        return res.json({
          success: true,
          message: '사용자 정보가 성공적으로 업데이트되었습니다.',
        });
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    return res.json({
      success: true,
      data: user,
    });
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    if (!isAdmin(user) && user.id !== id) {
      throw new ForbiddenException('자신의 계정만 삭제할 수 있습니다.');
    }

    const status = await this.userService.deleteUserById(id);

    switch (status) {
      case ResultStatus.NOT_FOUND:
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      case ResultStatus.ERROR:
        throw new InternalServerErrorException('사용자 삭제에 실패했습니다.');
      case ResultStatus.SUCCESS:
        return res.json({
          success: true,
          message: '사용자가 성공적으로 삭제되었습니다.',
        });
    }
  }
}
