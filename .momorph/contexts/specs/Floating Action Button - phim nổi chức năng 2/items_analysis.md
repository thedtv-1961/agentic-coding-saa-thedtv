# Items Analysis - Floating Action Button - phim nổi chức năng 2

Screen ID: Sv7DFwBw1h
File Key: 9ypp4enmFmdK3YAFJLIu6C

---

### Item A: Button thể lệ

- nameJP: 規約ボタン
- nameTrans: Rules Button
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
- transitionNote: Mở drawer bên phải màn hình (frame 3204:6051) với hiệu ứng slide từ phải vào; đóng drawer bằng hiệu ứng slide sang phải
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Button phụ của nhóm FAB cho phép người dùng xem thể lệ SAA dạng drawer bên phải.
  Thành phần Hiển thị: Icon đỏ-đen (thể lệ SAA) bên trái; label 'Thể lệ'; kích thước 149x64px; nền vàng nhạt; bo góc.
  Chức năng & Logic: Click mở drawer từ bên phải màn hình với animation nhanh (slide-in từ phải); đóng bằng slide-out sang phải; có backdrop; đóng khi click ngoài drawer hoặc nhấn Esc; button không có active state khi drawer đang mở.
- qa:

---

### Item B: Button viết kudos

- nameJP: クドス作成ボタン
- nameTrans: Write Kudos Button
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
- transitionNote: Mở màn hình "Viết Kudo" (frame 520:11602)
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Button phụ của nhóm FAB cho phép người dùng soạn và gửi lời khen kudos cho đồng nghiệp.
  Thành phần Hiển thị: Icon và label 'Viết KUDOS'; nền vàng; có shadow.
  Chức năng & Logic: Click mở modal/khung soạn KUDOS; hover tăng bóng nhẹ và đổi độ sáng.
- qa:
  - Mở modal overlay hay điều hướng sang trang mới?
  - Kích thước button (px)?
  - Trạng thái khi người dùng chưa có quyền viết kudos?

---

### Item C: Button hủy

- nameJP: キャンセルボタン
- nameTrans: Cancel Button
- itemType: button
- itemSubtype:
- buttonType: icon_only
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Thu gọn FAB; ẩn 2 sub-button với animation; trả về trạng thái ban đầu (Screen 1)
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Nút nổi tròn chỉ có icon × để đóng nhóm FAB và trở về trạng thái ban đầu.
  Thành phần Hiển thị: Hình tròn 56x56px; màu đỏ; icon '×' trắng ở trung tâm; không có label text; có shadow nhẹ.
  Chức năng & Logic: Click thu gọn FAB với animation; ẩn các sub-button; quay về trạng thái nút nổi ban đầu (Screen 1).
- qa:
  - Chi tiết animation thu gọn FAB (duration; easing)?
  - Nút × chỉ hiển thị khi FAB đang mở?
