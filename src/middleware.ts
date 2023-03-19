import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLogger } from "./logging/logging-util";
import { env } from "./env.mjs";

export async function middleware(req: NextRequest) {
  const logger = getLogger("auth");
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const queryClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVER_ROLE
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data, error } = await queryClient
    .from("AuthorizedEmail")
    .select("email");
  if (!data || error) {
    throw error;
  }
  const emails = data.map(({ email }) => email as string);
  // Check auth condition
  if (
    session?.user.email &&
    emails &&
    emails.includes(session.user.email.toLowerCase())
  ) {
    // Try redirecting here to the homepage
    if(req.destination.includes('login')) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
    // Authentication successful, forward request to protected route.
    return res;
  }
  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/",
    "/listing",
    "/api/trpc/:path*",
    // "/((?!api/cron|login|_next/static|_next/image|_next/|favicon.ico|404|500).*)",
  ],
};
