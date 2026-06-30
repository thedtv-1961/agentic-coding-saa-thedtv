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
import { updateSetting } from "@/app/actions/admin/update-setting";

const mockGetUserWithRole = vi.mocked(getUserWithRole);
const mockCreateClient = vi.mocked(createClient);

function makeSupabaseMock() {
  const mockEq = vi.fn().mockResolvedValue({ error: null });
  const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
  const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });
  return {
    client: { from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>,
    mockFrom,
    mockUpdate,
    mockEq,
  };
}

describe("updateSetting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserWithRole.mockResolvedValue({ user: null, isAdmin: true });
  });

  it("throws KEY_READONLY for a non-whitelisted key", async () => {
    await expect(updateSetting("some_other_key", "value")).rejects.toThrow("KEY_READONLY");
  });

  it("throws INVALID_DATE for countdown_date with non-ISO date string", async () => {
    await expect(updateSetting("countdown_date", "not-a-date")).rejects.toThrow("INVALID_DATE");
  });

  it("succeeds for countdown_date with a valid ISO date string", async () => {
    const { client } = makeSupabaseMock();
    mockCreateClient.mockResolvedValue(client);

    const result = await updateSetting("countdown_date", "2025-12-26T00:00:00.000Z");
    expect(result).toEqual({ ok: true });
  });
});
