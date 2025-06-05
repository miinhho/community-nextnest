import { togglePostLikes } from '@/lib/actions/post.actions';
import { auth } from '@/lib/auth';
import { NextIdParams } from '@/lib/helper/route.helper';
import { HttpStatus } from '@/lib/http-status';
import { LikeStatus } from '@/types/action.status';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: NextIdParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      { status: HttpStatus.UNAUTHORIZED },
    );
  }

  const postId = params.id;
  const userId = session.user.id!;
  const actionResult = await togglePostLikes(userId, postId);

  if (!actionResult.success) {
    switch (actionResult.status) {
      case LikeStatus.ADD_FAIL: {
        return NextResponse.json(
          {
            message: '알 수 없는 오류로 좋아요를 추가할 수 없습니다.',
          },
          { status: HttpStatus.INTERNAL_SERVER_ERROR },
        );
      }
      case LikeStatus.MINUS_FAIL: {
        return NextResponse.json(
          {
            message: '알 수 없는 오류로 좋아요를 삭제할 수 없습니다.',
          },
          { status: HttpStatus.INTERNAL_SERVER_ERROR },
        );
      }
      case LikeStatus.UNKNOWN_FAIL: {
        return NextResponse.json(
          {
            message: '알 수 없는 오류로 좋아요 관련 활동이 불가능합니다.',
          },
          { status: HttpStatus.INTERNAL_SERVER_ERROR },
        );
      }
    }
  }

  switch (actionResult.status) {
    case LikeStatus.ADD_SUCCESS: {
      return NextResponse.json(
        {
          message: '성공적으로 좋아요를 추가하였습니다.',
        },
        { status: HttpStatus.CREATED },
      );
    }
    case LikeStatus.MINUS_SUCCESS: {
      return NextResponse.json(
        {
          message: '성공적으로 좋아요를 삭제하였습니다.',
        },
        { status: HttpStatus.CREATED },
      );
    }
  }
}
