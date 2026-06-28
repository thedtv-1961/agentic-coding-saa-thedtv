import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AwardDetailCard from "@/app/components/awards/award-detail-card";
import { AWARD_META } from "@/types/awards";
import type { Award } from "@/types/awards";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockAward: Award = {
  id: "1",
  category: "top_talent",
  title: "Top Talent Award",
  description: "Awarded to the most talented individual",
  award_value: "7.000.000 VNĐ",
  recipient_count: 10,
};

describe("AwardDetailCard", () => {
  it("renders award title", async () => {
    const jsx = await AwardDetailCard({ award: mockAward });
    render(jsx);
    expect(screen.getByText("Top Talent Award")).toBeInTheDocument();
  });

  it("renders award description", async () => {
    const jsx = await AwardDetailCard({ award: mockAward });
    render(jsx);
    expect(
      screen.getByText("Awarded to the most talented individual"),
    ).toBeInTheDocument();
  });

  it("renders award_value", async () => {
    const jsx = await AwardDetailCard({ award: mockAward });
    render(jsx);
    expect(screen.getByText("7.000.000 VNĐ")).toBeInTheDocument();
  });

  it("renders recipient_count", async () => {
    const jsx = await AwardDetailCard({ award: mockAward });
    render(jsx);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders correct award image via AWARD_META", async () => {
    const jsx = await AwardDetailCard({ award: mockAward });
    render(jsx);
    const expectedSrc = AWARD_META["top_talent"].image;
    expect(screen.getByAltText("Top Talent Award")).toHaveAttribute(
      "src",
      expectedSrc,
    );
  });

  it("renders i18n label keys for quantity and value", async () => {
    const jsx = await AwardDetailCard({ award: mockAward });
    render(jsx);
    expect(screen.getByText(/quantity_label/)).toBeInTheDocument();
    expect(screen.getByText(/value_label/)).toBeInTheDocument();
  });
});
