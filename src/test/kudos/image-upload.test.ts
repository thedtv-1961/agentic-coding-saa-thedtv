import { describe, it, expect } from "vitest";
import { validateImageFile, MAX_IMAGE_SIZE_BYTES } from "@/app/lib/kudos/image-upload";

describe("validateImageFile", () => {
  it("accepts valid JPEG under 5MB", () => {
    const file = new File(
      [new ArrayBuffer(1024 * 1024)], // 1MB
      "test.jpg",
      { type: "image/jpeg" },
    );
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("accepts valid PNG under 5MB", () => {
    const file = new File(
      [new ArrayBuffer(2 * 1024 * 1024)], // 2MB
      "test.png",
      { type: "image/png" },
    );
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("accepts valid WEBP under 5MB", () => {
    const file = new File(
      [new ArrayBuffer(3 * 1024 * 1024)], // 3MB
      "test.webp",
      { type: "image/webp" },
    );
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("rejects file with invalid type (PDF)", () => {
    const file = new File(
      [new ArrayBuffer(1024)],
      "test.pdf",
      { type: "application/pdf" },
    );
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("JPG, PNG, WEBP");
  });

  it("rejects file exceeding 5MB", () => {
    // Create a file just over 5MB: 5MB + 1 byte
    const oversizeBuffer = new ArrayBuffer(MAX_IMAGE_SIZE_BYTES + 1);
    const file = new File(
      [oversizeBuffer],
      "toolarge.jpg",
      { type: "image/jpeg" },
    );
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("5MB");
  });
});
