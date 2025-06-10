import { CommentService } from '@/comment/comment.service';
import { IdParam } from '@/common/decorator/id.decorator';
import { Owner } from '@/common/decorator/owner.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Patch(':id')
  @Owner()
  async updateUser(@IdParam() id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUserById(id, updateUserDto);
    return {
      success: true,
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

  @Get(':id/comments')
  async getUserComments(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { totalCount, totalPage, comments } =
      await this.commentService.findCommentsByUserId(id, page, size);
    return {
      success: true,
      data: {
        comments,
        meta: {
          totalCount,
          totalPage,
          page,
          size,
        },
      },
    };
  }

  @Delete(':id')
  @Owner()
  async deleteUser(@IdParam() id: string) {
    const deletedUser = await this.userService.deleteUserById(id);
    return {
      success: true,
      data: deletedUser,
    };
  }
}
