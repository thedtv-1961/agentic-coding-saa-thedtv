# Reference Specs - Dropdown-profile

Screen: Dropdown-profile | screenId: z4sCl3_Qtk | fileKey: 9ypp4enmFmdK3YAFJLIu6C

---

## Item A — Dropdown-List (666:9601)

Related items (limit=3):

### Ref 1 — 666:9728 (Dropdown-List, screen: Dropdown-profile Admin)
- type: others / navigation
- nameTrans: Dropdown List
- userAction: on_click
- navigationNote: "Click avatar để mở/đóng dropdown; không có animation mở/đóng"
- description: Container dropdown menu cho tài khoản Admin; xuất hiện khi click vào avatar trên header. Nền tối; 3 mục menu: Profile (active; icon user); Dashboard (icon grid); Logout (icon mũi tên phải). Click avatar: mở/đóng menu; Click item con: thực hiện action và đóng menu; Hover item: đổi nền highlight; Click ngoài vùng: đóng menu.

### Ref 2 — 525:11713 (Dropdown-List, screen: Dropdown-ngôn ngữ)
- type: others / dropdown
- nameTrans: Dropdown chọn ngôn ngữ
- description: Dropdown chọn ngôn ngữ; click mở/đóng menu; chọn 'EN'/'VN' cập nhật giá trị và đóng menu

### Ref 3 — 563:8026 (Dropdown-List, screen: Dropdown list hashtag)
- type: others / list
- description: Dropdown lọc hashtag; click mục chọn giá trị và đóng dropdown; scroll khi vượt chiều cao

---

## Item A.1 — Profile (I666:9601;563:7844)

Related items (limit=3):

### Ref 1 — I666:9728;666:9277 (Profile, screen: Dropdown-profile Admin)
- type: button / icon_text
- nameJP: プロフィール
- nameTrans: Profile
- userAction: on_click
- navigationNote: "TODO: Trang Profile chưa được triển khai"
- description: Mục menu 'Profile' trong dropdown Admin; hiển thị active khi người dùng đang ở trang hồ sơ. Label 'Profile'; icon người dùng bên phải; nền highlight và hiệu ứng glow khi active. Click: đóng dropdown. TODO: Trang Profile chưa được triển khai; bỏ qua điều hướng trong phạm vi hiện tại.

---

## Item A.2 — Logout (I666:9601;563:7868)

Related items (limit=3): Không có item liên quan trực tiếp (refs trả về là Button chi tiết và ButtonHashtag — không áp dụng)
