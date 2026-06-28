import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AwardsSection from "@/app/components/home/awards-section";
import type { Award } from "@/types/awards";

const mockAwards = [
  {
    id: "1",
    category: "top_talent",
    title: "Top Talent",
    description: "Best individual performer",
  },
  {
    id: "2",
    category: "top_project",
    title: "Top Project",
    description: "Best project delivery",
  },
  {
    id: "3",
    category: "top_project_leader",
    title: "Top Project Leader",
    description: "Best project leader",
  },
  {
    id: "4",
    category: "best_manager",
    title: "Best Manager",
    description: "Outstanding manager",
  },
  {
    id: "5",
    category: "signature_creator",
    title: "Signature Creator",
    description: "Most creative individual",
  },
  {
    id: "6",
    category: "mvp",
    title: "MVP",
    description: "Most Valuable Person",
  },
];

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

// Mock AwardCard to avoid testing its async rendering here (covered in award-card.test.tsx)
vi.mock("@/app/components/home/award-card", () => ({
  default: ({ award }: { award: Award }) => (
    <a href={`/awards#${award.category}`} data-testid="award-card">
      {award.title}
    </a>
  ),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          returns: vi.fn(() => ({ data: mockAwards, error: null })),
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

  it("renders each award title", async () => {
    const jsx = await AwardsSection();
    render(jsx);
    for (const award of mockAwards) {
      expect(screen.getByText(award.title)).toBeInTheDocument();
    }
  });

  it("renders empty grid without crashing when DB returns no data", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValueOnce({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            returns: vi.fn(() => ({ data: [], error: null })),
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
