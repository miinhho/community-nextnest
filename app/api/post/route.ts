import { createPost } from "@/lib/actions/post.actions";
import { auth } from "@/lib/auth";
import status from "http-status";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", {
      status: status.UNAUTHORIZED,
    });
  }

  try {
    const { html } = await req.json();

    await createPost({
      content: html,
      authorId: session.user.id!,
    });

    return new NextResponse("Created", {
      status: status.CREATED,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Validation error", {
        status: status.BAD_REQUEST,
      });
    }
    return new NextResponse("Server error", {
      status: status.INTERNAL_SERVER_ERROR,
    });
  }
}
