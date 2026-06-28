import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AwardsSection from "@/app/components/home/awards-section";
import type { AwardCategory } from "@/types/awards";

const mockCategories: AwardCategory[] = [
  { id: 1, name: "Top Talent", title: "Top Talent", description: "Best individual performer", content: "", image_url: "/images/awards/top-talent.png", is_active: true },
  { id: 2, name: "Top Project", title: "Top Project", description: "Best project delivery", content: "", image_url: "/images/awards/top-project.png", is_active: true },
  { id: 3, name: "Top Project Leader", title: "Top Project Leader", description: "Best project leader", content: "", image_url: "/images/awards/top-project-leader.png", is_active: true },
  { id: 4, name: "Best Manager", title: "Best Manager", description: "Outstanding manager", content: "", image_url: "/images/awards/best-manager.png", is_active: true },
  { id: 5, name: "Signature 2025 Creator", title: "Signature 2025 – Creator", description: "Most creative individual", content: "", image_url: "/images/awards/signature-2025-creator.png", is_active: true },
  { id: 6, name: "MVP (Most Valuable Person)", title: "MVP (Most Valuable Person)", description: "Most valuable person", content: "", image_url: "/images/awards/mvp.png", is_active: true },
];

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock("@/app/components/home/award-card", () => ({
  default: ({ category }: { category: AwardCategory }) => (
    <a href={`/awards#${category.name}`} data-testid="award-card">
      {category.name}
    </a>
  ),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            returns: vi.fn(() => ({ data: mockCategories, error: null })),
          })),
        })),
      })),
    })),
  })),
}));

describe("AwardsSection", () => {
  it("renders section with all 6 award cards", async () => {
    const jsx = await AwardsSection();
    render(jsx);
    expect(screen.getAllByTestId("award-card")).toHaveLength(6);
  });

  it("renders section header caption", async () => {
    const jsx = await AwardsSection();
    render(jsx);
    expect(screen.getByText("awards_caption")).toBeInTheDocument();
  });

  it("renders section title", async () => {
    const jsx = await AwardsSection();
    render(jsx);
    expect(screen.getByText("awards_title")).toBeInTheDocument();
  });

  it("renders each award category name", async () => {
    const jsx = await AwardsSection();
    render(jsx);
    for (const category of mockCategories) {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    }
  });

  it("renders empty grid without crashing when DB returns no data", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValueOnce({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              returns: vi.fn(() => ({ data: [], error: null })),
            })),
          })),
        })),
      })),
    } as never);

    const jsx = await AwardsSection();
    const { container } = render(jsx);
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(screen.queryAllByTestId("award-card")).toHaveLength(0);
  });
});
