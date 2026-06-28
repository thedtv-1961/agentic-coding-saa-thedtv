# Items Analysis - Dropdown list hashtag

## Screen Context
- Screen ID: p9zO-c4a4x
- Frame: Dropdown list hashtag
- Ngôn ngữ target: Tiếng Việt
- Giới hạn chọn: tối đa 5 hashtag

## Clarifications (2026-06-28)

- Q: Dropdown hashtag là inline hay dropdown riêng? → A: Dropdown riêng — click "+ Hashtag" trong modal Viết Kudo mở dropdown này độc lập
- Q: Nguồn dữ liệu ưu tiên? → A: Follow Figma spec — không lấy theo live site

---

### Item A: mms_A_Hashtag đã chọn 1

- **nameJP**: ハッシュタグ選択済み行1
- **nameTrans**: Selected Hashtag Row 1
- **itemType**: others
- **itemSubtype**: list_item
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Toggle trạng thái chọn/bỏ chọn; dấu check (A.2) hiện/ẩn; nền tối ↔ sáng; hover làm nổi nền nhẹ
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Hàng danh sách trong dropdown hiển thị hashtag ở trạng thái đã chọn (selected), là một trong tối đa 5 lựa chọn của người dùng.
  Thành phần hiển thị: Văn bản '#High-perorming' bên trái (A.1); icon dấu check trong vòng tròn bên phải (A.2); nền tối biểu thị trạng thái selected.
  Chức năng & Logic: Click toggle chọn/bỏ chọn hashtag; khi bỏ chọn icon check ẩn và nền chuyển sáng; hover làm nổi bật nền; lặp lại cấu trúc này cho B và C (items đã chọn khác).
- **qa**:
  - Khi bỏ chọn, màu nền row chuyển sang giá trị cụ thể nào?
  - Hiệu ứng hover (hover state) được định nghĩa ra sao — opacity hay màu nền?
  - Khi đã chọn đủ 5, click vào item đã chọn có bỏ chọn được không?

---

### Item A.1: mms_A.1_Hashtag

- **nameJP**: ハッシュタグテキストラベル
- **nameTrans**: Hashtag Text Label
- **itemType**: label
- **itemSubtype**: -
- **buttonType**: -
- **dataType**: string
- **format**: #[text]
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Click toggle chọn/bỏ chọn; khi đủ 5 hashtag đã chọn, các mục chưa chọn bị disable (không thể click)
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**:
  - Condition: Số hashtag đã chọn >= 5
  - Error: Không cho phép chọn thêm hashtag mới (disable các mục chưa chọn)
- **description**:
  Mục đích và Ngữ cảnh: Nhãn văn bản hiển thị tên hashtag với tiền tố '#' trong hàng danh sách dropdown; dữ liệu hashtag được load dynamic từ DB.
  Thành phần hiển thị: Ký tự '#' + tên hashtag từ DB (ví dụ: '#High-perorming'); style khác nhau giữa selected và unselected.
  Chức năng & Logic: Click để toggle chọn/bỏ chọn; khi tổng số lựa chọn đạt 5, các nhãn chưa chọn bị disable (không phản hồi click); danh sách hashtag được lấy dynamic từ database.
- **qa**:
  - Khi disabled (đủ 5), visual style của label thay đổi thế nào (opacity giảm; màu xám)?
  - Thứ tự sắp xếp hashtag trong danh sách được quy định bởi tiêu chí gì (DB order; alphabetical)?
  - Có giới hạn độ dài tên hashtag được hiển thị không (truncate)?

---

### Item A.2: mms_A.2_icon đã chọn

- **nameJP**: 選択済みチェックアイコン
- **nameTrans**: Selected State Check Icon
- **itemType**: others
- **itemSubtype**: icon
- **buttonType**: -
- **dataType**: boolean
- **format**: -
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Click toggle: hiển thị dấu '✓' trong vòng tròn (selected) hoặc ẩn giữ khoảng trống 24x24px (unselected)
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Icon dấu check biểu thị trạng thái 'đã chọn' của mục hashtag trong dropdown; ẩn khi unselected để giữ layout ổn định.
  Thành phần hiển thị: Vòng tròn 24x24px chứa dấu '✓' khi selected; khoảng trống 24x24px (không có icon) khi unselected.
  Chức năng & Logic: Click toggle trạng thái chọn/bỏ chọn của hàng tương ứng; hiển thị/ẩn dấu check phản ánh trạng thái tức thời.
