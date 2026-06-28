# Items Analysis - Floating Action Button - phim nổi chức năng

Screen ID: _hphd32jN2
File Key: 9ypp4enmFmdK3YAFJLIu6C

---

### Item A: Widget Button

- nameJP: ウィジェットボタン
- nameTrans: Floating Widget Button
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
- transitionNote: Vị trí fixed; click hiển thị 2 sub-button (thể lệ và viết kudos) với animation; click icon × thu lại về trạng thái ban đầu
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Nút nổi cố định (fixed) cho phép người dùng thực hiện hành động nhanh trên màn hình.
  Thành phần Hiển thị: Icon cây bút (viết kudos) + ký tự '/' + icon đỏ-đen (thể lệ SAA) trên nền viên vàng (41x32px); có hiệu ứng bóng khi hover.
  Chức năng & Logic: Mặc định thu gọn khi vào màn hình; click mở 2 sub-button với animation nhanh; click icon × thu gọn về trạng thái ban đầu.
- qa:

---

### Item A.1: icon viết kudos

- nameJP: クドス作成アイコン
- nameTrans: Write Kudos Icon
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
- transitionNote: Điều hướng đến màn hình "Floating Action Button - phim nổi chức năng 2"
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Nút icon con trong bộ floating action button cho phép viết kudos.
  Thành phần Hiển thị: Hiển thị icon viết kudos bên trong nút nổi Widget Button.
  Chức năng & Logic: Click chuyển sang màn hình "phim nổi chức năng 2" để viết kudos.
- qa:
  - Icon cụ thể nào được dùng cho 'viết kudos'?
  - Nút này có label text bên cạnh icon không?
  - Trạng thái disabled khi nào?

---

### Item A.2: icon thể lệ saa

- nameJP: SAA規約アイコン
- nameTrans: SAA Rules Icon
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
- transitionNote: Điều hướng đến màn hình "Floating Action Button - phim nổi chức năng 2"
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Ngữ cảnh: Nút icon con trong bộ floating action button cho phép xem thể lệ SAA.
  Thành phần Hiển thị: Hiển thị icon thể lệ SAA bên trong nút nổi; tương tự mms_C.2_icon đã chọn.
  Chức năng & Logic: Click chuyển sang màn hình "phim nổi chức năng 2" để xem thể lệ SAA.
- qa:
  - Icon cụ thể nào được dùng cho 'thể lệ SAA'?
  - Nút này có label text bên cạnh icon không?
  - Trạng thái khi đang ở trang thể lệ (active state)?
