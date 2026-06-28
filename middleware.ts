import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/utils/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prelaunch gate — runs BEFORE auth guard so /countdown is public
  const isPrelaunch = process.env.PRELAUNCH_MODE === "true";
  const isCountdownRoute = pathname === "/countdown";
  const isAuthRoute =
    pathname.startsWith("/auth") || pathname === "/login";

  if (isPrelaunch && !isCountdownRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/countdown", request.url));
  }
  if (!isPrelaunch && isCountdownRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Auth guard: redirect authenticated users away from /login
  if (pathname === "/login") {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL("/todo", request.url));
    }

    intlMiddleware(request);
    return response;
  }

  // All other routes: refresh Supabase session
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)",
  ],
};
