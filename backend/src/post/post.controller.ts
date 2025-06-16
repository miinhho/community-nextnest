import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { LikeStatus } from '@/common/status/like-status';
import { UserData } from '@/common/user';
import { PostOwner } from '@/post/guard/post-owner.guard';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PostContentDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('post')
  async createPost(@Body() { content }: PostContentDto, @User() user: UserData) {
    const postId = await this.postService.createPost({
      authorId: user.id,
      content,
    });
    return {
      success: true,
      data: { postId, authorId: user.id, content },
    };
  }

  @Public()
  @Get('post/:id')
  async findPostById(@IdParam() id: string) {
    const post = await this.postService.findPostById(id);
    return {
      success: true,
      data: post,
    };
  }

  @Public()
  @Get('user/:id/posts')
  async getUserPosts(@IdParam() id: string, @PageQuery() pageQuery: PageQuery) {
    const { data: posts, meta } = await this.postService.findPostsByUserId(id, pageQuery);
    return {
      success: true,
      data: {
        posts,
        meta,
      },
    };
  }

  @Public()
  @Get('user/:id/posts-count')
  async getUserPostsCount(@IdParam() id: string) {
    const postCount = await this.postService.findPostCountByUserId(id);
    return {
      success: true,
      data: { postCount },
    };
  }

  @Public()
  @Get('post')
  async findPosts(@PageQuery() pageQuery: PageQuery) {
    const { data: posts, meta } = await this.postService.findPostsByPage(pageQuery);
    return {
      success: true,
      data: {
        posts,
        meta,
      },
    };
  }

  @PostOwner()
  @Put('post/:id')
  async updatePost(
    @IdParam() postId: string,
    @Body() { content }: PostContentDto,
    @User() user: UserData,
  ) {
    await this.postService.updatePost({
      id: postId,
      content,
    });
    return {
      success: true,
      data: {
        postId,
        content,
        authorId: user.id,
      },
    };
  }

  @PostOwner()
  @Delete('post/:id')
  async deletePost(@IdParam() id: string) {
    const deletedPost = await this.postService.deletePostById(id);
    return {
      success: true,
      data: deletedPost,
    };
  }

  @Post('post/:id/like')
  async toggleLike(@IdParam() postId: string, @User() user: UserData) {
    const status = await this.postService.addPostLikes({
      userId: user.id,
      postId,
    });

    switch (status) {
      case LikeStatus.MINUS:
        return {
          success: true,
          message: '게시글 좋아요가 취소되었습니다.',
          data: {
            status: LikeStatus.MINUS,
            postId,
          },
        };
      case LikeStatus.PLUS:
        return {
          success: true,
          message: '게시글 좋아요가 추가되었습니다.',
          data: {
            status: LikeStatus.PLUS,
            postId,
          },
        };
    }
  }
}
