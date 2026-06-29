import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WidgetButton from "@/app/components/shared/widget-button";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      menu_label: "Menu",
      rules_label: "Thể Lệ",
      write_kudos_label: "Viết KUDOS",
    };
    return translations[key] || key;
  }),
}));

describe("WidgetButton (FAB Controller)", () => {
  it("renders FAB in collapsed state by default", () => {
    render(<WidgetButton />);
    const collapsedBtn = screen.getByTestId("fab-collapsed");
    expect(collapsedBtn).toBeInTheDocument();
    expect(collapsedBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("expands FAB when collapsed button is clicked", () => {
    render(<WidgetButton />);
    const collapsedBtn = screen.getByTestId("fab-collapsed");

    fireEvent.click(collapsedBtn);

    expect(collapsedBtn).toHaveAttribute("aria-expanded", "true");
    const rulesBtn = screen.getByTestId("fab-rules");
    const writeKudosBtn = screen.getByTestId("fab-write-kudos");
    expect(rulesBtn).toBeVisible();
    expect(writeKudosBtn).toBeVisible();
  });

  it("collapses FAB when cancel button is clicked", () => {
    render(<WidgetButton />);
    const collapsedBtn = screen.getByTestId("fab-collapsed");

    // Expand
    fireEvent.click(collapsedBtn);
    expect(collapsedBtn).toHaveAttribute("aria-expanded", "true");

    // Collapse via cancel button
    const cancelBtn = screen.getByTestId("fab-cancel");
    fireEvent.click(cancelBtn);

    expect(collapsedBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onRulesClick when rules button is clicked", () => {
    const onRulesClick = vi.fn();
    render(<WidgetButton onRulesClick={onRulesClick} />);

    const collapsedBtn = screen.getByTestId("fab-collapsed");
    fireEvent.click(collapsedBtn);

    const rulesBtn = screen.getByTestId("fab-rules");
    fireEvent.click(rulesBtn);

    expect(onRulesClick).toHaveBeenCalledTimes(1);
  });

  it("calls onWriteKudosClick when write-kudos button is clicked", () => {
    const onWriteKudosClick = vi.fn();
    render(<WidgetButton onWriteKudosClick={onWriteKudosClick} />);

    const collapsedBtn = screen.getByTestId("fab-collapsed");
    fireEvent.click(collapsedBtn);

    const writeKudosBtn = screen.getByTestId("fab-write-kudos");
    fireEvent.click(writeKudosBtn);

    expect(onWriteKudosClick).toHaveBeenCalledTimes(1);
  });

  it("collapses FAB after clicking rules button", () => {
    const onRulesClick = vi.fn();
    render(<WidgetButton onRulesClick={onRulesClick} />);

    const collapsedBtn = screen.getByTestId("fab-collapsed");
    fireEvent.click(collapsedBtn);
    expect(collapsedBtn).toHaveAttribute("aria-expanded", "true");

    const rulesBtn = screen.getByTestId("fab-rules");
    fireEvent.click(rulesBtn);

    expect(collapsedBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("collapses FAB after clicking write-kudos button", () => {
    const onWriteKudosClick = vi.fn();
    render(<WidgetButton onWriteKudosClick={onWriteKudosClick} />);

    const collapsedBtn = screen.getByTestId("fab-collapsed");
    fireEvent.click(collapsedBtn);
    expect(collapsedBtn).toHaveAttribute("aria-expanded", "true");

    const writeKudosBtn = screen.getByTestId("fab-write-kudos");
    fireEvent.click(writeKudosBtn);

    expect(collapsedBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("supports controlled expansion via isExpanded prop", () => {
    const { unmount } = render(<WidgetButton isExpanded={false} />);
    const collapsedBtn = screen.getByTestId("fab-collapsed");
    expect(collapsedBtn).toHaveAttribute("aria-expanded", "false");
    unmount();

    const { unmount: unmount2 } = render(<WidgetButton isExpanded={true} />);
    const collapsedBtn2 = screen.getByTestId("fab-collapsed");
    expect(collapsedBtn2).toHaveAttribute("aria-expanded", "true");
    unmount2();
  });

  it("calls onToggle when controlled expansion changes", () => {
    const onToggle = vi.fn();
    render(
      <WidgetButton isExpanded={false} onToggle={onToggle} />,
    );

    const collapsedBtn = screen.getByTestId("fab-collapsed");
    fireEvent.click(collapsedBtn);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
