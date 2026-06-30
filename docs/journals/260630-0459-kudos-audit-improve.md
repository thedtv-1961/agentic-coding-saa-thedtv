# Viết Kudo Feature Audit & Improve

**Date**: 2026-06-30 15:01
**Severity**: Medium
**Component**: Kudo creation modal, rich text editor, FAB controller
**Status**: Resolved

## What Happened

Audited the "Viết Kudo" (write kudo) feature against MoMorph spec (screenId: ihQ26W78P2) and fixed five gaps: incorrect label text key, missing community standards link, poor UX for URL insertion (native `prompt()`), hardcoded submit button state text, and missing test coverage. Built 3 test files with 43 passing tests to prevent regression.

## The Brutal Truth

The feature was shipping with sloppy details — rendering the wrong i18n key for content label, forcing users through a native browser prompt for links, and no test coverage to catch regressions. None of it was broken functionally, but it _felt_ unfinished. The gap between "works" and "right" is where quality dies if you don't push back.

Testing the debounce behavior in the hashtag and recipient fields exposed a real footgun: `vi.useFakeTimers()` + `waitFor()` deadlock in Vitest. Spent frustration time on that until the pattern clicked — you have to flush both the timer and the promise queue together inside `act()`, not separately.

## Technical Details

**Fixed issues (G1–G5 from spec):**

1. **G1 - Content label:** Was rendering `{t("content_placeholder").slice(0, 10)}…` (truncated placeholder key) instead of `t("content_label")`. Added both keys to i18n.

2. **G2 - Community standards link:** Rich text toolbar was missing the link to "Tiêu chuẩn cộng đồng". Added as a new button with `ml-auto` alignment to push it to the right side of toolbar.

3. **G3 - Link insertion UX:** Replaced `window.prompt("Enter URL...")` with an inline dialog state (`linkDialogOpen`, `linkUrl`). Implemented `saveSelection()` / `restoreSelection()` helpers using `Range` API to preserve selection when dialog opens/closes—critical for contentEditable where state updates clear selection.

4. **G4 - Submit loading text:** Button was hardcoded to show "..." while submitting. Changed to use `t("submitting")` key added to messages.

5. **G5 - Success toast identifier:** Added `data-testid="success-toast"` to the toast element in fab-controller for E2E visibility.

**Test coverage:**
- `viet-kudos-modal.test.tsx`: 5 tests covering form render, submission flow, error boundary
- `kudos-hashtag-field.test.tsx`: 16 tests for debounce, duplicate prevention, empty state, submission via Enter key
- `kudos-recipient-field.test.tsx`: 22 tests for search, duplicate prevention, selection, removal via keyboard/mouse

**Debounce testing pattern (the hard-won one):**
```typescript
vi.useFakeTimers();
act(() => {
  fireEvent.change(input, { target: { value: "test" } });
});
await act(async () => {
  vi.advanceTimersByTime(300); // Flush timers + promise microtasks
});
expect(mockFn).toHaveBeenCalledWith("test");
```

**Selection preservation in contentEditable:**
```typescript
function saveSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

function restoreSelection(range) {
  if (!range) return;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
```

## What We Tried

1. **Native `window.prompt()`** — user-facing friction; modal should stay in-component. Replaced with controlled state + inline dialog.

2. **`vi.useFakeTimers()` + `waitFor()`** — deadlock because `waitFor` uses `setTimeout` internally. Tried separating with `vi.runAllTimers()` first; didn't work. Solution: wrap `vi.advanceTimersByTime()` in `act(async () => {...})` to flush both timer and promise queues atomically.

3. **Hardcoded label text in component** — tempting to just use "Đang gửi..." inline. Added to i18n instead to enable A/B testing and consistency across the app.

## Root Cause Analysis

**Why G1 happened:** Copy-paste from a different field that _was_ using a placeholder key. No code review caught the mismatch. The component rendered without error because keys gracefully fall back to the key name itself in next-intl.

**Why G3 felt stuck:** `contentEditable` elements lose selection on any DOM update (including state changes). The browser's selection object is tied to the current DOM tree; once React re-renders, the Range reference is invalid. Solution requires capturing the Range _before_ state changes and restoring it _after_ the DOM settles—needs to live in a modal dialog that opens after the save/restore dance.

**Why tests were hard to write:** Vitest's `vi.useFakeTimers()` intercepts all timer calls, including those inside `waitFor`. The interaction was undocumented. The fix comes from understanding that `act()` is designed to flush _both_ synchronous timer effects _and_ async promise work as a single atomic unit.

## Lessons Learned

1. **i18n keys must match specs exactly.** When MoMorph or Figma says "label", pull that exact term from the spec. Don't abbreviate or reuse a "placeholder" key. Code review should call this out if the template was copy-pasted.

2. **`contentEditable` selection is fragile.** Any React re-render invalidates the DOM-tied selection. If you need to open a dialog over contentEditable text, capture the Range first, open the dialog, restore the Range when the dialog closes. This is not optional—users expect selection to survive modal interactions.

3. **Fake timer + async testing in Vitest requires `act(async () => {})`—not `vi.runAllTimers()` alone.** The pattern is: `await act(async () => { vi.advanceTimersByTime(duration); })`. This flushes both synchronous timer side effects and promise microtask queue as one atomic step. Document this pattern for the next person.

4. **Test first, even for "small" UX fixes.** The three test files caught edge cases (debounce under rapid input, duplicate recipients, selection via keyboard) that manual testing would have missed. The test harness is the truth; UI changes should never ship without test coverage to back them.

## Next Steps

- Merge the three test files into the codebase (all 43 tests passing).
- Update `ui-implementation-checklist.md` with the contentEditable selection preservation pattern under "Components" section.
- Run `npm run test:coverage` to confirm coverage on the kudo feature is solid before final review.
- Consider documenting the fake timer pattern in the Vitest section of `code-standards.md`.
