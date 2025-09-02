import { CommentRepository } from '@/comment/comment.repository';
import { CommentOwner } from '@/comment/guard/comment-owner.guard';
import { ClientInfo, ClientInfoType } from '@/common/decorator/client-info.decorator';
import { IdParam } from '@/common/decorator/id.decorator';
import { OptionalAuth } from '@/common/decorator/optional-auth.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiIdParam } from '@/common/swagger/id-param.swagger';
import { ApiPageQuery } from '@/common/swagger/page.swagger';
import { ApiCommentTags, ApiPostTags, ApiUserTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import { PageQueryType } from '@/common/utils/page';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import {
  CreateCommentDto,
  CreateCommentResponseDto,
  UpdateCommentDto,
  GetCommentResponseDto,
  DeleteCommentResponseDto,
  GetRepliesResponseDto,
  CreateReplyDto,
  CreateReplyResponseDto,
  GetCommentsByPostIdResponseDto,
  GetCommentsByUserIdResponseDto,
} from '@/comment/dto';
import { ToggleCommentLikeResponseDto } from '@/comment/dto/comment-like.dto';

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentRepository: CommentRepository,
  ) {}

  @ApiOperation({
    summary: '댓글 생성',
    description: '게시글에 새로운 댓글을 작성합니다.',
  })
  @Post('comment')
  @ApiJwtAuth()
  @ApiCommentTags()
  @ApiBody({
    type: CreateCommentDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateCommentResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시물입니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청 형식입니다.' })
  @ApiInternalServerErrorResponse()
  async createComment(@Body() body: CreateCommentDto, @User() user: UserData) {
    const { postId, content } = body;
    const commentId = await this.commentService.createComment({
      postId,
      authorId: user.id,
      content,
    });

    return {
      commentId,
      postId,
      authorId: user.id,
    };
  }

  @ApiOperation({
    summary: '댓글 수정',
    description: '기존 댓글의 내용을 수정합니다.',
  })
  @Put('comment')
  @CommentOwner()
  @ApiJwtAuth()
  @ApiCommentTags()
  @ApiBody({
    type: UpdateCommentDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: '존재하지 않는 댓글입니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청 형식입니다.' })
  @ApiInternalServerErrorResponse()
  async updateComment(@Body() body: UpdateCommentDto) {
    const { commentId, content } = body;
    await this.commentRepository.updateComment({ commentId, content });
  }

  @ApiOperation({
    summary: '댓글 조회',
    description: 'ID로 특정 댓글의 상세 정보를 조회합니다. 차단된 사용자의 댓글은 제외됩니다.',
  })
  @Get('comment/:id')
  @OptionalAuth()
  @ApiJwtAuth()
  @ApiCommentTags()
  @ApiIdParam({ description: '조회할 댓글의 ID' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GetCommentResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 댓글입니다.' })
  @ApiInternalServerErrorResponse()
  async getCommentById(
    @IdParam() id: string,
    @User() user?: UserData,
    @ClientInfo() clientInfo?: ClientInfoType,
  ): Promise<GetCommentResponseDto> {
    const comment = await this.commentService.findCommentById(id, user, clientInfo);
    return {
      ...comment,
    };
  }

  @ApiOperation({
    summary: '댓글 삭제',
  })
  @Delete('comment/:id')
  @CommentOwner()
  @ApiJwtAuth()
  @ApiCommentTags()
  @ApiIdParam({ description: '삭제할 댓글의 ID' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: DeleteCommentResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 댓글입니다.' })
  @ApiInternalServerErrorResponse()
  async deleteComment(@IdParam() id: string): Promise<DeleteCommentResponseDto> {
    const deletedComment = await this.commentService.deleteCommentById(id);
    return {
      ...deletedComment,
    };
  }

  @ApiOperation({
    summary: '댓글 답글 목록 조회',
    description:
      '특정 댓글의 답글 목록을 페이지네이션으로 조회합니다. 차단된 사용자의 댓글은 제외됩니다.',
  })
  @Get('comment/:id/replies')
  @OptionalAuth()
  @ApiJwtAuth()
  @ApiCommentTags()
  @ApiIdParam({ description: '조회할 댓글의 ID' })
  @ApiPageQuery()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GetRepliesResponseDto,
  })
  @ApiInternalServerErrorResponse()
  async getCommentReplies(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
    @User() user?: UserData,
  ): Promise<GetRepliesResponseDto> {
    const { data: replies, meta } = await this.commentRepository.findRepliesByCommentId(
      id,
      pageQuery,
      user?.id,
    );
    return {
      replies,
      meta,
    };
  }

  @ApiOperation({
    summary: '댓글 좋아요 토글',
    description: '댓글의 좋아요 상태를 토글합니다.',
  })
  @Post('comment/:id/like')
  @ApiJwtAuth()
  @ApiCommentTags()
  @ApiIdParam({
    description: '좋아요/싫어요를 토글할 댓글의 ID',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ToggleCommentLikeResponseDto,
  })
  @ApiInternalServerErrorResponse()
  async toggleCommentLike(@IdParam() commentId: string, @User() user: UserData) {
    const likeStatus = await this.commentService.addCommentLikes({
      commentId,
      userId: user.id,
    });
    return {
      status: likeStatus,
      commentId,
    };
  }

  @ApiOperation({
    summary: '답글 생성',
    description: '댓글에 답글을 작성합니다.',
  })
  @Post('reply')
  @ApiJwtAuth()
  @ApiCommentTags()
  @ApiBody({
    description: '답글 생성 요청 데이터',
    type: CreateReplyDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateReplyResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 댓글이나 게시물입니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청 형식입니다.' })
  @ApiInternalServerErrorResponse()
  async createCommentReply(
    @Body() body: CreateReplyDto,
    @User() user: UserData,
  ): Promise<CreateReplyResponseDto> {
    const { postId, content, commentId } = body;
    const replyId = await this.commentService.createCommentReply({
      postId,
      authorId: user.id,
      commentId,
      content,
    });

    return {
      replyId,
      postId,
      authorId: user.id,
    };
  }

  @ApiOperation({
    summary: '게시글 댓글 목록 조회',
    description:
      '특정 게시글의 댓글 목록을 페이지네이션으로 조회합니다. 차단된 사용자의 댓글은 제외됩니다.',
  })
  @Get('post/:id/comments')
  @OptionalAuth()
  @ApiJwtAuth()
  @ApiPostTags()
  @ApiIdParam({ description: '댓글을 조회할 게시글의 ID' })
  @ApiPageQuery()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GetCommentsByPostIdResponseDto,
  })
  @ApiInternalServerErrorResponse()
  async getCommentsByPostId(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
    @User() user?: UserData,
  ): Promise<GetCommentsByPostIdResponseDto> {
    const { data: comments, meta } = await this.commentRepository.findCommentsByPostId(
      id,
      pageQuery,
      user?.id,
    );
    return {
      postId: id,
      comments,
      meta,
    };
  }

  @ApiOperation({
    summary: '사용자 댓글 목록 조회',
    description:
      '특정 사용자가 작성한 댓글 목록을 페이지네이션으로 조회합니다. 차단된 사용자의 댓글은 제외됩니다.',
  })
  @Get('user/:id/comments')
  @OptionalAuth()
  @ApiJwtAuth()
  @ApiUserTags()
  @ApiIdParam({ description: '댓글을 조회할 사용자의 ID' })
  @ApiPageQuery()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GetCommentsByUserIdResponseDto,
  })
  @ApiInternalServerErrorResponse()
  async getCommentsByUserId(
    @IdParam() id: string,
    @PageQuery() pageQuery: PageQueryType,
    @User() user?: UserData,
  ): Promise<GetCommentsByUserIdResponseDto> {
    const { data: comments, meta } = await this.commentRepository.findCommentsByUserId(
      id,
      pageQuery,
      user?.id,
    );
    return {
      comments,
      meta,
    };
  }
}
