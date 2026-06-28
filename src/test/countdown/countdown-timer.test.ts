import { describe, it, expect, vi, afterEach } from "vitest";
import { calcTimeLeft } from "@/utils/calc-time-left";

describe("calcTimeLeft", () => {
  afterEach(() => vi.useRealTimers());

  it("trả về đúng days/hours/minutes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-19T00:00:00+07:00"));
    const result = calcTimeLeft("2026-12-20T00:00:00+07:00");
    expect(result).toEqual({ days: 1, hours: 0, minutes: 0 });
  });

  it("trả về 0/0/0 khi đã qua target date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-21T00:00:00+07:00"));
    const result = calcTimeLeft("2026-12-20T00:00:00+07:00");
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
  });

  it("zero-pad không cần thiết ở logic — chỉ ở UI", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-19T18:35:00+07:00"));
    const result = calcTimeLeft("2026-12-20T00:00:00+07:00");
    expect(result.hours).toBe(5);
    expect(result.minutes).toBe(25);
  });
});
