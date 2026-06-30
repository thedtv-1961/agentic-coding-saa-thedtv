# Phase 03 — Unit Tests cho Form Components

## Context Links

- Plan: `plans/260630-0423-viet-kudo-audit-improve/plan.md`
- Pattern: `src/test/kudos/widget-button.test.tsx`, `src/test/kudos/submit-kudos-validation.test.ts`

## Overview

- **Priority**: P1
- **Status**: todo
- **Description**: Viết unit tests cho 3 form components chính của Viết Kudo chưa có coverage.

## Tests cần viết

### 1. `src/test/kudos/viet-kudos-modal.test.tsx`

Tập trung vào form state và validation logic (không test UI pixel-perfect).

```
describe("VietKudosModal")
  ✓ renders modal when isOpen=true
  ✓ does not render when isOpen=false
  ✓ submit button disabled when form empty
  ✓ submit button disabled when only recipient filled (missing content + hashtag)
  ✓ submit button disabled when only content filled (missing recipient + hashtag)
  ✓ submit button disabled when recipient + content but no hashtag
  ✓ submit button enabled when recipient + content + ≥1 hashtag all filled
  ✓ calls onClose when cancel button clicked
  ✓ shows confirm dialog before close when form has data
  ✓ resets form when modal closes (isOpen: true → false)
```

**Mock cần thiết:**
- `next-intl` → `useTranslations` trả về key as-is hoặc translation map
- `@/app/actions/kudos/get-hashtags` → trả về `{ data: [{id:"h1",name:"teamwork"}] }`
- `@/app/actions/kudos/submit-kudos` → mock để test submit flow (Phase 05)

### 2. `src/test/kudos/kudos-hashtag-field.test.tsx`

```
describe("KudosHashtagField")
  ✓ renders label + add button
  ✓ opens dropdown when add button clicked
  ✓ adds hashtag chip on selection
  ✓ removes hashtag chip on × click
  ✓ hides add button when 5 hashtags selected
  ✓ shows max message when 5 hashtags selected
  ✓ shows error message when error prop passed
  ✓ does not add duplicate hashtag
```

### 3. `src/test/kudos/kudos-recipient-field.test.tsx`

```
describe("KudosRecipientField")
  ✓ renders search input + label
  ✓ shows loading indicator while searching
  ✓ shows dropdown results after search
  ✓ calls onSelect with id + name when result clicked
  ✓ closes dropdown on outside click
  ✓ shows error message when error prop passed
  ✓ clears selection when user types after selecting
```

**Mock cần thiết:**
- `@/app/actions/kudos/search-profiles` → `vi.fn().mockResolvedValue({ data: [{id:"u1", full_name:"Nguyen Van A", avatar_url:null}] })`
- `next/image` → render as `<img>` (standard Next.js test mock)

## Mock Pattern (theo convention hiện tại)

```ts
// Mock next-intl (dùng lại pattern từ widget-button.test.tsx)
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props, src: String(props.src), alt: String(props.alt) }),
}));
```

## Scope

- **Không test**: Rich text editor toolbar (document.execCommand — không hoạt động trong jsdom)
- **Không test**: Image upload (network + File API — integration concern, không unit)
- **Không test**: Submit form end-to-end — đã có `submit-kudos-validation.test.ts`

## Todo

- [ ] Tạo `src/test/kudos/viet-kudos-modal.test.tsx`
- [ ] Tạo `src/test/kudos/kudos-hashtag-field.test.tsx`
- [ ] Tạo `src/test/kudos/kudos-recipient-field.test.tsx`
- [ ] Chạy `npm run test` — tất cả pass

## Success Criteria

- [ ] 3 test files mới, không file nào fail
- [ ] `npm run test` green (bao gồm các tests cũ)

## Next Steps

→ Phase 04: Build + lint verification
