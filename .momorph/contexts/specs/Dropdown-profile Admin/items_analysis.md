# Items Analysis - Dropdown-profile Admin

Screen ID: 54rekaCHG1
Frame Name: Dropdown-profile Admin
Target Language: Vietnamese

## Clarifications (2026-06-28)

- Q: Sau logout Admin điều hướng về trang nào? → A: /login
- Q: Chưa đăng nhập có truy cập các page khác không? → A: Không — auth guard redirect về /login

---

### Item A: mms_A_Dropdown-List

- **nameJP:** ドロップダウンリスト
- **nameTrans:** Dropdown List
- **itemType:** others
- **itemSubtype:** navigation
- **buttonType:**
- **dataType:**
- **format:**
- **required:** false
- **minLength:**
- **maxLength:**
- **defaultValue:**
- **userAction:** on_click
- **transitionNote:** Mở/đóng menu dropdown; click item con sẽ điều hướng hoặc thực hiện action tương ứng rồi đóng menu
- **databaseTable:**
- **databaseColumn:**
- **databaseNote:**
- **validationNote:**
- **description:**
  Mục đích và Ngữ cảnh: Container dropdown menu cho tài khoản Admin, xuất hiện khi click vào avatar/tên người dùng trên header.
  Thành phần hiển thị: Nền tối; 3 mục menu theo thứ tự: Profile (active; icon user), Dashboard (icon grid), Logout (icon mũi tên phải).
  Chức năng & Logic: Click item: thực hiện action tương ứng và đóng menu; Hover item: đổi nền highlight; Click ngoài vùng dropdown: đóng menu.
- **qa:**
  - Trigger mở dropdown là gì — click avatar, click tên, hay cả hai?
  - Click ngoài vùng dropdown có tự đóng không?
  - Dropdown có animation mở/đóng không? Nếu có, kiểu nào (fade, slide)?
  - Trạng thái active của item được xác định theo URL hiện tại hay theo session?

---

### Item A.1: mms_A.1_Profile

- **nameJP:** プロフィール
- **nameTrans:** Profile
- **itemType:** button
- **itemSubtype:**
- **buttonType:** icon_text
- **dataType:**
- **format:**
- **required:** false
- **minLength:**
- **maxLength:**
- **defaultValue:**
- **userAction:** on_click
- **transitionNote:** Đóng dropdown và điều hướng đến trang hồ sơ người dùng
- **databaseTable:**
- **databaseColumn:**
- **databaseNote:**
- **validationNote:**
- **description:**
  Mục đích và Ngữ cảnh: Mục menu 'Profile' trong dropdown Admin, hiển thị ở trạng thái active khi người dùng đang ở trang hồ sơ.
  Thành phần hiển thị: Label 'Profile'; icon người dùng bên phải; nền highlight và hiệu ứng glow khi active.
  Chức năng & Logic: Click: đóng dropdown và điều hướng đến trang Profile; Hover: hiệu ứng nền sáng nhẹ; State active khi route hiện tại là trang Profile.
- **qa:**
  - Route/URL điều hướng đến trang Profile là gì (ví dụ: /profile, /admin/profile)?
  - State active được xác định theo URL hay theo giá trị trong session/store?
  - Icon người dùng dùng thư viện nào và tên icon chính xác?

---

### Item A.2: mms_A.2_Dashboard

- **nameJP:** ダッシュボード
- **nameTrans:** Dashboard
- **itemType:** others
- **itemSubtype:** list_item
- **buttonType:**
- **dataType:**
- **format:**
- **required:** false
- **minLength:**
- **maxLength:**
- **defaultValue:**
- **userAction:** on_click
- **transitionNote:** Đóng dropdown và điều hướng đến trang Admin Dashboard
- **databaseTable:**
- **databaseColumn:**
- **databaseNote:**
- **validationNote:**
- **description:**
  Mục đích và Ngữ cảnh: Mục menu 'Dashboard' trong dropdown profile, dẫn đến trang quản trị Admin Dashboard.
  Thành phần hiển thị: Label 'Dashboard'; icon grid/dots bên phải; trạng thái mặc định không active.
  Chức năng & Logic: Click: đóng dropdown và điều hướng đến Dashboard; Hover: đổi nền highlight nhẹ; không có state active mặc định.
- **qa:**
  - Route/URL điều hướng đến Dashboard là gì (ví dụ: /admin/dashboard)?
  - Icon grid dùng thư viện nào và tên icon chính xác?
  - Item này có hiển thị state active khi người dùng đang ở trang Dashboard không?

---

### Item A.3: mms_A.3_Logout

- **nameJP:** ログアウト
- **nameTrans:** Logout
- **itemType:** button
- **itemSubtype:**
- **buttonType:** icon_text
- **dataType:**
- **format:**
- **required:** false
- **minLength:**
- **maxLength:**
- **defaultValue:**
- **userAction:** on_click
- **transitionNote:** Gọi API logout/đóng session; xóa token; đóng dropdown và điều hướng về trang đăng nhập
- **databaseTable:**
- **databaseColumn:**
- **databaseNote:**
- **validationNote:**
- **description:**
  Mục đích và Ngữ cảnh: Mục menu 'Logout' trong dropdown profile, cho phép Admin đăng xuất khỏi hệ thống.
  Thành phần hiển thị: Label 'Logout'; icon mũi tên phải (chevron) bên phải.
  Chức năng & Logic: Click: gọi API logout hoặc đóng session; xóa access token/cookie; đóng dropdown; chuyển hướng về trang đăng nhập.
- **qa:**
  - Logout API endpoint là gì? Cần xóa cookie/localStorage/token nào?
  - Có hiển thị confirmation dialog trước khi logout không?
  - Sau khi logout, redirect về /login hay trang home?
  - Xử lý lỗi khi API logout thất bại như thế nào?
