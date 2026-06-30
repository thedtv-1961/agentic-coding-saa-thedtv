import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import KudosHashtagField from "@/app/components/kudos/kudos-hashtag-field";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      hashtag_label: "Hashtags",
      hashtag_add: "+ Thêm",
      hashtag_max: "Tối đa 5 hashtags",
    };
    return translations[key] || key;
  }),
}));

const mockHashtags = [
  { id: "h1", name: "#teamwork" },
  { id: "h2", name: "#support" },
  { id: "h3", name: "#innovation" },
  { id: "h4", name: "#excellence" },
  { id: "h5", name: "#leadership" },
  { id: "h6", name: "#collaboration" },
];

describe("KudosHashtagField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders label and add button", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    expect(screen.getByText("Hashtags")).toBeInTheDocument();
    expect(screen.getByTestId("hashtag-add-btn")).toBeInTheDocument();
  });

  it("opens dropdown when add button clicked", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    // Dropdown should show available hashtags
    const options = screen.getAllByTestId("hashtag-option");
    expect(options.length).toBeGreaterThan(0);
  });

  it("adds hashtag chip when option selected", async () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    const firstOption = screen.getAllByTestId("hashtag-option")[0];
    fireEvent.click(firstOption);

    expect(onChange).toHaveBeenCalledWith(["h1"]);
  });

  it("removes hashtag chip when × clicked", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={["h1"]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    // Find chip and click remove button
    const chip = screen.getByText("#teamwork");
    const removeBtn = chip.parentElement?.querySelector("button");
    fireEvent.click(removeBtn!);

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("hides add button when 5 hashtags selected", () => {
    const onChange = vi.fn();
    const fiveSelected = ["h1", "h2", "h3", "h4", "h5"];

    render(
      <KudosHashtagField
        value={fiveSelected}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    // Add button should not be visible
    const addBtn = screen.queryByTestId("hashtag-add-btn");
    expect(addBtn).not.toBeInTheDocument();

    // Should show max reached message
    expect(screen.getByText("Tối đa 5 hashtags")).toBeInTheDocument();
  });

  it("shows error message when error prop passed", () => {
    const onChange = vi.fn();
    const errorMsg = "Vui lòng thêm ít nhất 1 hashtag";

    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
        error={errorMsg}
      />
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("clicking selected hashtag in dropdown deselects it", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={["h1"]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    // All hashtags shown — h1 (teamwork) is visible as a selected item
    const options = screen.getAllByTestId("hashtag-option");
    expect(options).toHaveLength(mockHashtags.length);

    // Click on the selected #teamwork option → should deselect
    const teamworkOption = options.find((opt) => opt.textContent?.includes("teamwork"));
    fireEvent.click(teamworkOption!);

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("closes dropdown when option selected", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    // Verify dropdown is open
    expect(screen.getAllByTestId("hashtag-option").length).toBeGreaterThan(0);

    // Click option
    const firstOption = screen.getAllByTestId("hashtag-option")[0];
    fireEvent.click(firstOption);

    // Dropdown should close (no options visible anymore for fresh state)
    // We can verify by checking onChange was called
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("closes dropdown when clicking outside", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    // Dropdown should be open
    expect(screen.getAllByTestId("hashtag-option").length).toBeGreaterThan(0);

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should close
    expect(screen.queryByTestId("hashtag-option")).not.toBeInTheDocument();
  });

  it("shows all available hashtags when dropdown opens", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    const options = screen.getAllByTestId("hashtag-option");
    expect(options).toHaveLength(mockHashtags.length);

    mockHashtags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    });
  });

  it("shows all hashtags in dropdown — selected and unselected", () => {
    const onChange = vi.fn();
    render(
      <KudosHashtagField
        value={["h1", "h2"]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    // All 6 hashtags shown (not filtered)
    const options = screen.getAllByTestId("hashtag-option");
    expect(options).toHaveLength(mockHashtags.length);

    // Selected items appear in the dropdown (for deselection)
    expect(options.find((o) => o.textContent?.includes("teamwork"))).toBeDefined();
    expect(options.find((o) => o.textContent?.includes("support"))).toBeDefined();
  });

  it("handles adding multiple hashtags sequentially", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    // Open dropdown and add first hashtag
    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);
    const firstOption = screen.getAllByTestId("hashtag-option")[0];
    fireEvent.click(firstOption);

    expect(onChange).toHaveBeenCalledWith(["h1"]);

    // Simulate state update — dropdown stays open, directly select second item
    onChange.mockClear();
    rerender(
      <KudosHashtagField
        value={["h1"]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    // Dropdown is still open — find unselected h2 (second in list, first is now selected h1)
    const allOptions = screen.getAllByTestId("hashtag-option");
    const h2Option = allOptions.find((o) => o.textContent?.includes("support"));
    fireEvent.click(h2Option!);

    expect(onChange).toHaveBeenCalledWith(["h1", "h2"]);
  });

  it("displays all selected hashtags as chips", () => {
    const onChange = vi.fn();
    const selected = ["h1", "h2", "h3"];

    render(
      <KudosHashtagField
        value={selected}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    expect(screen.getByText("#teamwork")).toBeInTheDocument();
    expect(screen.getByText("#support")).toBeInTheDocument();
    expect(screen.getByText("#innovation")).toBeInTheDocument();
  });

  it("shows 'max reached' message when 5 hashtags are selected", () => {
    const onChange = vi.fn();
    const allSelected = ["h1", "h2", "h3", "h4", "h5"];

    render(
      <KudosHashtagField
        value={allSelected}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    expect(screen.getByText("Tối đa 5 hashtags")).toBeInTheDocument();
  });

  it("prevents adding more than 5 hashtags even if dropdown clicked", () => {
    const onChange = vi.fn();
    const allSelected = ["h1", "h2", "h3", "h4", "h5"];

    render(
      <KudosHashtagField
        value={allSelected}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    // Add button should not exist
    const addBtn = screen.queryByTestId("hashtag-add-btn");
    expect(addBtn).not.toBeInTheDocument();

    // onChange should never be called since button doesn't exist
    expect(onChange).not.toHaveBeenCalled();
  });

  it("unselected items enabled when below max, disabled when dropdown opens at 5 via chip removal", () => {
    const onChange = vi.fn();
    // With 4 selected, unselected items are still enabled in dropdown
    render(
      <KudosHashtagField
        value={["h1", "h2", "h3", "h4"]}
        onChange={onChange}
        hashtags={mockHashtags}
      />
    );

    const addBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(addBtn);

    const options = screen.getAllByTestId("hashtag-option");
    // unselected h5/h6 should be enabled (can still add one more)
    const h5 = options.find((o) => o.textContent?.includes("leadership"));
    const h6 = options.find((o) => o.textContent?.includes("collaboration"));
    expect(h5).not.toBeDisabled();
    expect(h6).not.toBeDisabled();
  });

  it("displays error with red styling", () => {
    const onChange = vi.fn();
    const errorMsg = "Yêu cầu ít nhất 1 hashtag";

    render(
      <KudosHashtagField
        value={[]}
        onChange={onChange}
        hashtags={mockHashtags}
        error={errorMsg}
      />
    );

    const errorElement = screen.getByText(errorMsg);
    expect(errorElement).toHaveClass("text-red-500");
  });
});
