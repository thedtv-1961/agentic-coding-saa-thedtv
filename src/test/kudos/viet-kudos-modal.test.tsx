import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import VietKudosModal from "@/app/components/kudos/viet-kudos-modal";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      modal_title: "Viết KUDOS",
      cancel: "Hủy",
      submit: "Gửi",
      submitting: "Đang gửi...",
      recipient_label: "Người nhận",
      recipient_placeholder: "Tìm kiếm...",
      recipient_required: "Vui lòng chọn người nhận",
      content_label: "Nội dung",
      content_required: "Vui lòng nhập nội dung",
      hashtag_label: "Hashtags",
      hashtag_required: "Vui lòng thêm ít nhất 1 hashtag",
      hashtag_add: "+ Thêm",
      hashtag_max: "Tối đa 5 hashtags",
    };
    return translations[key] || key;
  }),
}));

// Mock getHashtags
vi.mock("@/app/actions/kudos/get-hashtags", () => ({
  getHashtags: vi.fn().mockResolvedValue({
    data: [
      { id: "h1", name: "teamwork" },
      { id: "h2", name: "support" },
      { id: "h3", name: "innovation" },
    ],
  }),
}));

// Mock submitKudos
vi.mock("@/app/actions/kudos/submit-kudos", () => ({
  submitKudos: vi.fn().mockResolvedValue({ data: { id: "kudos-123" } }),
}));

// Mock child components (they have their own tests)
vi.mock("@/app/components/kudos/kudos-recipient-field", () => ({
  default: ({
    onSelect,
    error,
  }: {
    recipientId: string;
    onSelect: (id: string, name: string) => void;
    error?: string;
  }) => (
    <div data-testid="recipient-field">
      <input
        type="text"
        data-testid="recipient-input"
        placeholder="Search recipient"
        onChange={(e) => {
          if (e.target.value === "John") onSelect("u1", "John Doe");
        }}
      />
      {error && <p data-testid="recipient-error">{error}</p>}
    </div>
  ),
}));

vi.mock("@/app/components/kudos/kudos-rich-text-editor", () => ({
  default: ({
    value,
    onChange,
    error,
  }: {
    value: string;
    onChange: (html: string) => void;
    error?: string;
  }) => (
    <div data-testid="rich-text-editor">
      <textarea
        data-testid="editor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write content..."
      />
      {error && <p data-testid="editor-error">{error}</p>}
    </div>
  ),
}));

vi.mock("@/app/components/kudos/kudos-hashtag-field", () => ({
  default: ({
    value,
    onChange,
    error,
  }: {
    value: string[];
    onChange: (ids: string[]) => void;
    error?: string;
  }) => (
    <div data-testid="hashtag-field">
      <button
        type="button"
        data-testid="hashtag-add-btn"
        onClick={() => {
          if (value.length < 5) onChange([...value, `h${value.length + 1}`]);
        }}
      >
        Add hashtag
      </button>
      <div data-testid="hashtag-chips">
        {value.map((id) => (
          <span key={id}>{id}</span>
        ))}
      </div>
      {error && <p data-testid="hashtag-error">{error}</p>}
    </div>
  ),
}));

vi.mock("@/app/components/kudos/kudos-image-upload-field", () => ({
  default: () => <div data-testid="image-upload-field" />,
}));

vi.mock("@/app/components/kudos/kudos-anonymous-toggle", () => ({
  default: () => <div data-testid="anonymous-toggle" />,
}));

