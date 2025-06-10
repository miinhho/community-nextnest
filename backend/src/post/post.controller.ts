import { LikeStatus } from '@/common/status/like-status';
import { ResultStatus } from '@/common/status/result-status';
import { UserData } from '@/common/user.data';
import { User } from '@/user/user.decorator';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostContentDto } from './dto/post-content.dto';
import { PostService } from './post.service';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body() postContentDto: PostContentDto,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const { content } = postContentDto;
    const postId = await this.postService.createPost(user.id, content);
    if (!postId) {
      throw new InternalServerErrorException('게시글 작성에 실패했습니다.');
    }
    return res.json({
      success: true,
      message: '게시글이 성공적으로 작성되었습니다.',
      data: { postId, authorId: user.id, content },
    });
  }

  @Get(':id')
  async findPostById(@Param('id') postId: string, @Res() res: Response) {
    const post = await this.postService.findPostById(postId);
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return res.json({
      success: true,
      message: '게시글을 성공적으로 조회했습니다.',
      data: post,
    });
  }

  @Get()
  async findPostsByPage(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Res() res: Response,
  ) {
    const posts = await this.postService.findPostsByPage(page, size);
    if (!posts || posts.length === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return res.json({
      success: true,
      message: '게시글 목록을 성공적으로 조회했습니다.',
      data: posts,
    });
  }

  @Put(':id')
  async updatePostContent(
    @Param('id') postId: string,
    @Body() postContentDto: PostContentDto,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const { content } = postContentDto;
    const status: ResultStatus = await this.postService.updatePost(
      postId,
      content,
      user.id,
    );

    switch (status) {
      case ResultStatus.NOT_FOUND:
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      case ResultStatus.ACCESS_DENIED:
        throw new ForbiddenException('게시글 수정 권한이 없습니다.');
      case ResultStatus.ERROR:
        throw new InternalServerErrorException('게시글 수정에 실패했습니다.');
      case ResultStatus.SUCCESS:
        return res.json({
          success: true,
          message: '게시글이 성공적으로 수정되었습니다.',
          data: { postId, authorId: user.id, content },
        });
    }
  }

  @Delete(':id')
  async removePost(
    @Param('id') postId: string,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const status: ResultStatus = await this.postService.deletePostById(postId, user.id);

    switch (status) {
      case ResultStatus.NOT_FOUND:
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      case ResultStatus.ACCESS_DENIED:
        throw new ForbiddenException('게시글 삭제 권한이 없습니다.');
      case ResultStatus.ERROR:
        throw new InternalServerErrorException('게시글 삭제 중 오류가 발생했습니다.');
      case ResultStatus.SUCCESS:
        return res.json({
          success: true,
          message: '게시글이 성공적으로 삭제되었습니다.',
        });
    }
  }

  @Post('/like/:id')
  async toggleLike(
    @Param('id') postId: string,
    @User() user: UserData,
    @Res() res: Response,
  ) {
    const likeStatus: LikeStatus = await this.postService.addPostLikes(user.id, postId);

    switch (likeStatus) {
      case LikeStatus.PLUS_SUCCESS:
        return res.json({
          success: true,
          message: '게시글 좋아요가 추가되었습니다.',
        });
      case LikeStatus.MINUS_SUCCESS:
        return res.json({
          success: true,
          message: '게시글 좋아요가 취소되었습니다.',
        });
      case LikeStatus.PLUS_FAIL:
        throw new InternalServerErrorException('게시글 좋아요 추가에 실패했습니다.');
      case LikeStatus.MINUS_FAIL:
        throw new InternalServerErrorException('게시글 좋아요 취소에 실패했습니다.');
    }
  }
}
