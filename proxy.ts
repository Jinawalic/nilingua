import { verifySessionToken, getSessionCookieName } from "@/lib/auth-session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  const session = await verifySessionToken(sessionToken);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/home/:path*"],
};
