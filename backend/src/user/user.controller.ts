import { ResultStatus } from '@/common/status/result-status';
import { UpdateUserDto } from '@/user/dto/user.dto';
import {
  Body,
  Controller,
  Delete,
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
    @Res() res: Response,
  ) {
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
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
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
