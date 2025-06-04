import { Role } from '@prisma/client';
import status from 'http-status';
import { NextResponse } from 'next/server';
import { findPostById } from '../actions/post.actions';
import { auth } from '../auth';

/**
 * 인증되지 않았거나 / 글을 찾을 수 없거나 / 해당 글에 대한 권한이 없다면
 * `NextResponse` 가 반환된다
 * @returns `null` / `NextResponse`
 */
export async function postAuthGuard(postId: string) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      {
        message: '인증되지 않은 사용자는 접근이 불가능합니다.',
      },
      { status: status.UNAUTHORIZED },
    );
  }

  const findResult = await findPostById(postId);
  if (!findResult.success) {
    return NextResponse.json(
      {
        message: '글을 찾을 수 없습니다.',
      },
      { status: status.NOT_FOUND },
    );
  }

  const postAuthorId = findResult.data!.authorId;
  if (postAuthorId !== session?.user.id || session?.user.role !== Role.ADMIN) {
    return NextResponse.json(
      {
        message: '권한이 없습니다.',
      },
      { status: status.FORBIDDEN },
    );
  }

  return null;
}
