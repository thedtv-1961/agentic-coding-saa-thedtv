# Items Analysis - Login

## Screen Context

- **Screen**: Login | screenId: GzbNeVGJHz
- **Overview**: Màn hình đăng nhập SAA 2025 với hero visual, header chọn ngôn ngữ, nút đăng nhập Google và footer bản quyền.
- **targetLanguage**: Vietnamese

---

### Item 1: mms_A_Header — Header

- **nameJP**: ヘッダー
- **nameTrans**: Header
- **itemType**: others
- **itemSubtype**: navigation_bar
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: -
- **transitionNote**: -
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và ngữ cảnh: Thanh điều hướng fixed/sticky ở đầu trang màn hình đăng nhập SAA 2025.
  Thành phần hiển thị: Logo Sun* Annual Awards 2025 ở góc trái; bộ chọn ngôn ngữ (VN) ở góc phải.
  Chức năng và logic: Container bố cục fixed (sticky) chứa logo và bộ chọn ngôn ngữ; không có tương tác trực tiếp ở cấp container.
- **qa**:
  - ~~Header có fixed/sticky khi scroll trang không?~~ → **Đã xác nhận: fixed/sticky.**
  - ~~Background header là transparent hay solid?~~ → **Đã xác nhận: transparent.**

---

### Item 1.1: mms_A.1_Logo — Brand Logo

- **nameJP**: ブランドロゴ
- **nameTrans**: Brand Logo
- **itemType**: others
- **itemSubtype**: image
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: -
- **transitionNote**: -
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và ngữ cảnh: Logo nhận diện thương hiệu Sun* Annual Awards 2025 ở góc trên bên trái header.
  Thành phần hiển thị: Hình ảnh logo Sun* Annual Awards 2025.
  Chức năng và logic: Hiển thị tĩnh; chưa rõ có điều hướng khi click không.
- **qa**:
  - Click vào logo có điều hướng về trang chủ không?
  - Logo có phiên bản responsive/mobile khác không?

---

### Item 1.2: mms_A.2_Language — Language Selector

- **nameJP**: 言語選択
- **nameTrans**: Language Selector
- **itemType**: dropdown
- **itemSubtype**: -
- **buttonType**: -
- **dataType**: string
- **format**: ISO 639-1 language code (e.g. VN; EN)
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: VN
- **userAction**: on_click
- **transitionNote**: Hiển thị dropdown danh sách ngôn ngữ để người dùng chọn; cập nhật giao diện toàn trang theo ngôn ngữ đã chọn.
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và ngữ cảnh: Cho phép người dùng chuyển đổi ngôn ngữ giao diện trước khi đăng nhập.
  Thành phần hiển thị: Cờ Việt Nam + nhãn "VN" + mũi tên dropdown; hiện đang chọn tiếng Việt (VN).
  Chức năng và logic: Khi click hiển thị menu chọn ngôn ngữ; sau khi chọn cập nhật toàn bộ nội dung UI sang ngôn ngữ tương ứng.
- **qa**:
  - ~~Danh sách ngôn ngữ hỗ trợ gồm những ngôn ngữ nào?~~ → **Đã xác nhận: Tiếng Việt (VN) và Tiếng Anh (EN). Spec chi tiết sẽ cung cấp sau.**
  - ~~Lựa chọn ngôn ngữ có được lưu vào localStorage/cookie không?~~ → **Đã xác nhận: Lưu vào cookie (`NEXT_LOCALE`).**
  - ~~Sau khi chọn ngôn ngữ mới có reload trang hay update dynamic không?~~ → **Đã xác nhận: full page reload.**

---

### Item 2: mms_B_Bìa — Main Login Section

- **nameJP**: メインログインセクション
- **nameTrans**: Main Login Section
- **itemType**: others
- **itemSubtype**: section
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: -
- **transitionNote**: -
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và ngữ cảnh: Khu vực nội dung chính chiếm toàn bộ không gian giữa header và footer của màn hình đăng nhập.
  Thành phần hiển thị: Hero visual (sóng màu trừu tượng) làm nền phủ toàn bộ; khối nội dung giới thiệu và nút đăng nhập ở phía trái.
  Chức năng và logic: Container bố cục; không có tương tác trực tiếp ở cấp này.
