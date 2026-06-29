import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitKudos } from "@/app/actions/kudos/submit-kudos";

// Mock Supabase server client
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      }),
    },
    from: vi.fn((table: string) => {
      if (table === "kudos") {
        return {
          insert: vi
            .fn()
            .mockResolvedValue({
              data: [{ id: "test-kudos-id" }],
              error: null,
            })
            .mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "test-kudos-id" },
                  error: null,
                }),
              }),
            }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      if (table === "kudos_hashtags") {
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }
      if (table === "kudos_images") {
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }
      return {};
    }),
  })),
}));

describe("submitKudos validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when receiverId is empty", async () => {
    const result = await submitKudos({
      receiverId: "",
      title: "Hero của tôi",
      content: "Cảm ơn bạn!",
      hashtagIds: ["tag-1"],
      imageUrls: [],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("error");
    expect(result).toEqual({ error: "Vui lòng chọn người nhận" });
  });

  it("returns error when content is empty", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "",
      hashtagIds: ["tag-1"],
      imageUrls: [],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("error");
    expect(result).toEqual({ error: "Vui lòng nhập nội dung lời cảm ơn" });
  });

  it("returns error when content is only whitespace", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "   \n  \t  ",
      hashtagIds: ["tag-1"],
      imageUrls: [],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("error");
    expect(result).toEqual({ error: "Vui lòng nhập nội dung lời cảm ơn" });
  });

  it("returns error when hashtagIds is empty array", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "Cảm ơn bạn!",
      hashtagIds: [],
      imageUrls: [],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("error");
    expect(result).toEqual({ error: "Vui lòng thêm ít nhất 1 hashtag" });
  });

  it("returns error when hashtagIds has more than 5 items", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "Cảm ơn bạn!",
      hashtagIds: ["tag-1", "tag-2", "tag-3", "tag-4", "tag-5", "tag-6"],
      imageUrls: [],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("error");
    expect(result).toEqual({ error: "Tối đa 5 hashtag" });
  });

  it("returns error when imageUrls has more than 5 items", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "Cảm ơn bạn!",
      hashtagIds: ["tag-1"],
      imageUrls: [
        "url-1",
        "url-2",
        "url-3",
        "url-4",
        "url-5",
        "url-6",
      ],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("error");
    expect(result).toEqual({ error: "Tối đa 5 ảnh" });
  });

  it("passes validation and returns data with valid inputs", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "Cảm ơn bạn đã hỗ trợ!",
      hashtagIds: ["tag-1", "tag-2"],
      imageUrls: ["url-1"],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("data");
    expect(result).toEqual({ data: { id: "test-kudos-id" } });
  });

  it("allows up to 5 hashtags (boundary test)", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "Cảm ơn bạn!",
      hashtagIds: ["tag-1", "tag-2", "tag-3", "tag-4", "tag-5"],
      imageUrls: [],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("data");
  });

  it("allows up to 5 images (boundary test)", async () => {
    const result = await submitKudos({
      receiverId: "user-123",
      title: "Hero của tôi",
      content: "Cảm ơn bạn!",
      hashtagIds: ["tag-1"],
      imageUrls: ["url-1", "url-2", "url-3", "url-4", "url-5"],
      isAnonymous: false,
    });

    expect(result).toHaveProperty("data");
  });
});