- **qa**:
  - Màu sắc vòng tròn và dấu '✓' khi selected là gì?
  - Icon có transition animation (fade/scale) khi hiển thị/ẩn không?
  - Icon cùng click area với toàn bộ row (A) hay chỉ riêng vùng icon?

---

### Item B: mms_B_Hashtag đã chọn 2

- **nameJP**: ハッシュタグ選択済み行2
- **nameTrans**: Selected Hashtag Row 2
- **itemType**: others
- **itemSubtype**: list_item
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Toggle trạng thái chọn/bỏ chọn; dấu check (B.2) hiện/ẩn; nền tối ↔ sáng; hover làm nổi nền nhẹ
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Hàng danh sách thứ hai trong dropdown hiển thị hashtag đã chọn; cấu trúc và tương tác giống hệt Item A.
  Thành phần hiển thị: Văn bản '#BE PROFESSIONAL' bên trái (B.1); icon dấu check trong vòng tròn bên phải (B.2); nền tối.
  Chức năng & Logic: Giống hệt Item A — click toggle; hover highlight; bỏ chọn làm ẩn check và chuyển nền sáng.
- **qa**:
  - (Xem QA của Item A — cùng logic áp dụng)

---

### Item B.1: mms_B.1_Hashtag

- **nameJP**: ハッシュタグテキストラベル2
- **nameTrans**: Hashtag Text Label 2
- **itemType**: others
- **itemSubtype**: list_item
- **buttonType**: -
- **dataType**: string
- **format**: #[text]
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Giống A.1 — toggle chọn/bỏ chọn; disable khi đủ 5
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**:
  - Condition: Số hashtag đã chọn >= 5
  - Error: Không cho phép chọn thêm (disable)
- **description**:
  Mục đích và Ngữ cảnh: Nhãn văn bản hiển thị '#BE PROFESSIONAL' trong hàng B; cấu trúc và logic giống A.1.
  Thành phần hiển thị: '#BE PROFESSIONAL' với định dạng '#' + tên hashtag.
  Chức năng & Logic: Giống hệt A.1 — click toggle; disable khi đủ 5 lựa chọn.
- **qa**:
  - (Xem QA của Item A.1 — cùng logic áp dụng)

---

### Item B.2: mms_B.2_icon đã chọn

- **nameJP**: 選択済みチェックアイコン2
- **nameTrans**: Selected State Check Icon 2
- **itemType**: others
- **itemSubtype**: icon
- **buttonType**: -
- **dataType**: boolean
- **format**: -
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Giống A.2 — hiển thị/ẩn dấu check khi toggle
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Icon check trạng thái đã chọn cho hàng B; cấu trúc và logic giống hệt A.2.
  Thành phần hiển thị: Vòng tròn 24x24px với '✓' (selected) hoặc khoảng trống (unselected).
  Chức năng & Logic: Giống hệt A.2 — click toggle; hiển thị/ẩn check.
- **qa**:
  - (Xem QA của Item A.2 — cùng logic áp dụng)

---

### Item C: mms_C_Hashtag đã chọn 3

- **nameJP**: ハッシュタグ選択済み行3
- **nameTrans**: Selected Hashtag Row 3
- **itemType**: others
- **itemSubtype**: list_item
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Toggle trạng thái chọn/bỏ chọn; dấu check (C.2) hiện/ẩn; nền tối ↔ sáng; hover làm nổi nền nhẹ
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Hàng danh sách thứ ba trong dropdown hiển thị hashtag đã chọn; cấu trúc và tương tác giống hệt Item A.
  Thành phần hiển thị: Văn bản '#BE OPTIMISTIC' bên trái (C.1); icon dấu check trong vòng tròn bên phải (C.2); nền tối.
  Chức năng & Logic: Giống hệt Item A — click toggle; hover highlight; bỏ chọn làm ẩn check và chuyển nền sáng.
