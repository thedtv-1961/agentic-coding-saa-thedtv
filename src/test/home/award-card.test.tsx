import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AwardCard from "@/app/components/home/award-card";
import { AWARD_META } from "@/types/awards";
import type { Award } from "@/types/awards";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockAward: Award = {
  id: "1",
  category: "top_talent",
  title: "Top Talent Award",
  description: "Awarded to the most talented individual",
};

describe("AwardCard", () => {
  it("renders award title", async () => {
    const jsx = await AwardCard({ award: mockAward });
    render(jsx);
    // Title appears in both the medal circle and the card heading
    const titleElements = screen.getAllByText("Top Talent Award");
    expect(titleElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders award description", async () => {
    const jsx = await AwardCard({ award: mockAward });
    render(jsx);
    expect(
      screen.getByText("Awarded to the most talented individual"),
    ).toBeInTheDocument();
  });

  it("detail link points to /awards#slug", async () => {
    const jsx = await AwardCard({ award: mockAward });
    render(jsx);
    const slug = AWARD_META["top_talent"].slug;
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/awards#${slug}`);
  });

  it("renders detail label from i18n", async () => {
    const jsx = await AwardCard({ award: mockAward });
    render(jsx);
    expect(screen.getByText(/award_detail/)).toBeInTheDocument();
  });

  it("uses correct slug for each category", async () => {
    const categories: Award["category"][] = [
      "top_talent",
      "top_project",
      "top_project_leader",
      "best_manager",
      "signature_creator",
      "mvp",
    ];
    for (const category of categories) {
      const award: Award = { ...mockAward, id: category, category };
      const jsx = await AwardCard({ award });
      const { unmount } = render(jsx);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        `/awards#${AWARD_META[category].slug}`,
      );
      unmount();
    }
  });
});
