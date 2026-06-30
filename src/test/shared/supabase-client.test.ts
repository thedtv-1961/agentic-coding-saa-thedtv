import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock @supabase/ssr để bắt được tham số truyền vào createBrowserClient.
const createBrowserClient = vi.fn();
vi.mock("@supabase/ssr", () => ({ createBrowserClient }));

describe("utils/supabase/client createClient", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    createBrowserClient.mockClear();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("dùng biến NEXT_PUBLIC_ (phải có để browser đọc được)", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://prod.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_prod";

    const { createClient } = await import("@/utils/supabase/client");
    createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://prod.supabase.co",
      "sb_publishable_prod",
    );
  });

  it("KHÔNG dùng biến non-prefix (không tới được browser)", async () => {
    // Chỉ set biến server-side, để trống biến NEXT_PUBLIC_ -> mô phỏng bug cũ.
    process.env.SUPABASE_URL = "https://server-only.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_server";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const { createClient } = await import("@/utils/supabase/client");
    createClient();

    const [url, key] = createBrowserClient.mock.calls[0];
    expect(url).not.toBe("https://server-only.supabase.co");
    expect(key).not.toBe("sb_publishable_server");
  });
});
