# Reference Specs - Dropdown-profile Admin

Screen ID: 54rekaCHG1
File Key: 9ypp4enmFmdK3YAFJLIu6C
Source: MoMorph

---

## Item A: mms_A_Dropdown-List (666:9728)

### Related Items

**1. Dropdown-List (525:11713) — Dropdown chọn ngôn ngữ**
- Type: others / dropdown
- Description: Dropdown chọn ngôn ngữ. Selected: vùng trên, nền xám đậm, cờ VN. Option: vùng dưới, nền đen, cờ EN. Click mở/đóng menu; chọn EN/VN cập nhật giá trị và đóng menu.

**2. Dropdown-List (666:9601) — Menu dropdown 'Profile' và 'Logout'**
- Type: others / dropdown_menu
- Description: Menu dropdown cho thao tác người dùng. Profile: item với icon người, nền sáng, glow. Logout: item text với mũi tên phải. Click Profile: mở trang profile; Click Logout: thực hiện logout.

**3. Dropdown-List (563:8026) — Danh sách Dropdown - bộ lọc hashtag**
- Type: others / list
- Description: Danh sách dropdown để lọc hashtag. Click mục: chọn giá trị, đóng dropdown, áp dụng filter. Scroll khi vượt chiều cao.

---

## Item A.1: mms_A.1_Profile (I666:9728;666:9277)

### Related Items

**1. Profile (I666:9601;563:7844) — Mục 'Profile' (Hồ sơ)**
- Type: button / icon_text
- Description: Mục menu 'Profile' trong dropdown tài khoản. Label 'Profile'; Icon user bên phải; 119x56px. Click: mở trang Hồ sơ; Hover/focus: nền sáng; State active: nền sáng + glow, cursor pointer.

---

## Item A.2: mms_A.2_Dashboard (I666:9728;666:9452)

### Related Items

**1. Top Talent (313:8460) — Navigation item (C.1)**
- Type: others / navigation_item
- Description: Navigation item 'Top Talent' với leading icon. Click: scroll đến section D.1, set C.1 active.

**2. Top Project (313:8461) — Navigation item (C.2)**
- Type: others / navigation_item
- Description: Navigation item 'Top Project'. Click: scroll đến section D.2, set C.2 active.

**3. Top Project Leader (313:8462) — Navigation item (C.3)**
- Type: others / navigation_item
- Description: Navigation item 'Top Project Leader'. Click: scroll đến section D.3, set C.3 active.

---

## Item A.3: mms_A.3_Logout (I666:9728;666:9278)

### Related Items

**1. Button chi tiết (I335:12023;313:8426) — Detail Button**
- Type: button / text_link
- Description: 'Chi tiết' text-link button trong Sun* Kudos content block. Click: Open Sun* Kudos tab/page.

**2. ButtonHashtag (2940:13459) — Nút lọc 'Hashtag'**
- Type: button / icon_text
- Description: Nút mở menu 'Hashtag' để chọn tag, lọc nội dung. Click: Mở dropdown; Select: Chọn tag để lọc kudos.

**3. Button Phong ban (2940:13460) — Nút 'Phòng ban'**
- Type: button / icon_text
- Description: Nút mở menu 'Phòng ban'. Click: Mở dropdown; Select: Chọn phòng ban để lọc.
