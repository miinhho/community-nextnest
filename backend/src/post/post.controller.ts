import { UserData } from '@/types/user.data';
import { User } from '@/user/user.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostContentDto } from './dto/post-content.dto';
import { PostService } from './post.service';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() postContentDto: PostContentDto, @User() user: UserData) {
    const { content } = postContentDto;
    return this.postService.createPost(user.id, content);
  }

  @Get(':id')
  findPostById(@Param('id') postId: string) {
    return this.postService.findPostById(postId);
  }

  @Put(':id')
  updatePostContent(@Param('id') postId: string, @Body() postContentDto: PostContentDto) {
    const { content } = postContentDto;
    return this.postService.updatePost(postId, content);
  }

  @Delete(':id')
  async removePost(@Param('id') postId: string) {
    await this.postService.deletePostById(postId);
  }

  @Post('/like/:id')
  async toggleLike(@Param('id') postId: string, @User() user: UserData) {
    return this.postService.addPostLikes(user.id, postId);
  }
}
