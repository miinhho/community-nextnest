import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

// TODO : nothing 변경
const protectedRoutes = ["nothing"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login"));
  }

  return NextResponse.next();
}
