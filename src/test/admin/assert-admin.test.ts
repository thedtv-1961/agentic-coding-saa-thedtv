import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/utils/supabase/get-user-with-role", () => ({
  getUserWithRole: vi.fn(),
}));

import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { assertAdmin } from "@/app/actions/admin/assert-admin";

const mockGetUserWithRole = vi.mocked(getUserWithRole);

describe("assertAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws FORBIDDEN when user is not admin", async () => {
    mockGetUserWithRole.mockResolvedValue({ user: null, isAdmin: false });
    await expect(assertAdmin()).rejects.toThrow("FORBIDDEN");
  });

  it("resolves without error when user is admin", async () => {
    mockGetUserWithRole.mockResolvedValue({ user: null, isAdmin: true });
    await expect(assertAdmin()).resolves.toBeUndefined();
  });
});
