import { CommentService } from '@/comment/comment.service';
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

@Controller('api/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  async createPost(@Body() { content }: PostContentDto, @User() user: UserData) {
    const postId = await this.postService.createPost(user.id, content);
    return {
      success: true,
      data: { postId, authorId: user.id, content },
    };
  }

  @Public()
  @Get(':id')
  async findPostById(@IdParam() postId: string) {
    const post = await this.postService.findPostById(postId);
    return {
      success: true,
      data: post,
    };
  }

  @Public()
  @Get()
  async findPosts(@PageQuery() { page, size }: PageQuery) {
    const { data: posts, meta } = await this.postService.findPostsByPage(page, size);
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
  async getCommentsByPostId(
    @IdParam() id: string,
    @PageQuery() { page, size }: PageQuery,
  ) {
    const { data: comments, meta } = await this.commentService.findCommentsByPostId(
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

  @PostOwner()
  @Put(':id')
  async updatePost(
    @IdParam() postId: string,
    @Body() { content }: PostContentDto,
    @User() user: UserData,
  ) {
    await this.postService.updatePost(postId, content);
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
  @Delete(':id')
  async deletePost(@IdParam() postId: string) {
    const deletedPost = await this.postService.deletePostById(postId);
    return {
      success: true,
      data: deletedPost,
    };
  }

  @Post(':id/like')
  async toggleLike(@IdParam() postId: string, @User() user: UserData) {
    const status = await this.postService.addPostLikes(user.id, postId);

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
