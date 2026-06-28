## Session 2026-06-28

- Q: Scope của plan? → A: HOLD SCOPE — implement đủ 7 sections theo spec
- Q: Header sticky/fixed khi scroll? → A: Sticky/fixed đầu trang (position fixed, z-50)
- Q: Mobile header → A: Hamburger menu — nav links collapse, icon ≡ mở drawer
- Q: Widget Button menu options → A: Placeholder/TODO — render đúng style, click chưa có action
- Q: Content source (text) → A: Static hardcode trong i18n (vi.json + en.json)
- Q: Notification panel → A: Placeholder — icon bell chỉ có style, chưa có click action
- Q: Awards data → A: Dynamic từ Supabase `awards` table (seeded 6 rows), image static mapped by category
- Q: User avatar khi chưa auth → A: Homepage yêu cầu login — user luôn auth khi thấy trang này; thêm auth guard vào middleware
