import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AwardCard from "@/app/components/home/award-card";
import { nameToSlug } from "@/types/awards";
import type { AwardCategory } from "@/types/awards";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
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

const mockCategory: AwardCategory = {
  id: 1,
  name: "Top Talent",
  title: "Top Talent",
  description: "Awarded to the most talented individual",
  content: "",
  image_url: "/images/awards/top-talent.png",
  is_active: true,
};

describe("AwardCard", () => {
  it("renders category name", async () => {
    const jsx = await AwardCard({ category: mockCategory });
    render(jsx);
    expect(screen.getByText("Top Talent")).toBeInTheDocument();
  });

  it("renders description", async () => {
    const jsx = await AwardCard({ category: mockCategory });
    render(jsx);
    expect(screen.getByText("Awarded to the most talented individual")).toBeInTheDocument();
  });

  it("detail link points to /awards#slug derived from name", async () => {
    const jsx = await AwardCard({ category: mockCategory });
    render(jsx);
    const slug = nameToSlug("Top Talent");
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/awards#${slug}`);
  });

  it("renders detail label from i18n", async () => {
    const jsx = await AwardCard({ category: mockCategory });
    render(jsx);
    expect(screen.getByText(/award_detail/)).toBeInTheDocument();
  });

  it("renders image from category.image_url", async () => {
    const jsx = await AwardCard({ category: mockCategory });
    render(jsx);
    expect(screen.getByAltText("Top Talent")).toHaveAttribute(
      "src",
      "/images/awards/top-talent.png",
    );
  });

  it("uses nameToSlug for the link href", async () => {
    const category: AwardCategory = {
      ...mockCategory,
      id: 6,
      name: "MVP (Most Valuable Person)",
      title: "MVP (Most Valuable Person)",
      image_url: "/images/awards/mvp.png",
    };
    const jsx = await AwardCard({ category });
    const { unmount } = render(jsx);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      `/awards#${nameToSlug("MVP (Most Valuable Person)")}`,
    );
    unmount();
  });
});
