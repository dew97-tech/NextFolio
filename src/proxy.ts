import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const CANONICAL_URL = "https://davidmallick.dev";

const ALIAS_HOSTS = new Set([
  "david-dew-mallick.vercel.app",
  "portfolio-gilt-beta-15.vercel.app",
]);

export default NextAuth(authConfig).auth((request) => {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (!ALIAS_HOSTS.has(host)) {
    return;
  }

  const target = new URL(
    request.nextUrl.pathname + request.nextUrl.search,
    CANONICAL_URL,
  );

  return NextResponse.redirect(target, 308);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
