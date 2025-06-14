import { CommentService } from '@/comment/comment.service';
import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { FollowService } from '@/follow/follow.service';
import { PostService } from '@/post/post.service';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { UserOwner } from '@/user/guard/user-owner.guard';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly followService: FollowService,
  ) {}

  @UserOwner()
  @Patch(':id')
  async updateUser(@IdParam() id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUserById(id, updateUserDto);
    return {
      success: true,
      data: updatedUser,
    };
  }

  @Public()
  @Get(':id')
  async findUserById(@IdParam() id: string) {
    const user = await this.userService.findUserById(id);
    return {
      success: true,
      data: user,
    };
  }

  @Public()
  @Get(':id/posts-count')
  async getUserPostsCount(@IdParam() id: string) {
    const postCount = await this.postService.findPostCountByUserId(id);
    return {
      success: true,
      data: { postCount },
    };
  }

  @Public()
  @Get(':id/posts')
  async getUserPosts(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { data: posts, meta } = await this.postService.findPostsByUserId(
      id,
      page,
      size,
    );
    return {
      success: true,
      data: {
        posts,
        meta,
      },
    };
  }

  @Public()
  @Get(':id/comments')
  async getUserComments(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { data: comments, meta } = await this.commentService.findCommentsByUserId(
      id,
      page,
      size,
    );
    return {
      success: true,
      data: {
        comments,
        meta,
      },
    };
  }

  @Public()
  @Get(':id/following-count')
  async getUserFollowingCount(@IdParam() id: string) {
    const followingCount = await this.followService.getFollowingCount(id);
    return {
      success: true,
      data: { followingCount },
    };
  }

  @Public()
  @Get(':id/followers-count')
  async getUserFollowersCount(@IdParam() id: string) {
    const followersCount = await this.followService.getFollowersCount(id);
    return {
      success: true,
      data: { followersCount },
    };
  }

  @Public()
  @Get(':id/followers')
  async getUserFollowers(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { data: followers, meta } = await this.followService.getFollowers(
      id,
      page,
      size,
    );
    return {
      success: true,
      data: {
        followers,
        meta,
      },
    };
  }

  @Public()
  @Get(':id/following')
  async getUserFollowing(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { data: following, meta } = await this.followService.getFollowing(
      id,
      page,
      size,
    );
    return {
      success: true,
      data: {
        following,
        meta,
      },
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
