# Items Analysis - Dropdown-profile

Screen: Dropdown-profile | screenId: z4sCl3_Qtk | fileKey: 9ypp4enmFmdK3YAFJLIu6C

## Clarifications (2026-06-28)

- Q: Có animation khi mở/đóng dropdown không? → A: Không cần animation
- Q: Click ngoài vùng dropdown có đóng menu không? → A: Có
- Q: Click Profile có điều hướng không? → A: Không có sự kiện (trang Profile không được triển khai)
- Q: Logout có confirmation dialog không? → A: Logout ngay, không cần confirmation
- Q: Sau logout điều hướng về trang nào? → A: Trang /login (không phải Homepage SAA)
- Q: Chưa đăng nhập có truy cập các page khác không? → A: Không — auth guard redirect về /login

---

### Item A: Dropdown-List

- nameJP: ドロップダウンリスト
- nameTrans: Dropdown List
- itemType: others
- itemSubtype: dropdown_menu
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Không có animation; click ngoài vùng dropdown sẽ đóng menu
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Container dropdown menu cho tài khoản người dùng; xuất hiện khi click vào avatar trên header
  Thành phần hiển thị: Nền tối; 2 mục menu: Profile (icon user; nền sáng và glow) và Logout (text với chevron phải)
  Chức năng & Logic: Click avatar: mở/đóng menu (không có animation); Click 'Profile': không có sự kiện; Click 'Logout': logout ngay và điều hướng về Homepage SAA; Click ngoài vùng: đóng menu
- qa:

---

### Item A.1: Profile

- nameJP: プロフィール
- nameTrans: Profile
- itemType: button
- itemSubtype:
- buttonType: icon_text
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Click không có sự kiện (trang Profile không được triển khai)
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Mục menu 'Profile' trong dropdown tài khoản; hiển thị active khi người dùng đang ở trang hồ sơ
  Thành phần hiển thị: Label 'Profile'; icon user bên phải; nền highlight và hiệu ứng glow khi active; kích thước 119x56px
  Chức năng & Logic: Click: không có sự kiện (trang Profile không được triển khai); Hover/focus: hiệu ứng nổi nền sáng; State active: nền sáng glow nhẹ; cursor pointer
- qa:

---

### Item A.2: Logout

- nameJP: ログアウト
- nameTrans: Logout
- itemType: button
- itemSubtype:
- buttonType: icon_text
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Logout ngay (không có confirmation dialog); điều hướng về trang /login
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Mục menu 'Logout' trong dropdown tài khoản để đăng xuất khỏi hệ thống
  Thành phần hiển thị: Label 'Logout'; icon chevron phải
  Chức năng & Logic: Click: logout ngay (không có confirmation dialog) và đóng dropdown; điều hướng về trang /login; Hover: highlight nền
- qa:
