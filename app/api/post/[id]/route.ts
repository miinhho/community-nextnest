import { deletePostById, findPostById, updatePostContent } from '@/lib/actions/post.actions';
import { postAuthGuard } from '@/lib/helper/route.helper';
import { ValidateStatus } from '@/types/action.status';
import status from 'http-status';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  const findResult = await findPostById(postId);

  if (!findResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: '글을 불러올 수 없습니다.',
      },
      { status: status.INTERNAL_SERVER_ERROR },
    );
  }

  const data = findResult.data!;
  return NextResponse.json(
    {
      success: true,
      data: {
        author: {
          name: data.author.name,
          image: data.author.image,
        },
        authorId: data.authorId,
        content: data.content,
        likeCount: data.likeCount,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    },
    { status: status.OK },
  );
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  const result = await postAuthGuard(postId);
  if (result) {
    return result;
  }

  const json = await req.json();
  const content = json.content;
  const updateResult = await updatePostContent(postId, content);
  if (!updateResult.success) {
    switch (updateResult.status) {
      case ValidateStatus.SUCCESS: {
        return NextResponse.json(
          {
            message: '알 수 없는 오류로 글을 수정할 수 없습니다.',
          },
          { status: status.INTERNAL_SERVER_ERROR },
        );
      }
      case ValidateStatus.FAIL: {
        return NextResponse.json(
          {
            message: updateResult.message,
          },
          { status: status.BAD_REQUEST },
        );
      }
    }
  }

  return NextResponse.json(
    {
      message: '성공적으로 글을 수정하였습니다.',
    },
    { status: status.OK },
  );
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  const result = await postAuthGuard(postId);
  if (result) {
    return result;
  }

  const deleteResult = await deletePostById(postId);
  if (!deleteResult.success) {
    return NextResponse.json(
      {
        message: '알 수 없는 오류로 글을 지울 수 없습니다.',
      },
      { status: status.INTERNAL_SERVER_ERROR },
    );
  }

  return NextResponse.json(
    {
      message: '성공적으로 글을 삭제했습니다.',
    },
    { status: status.OK },
  );
}
