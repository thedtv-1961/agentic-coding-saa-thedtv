# Items Analysis - Countdown - Prelaunch page

Screen ID: 8PJQswPZmU
File Key: 9ypp4enmFmdK3YAFJLIu6C
Target Language: Vietnamese

---

### Item 0.1: Background Image

- **nameJP**: バックグラウンドイメージ
- **nameTrans**: Background Image
- **itemType**: others
- **itemSubtype**: background
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
  Mục đích và Ngữ cảnh: Hình nền toàn màn hình cho trang đếm ngược prelaunch.
  Thành phần hiển thị: Nền tối với họa tiết hữu cơ nhiều màu sắc (đỏ, xanh lá, xanh dương, vàng nâu) trải dài toàn viewport; lớp phủ bán trong suốt màu tối giúp tăng độ tương phản cho văn bản.
  Chức năng & Logic: Hiển thị tĩnh; không có tương tác. Chế độ hiển thị: cover; no-repeat.
- **qa**: -

---

### Item 0.2: Countdown Title

- **nameJP**: カウントダウンタイトル
- **nameTrans**: Countdown Title
- **itemType**: label
- **itemSubtype**: -
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: Sự kiện sẽ bắt đầu sau
- **userAction**: -
- **transitionNote**: -
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Nhãn tiêu đề tĩnh hiển thị phía trên các khối đếm ngược.
  Thành phần hiển thị: Văn bản "Sự kiện sẽ bắt đầu sau"; căn giữa; màu trắng; cỡ chữ trung bình.
  Chức năng & Logic: Không có tương tác; nội dung cố định.
- **qa**:
  - Nội dung văn bản có thể cấu hình hay cố định?
  - Có hỗ trợ đa ngôn ngữ (i18n) cho tiêu đề này không?

---

### Item 1: Days

- **nameJP**: 日数カウントダウン
- **nameTrans**: Days Countdown Unit
- **itemType**: others
- **itemSubtype**: info_block
- **buttonType**: -
- **dataType**: integer
- **format**: 2-digit zero-padded (00–99)
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: 00
- **userAction**: after_delay
- **transitionNote**: Giá trị tự động cập nhật mỗi giây qua bộ đếm ngược JavaScript.
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Khối đếm ngược hiển thị số ngày còn lại đến sự kiện.
  Thành phần hiển thị: Hai hộp chữ số kiểu LED; nhãn "DAYS" màu trắng in hoa bên dưới các chữ số.
  Chức năng & Logic: Tự động cập nhật qua bộ đếm ngược JavaScript; hiển thị "00" khi còn dưới 1 ngày.
- **qa**:
  - Thời điểm mục tiêu (target datetime) được lấy từ đâu (API, config, hardcode)?
  - Khi countdown về 0 tất cả, trang có chuyển hướng hoặc hiện thông báo không?
  - Có hỗ trợ seconds không (hiện tại chỉ thấy days/hours/minutes)?

---

### Item 2: Hours

- **nameJP**: 時間カウントダウン
- **nameTrans**: Hours Countdown Unit
- **itemType**: others
- **itemSubtype**: info_block
- **buttonType**: -
- **dataType**: integer
- **format**: 2-digit zero-padded (00–23)
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: 00
- **userAction**: after_delay
- **transitionNote**: Giá trị tự động cập nhật mỗi giây qua bộ đếm ngược JavaScript.
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: Phạm vi: 00–23
- **description**:
  Mục đích và Ngữ cảnh: Khối đếm ngược hiển thị số giờ còn lại trong ngày hiện tại.
  Thành phần hiển thị: Hai hộp chữ số kiểu LED; nhãn "HOURS" màu trắng in hoa bên dưới.
  Chức năng & Logic: Tự động cập nhật; phạm vi hợp lệ 00–23.
- **qa**:
  - Timezone nào được sử dụng để tính giờ còn lại?

---

### Item 3: Minutes

- **nameJP**: 分カウントダウン
- **nameTrans**: Minutes Countdown Unit
- **itemType**: others
- **itemSubtype**: info_block
- **buttonType**: -
- **dataType**: integer
- **format**: 2-digit zero-padded (00–59)
- **required**: -
- **minLength**: -
- **maxLength**: -
- **defaultValue**: 00
- **userAction**: after_delay
- **transitionNote**: Giá trị tự động cập nhật mỗi giây qua bộ đếm ngược JavaScript.
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: Phạm vi: 00–59
- **description**:
  Mục đích và Ngữ cảnh: Khối đếm ngược hiển thị số phút còn lại trong giờ hiện tại.
  Thành phần hiển thị: Hai hộp chữ số kiểu LED; nhãn "MINUTES" màu trắng in hoa bên dưới.
  Chức năng & Logic: Tự động cập nhật; phạm vi hợp lệ 00–59.
- **qa**:
  - Interval cập nhật là bao nhiêu giây (mỗi giây hay mỗi phút)?
