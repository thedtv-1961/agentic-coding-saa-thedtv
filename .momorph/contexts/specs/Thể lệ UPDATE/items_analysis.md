# Items Analysis - Thể lệ UPDATE

- Screen ID: b1Filzi9i6
- Frame Name: Thể lệ UPDATE
- Target Language: Tiếng Việt

---

### Item A: A_Nội dung thể lệ

- itemId: 3204:6053
- nameJP: Nội dung thể lệ
- nameTrans: Terms & Conditions Content Panel
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction:
- transitionNote:
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Panel chính hiển thị toàn bộ nội dung thể lệ chương trình SAA 2025 bên trong modal overlay.
  Thành phần hiển thị: Tiêu đề 'Thể lệ'; mô tả chương trình; danh sách 4 cấp huy hiệu Hero (New Hero / Rising Hero / Super Hero / Legend Hero) kèm điều kiện; 6 icon bộ sưu tập (REVIVAL; TOUCH OF LIGHT; STAY GOLD; FLOW TO HORIZON; BEYOND THE BOUNDARY; ROOT FURTHER); thông tin Kudos Quốc Dân; footer nút hành động.
  Chức năng & Logic: Nội dung HTML tĩnh (hardcode); panel chiếm full chiều cao màn hình; cuộn dọc chỉ áp dụng cho vùng nội dung bên trong khi content quá dài (không scroll toàn trang); 6 icon bộ sưu tập là ảnh tĩnh; click 'Đóng' đóng panel; click 'Viết KUDOS' đóng panel này trước rồi mở form nhập.
- qa:

---

### Item B: B_Button

- itemId: 3204:6092
- nameJP: Button
- nameTrans: Action Buttons (Footer Modal)
- itemType: button
- itemSubtype:
- buttonType: icon_text
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction:
- transitionNote:
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Container footer modal chứa hai nút hành động chính của màn hình thể lệ.
  Thành phần hiển thị: Nút 'Đóng' (icon X + text; kiểu secondary/outlined) và nút 'Viết KUDOS' (icon bút + text; kiểu primary màu vàng) đặt cạnh nhau theo hàng ngang.
  Chức năng & Logic: State Hover thay đổi màu/độ nổi của từng nút; nút 'Viết KUDOS' không bao giờ ở trạng thái Disabled; hai nút không block lẫn nhau; responsive mobile ngoài scope.
- qa:

---

### Item B.1: B.1_Button đóng

- itemId: 3204:6093
- nameJP: Button đóng
- nameTrans: Close Button
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
- transitionNote: Đóng modal thể lệ và quay lại nội dung màn hình trước đó
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Nút đóng modal thể lệ; cho phép người dùng thoát khỏi panel mà không thực hiện hành động.
  Thành phần hiển thị: Icon 'X' bên trái và text 'Đóng'; kiểu secondary/outlined.
  Chức năng & Logic: Click đóng modal và quay về trạng thái màn hình trước; focus và scroll position được khôi phục về vị trí cũ; hỗ trợ đóng bằng phím Escape hoặc click ngoài vùng modal; hover kích hoạt hiệu ứng visual thay đổi màu/độ nổi.
- qa:

---

### Item B.2: B.2_Button viết kudos

- itemId: 3204:6094
- nameJP: Button viết kudos
- nameTrans: Write KUDOS Button
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
- transitionNote: Đóng modal thể lệ trước; sau đó mở modal 'Viết Kudo' (linkedFrameId: 520:11602)
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Nút CTA chính dẫn người dùng sang form viết và gửi lời khen Kudos.
  Thành phần hiển thị: Icon bút bên trái và text 'Viết KUDOS'; kiểu primary màu vàng nổi bật so với nút 'Đóng'; nút không bao giờ disabled.
  Chức năng & Logic: Click đóng modal thể lệ trước; sau đó mở modal form 'Viết Kudo' (2 modals không cùng tồn tại); hover kích hoạt hiệu ứng visual.
- qa:
  (Màn hình yêu cầu đăng nhập — người dùng chưa login không thể truy cập màn này)
