# Phase 02 — Static UI: Hero, Title, Award Detail Cards

## Overview
- **Priority**: P1
- **Status**: todo
- **Effort**: ~60 phút

## Context Links
- Plan: `plans/260628-1800-awards-page/plan.md`
- MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
- Existing award images: `public/images/awards/`
- Existing components: `app/components/home/`

## Key Insights

### Item 3 — Keyvisual (hero banner)
- Background image 1200×871px, object-cover, center-crop
- Text: "ROOT FURTHER" (tiêu đề lớn) + "Sun* Annual Award 2025" (phụ đề)
- Logo + biểu tượng góc trên — dùng `public/images/saa-logo.png`
- Không có click handler — chỉ hiển thị
- Tham khảo pattern từ `app/components/home/hero-section.tsx`

### Item A — Section Title
- Phụ đề nhỏ muted: "Sun* Annual Awards 2025"
- Tiêu đề chính vàng lớn: "Hệ thống giải thưởng SAA 2025"
- Tĩnh, không tương tác

### Items D.1–D.6 — Award Detail Cards
- Layout: hình ảnh bên trái (336×336px) + nội dung bên phải
- Nội dung: tiêu đề, mô tả, số lượng giải thưởng, giá trị giải thưởng
- Data từ DB: `title`, `description`, `award_value`, `recipient_count`
- Mỗi card có `id` matching slug (để scroll spy anchor hoạt động)
- **D.5 Signature 2025**: có 2 giá trị — hiển thị trên 2 dòng: "5.000.000 VNĐ (cá nhân)" và "8.000.000 VNĐ (tập thể)"
- Không có hover state, không link đến trang khác

### Item D1 — Sun* Kudos Block
- Tái sử dụng `<KudosSection />` đã có tại `app/components/home/kudos-section.tsx`
- Nút "Chi tiết" link đến `/kudos` (internal, same tab) — đã đúng rồi

## Requirements

**Functional:**
- Keyvisual hero render đúng với background image + text overlay
- Section title render text đúng (lấy từ i18n)
- 6 award detail cards render theo đúng thứ tự Figma (Top Talent → Top Project → Top Project Leader → Best Manager → Signature 2025 → MVP)
- Mỗi card có `id` attribute là slug (e.g. `id="top-talent"`) cho anchor scroll
- Sun* Kudos block hiển thị ở cuối trang

**Non-functional:**
- Server Components — không cần client interaction ở phase này
- Mỗi file ≤ 200 dòng
- Ảnh dùng `next/image` với `fill` hoặc explicit `width/height`

## Architecture

```
app/
  awards/
    page.tsx             ← Update: import và render các components mới
  components/
    awards/
      awards-hero.tsx          ← Keyvisual banner (Item 3)
      awards-section-title.tsx ← Title block (Item A)
      award-detail-card.tsx    ← Single award card (Items D.1–D.6)
      awards-detail-list.tsx   ← List wrapper cho 6 cards (phần D của Item B)
```

## Related Code Files

**Đọc để tham khảo:**
- `app/components/home/hero-section.tsx` — pattern hero banner
- `app/components/home/kudos-section.tsx` — tái dùng nguyên
- `app/components/home/award-card.tsx` — style reference
- `public/images/awards/` — images đã có cho 6 categories
- `messages/vi.json` + `messages/en.json` — i18n keys

**Tạo mới:**
- `app/components/awards/awards-hero.tsx`
- `app/components/awards/awards-section-title.tsx`
- `app/components/awards/award-detail-card.tsx`
- `app/components/awards/awards-detail-list.tsx`

**Sửa:**
- `app/awards/page.tsx` — import và compose các components
- `messages/vi.json` + `messages/en.json` — thêm namespace `awards`

## i18n Keys Cần Thêm (namespace `awards`)

```json
{
  "awards": {
    "page_title": "Hệ thống giải thưởng SAA 2025",
    "caption": "Sun* Annual Awards 2025",
    "hero_title": "ROOT FURTHER",
    "hero_subtitle": "Sun* Annual Award 2025",
    "quantity_label": "Số lượng giải thưởng",
    "value_label": "Giá trị giải thưởng",
    "individual_label": "cá nhân",
    "group_label": "tập thể"
  }
}
```

## Implementation Steps

1. **Tạo `awards-hero.tsx`** — Server Component:
   - Background: `public/images/homepage/keyvisual.png` hoặc tải mới từ Figma (nếu khác homepage)
   - Text overlay: "ROOT FURTHER" + "Sun* Annual Award 2025"
   - Logo SAA góc trên trái

2. **Tạo `awards-section-title.tsx`** — Server Component:
   - Phụ đề: `text-white/60 text-xs tracking-widest uppercase`
   - Tiêu đề: `text-[#FFEA9E] text-4xl font-black`

3. **Tạo `award-detail-card.tsx`** — Server Component:
   - Props: `award: Award` (full type với award_value, recipient_count)
   - Layout: `flex flex-row gap-8 items-start`
   - Left: `<Image>` award image 336×336 từ `AWARD_META[award.category].image`
   - Right: tiêu đề, mô tả, số lượng, giá trị
   - `id={AWARD_META[award.category].slug}` cho anchor scroll
   - Lưu ý D.5 Signature: `award_value` DB có thể là "5.000.000 VNĐ / 8.000.000 VNĐ" → cần parse và render 2 dòng, hoặc render nguyên string nếu đã đúng format

4. **Tạo `awards-detail-list.tsx`** — Server Component:
   - Nhận `awards: Award[]`, render danh sách `<AwardDetailCard>` theo CATEGORY_ORDER
   - Wrap mỗi card trong `<section>` với `id` slug để anchor hoạt động
   - Gap giữa các cards: `gap-16` hoặc `gap-20`

5. **Update `app/awards/page.tsx`**:
   - Compose: `<Header />` + `<AwardsHero />` + `<AwardsSectionTitle />` + layout 2 cột (nav sẽ thêm phase 03) + `<AwardsDetailList awards={awards} />` + `<KudosSection />` + `<Footer />`

6. **Thêm i18n keys** vào cả `vi.json` và `en.json`

## Todo

- [ ] Kiểm tra ảnh keyvisual cho awards page (giống hay khác homepage hero?)
- [ ] Tạo `awards-hero.tsx`
- [ ] Tạo `awards-section-title.tsx`
- [ ] Tạo `award-detail-card.tsx` với đủ data fields
- [ ] Tạo `awards-detail-list.tsx`
- [ ] Update `app/awards/page.tsx` để compose layout
- [ ] Thêm i18n keys vào vi.json + en.json
- [ ] Visual check: screenshot vs Figma
- [ ] `npm run build` pass

## Success Criteria
- Trang `/awards` render 6 award cards theo đúng thứ tự Figma
- Mỗi card hiển thị: hình ảnh, tiêu đề, mô tả, số lượng, giá trị giải thưởng
- Sun* Kudos block ở cuối trang
- Layout khớp với Figma design

## Risk Assessment
- **Medium**: Ảnh keyvisual cho awards page có thể cần tải mới từ Figma nếu khác homepage hero
- **Low**: D.5 Signature giá trị 2 mức — cần confirm format `award_value` trong DB