- **qa**:
  - Layout có responsive trên tablet/mobile không? Vị trí khối nội dung thay đổi như thế nào?

---

### Item 2.1: mms_B.1_Key Visual — Hero Visual

- **nameJP**: ヒービジュアル
- **nameTrans**: Hero Visual
- **itemType**: file_or_image
- **itemSubtype**: -
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: -
- **transitionNote**: -
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và ngữ cảnh: Hình ảnh hero trang trí tạo nhận diện thị giác cho trang đăng nhập SAA 2025.
  Thành phần hiển thị: Hình ảnh trừu tượng với các dải sóng màu rực rỡ (vàng; cam; xanh lá; xanh dương; tím) trên nền tối; phủ bên phải và một phần trên của màn hình.
  Chức năng và logic: Hiển thị tĩnh trang trí; không có tương tác người dùng.
- **qa**:
  - Hero image responsive như thế nào trên mobile/tablet? Crop theo tỉ lệ nào?
  - Định dạng file hỗ trợ (PNG/WebP/AVIF)?

---

### Item 2.2: mms_Frame 550 — Introduction Content Block

- **nameJP**: 紹介コンテンツブロック
- **nameTrans**: Introduction Content Block
- **itemType**: others
- **itemSubtype**: content_block
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: -
- **transitionNote**: -
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và ngữ cảnh: Khối nội dung giới thiệu chương trình SAA 2025 nằm phía bên trái trên hero section.
  Thành phần hiển thị: Tiêu đề lớn "ROOT FURTHER"; subtitle "Bắt đầu hành trình của bạn cùng SAA 2025."; tagline "Đăng nhập để khám phá!"; nút đăng nhập Google (item 2.2.1).
  Chức năng và logic: Container tĩnh chứa text giới thiệu và nút đăng nhập; không có tương tác trực tiếp ở cấp container.
- **qa**:
  - Nội dung text (tiêu đề; subtitle; tagline) có được quản lý qua i18n không?
  - Trên mobile text "ROOT FURTHER" có thu nhỏ hoặc xuống dòng không?

---

### Item 2.2.1: mms_B.3_Login — Login with Google Button

- **nameJP**: Googleログインボタン
- **nameTrans**: Login with Google Button
- **itemType**: button
- **itemSubtype**: -
- **buttonType**: icon_text
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Kích hoạt luồng xác thực Google OAuth; chuyển hướng đến trang Google sign-in; sau khi xác thực thành công redirect về `/todo`.
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**:
  Condition: Xác thực Google thất bại hoặc người dùng hủy
  Error: "Đăng nhập không thành công. Vui lòng thử lại."
- **description**:
  Mục đích và ngữ cảnh: Nút duy nhất để đăng nhập vào ứng dụng SAA 2025 thông qua tài khoản Google.
  Thành phần hiển thị: Nút màu vàng nhạt với biểu tượng Google và text "LOGIN With Google"; font đậm.
  Chức năng và logic: Khi nhấn khởi động Google OAuth flow; hiển thị trạng thái loading trong khi chờ; sau xác thực thành công redirect vào ứng dụng.
- **qa**:
  - ~~Tài khoản Google nào được phép đăng nhập?~~ → **Đã xác nhận: Tất cả tài khoản Google.**
  - ~~URL redirect sau đăng nhập thành công là gì?~~ → **Đã xác nhận: `/todo`.**
  - ~~Loading state trong khi chờ Google OAuth phản hồi như thế nào?~~ → **Đã xác nhận: hiển thị spinner, disable button.**
  - ~~Nếu popup bị block có fallback redirect flow không?~~ → **Đã xác nhận: dùng redirect flow (không phải popup) — popup blocker không ảnh hưởng.**

---

### Item 3: mms_D_Footer — Footer

- **nameJP**: フッター
- **nameTrans**: Footer
- **itemType**: others
- **itemSubtype**: -
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: -
- **transitionNote**: -
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và ngữ cảnh: Thanh chân trang hiển thị thông tin bản quyền của ứng dụng SAA 2025.
  Thành phần hiển thị: Text "Bản quyền thuộc về Sun* © 2025" căn giữa trên nền tối.
  Chức năng và logic: Hiển thị tĩnh; không có tương tác người dùng.
- **qa**:
  - Năm trong thông tin bản quyền có tự động cập nhật theo năm hiện tại không?
