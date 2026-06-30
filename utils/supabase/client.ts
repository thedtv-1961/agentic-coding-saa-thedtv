import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Browser client: chỉ biến có tiền tố NEXT_PUBLIC_ mới được Next.js
  // nhúng vào bundle phía client. Biến non-prefix sẽ là undefined ở trình duyệt.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
