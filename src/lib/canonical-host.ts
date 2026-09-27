import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_URL = "https://davidmallick.dev";

const ALIAS_HOSTS = new Set([
  "david-dew-mallick.vercel.app",
  "portfolio-gilt-beta-15.vercel.app",
]);

export function redirectAliasHost(
  request: NextRequest,
): NextResponse | undefined {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (!ALIAS_HOSTS.has(host)) {
    return undefined;
  }

  return NextResponse.redirect(
    new URL(request.nextUrl.pathname + request.nextUrl.search, CANONICAL_URL),
    308,
  );
}
