import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AwardDetailCard from "@/app/components/awards/award-detail-card";
import type { GroupedAward } from "@/types/awards";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockGrouped: GroupedAward = {
  category: {
    id: 1,
    name: "Top Talent",
    title: "Top Talent",
    description: "Vinh danh những cá nhân xuất sắc nhất",
    content: "Nội dung chi tiết về giải thưởng Top Talent",
    image_url: "/images/awards/top-talent.png",
    is_active: true,
  },
  items: [
    {
      id: 1,
      category_id: 1,
      number_of_winners: 10,
      winner_unit: 1,
      prize_value: 7000000,
      is_active: true,
      award_categories: {
        id: 1,
        name: "Top Talent",
        title: "Top Talent",
        description: "Vinh danh những cá nhân xuất sắc nhất",
        content: "Nội dung chi tiết về giải thưởng Top Talent",
        image_url: "/images/awards/top-talent.png",
        is_active: true,
      },
    },
  ],
};

const mockGroupedMulti: GroupedAward = {
  category: {
    id: 5,
    name: "Signature 2025 Creator",
    title: "Signature 2025 – Creator",
    description: "Vinh danh Creator",
    content: "Nội dung Signature",
    image_url: "/images/awards/signature-2025-creator.png",
    is_active: true,
  },
  items: [
    {
      id: 5,
      category_id: 5,
      number_of_winners: 1,
      winner_unit: 1,
      prize_value: 5000000,
      is_active: true,
      award_categories: {
        id: 5,
        name: "Signature 2025 Creator",
        title: "Signature 2025 – Creator",
        description: "Vinh danh Creator",
        content: "Nội dung Signature",
        image_url: "/images/awards/signature-2025-creator.png",
        is_active: true,
      },
    },
    {
      id: 6,
      category_id: 5,
      number_of_winners: 1,
      winner_unit: 2,
      prize_value: 8000000,
      is_active: true,
      award_categories: {
        id: 5,
        name: "Signature 2025 Creator",
        title: "Signature 2025 – Creator",
        description: "Vinh danh Creator",
        content: "Nội dung Signature",
        image_url: "/images/awards/signature-2025-creator.png",
        is_active: true,
      },
    },
  ],
};

describe("AwardDetailCard — single prize", () => {
  it("renders category title", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGrouped });
    render(jsx);
    expect(screen.getByText("Top Talent")).toBeInTheDocument();
  });

  it("renders content as body text", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGrouped });
    render(jsx);
    expect(screen.getByText("Nội dung chi tiết về giải thưởng Top Talent")).toBeInTheDocument();
  });

  it("renders prize_value formatted", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGrouped });
    render(jsx);
    expect(screen.getByText(/7\.000\.000.*VNĐ/)).toBeInTheDocument();
  });

  it("renders number_of_winners with unit label", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGrouped });
    render(jsx);
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/Cá nhân/)).toBeInTheDocument();
  });

  it("renders image from category.image_url", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGrouped });
    render(jsx);
    expect(screen.getByAltText("Top Talent")).toHaveAttribute(
      "src",
      "/images/awards/top-talent.png",
    );
  });

  it("renders i18n label keys", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGrouped });
    render(jsx);
    expect(screen.getByText(/quantity_label/)).toBeInTheDocument();
    expect(screen.getByText(/value_label/)).toBeInTheDocument();
  });
});

describe("AwardDetailCard — multi-prize (Signature)", () => {
  it("renders both unit labels", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGroupedMulti });
    render(jsx);
    expect(screen.getByText("Cá nhân")).toBeInTheDocument();
    expect(screen.getByText("Tập thể")).toBeInTheDocument();
  });

  it("renders both prize values", async () => {
    const jsx = await AwardDetailCard({ grouped: mockGroupedMulti });
    render(jsx);
    expect(screen.getByText(/5\.000\.000.*VNĐ/)).toBeInTheDocument();
    expect(screen.getByText(/8\.000\.000.*VNĐ/)).toBeInTheDocument();
  });
});