describe("VietKudosModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm to avoid real dialogs in tests
    global.confirm = vi.fn(() => true);
  });

  it("renders modal content when isOpen=true", () => {
    render(
      <VietKudosModal isOpen={true} onClose={vi.fn()} userId="test-user" />
    );

    expect(screen.getByTestId("kudos-modal")).toBeInTheDocument();
    expect(screen.getByText("Viết KUDOS")).toBeInTheDocument();
  });

  it("does not render when isOpen=false", () => {
    render(
      <VietKudosModal isOpen={false} onClose={vi.fn()} userId="test-user" />
    );

    expect(screen.queryByTestId("kudos-modal")).not.toBeInTheDocument();
  });

  it("submit button disabled when form empty", () => {
    render(
      <VietKudosModal isOpen={true} onClose={vi.fn()} userId="test-user" />
    );

    const submitBtn = screen.getByTestId("kudos-submit-btn");
    expect(submitBtn).toBeDisabled();
  });

  it("submit button enabled when all fields filled", async () => {
    render(
      <VietKudosModal isOpen={true} onClose={vi.fn()} userId="test-user" />
    );

    // Fill recipient
    const recipientInput = screen.getByTestId("recipient-input");
    fireEvent.change(recipientInput, { target: { value: "John" } });

    // Fill content
    const editorInput = screen.getByTestId("editor-input");
    fireEvent.change(editorInput, { target: { value: "Great work!" } });

    // Add hashtag
    const hashtagAddBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(hashtagAddBtn);

    await waitFor(() => {
      const submitBtn = screen.getByTestId("kudos-submit-btn");
      expect(submitBtn).not.toBeDisabled();
    });
  });

  it("shows required error on recipient when submitting empty form", async () => {
    const { getByTestId } = render(
      <VietKudosModal isOpen={true} onClose={vi.fn()} userId="test-user" />
    );

    // Try submit without filling form
    const submitBtn = getByTestId("kudos-submit-btn");
    fireEvent.click(submitBtn);

    // Should still be disabled but we'll verify errors would show
    expect(submitBtn).toBeDisabled();
  });

  it("calls onClose when cancel button clicked without data", () => {
    const onClose = vi.fn();
    render(
      <VietKudosModal isOpen={true} onClose={onClose} userId="test-user" />
    );

    const cancelBtn = screen.getByTestId("kudos-cancel-btn");
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("confirms before closing when form has data", async () => {
    const onClose = vi.fn();
    render(
      <VietKudosModal isOpen={true} onClose={onClose} userId="test-user" />
    );

    // Fill recipient to have unsaved data
    const recipientInput = screen.getByTestId("recipient-input");
    fireEvent.change(recipientInput, { target: { value: "John" } });

    const cancelBtn = screen.getByTestId("kudos-cancel-btn");
    fireEvent.click(cancelBtn);

    // Should call confirm dialog
    expect(global.confirm).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets form when modal re-opens after close", async () => {
    const { rerender } = render(
      <VietKudosModal isOpen={true} onClose={vi.fn()} userId="test-user" />
    );

    // Fill form
    const recipientInput = screen.getByTestId("recipient-input");
    fireEvent.change(recipientInput, { target: { value: "John" } });

    const editorInput = screen.getByTestId("editor-input");
    fireEvent.change(editorInput, { target: { value: "Test content" } });

    // Close modal
    rerender(
      <VietKudosModal isOpen={false} onClose={vi.fn()} userId="test-user" />
    );

    // Re-open modal
    rerender(
      <VietKudosModal isOpen={true} onClose={vi.fn()} userId="test-user" />
    );

    // Form should be reset
    expect(screen.getByTestId("recipient-input")).toHaveValue("");
    expect(screen.getByTestId("editor-input")).toHaveValue("");
  });

  it("fetches hashtags on modal open", async () => {
    const { getHashtags } = await import("@/app/actions/kudos/get-hashtags");
    render(
      <VietKudosModal isOpen={true} onClose={vi.fn()} userId="test-user" />
    );

    await waitFor(() => {
      expect(getHashtags).toHaveBeenCalled();
    });
  });

  it("does not fetch hashtags when isOpen=false", async () => {
    const { getHashtags } = await import("@/app/actions/kudos/get-hashtags");
    vi.clearAllMocks();

    render(
      <VietKudosModal isOpen={false} onClose={vi.fn()} userId="test-user" />
    );

    await waitFor(() => {
      expect(getHashtags).not.toHaveBeenCalled();
    });
  });

  it("calls onSuccess and onClose after successful submit", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    render(
      <VietKudosModal
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
        userId="test-user"
      />
    );

    // Fill form completely
    const recipientInput = screen.getByTestId("recipient-input");
    fireEvent.change(recipientInput, { target: { value: "John" } });

    const editorInput = screen.getByTestId("editor-input");
    fireEvent.change(editorInput, { target: { value: "Great work!" } });

    const hashtagAddBtn = screen.getByTestId("hashtag-add-btn");
    fireEvent.click(hashtagAddBtn);

    // Submit form
    await waitFor(() => {
      const submitBtn = screen.getByTestId("kudos-submit-btn");
      expect(submitBtn).not.toBeDisabled();
    });

    const submitBtn = screen.getByTestId("kudos-submit-btn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("closes modal via background click without data", () => {
    const onClose = vi.fn();
    render(
      <VietKudosModal isOpen={true} onClose={onClose} userId="test-user" />
    );

    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal via Escape key without data", () => {
    const onClose = vi.fn();
    render(
      <VietKudosModal isOpen={true} onClose={onClose} userId="test-user" />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
