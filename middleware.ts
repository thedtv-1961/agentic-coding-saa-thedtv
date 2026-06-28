import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { updateSession } from "@/utils/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

async function isLaunchDatePassed(): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "countdown_date")
    .single();

  if (error || !data?.value) return false;
  return new Date(data.value as string).getTime() <= Date.now();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prelaunch gate — runs BEFORE auth guard so /countdown is public
  const isPrelaunch = process.env.PRELAUNCH_MODE === "true";
  const isCountdownRoute = pathname === "/countdown";
  const isAuthRoute =
    pathname.startsWith("/auth") || pathname === "/login";

  if (isPrelaunch && !isCountdownRoute && !isAuthRoute) {
    // If launch date has already passed, bypass the prelaunch gate
    const launched = await isLaunchDatePassed();
    if (!launched) {
      return NextResponse.redirect(new URL("/countdown", request.url));
    }
  }
  if (isCountdownRoute) {
    // Redirect away from /countdown when prelaunch is off OR launch date passed
    const shouldBypass = !isPrelaunch || (await isLaunchDatePassed());
    if (shouldBypass) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Helper: create a lightweight Supabase client for auth checks in middleware
  function makeSupabaseClient(req: NextRequest, res: { current: NextResponse }) {
    return createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) =>
              req.cookies.set(name, value),
            );
            res.current = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.current.cookies.set(name, value, options),
            );
          },
        },
      },
    );
  }

  // Auth guard: redirect authenticated users away from /login
  if (pathname === "/login") {
    const res = { current: NextResponse.next({ request }) };
    const supabase = makeSupabaseClient(request, res);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL("/todo", request.url));
    }
    // Return intlMiddleware response so locale headers/cookies are applied
    return intlMiddleware(request);
  }

  // Auth guard: protect homepage and awards page — unauthenticated users go to /login.
  if (pathname === "/" || pathname.startsWith("/awards")) {
    const res = { current: NextResponse.next({ request }) };
    const supabase = makeSupabaseClient(request, res);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return res.current;
  }

  // All other routes: refresh Supabase session
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)",
  ],
};
