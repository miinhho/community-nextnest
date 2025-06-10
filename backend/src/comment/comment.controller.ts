import { CommentCreateDto, CommentUpdateDto } from '@/comment/dto/comment.dto';
import { ReplyContentDto } from '@/comment/dto/reply.dto';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { User } from '@/common/decorator/user.decorator';
import { LikeStatus } from '@/common/status/like-status';
import { ResultStatus } from '@/common/status/result-status';
import { UserData } from '@/common/user.data';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CommentService } from './comment.service';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @Body() commentCreateDto: CommentCreateDto,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const { postId, content } = commentCreateDto;

    const commentId = await this.commentService.createComment(postId, user.id, content);

    if (!commentId) {
      throw new InternalServerErrorException('댓글 작성에 실패했습니다.');
    }

    return res.json({
      success: true,
      message: '댓글이 성공적으로 작성되었습니다.',
      data: { commentId, postId, authorId: user.id, content },
    });
  }

  @Post('reply')
  async createCommentReply(
    @Body() replyContentDto: ReplyContentDto,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const { postId, content, commentId } = replyContentDto;
    const replyId = await this.commentService.createCommentReply({
      postId,
      authorId: user.id,
      commentId,
      content,
    });
    if (!replyId) {
      throw new InternalServerErrorException('댓글 답글 작성에 실패했습니다.');
    }

    return res.json({
      success: true,
      message: '댓글 답글이 성공적으로 작성되었습니다.',
      data: { replyId, postId, authorId: user.id, content },
    });
  }

  @Put()
  async updateComment(
    @Body() commentUpdateDto: CommentUpdateDto,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const { commentId, content } = commentUpdateDto;
    const status: ResultStatus = await this.commentService.updateComment(
      commentId,
      content,
      user.id,
    );

    switch (status) {
      case ResultStatus.ERROR:
        throw new InternalServerErrorException('댓글 수정에 실패했습니다.');
      case ResultStatus.ACCESS_DENIED:
        throw new ForbiddenException('댓글 수정 권한이 없습니다.');
      case ResultStatus.NOT_FOUND:
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      case ResultStatus.SUCCESS:
        return res.json({
          success: true,
          message: '댓글이 성공적으로 수정되었습니다.',
        });
    }
  }

  @Get(':id')
  async getCommentById(@Param('id') id: string, @Res() res: Response) {
    const comment = await this.commentService.findCommentById(id);
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return res.json({
      success: true,
      message: '댓글을 성공적으로 조회했습니다.',
      data: comment,
    });
  }

  @Get('/user/:userId')
  async getCommentsByUserId(
    @Param('userId') userId: string,
    @PageQuery() { page, size }: PageQuery,
    @Res() res: Response,
  ) {
    const comments = await this.commentService.findCommentsByUserId(userId, page, size);
    if (!comments || comments.length === 0) {
      throw new NotFoundException('해당 사용자의 댓글을 찾을 수 없습니다.');
    }
    return res.json({
      success: true,
      message: '사용자 댓글 목록을 성공적으로 조회했습니다.',
      data: {
        comments,
        page,
        size,
      },
    });
  }

  @Get('/post/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @PageQuery() { page, size }: PageQuery,
    @Res() res: Response,
  ) {
    const comments = await this.commentService.findCommentsByPostId(postId, page, size);
    if (!comments || comments.length === 0) {
      throw new NotFoundException('해당 게시글의 댓글을 찾을 수 없습니다.');
    }
    return res.json({
      success: true,
      message: '게시글 댓글 목록을 성공적으로 조회했습니다.',
      data: {
        comments,
        page,
        size,
      },
    });
  }

  @Get('reply/:id')
  async getCommentReplies(@Param('id') id: string, @Res() res: Response) {
    const replies = await this.commentService.findRepliesByCommentId(id);
    if (!replies || replies.length === 0) {
      throw new NotFoundException('댓글에 대한 답글을 찾을 수 없습니다.');
    }
    return res.json({
      success: true,
      message: '댓글 답글 목록을 성공적으로 조회했습니다.',
      data: replies,
    });
  }

  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const status: ResultStatus = await this.commentService.deleteCommentById(
      commentId,
      user.id,
    );

    switch (status) {
      case ResultStatus.ERROR:
        throw new InternalServerErrorException('댓글 삭제에 실패했습니다.');
      case ResultStatus.NOT_FOUND:
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      case ResultStatus.ACCESS_DENIED:
        throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
      case ResultStatus.SUCCESS:
        return res.json({
          success: true,
          message: '댓글이 성공적으로 삭제되었습니다.',
        });
    }
  }

  @Post('like/:id')
  async toggleCommentLike(
    @Param('id') commentId: string,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const likeStatus: LikeStatus = await this.commentService.addCommentLikes(
      user.id,
      commentId,
    );

    switch (likeStatus) {
      case LikeStatus.PLUS_SUCCESS:
        return res.json({
          success: true,
          message: '댓글 좋아요가 추가되었습니다.',
        });
      case LikeStatus.MINUS_SUCCESS:
        return res.json({
          success: true,
          message: '댓글 좋아요가 취소되었습니다.',
        });
      case LikeStatus.PLUS_FAIL:
        throw new InternalServerErrorException('댓글 좋아요 추가에 실패했습니다.');
      case LikeStatus.MINUS_FAIL:
        throw new InternalServerErrorException('댓글 좋아요 취소에 실패했습니다.');
    }
  }
}
