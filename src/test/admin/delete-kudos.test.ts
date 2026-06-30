import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/utils/supabase/get-user-with-role", () => ({
  getUserWithRole: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { createClient } from "@/utils/supabase/server";
import { deleteKudos } from "@/app/actions/admin/delete-kudos";

const mockGetUserWithRole = vi.mocked(getUserWithRole);
const mockCreateClient = vi.mocked(createClient);

describe("deleteKudos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls delete with correct id when user is admin", async () => {
    mockGetUserWithRole.mockResolvedValue({ user: null, isAdmin: true });

    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });
    mockCreateClient.mockResolvedValue({ from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await deleteKudos("kudos-123");

    expect(result).toEqual({ ok: true });
    expect(mockFrom).toHaveBeenCalledWith("kudos");
    expect(mockEq).toHaveBeenCalledWith("id", "kudos-123");
  });

  it("throws FORBIDDEN when user is not admin", async () => {
    mockGetUserWithRole.mockResolvedValue({ user: null, isAdmin: false });

    await expect(deleteKudos("kudos-123")).rejects.toThrow("FORBIDDEN");
  });
});
