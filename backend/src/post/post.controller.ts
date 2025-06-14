import { CommentService } from '@/comment/comment.service';
import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { LikeStatus } from '@/common/status/like-status';
import { isAdmin, UserData } from '@/common/user';
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

  @Get(':id')
  async findPostById(@IdParam() postId: string) {
    const post = await this.postService.findPostById(postId);
    return {
      success: true,
      data: post,
    };
  }

  @Get()
  async findPosts(@PageQuery() { page, size }: PageQuery) {
    const { posts, totalCount, totalPage } = await this.postService.findPostsByPage(
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

  @Get('/post/:id')
  async getCommentsByPostId(
    @IdParam() id: string,
    @PageQuery() { page, size }: PageQuery,
  ) {
    const { totalCount, totalPage, comments } =
      await this.commentService.findCommentsByPostId(id, page, size);
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

  @Put(':id')
  async updatePost(
    @IdParam() postId: string,
    @Body() { content }: PostContentDto,
    @User() user: UserData,
  ) {
    await this.postService.updatePost(postId, content, user.id, isAdmin(user));
    return {
      success: true,
      data: {
        postId,
        content,
        authorId: user.id,
      },
    };
  }

  @Delete(':id')
  async deletePost(@IdParam() postId: string, @User() user: UserData) {
    const deletedPost = await this.postService.deletePostById(
      postId,
      user.id,
      isAdmin(user),
    );
    return {
      success: true,
      data: deletedPost,
    };
  }

  @Post('/like/:id')
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
