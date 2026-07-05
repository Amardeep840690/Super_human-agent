import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret } from "@/server/auth/config";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: authSecret,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/integrations/:path*", "/inbox/:path*"],
};
