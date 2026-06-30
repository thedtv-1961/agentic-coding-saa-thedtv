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
import { addHashtag, deleteHashtag } from "@/app/actions/admin/manage-hashtags";

const mockGetUserWithRole = vi.mocked(getUserWithRole);
const mockCreateClient = vi.mocked(createClient);

describe("addHashtag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserWithRole.mockResolvedValue({ user: null, isAdmin: true });
  });

  it("throws EMPTY_NAME for empty string", async () => {
    await expect(addHashtag("")).rejects.toThrow("EMPTY_NAME");
  });

  it("throws EMPTY_NAME for whitespace-only string", async () => {
    await expect(addHashtag("   ")).rejects.toThrow("EMPTY_NAME");
  });

  it("inserts hashtag and returns ok when name is valid", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    mockCreateClient.mockResolvedValue({ from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await addHashtag("teamwork");
    expect(result).toEqual({ ok: true });
    expect(mockInsert).toHaveBeenCalledWith({ name: "teamwork" });
  });
});

describe("deleteHashtag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserWithRole.mockResolvedValue({ user: null, isAdmin: true });
  });

  it("throws HASHTAG_IN_USE when hashtag has usage count > 0", async () => {
    const mockEq = vi.fn().mockResolvedValue({ count: 3, error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    mockCreateClient.mockResolvedValue({ from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>);

    await expect(deleteHashtag("hashtag-id-1")).rejects.toThrow("HASHTAG_IN_USE");
  });

  it("deletes hashtag and returns ok when count is 0", async () => {
    const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq });

    const mockSelectEq = vi.fn().mockResolvedValue({ count: 0, error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockSelectEq });

    const mockFrom = vi.fn().mockImplementation((table: string) => {
      if (table === "kudos_hashtags") return { select: mockSelect };
      if (table === "hashtags") return { delete: mockDelete };
      return {};
    });

    mockCreateClient.mockResolvedValue({ from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await deleteHashtag("hashtag-id-1");
    expect(result).toEqual({ ok: true });
    expect(mockDeleteEq).toHaveBeenCalledWith("id", "hashtag-id-1");
  });
});
