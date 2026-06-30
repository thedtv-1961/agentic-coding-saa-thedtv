import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { updateSession } from "@/utils/supabase/middleware";

async function isLaunchDatePassed(): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  // Đọc bằng publishable/anon key (RLS cho anon SELECT app_settings) — KHÔNG dùng
  // service_role trong middleware: vừa rủi ro bảo mật, vừa từng fail-open trên prod.
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return true; // no DB → assume launched

  try {
    const supabase = createClient(url, key);
    const queryPromise = supabase
      .from("app_settings")
      .select("value")
      .eq("key", "countdown_date")
      .single();
    // Timeout — tránh treo Worker khi DB cold-start
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("db_timeout")), 2500),
    );
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
    if (error || !data?.value) return true;
    return new Date((data.value as string).trim()).getTime() <= Date.now();
  } catch {
    return true; // timeout hoặc lỗi → assume launched
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isCountdownRoute = pathname === "/countdown";
  // Admin routes are auth routes — admin login must be accessible regardless of launch status
  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname === "/login" ||
    pathname.startsWith("/admin");

  // Prelaunch gate — based solely on countdown_date in DB
  if (!isCountdownRoute && !isAuthRoute) {
    const launched = await isLaunchDatePassed();
    if (!launched) {
      return NextResponse.redirect(new URL("/countdown", request.url));
    }
  }
  if (isCountdownRoute) {
    const launched = await isLaunchDatePassed();
    if (launched) {
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
      return NextResponse.redirect(new URL("/", request.url));
    }
    return res.current;
  }

  // Auth guard: protect homepage and awards — unauthenticated users go to /login.
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

  // Admin sub-routes: unauthenticated users → /admin (login form).
  // /admin root itself is always accessible (it IS the admin login page).
  if (pathname.startsWith("/admin/")) {
    const res = { current: NextResponse.next({ request }) };
    const supabase = makeSupabaseClient(request, res);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/admin", request.url));
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
