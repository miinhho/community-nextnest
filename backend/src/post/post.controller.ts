import { ClientInfo, ClientInfoType } from '@/common/decorator/client-info.decorator';
import { IdParam } from '@/common/decorator/id.decorator';
import { OptionalAuth } from '@/common/decorator/optional-auth.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiIdParam } from '@/common/swagger/id-param.swagger';
import { ApiPageQuery } from '@/common/swagger/page.swagger';
import { ApiUserTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import { PostOwner } from '@/post/guard/post-owner.guard';
import { PostRepository } from '@/post/post.repository';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreatePostResponseDto,
  DeletePostResponseDto,
  FindPostByIdResponseDto,
  FindPostsResponseDto,
  GetUserPostsResponseDto,
  PostContentDto,
  ToggleLikeResponseDto,
  UpdatePostResponseDto,
} from './dto/post.dto';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postRepository: PostRepository,
  ) {}

  @ApiOperation({
    summary: '게시글 생성',
    description: '새 게시글을 생성합니다.',
  })
  @Post('post')
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiOkResponse({
    type: CreatePostResponseDto,
  })
  @ApiInternalServerErrorResponse()
  async createPost(
    @Body() body: PostContentDto,
    @User() user: UserData,
  ): Promise<CreatePostResponseDto> {
    const { id: postId } = await this.postRepository.createPost({
      authorId: user.id,
      content: body.content,
    });
    return {
      postId,
      authorId: user.id,
    };
  }

  @ApiOperation({
    summary: '게시글 목록 조회',
    description: '페이지네이션으로 게시글 목록을 조회합니다.',
  })
  @Get('post')
  @Public()
  @ApiPageQuery()
  @ApiOkResponse({
    type: FindPostsResponseDto,
  })
  @ApiInternalServerErrorResponse()
  async findPosts(@PageQuery() pageQuery: PageQueryType): Promise<FindPostsResponseDto> {
    const { data: posts, meta } = await this.postService.findPostsByPage(pageQuery);
    return {
      posts,
      meta,
    };
  }

  @ApiOperation({
    summary: '게시글 상세 조회',
    description: 'ID로 특정 게시글을 조회합니다.',
  })
  @Get('post/:id')
  @OptionalAuth()
  @ApiIdParam({
    description: '게시글 ID',
  })
  @ApiOkResponse({
    type: FindPostByIdResponseDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async findPostById(
    @IdParam() id: string,
    @User() user?: UserData,
    @ClientInfo() clientInfo?: ClientInfoType,
  ): Promise<FindPostByIdResponseDto> {
    const post = await this.postService.findPostById(id, user, clientInfo);
    return {
      ...post,
    };
  }

  @ApiOperation({
    summary: '게시글 수정',
    description: '게시글의 내용을 수정합니다.',
  })
  @PostOwner()
  @Put('post/:id')
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiIdParam({
    description: '수정할 게시글 ID',
  })
  @ApiOkResponse({
    type: UpdatePostResponseDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async updatePost(
    @IdParam() postId: string,
    @Body() body: PostContentDto,
    @User() user: UserData,
  ): Promise<UpdatePostResponseDto> {
    await this.postRepository.updatePost({
      postId,
      content: body.content,
    });
    return {
      id: postId,
      authorId: user.id,
    };
  }

  @ApiOperation({
    summary: '게시글 삭제',
    description: '게시글을 삭제합니다.',
  })
  @Delete('post/:id')
  @PostOwner()
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiIdParam({
    description: '삭제할 게시글 ID',
  })
  @ApiOkResponse({
    type: DeletePostResponseDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async deletePost(@IdParam() id: string): Promise<DeletePostResponseDto> {
    const deletedPost = await this.postRepository.deletePostById(id);
    return {
      ...deletedPost,
    };
  }

  @ApiOperation({
    summary: '게시글 좋아요 토글',
    description: '게시글에 좋아요를 추가하거나 취소합니다.',
  })
  @Post('post/:id/like')
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiIdParam({
    description: '좋아요할 게시글 ID',
  })
  @ApiOkResponse({
    type: ToggleLikeResponseDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async toggleLike(
    @IdParam() postId: string,
    @User() user: UserData,
  ): Promise<ToggleLikeResponseDto> {
    const status = await this.postService.addPostLikes({
      user,
      postId,
    });

    return {
      status,
      id: postId,
    };
  }

  @ApiOperation({
    summary: '사용자 게시글 목록 조회',
    description: '특정 사용자의 게시글 목록을 페이지네이션으로 조회합니다.',
  })
  @OptionalAuth()
  @Get('user/:id/posts')
  @ApiIdParam({
    description: '사용자 ID',
  })
  @ApiPageQuery()
  @ApiOkResponse({
    type: GetUserPostsResponseDto,
  })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse()
  async getUserPosts(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
    @User() user?: UserData,
  ): Promise<GetUserPostsResponseDto> {
    const { data: posts, meta } = await this.postService.findPostsByUserId(id, pageQuery, user);
    return {
      posts,
      meta,
    };
  }
}
