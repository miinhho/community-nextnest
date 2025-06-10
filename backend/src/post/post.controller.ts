import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { LikeStatus } from '@/common/status/like-status';
import { isAdmin, UserData } from '@/common/user';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PostContentDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() { content }: PostContentDto, @User() user: UserData) {
    const postId = await this.postService.createPost(user.id, content);
    return {
      success: true,
      message: '게시글이 성공적으로 작성되었습니다.',
      data: { postId, authorId: user.id, content },
    };
  }

  @Get(':id')
  async findPostById(@Param('id', ParseUUIDPipe) postId: string) {
    const post = await this.postService.findPostById(postId);
    return {
      success: true,
      message: '게시글을 성공적으로 조회했습니다.',
      data: post,
    };
  }

  @Get()
  async findPosts(@PageQuery() { page, size }: PageQuery) {
    const posts = await this.postService.findPostsByPage(page, size);
    return {
      success: true,
      message: '게시글 목록을 성공적으로 조회했습니다.',
      data: posts,
    };
  }

  @Put(':id')
  async updatePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() { content }: PostContentDto,
    @User() user: UserData,
  ) {
    await this.postService.updatePost(postId, content, user.id, isAdmin(user));
    return {
      success: true,
      message: '게시글이 성공적으로 수정되었습니다.',
      data: {
        postId,
        content,
        authorId: user.id,
      },
    };
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseUUIDPipe) postId: string, @User() user: UserData) {
    const deletedPost = await this.postService.deletePostById(
      postId,
      user.id,
      isAdmin(user),
    );
    return {
      success: true,
      message: '게시글이 성공적으로 삭제되었습니다.',
      data: deletedPost,
    };
  }

  @Post('/like/:id')
  async toggleLike(@Param('id', ParseUUIDPipe) postId: string, @User() user: UserData) {
    const status = await this.postService.addPostLikes(user.id, postId);

    switch (status) {
      case LikeStatus.MINUS:
        return {
          success: true,
          message: '게시글 좋아요가 취소되었습니다.',
        };
      case LikeStatus.PLUS:
        return {
          success: true,
          message: '게시글 좋아요가 추가되었습니다.',
        };
    }
  }
}