- **qa**:
  - (Xem QA của Item A — cùng logic áp dụng)

---

### Item C.1: mms_C.1_Hashtag

- **nameJP**: ハッシュタグテキストラベル3
- **nameTrans**: Hashtag Text Label 3
- **itemType**: others
- **itemSubtype**: list_item
- **buttonType**: -
- **dataType**: string
- **format**: #[text]
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Giống A.1 — toggle chọn/bỏ chọn; disable khi đủ 5
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**:
  - Condition: Số hashtag đã chọn >= 5
  - Error: Không cho phép chọn thêm (disable)
- **description**:
  Mục đích và Ngữ cảnh: Nhãn văn bản hiển thị '#BE OPTIMISTIC' trong hàng C; cấu trúc và logic giống A.1.
  Thành phần hiển thị: '#BE OPTIMISTIC' với định dạng '#' + tên hashtag.
  Chức năng & Logic: Giống hệt A.1 — click toggle; disable khi đủ 5 lựa chọn.
- **qa**:
  - (Xem QA của Item A.1 — cùng logic áp dụng)

---

### Item C.2: mms_C.2_icon đã chọn

- **nameJP**: 選択済みチェックアイコン3
- **nameTrans**: Selected State Check Icon 3
- **itemType**: others
- **itemSubtype**: icon
- **buttonType**: -
- **dataType**: boolean
- **format**: -
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Giống A.2 — hiển thị/ẩn dấu check khi toggle
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**: -
- **description**:
  Mục đích và Ngữ cảnh: Icon check trạng thái đã chọn cho hàng C; cấu trúc và logic giống hệt A.2 (MoMorph đánh nhầm là button/icon_text — thực tế là icon).
  Thành phần hiển thị: Vòng tròn 24x24px với '✓' (selected) hoặc khoảng trống (unselected).
  Chức năng & Logic: Giống hệt A.2 — click toggle; hiển thị/ẩn check.
- **qa**:
  - (Xem QA của Item A.2 — cùng logic áp dụng)

---

### Item D: mms_D_Hashtag chưa chọn

- **nameJP**: ハッシュタグ未選択行
- **nameTrans**: Unselected Hashtag Row
- **itemType**: others
- **itemSubtype**: list_item
- **buttonType**: -
- **dataType**: -
- **format**: -
- **required**: false
- **minLength**: -
- **maxLength**: -
- **defaultValue**: -
- **userAction**: on_click
- **transitionNote**: Click chọn hashtag — icon check xuất hiện; nền chuyển tối (thành trạng thái selected); hover làm nổi nền nhẹ; bị disable khi đã đủ 5 lựa chọn
- **databaseTable**: -
- **databaseColumn**: -
- **databaseNote**: -
- **validationNote**:
  - Condition: Số hashtag đã chọn >= 5
  - Error: Item bị disable — không phản hồi click
- **description**:
  Mục đích và Ngữ cảnh: Hàng danh sách hiển thị hashtag chưa được chọn (unselected state); đại diện cho tất cả các mục trong danh sách chưa được chọn.
  Thành phần hiển thị: Văn bản '#Be A Team' bên trái (và các hashtag khác như #THINK OUTSIDE THE BOX; #GET RISKY; #GO FAST; #WASSHOI); không hiển thị icon check; nền sáng biểu thị trạng thái chưa chọn.
  Chức năng & Logic: Click để chọn hashtag — row chuyển sang selected state (nền tối; icon check xuất hiện); hover làm nổi bật nền nhẹ; khi tổng số lựa chọn = 5; row bị disable (không phản hồi click).
- **qa**:
  - Khi disabled (đủ 5 hashtag đã chọn); trạng thái visual của row thay đổi ra sao (opacity; màu text)?
  - Có tooltip hoặc thông báo nào giải thích lý do bị disable không?
  - Danh sách unselected có scroll được không; nếu có thì scroll container là gì?
  - Số lượng mục trong danh sách tổng cộng là bao nhiêu (bao gồm cả selected)?
