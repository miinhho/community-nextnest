import { CommentService } from '@/comment/comment.service';
import { IdParam } from '@/common/decorator/id.decorator';
import { Owner } from '@/common/decorator/owner.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { FollowService } from '@/follow/follow.service';
import { PostService } from '@/post/post.service';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private followService: FollowService,
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

  @Get(':id/posts-count')
  async getUserPostsCount(@IdParam() id: string) {
    const postCount = await this.postService.findPostCountByUserId(id);
    return {
      success: true,
      data: { postCount },
    };
  }

  @Get(':id/posts')
  async getUserPosts(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { totalCount, totalPage, posts } = await this.postService.findPostsByUserId(
      id,
      page,
      size,
    );
    return {
      success: true,
      data: {
        posts,
        meta: {
          totalCount,
          totalPage,
          page,
          size,
        },
      },
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

  @Get(':id/following-count')
  async getUserFollowingCount(@IdParam() id: string) {
    const followingCount = await this.followService.getFollowingCount(id);
    return {
      success: true,
      data: { followingCount },
    };
  }

  @Get(':id/followers-count')
  async getUserFollowersCount(@IdParam() id: string) {
    const followersCount = await this.followService.getFollowersCount(id);
    return {
      success: true,
      data: { followersCount },
    };
  }

  @Get(':id/followers')
  async getUserFollowers(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { followers, totalCount, totalPage } = await this.followService.getFollowers(
      id,
      page,
      size,
    );
    return {
      success: true,
      data: {
        followers,
        meta: {
          totalCount,
          totalPage,
          page,
          size,
        },
      },
    };
  }

  @Get(':id/following')
  async getUserFollowing(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const { following, totalCount, totalPage } = await this.followService.getFollowing(
      id,
      page,
      size,
    );
    return {
      success: true,
      data: {
        following,
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
