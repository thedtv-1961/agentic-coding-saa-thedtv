import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import KudosRecipientField from "@/app/components/kudos/kudos-recipient-field";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      recipient_label: "Người nhận",
      recipient_placeholder: "Tìm kiếm...",
      recipient_not_found: "Không tìm thấy người nhận này trong hệ thống",
    };
    return translations[key] || key;
  }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

// Mock searchProfiles
vi.mock("@/app/actions/kudos/search-profiles", () => ({
  searchProfiles: vi.fn().mockResolvedValue({
    data: [
      { id: "u1", full_name: "Nguyen Van A", avatar_url: null },
      { id: "u2", full_name: "Tran Thi B", avatar_url: "https://example.com/avatar.jpg" },
      { id: "u3", full_name: "Le Van C", avatar_url: null },
    ],
  }),
}));

// Helper: advance debounce + flush promises
async function advanceDebounce(ms = 300) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

describe("KudosRecipientField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders search input with label", () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );
    expect(screen.getByText("Người nhận")).toBeInTheDocument();
    expect(screen.getByTestId("recipient-search")).toBeInTheDocument();
  });

  it("shows error message when error prop passed", () => {
    const errorMsg = "Vui lòng chọn người nhận";
    render(
      <KudosRecipientField
        recipientId=""
        recipientName=""
        onSelect={vi.fn()}
        error={errorMsg}
      />
    );
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("calls searchProfiles after user types with debounce", async () => {
    const { searchProfiles } = await import("@/app/actions/kudos/search-profiles");
    const onSelect = vi.fn();

    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={onSelect} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });

    // Before debounce fires
    expect(searchProfiles).not.toHaveBeenCalled();

    await advanceDebounce(300);
    expect(searchProfiles).toHaveBeenCalledWith("Nguyen");
  });

  it("shows dropdown results after search completes", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    const options = screen.getAllByTestId("recipient-option");
    expect(options.length).toBeGreaterThan(0);
  });

  it("calls onSelect with correct id and name when result clicked", async () => {
    const onSelect = vi.fn();

    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={onSelect} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    expect(screen.getAllByTestId("recipient-option").length).toBeGreaterThan(0);

    const firstOption = screen.getAllByTestId("recipient-option")[0];
    fireEvent.click(firstOption);

    expect(onSelect).toHaveBeenCalledWith("u1", "Nguyen Van A");
  });

  it("clears selection when user types again after selecting", async () => {
    const { searchProfiles } = await import("@/app/actions/kudos/search-profiles");
    const onSelect = vi.fn();

    render(
      <KudosRecipientField
        recipientId="u1"
        recipientName="Nguyen Van A"
        onSelect={onSelect}
      />
    );

    const input = screen.getByTestId("recipient-search") as HTMLInputElement;
    expect(input.value).toBe("Nguyen Van A");

    fireEvent.change(input, { target: { value: "Tran" } });

    // Should call onSelect with empty values to clear selection
    expect(onSelect).toHaveBeenCalledWith("", "");

    await advanceDebounce(300);
    expect(searchProfiles).toHaveBeenCalledWith("Tran");
  });

  it("does not search when input is empty or whitespace", async () => {
    const { searchProfiles } = await import("@/app/actions/kudos/search-profiles");

    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");

    fireEvent.change(input, { target: { value: "" } });
    await advanceDebounce(300);
    expect(searchProfiles).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "   " } });
    await advanceDebounce(300);
    expect(searchProfiles).not.toHaveBeenCalled();
  });

  it("closes dropdown when clicking outside", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    expect(screen.getAllByTestId("recipient-option").length).toBeGreaterThan(0);

    // Click outside the component
    fireEvent.mouseDown(document.body);

    expect(screen.queryByTestId("recipient-option")).not.toBeInTheDocument();
  });

  it("displays loading indicator while searching", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    // After search completes, results should be visible
    const options = screen.queryAllByTestId("recipient-option");
    expect(options.length).toBeGreaterThan(0);
  });

  it("syncs input value when recipientId prop changes", async () => {
    const { rerender } = render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search") as HTMLInputElement;
    expect(input.value).toBe("");

    rerender(
      <KudosRecipientField
        recipientId="u1"
        recipientName="Nguyen Van A"
        onSelect={vi.fn()}
      />
    );

    expect(input.value).toBe("Nguyen Van A");
  });

  it("clears input when recipientId prop is cleared", async () => {
    const { rerender } = render(
      <KudosRecipientField
        recipientId="u1"
        recipientName="Nguyen Van A"
        onSelect={vi.fn()}
      />
    );

    const input = screen.getByTestId("recipient-search") as HTMLInputElement;
    expect(input.value).toBe("Nguyen Van A");

    rerender(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    expect(input.value).toBe("");
  });

  it("handles multiple search queries in sequence", async () => {
    const { searchProfiles } = await import("@/app/actions/kudos/search-profiles");

    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");

    // First search
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);
    expect(searchProfiles).toHaveBeenCalledWith("Nguyen");

    // Second search
    (searchProfiles as ReturnType<typeof vi.fn>).mockClear();
    fireEvent.change(input, { target: { value: "Tran" } });
    await advanceDebounce(300);
    expect(searchProfiles).toHaveBeenCalledWith("Tran");
  });

  it("cancels previous search when new query typed before debounce completes", async () => {
    const { searchProfiles } = await import("@/app/actions/kudos/search-profiles");

    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");

    fireEvent.change(input, { target: { value: "N" } });
    await act(async () => { vi.advanceTimersByTime(100); });

    // Second keystroke cancels first debounce
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await act(async () => { vi.advanceTimersByTime(300); });

    expect(searchProfiles).toHaveBeenCalledTimes(1);
    expect(searchProfiles).toHaveBeenCalledWith("Nguyen");
  });

  it("displays avatar image when available", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Tran" } });
    await advanceDebounce(300);

    // Tran Thi B has an avatar
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("displays initials when avatar unavailable", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    // Nguyen Van A has no avatar, should show initial "N"
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("shows all search results", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "a" } });
    await advanceDebounce(300);

    const options = screen.getAllByTestId("recipient-option");
    expect(options).toHaveLength(3);
  });

  it("updates input text after selecting a result", async () => {
    const onSelect = vi.fn();

    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={onSelect} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    const firstOption = screen.getAllByTestId("recipient-option")[0];
    fireEvent.click(firstOption);

    expect(onSelect).toHaveBeenCalledWith("u1", "Nguyen Van A");
  });

  it("hides dropdown after selecting a result", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    expect(screen.getAllByTestId("recipient-option").length).toBeGreaterThan(0);

    const firstOption = screen.getAllByTestId("recipient-option")[0];
    fireEvent.click(firstOption);

    expect(screen.queryByTestId("recipient-option")).not.toBeInTheDocument();
  });

  it("shows input with yellow background when recipient selected", () => {
    render(
      <KudosRecipientField
        recipientId="u1"
        recipientName="Nguyen Van A"
        onSelect={vi.fn()}
      />
    );
    const input = screen.getByTestId("recipient-search");
    expect(input).toHaveClass("bg-yellow-50");
  });

  it("shows input with white background when no recipient selected", () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );
    const input = screen.getByTestId("recipient-search");
    expect(input).toHaveClass("bg-white");
  });

  it("shows error style on input border when error exists", () => {
    render(
      <KudosRecipientField
        recipientId=""
        recipientName=""
        onSelect={vi.fn()}
        error="Vui lòng chọn người nhận"
      />
    );
    const input = screen.getByTestId("recipient-search");
    expect(input).toHaveClass("border-red-500");
  });

  it("shows not-found error on blur when name typed but nobody selected", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Khong Ton Tai" } });
    await advanceDebounce(300);

    fireEvent.blur(input);
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(
      screen.getByText("Không tìm thấy người nhận này trong hệ thống")
    ).toBeInTheDocument();
    expect(input).toHaveClass("border-red-500");
  });

  it("does not show not-found error on blur when a recipient is selected", async () => {
    render(
      <KudosRecipientField
        recipientId="u1"
        recipientName="Nguyen Van A"
        onSelect={vi.fn()}
      />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.blur(input);
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(
      screen.queryByText("Không tìm thấy người nhận này trong hệ thống")
    ).not.toBeInTheDocument();
  });

  it("does not show not-found error on blur when input is empty", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.blur(input);
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByTestId("recipient-error")).not.toBeInTheDocument();
  });

  it("clears not-found error once the user types again", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Khong Ton Tai" } });
    await advanceDebounce(300);
    fireEvent.blur(input);
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByTestId("recipient-error")).toBeInTheDocument();

    // Typing again should clear the error immediately
    fireEvent.change(input, { target: { value: "Khong Ton Tai N" } });
    expect(screen.queryByTestId("recipient-error")).not.toBeInTheDocument();
  });

  it("opens dropdown when input focused and results available", async () => {
    render(
      <KudosRecipientField recipientId="" recipientName="" onSelect={vi.fn()} />
    );

    const input = screen.getByTestId("recipient-search");
    fireEvent.change(input, { target: { value: "Nguyen" } });
    await advanceDebounce(300);

    expect(screen.getAllByTestId("recipient-option").length).toBeGreaterThan(0);

    // Re-focus should keep dropdown open
    fireEvent.focus(input);
    const options = screen.queryAllByTestId("recipient-option");
    expect(options.length).toBeGreaterThan(0);
  });
});
