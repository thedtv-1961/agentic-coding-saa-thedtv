import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache before importing action
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/utils/supabase/get-user-with-role", () => ({
  getUserWithRole: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { createClient } from "@/utils/supabase/server";
import { toggleUserRole } from "@/app/actions/admin/toggle-user-role";

const mockGetUserWithRole = vi.mocked(getUserWithRole);
const mockCreateClient = vi.mocked(createClient);

function makeSupabaseMock(role: "admin" | "user", updateError: null | { message: string } = null) {
  const mockEqUpdate = vi.fn().mockReturnValue({ error: updateError });
  const mockFrom = vi.fn().mockImplementation((table: string) => {
    if (table === "profiles") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role }, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: mockEqUpdate,
        }),
      };
    }
    return {};
  });
  return { from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>;
}

describe("toggleUserRole", () => {
  const CURRENT_USER_ID = "user-abc";
  const TARGET_USER_ID = "user-xyz";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws CANNOT_DEMOTE_SELF when targetId equals current user id", async () => {
    mockGetUserWithRole.mockResolvedValue({
      user: { id: CURRENT_USER_ID } as never,
      isAdmin: true,
    });
    mockCreateClient.mockResolvedValue(makeSupabaseMock("admin"));

    await expect(toggleUserRole(CURRENT_USER_ID)).rejects.toThrow("CANNOT_DEMOTE_SELF");
  });

  it("flips admin to user", async () => {
    mockGetUserWithRole.mockResolvedValue({
      user: { id: CURRENT_USER_ID } as never,
      isAdmin: true,
    });

    const supabaseMock = makeSupabaseMock("admin");
    // Override update to track new role assignment
    (supabaseMock.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      return {};
    });
    mockCreateClient.mockResolvedValue(supabaseMock);

    const result = await toggleUserRole(TARGET_USER_ID);
    expect(result.ok).toBe(true);
    expect(result.role).toBe("user");
  });

  it("flips user to admin", async () => {
    mockGetUserWithRole.mockResolvedValue({
      user: { id: CURRENT_USER_ID } as never,
      isAdmin: true,
    });

    const supabaseMock = makeSupabaseMock("user");
    (supabaseMock.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { role: "user" }, error: null }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      return {};
    });
    mockCreateClient.mockResolvedValue(supabaseMock);

    const result = await toggleUserRole(TARGET_USER_ID);
    expect(result.ok).toBe(true);
    expect(result.role).toBe("admin");
  });

  it("throws FORBIDDEN when current user is not admin", async () => {
    mockGetUserWithRole.mockResolvedValue({
      user: { id: CURRENT_USER_ID } as never,
      isAdmin: false,
    });

    await expect(toggleUserRole(TARGET_USER_ID)).rejects.toThrow("FORBIDDEN");
  });
});
