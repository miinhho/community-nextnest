import { ClientInfo, ClientInfoType } from '@/common/decorator/client-info.decorator';
import { IdParam } from '@/common/decorator/id.decorator';
import { OptionalAuth } from '@/common/decorator/optional-auth.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { LikeStatus } from '@/common/status';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import { PostOwner } from '@/post/guard/post-owner.guard';
import { PostRepository } from '@/post/post.repository';
import {
  ApiCreatePost,
  ApiDeletePost,
  ApiFindPostById,
  ApiFindPosts,
  ApiGetUserPosts,
  ApiTogglePostLike,
  ApiUpdatePost,
} from '@/post/post.swagger';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PostContentDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postRepository: PostRepository,
  ) {}

  @Post('post')
  @ApiCreatePost()
  async createPost(@Body() { content }: PostContentDto, @User() user: UserData) {
    const postId = await this.postRepository.createPost({
      authorId: user.id,
      content,
    });
    return {
      success: true,
      data: { postId, authorId: user.id },
    };
  }

  @Public()
  @Get('post')
  @ApiFindPosts()
  async findPosts(@PageQuery() pageQuery: PageQueryType) {
    const { data: posts, meta } = await this.postService.findPostsByPage(pageQuery);
    return {
      success: true,
      data: {
        posts,
        meta,
      },
    };
  }

  @OptionalAuth()
  @Get('post/:id')
  @ApiFindPostById()
  async findPostById(
    @IdParam() id: string,
    @User() user?: UserData,
    @ClientInfo() clientInfo?: ClientInfoType,
  ) {
    const post = await this.postService.findPostById(id, user, clientInfo);
    return {
      success: true,
      data: {
        ...post,
      },
    };
  }

  @PostOwner()
  @Put('post/:id')
  @ApiUpdatePost()
  async updatePost(
    @IdParam() postId: string,
    @Body() { content }: PostContentDto,
    @User() user: UserData,
  ) {
    await this.postRepository.updatePost({
      postId,
      content,
    });
    return {
      success: true,
      data: {
        id: postId,
        content,
        authorId: user.id,
      },
    };
  }

  @PostOwner()
  @Delete('post/:id')
  @ApiDeletePost()
  async deletePost(@IdParam() id: string) {
    const deletedPost = await this.postRepository.deletePostById(id);
    return {
      success: true,
      data: {
        ...deletedPost,
      },
    };
  }

  @Post('post/:id/like')
  @ApiTogglePostLike()
  async toggleLike(@IdParam() postId: string, @User() user: UserData) {
    const status = await this.postService.addPostLikes({
      user,
      postId,
    });

    switch (status) {
      case LikeStatus.MINUS:
        return {
          success: true,
          data: {
            status: LikeStatus.MINUS,
            id: postId,
          },
        };
      case LikeStatus.PLUS:
        return {
          success: true,
          data: {
            status: LikeStatus.PLUS,
            id: postId,
          },
        };
    }
  }

  @OptionalAuth()
  @Get('user/:id/posts')
  @ApiGetUserPosts()
  async getUserPosts(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
    @User() user?: UserData,
  ) {
    const { data: posts, meta } = await this.postService.findPostsByUserId(id, pageQuery, user);
    return {
      success: true,
      data: {
        posts,
        meta,
      },
    };
  }
}
