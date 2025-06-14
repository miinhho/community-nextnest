import { CommentCreateDto, CommentUpdateDto } from '@/comment/dto/comment.dto';
import { ReplyContentDto } from '@/comment/dto/reply.dto';
import { CommentOwner } from '@/comment/guard/comment-owner.guard';
import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { LikeStatus } from '@/common/status/like-status';
import { UserData } from '@/common/user';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @Body() { postId, content }: CommentCreateDto,
    @User() user: UserData,
  ) {
    const commentId = await this.commentService.createComment(postId, user.id, content);
    return {
      success: true,
      data: { commentId, postId, authorId: user.id, content },
    };
  }

  @Post('reply')
  async createCommentReply(
    @Body() { postId, content, commentId }: ReplyContentDto,
    @User() user: UserData,
  ) {
    const replyId = await this.commentService.createCommentReply({
      postId,
      authorId: user.id,
      commentId,
      content,
    });

    return {
      success: true,
      data: { replyId, postId, authorId: user.id, content },
    };
  }

  @CommentOwner()
  @Put()
  async updateComment(@Body() { commentId, content }: CommentUpdateDto) {
    await this.commentService.updateComment(commentId, content);
    return {
      success: true,
      message: '댓글이 성공적으로 수정되었습니다.',
    };
  }

  @Public()
  @Get(':id')
  async getCommentById(@IdParam() id: string) {
    const comment = await this.commentService.findCommentById(id);
    return {
      success: true,
      data: comment,
    };
  }

  @Public()
  @Get(':id/replies')
  async getCommentReplies(@IdParam() id: string, @PageQuery() { page, size }: PageQuery) {
    const replies = await this.commentService.findRepliesByCommentId(id, page, size);
    return {
      success: true,
      data: replies,
    };
  }

  @CommentOwner()
  @Delete(':id')
  async deleteComment(@IdParam() commentId: string) {
    const deletedComment = await this.commentService.deleteCommentById(commentId);
    return {
      success: true,
      data: deletedComment,
    };
  }

  @Post('like/:id')
  async toggleCommentLike(@IdParam() commentId: string, @User() user: UserData) {
    const likeStatus: LikeStatus = await this.commentService.addCommentLikes(
      user.id,
      commentId,
    );

    switch (likeStatus) {
      case LikeStatus.PLUS:
        return {
          success: true,
          message: '댓글 좋아요가 추가되었습니다.',
          data: {
            status: LikeStatus.PLUS,
            commentId,
          },
        };
      case LikeStatus.MINUS:
        return {
          success: true,
          message: '댓글 좋아요가 취소되었습니다.',
          data: {
            status: LikeStatus.MINUS,
            commentId,
          },
        };
    }
  }
}
