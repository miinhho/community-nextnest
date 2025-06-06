import { createPost } from '@/lib/actions/post.actions';
import { auth } from '@/lib/auth';
import { HttpStatus } from '@/lib/http-status';
import { ValidateStatus } from '@/types/action.status';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      {
        message: '인증되지 않은 사용자는 접근이 불가능합니다.',
      },
      { status: HttpStatus.UNAUTHORIZED },
    );
  }

  const { lexicalJson } = await req.json();
  const userId = session.user.id!;
  const actionResult = await createPost(userId, lexicalJson);

  if (!actionResult.success) {
    switch (actionResult.status) {
      case ValidateStatus.FAIL: {
        return NextResponse.json(
          {
            message: actionResult.message,
          },
          { status: HttpStatus.BAD_REQUEST },
        );
      }
      case ValidateStatus.SUCCESS: {
        return NextResponse.json(
          {
            message: '알 수 없는 오류로 글을 올릴 수 없습니다.',
          },
          { status: HttpStatus.INTERNAL_SERVER_ERROR },
        );
      }
    }
  }

  const postId = actionResult.data?.id;

  return NextResponse.json(
    {
      postId,
    },
    { status: HttpStatus.CREATED },
  );
}
