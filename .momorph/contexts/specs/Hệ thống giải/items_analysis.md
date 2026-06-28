# Items Analysis - Hệ thống giải

## Screen Context
- screenId: zFYDgyj_pD
- name: Hệ thống giải
- targetLanguage: Vietnamese

## Clarifications (2026-06-28)

- Q: Navigation (Item C) có sticky khi scroll không? → A: Có — sidebar cố định, không scroll theo trang
- Q: Active state có cập nhật tự động khi scroll (scroll spy) không? → A: Có — item tự active khi scroll đến vùng tương ứng
- Q: Nguồn dữ liệu ưu tiên? → A: Follow Figma spec — không lấy theo live site

---

### Item 3: Keyvisual
- nameJP: キービジュアル
- nameTrans: Key Visual Banner
- itemType: others
- itemSubtype: hero_banner
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Banner hero hiển thị hình ảnh chiến dịch và tiêu đề trang giải thưởng SAA 2025.
  Các yếu tố hiển thị: Hình nền (1200x871px; cover; center-crop); tiêu đề 'ROOT FURTHER'; phụ đề 'Sun* Annual Award 2025'; logo và biểu tượng góc trên.
  Chức năng & Logic: Chỉ hiển thị; không có hành vi click. Responsive: scale to cover và center-crop.
- qa:
  - Alt text 'Keyvisual Sun* Annual Award 2025' có cần dịch đa ngôn ngữ không?
  - Hành vi responsive trên mobile: chiều cao banner có thay đổi không?

---

### Item A: Title hệ thống giải thưởng
- nameJP: 賞制度タイトル
- nameTrans: Award System Section Title
- itemType: label
- itemSubtype:
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Tiêu đề phần tĩnh giới thiệu mục hệ thống giải thưởng SAA 2025.
  Các yếu tố hiển thị: Phụ đề 'Sun* Annual Awards 2025' (chữ nhỏ; muted); tiêu đề chính 'Hệ thống giải thưởng SAA 2025' (chữ lớn; vàng).
  Chức năng & Logic: Không tương tác; chỉ hiển thị tĩnh.
- qa:
  - Văn bản tiêu đề có cần hỗ trợ đa ngôn ngữ (EN/VI) không?
  - Năm '2025' có được cấu hình động hay hardcode?

---

### Item B: Hệ thống giải thưởng
- nameJP: 賞制度セクション
- nameTrans: Award System Section
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Cuộn mượt đến phần thẻ giải thưởng được chọn.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Container cha chứa toàn bộ danh mục giải thưởng SAA 2025 với điều hướng và thẻ thông tin.
  Các yếu tố hiển thị: Bảng điều hướng trái (C) và các thẻ giải thưởng (D.1–D.6). Mỗi thẻ hiển thị hình ảnh/icon; tiêu đề; mô tả; số lượng; và giá trị giải thưởng.
  Chức năng & Logic: Chỉ đọc. Click kích hoạt cuộn mượt đến phần giải thưởng tương ứng.
- qa:
  - Active state điều hướng có đồng bộ với scroll position (scroll spy) không?
  - Có lazy loading cho thẻ giải thưởng khi cuộn không?

---

### Item C: Menu list
- nameJP: カテゴリナビゲーション
- nameTrans: Award Category Navigation Menu
- itemType: others
- itemSubtype: navigation
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Trạng thái active: màu vàng + gạch chân trên mục được chọn; cuộn đến section tương ứng.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Điều hướng trái liệt kê 6 danh mục giải thưởng để người dùng truy cập nhanh đến từng section.
  Các yếu tố hiển thị: 6 mục: 'Top Talent'; 'Top Project'; 'Top Project Leader'; 'Best Manager'; 'Signature 2025 - Creator'; 'MVP'. Mục active hiển thị màu vàng và gạch chân.
  Chức năng & Logic: Sidebar sticky (position: sticky; không scroll theo trang); click vào mục cuộn trang đến section tương ứng và đặt mục đó ở trạng thái active; scroll spy — active state tự động cập nhật khi người dùng cuộn đến vùng section tương ứng.
- qa:
  - Trên mobile: menu chuyển thành horizontal scroll hay dropdown không?

---

### Item C.1: Top talent (navigation item)
- nameJP: トップタレント（ナビ）
- nameTrans: Top Talent (navigation item)
- itemType: others
- itemSubtype: navigation_item
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Cuộn đến section D.1; đặt C.1 ở trạng thái active.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Mục điều hướng 'Top Talent' trong menu trái cho phép người dùng nhảy đến section giải thưởng Top Talent.
  Các yếu tố hiển thị: Nhãn text 'Top Talent' với icon dẫn đầu trong menu danh mục trái.
  Chức năng & Logic: Click cuộn đến section D.1; đặt C.1 ở trạng thái active (màu vàng + gạch chân).
- qa:
  - Icon dẫn đầu là icon nào? Có thay đổi theo trạng thái active không?

---

### Item C.2: Top project (navigation item)
- nameJP: トッププロジェクト（ナビ）
- nameTrans: Top Project (navigation item)
- itemType: others
- itemSubtype: navigation_item
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Cuộn đến section D.2; đặt C.2 ở trạng thái active.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Mục điều hướng 'Top Project' trong menu trái cho phép người dùng nhảy đến section giải thưởng Top Project.
  Các yếu tố hiển thị: Nhãn text 'Top Project' trong menu danh mục trái.
  Chức năng & Logic: Click cuộn đến section D.2; đặt C.2 ở trạng thái active.
- qa:
  - Có icon dẫn đầu không? Nếu có thì icon gì?

---

### Item C.3: Top Project leader (navigation item)
- nameJP: トッププロジェクトリーダー（ナビ）
- nameTrans: Top Project Leader (navigation item)
- itemType: others
- itemSubtype: navigation_item
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Cuộn đến section D.3; đặt C.3 ở trạng thái active.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Mục điều hướng 'Top Project Leader' trong menu trái cho phép người dùng nhảy đến section tương ứng.
  Các yếu tố hiển thị: Nhãn text 'Top Project Leader' trong menu danh mục trái.
  Chức năng & Logic: Click cuộn đến section D.3; đặt C.3 ở trạng thái active.
- qa:
  - Có icon dẫn đầu không?

---

### Item C.4: Best manager (navigation item)
- nameJP: ベストマネージャー（ナビ）
- nameTrans: Best Manager (navigation item)
- itemType: others
- itemSubtype: navigation_item
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Cuộn đến section D.4; đặt C.4 ở trạng thái active.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Mục điều hướng 'Best Manager' trong menu trái cho phép người dùng nhảy đến section tương ứng.
  Các yếu tố hiển thị: Nhãn text 'Best Manager' trong menu danh mục trái.
  Chức năng & Logic: Click cuộn đến section D.4; đặt C.4 ở trạng thái active.
- qa:
  - Có icon dẫn đầu không?

---

### Item C.5: Signature 2025 (navigation item)
- nameJP: シグネチャー2025（ナビ）
- nameTrans: Signature 2025 - Creator (navigation item)
- itemType: others
- itemSubtype: navigation_item
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Cuộn đến section D.5; đặt C.5 ở trạng thái active.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Mục điều hướng 'Signature 2025 - Creator' trong menu trái cho phép người dùng nhảy đến section tương ứng.
  Các yếu tố hiển thị: Nhãn text 'Signature 2025' trong menu danh mục trái.
  Chức năng & Logic: Click cuộn đến section D.5; đặt C.5 ở trạng thái active.
- qa:
  - Có icon dẫn đầu không?

---

### Item C.6: MVP (navigation item)
- nameJP: MVP（ナビ）
- nameTrans: MVP (navigation item)
- itemType: others
- itemSubtype: navigation_item
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Cuộn đến section D.6; đặt C.6 ở trạng thái active.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Mục điều hướng 'MVP' trong menu trái cho phép người dùng nhảy đến section giải thưởng MVP.
  Các yếu tố hiển thị: Nhãn text 'MVP' trong menu danh mục trái.
  Chức năng & Logic: Click cuộn đến section D.6; đặt C.6 ở trạng thái active.
- qa:
  - Có icon dẫn đầu không?

---

### Item D.1: Top talent (Award Card)
- nameJP: トップタレント賞カード
- nameTrans: Top Talent Award Card
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Thẻ thông tin giải thưởng 'Top Talent' hiển thị chi tiết giải thưởng dành cho nhân tài xuất sắc nhất.
  Các yếu tố hiển thị: Hình ảnh/icon giải thưởng (D.1.1; trái); khối nội dung (D.1.2; phải): tiêu đề 'Top Talent'; đoạn mô tả; số lượng 'Số lượng giải thưởng: 10 Đơn vị'; giá trị 'Giá trị giải thưởng: 7.000.000 VNĐ cho mỗi giải thưởng'.
  Chức năng & Logic: Chỉ đọc; không có tương tác.
- qa:
  - Số lượng và giá trị giải thưởng có được tải từ API/database hay hardcode?
  - Thẻ có trạng thái hover không?
  - Thẻ có link đến trang chi tiết giải thưởng không?

---

### Item D.1.1: Picture-Award
- nameJP: 賞画像
- nameTrans: Award Image
- itemType: others
- itemSubtype: image
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Hình ảnh/đồ họa đại diện giải thưởng trong thẻ Top Talent.
  Các yếu tố hiển thị: Hình ảnh/đồ họa giải thưởng (336x336px); chỉ hiển thị; không tương tác.
  Chức năng & Logic: Decorative display only.
- qa:
  - Kích thước hình ảnh có cố định (336x336px) hay responsive không?
  - Alt text cần được xác định cho accessibility.

---

### Item D.1.2: Content (Top Talent)
- nameJP: トップタレントコンテンツブロック
- nameTrans: Top Talent Content Block
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Khối nội dung bên phải thẻ Top Talent hiển thị thông tin chi tiết về giải thưởng.
  Các yếu tố hiển thị: Icon/đồ họa (trái); tiêu đề 'Top Talent'; đoạn mô tả; 'Số lượng giải thưởng: 10 Đơn vị'; 'Giá trị giải thưởng: 7.000.000 VNĐ cho mỗi giải thưởng'.
  Chức năng & Logic: Chỉ đọc; không tương tác.
- qa:
  - Số lượng (10 Đơn vị) và giá trị (7.000.000 VNĐ) có được tải từ API hay hardcode?

---

### Item D.2: Top Project (Award Card)
- nameJP: トッププロジェクト賞カード
- nameTrans: Top Project Award Card
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Thẻ thông tin giải thưởng 'Top Project' dành cho dự án xuất sắc nhất SAA 2025.
  Các yếu tố hiển thị: Hình ảnh/icon; tiêu đề 'Top Project'; đoạn mô tả; số lượng '02 Tập thể'; giá trị '15.000.000 VNĐ mỗi giải'.
  Chức năng & Logic: Chỉ đọc; không có tương tác.
- qa:
  - Số lượng và giá trị giải thưởng có được tải từ API/database hay hardcode?
  - Thẻ có trạng thái hover/focus không?

---

### Item D.3: Top Project Leader (Award Card)
- nameJP: トッププロジェクトリーダー賞カード
- nameTrans: Top Project Leader Award Card
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Thẻ thông tin giải thưởng 'Top Project Leader' dành cho trưởng dự án xuất sắc nhất.
  Các yếu tố hiển thị: Hình ảnh/icon; tiêu đề 'Top Project Leader'; đoạn mô tả; số lượng '03 Cá nhân'; giá trị '7.000.000 VNĐ'.
  Chức năng & Logic: Chỉ đọc; không có tương tác.
- qa:
  - Số lượng và giá trị giải thưởng có được tải từ API hay hardcode?

---

### Item D.4: Best manager (Award Card)
- nameJP: ベストマネージャー賞カード
- nameTrans: Best Manager Award Card
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Thẻ thông tin giải thưởng 'Best Manager' dành cho quản lý xuất sắc nhất SAA 2025.
  Các yếu tố hiển thị: Hình ảnh/icon; tiêu đề 'Best Manager'; đoạn mô tả; số lượng '01 Cá nhân'; giá trị '10.000.000 VNĐ'.
  Chức năng & Logic: Chỉ đọc; không có tương tác.
- qa:
  - Số lượng và giá trị giải thưởng có được tải từ API hay hardcode?

---

### Item D.5: Signature 2025 (Award Card)
- nameJP: シグネチャー2025クリエイター賞カード
- nameTrans: Signature 2025 - Creator Award Card
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Thẻ thông tin giải thưởng 'Signature 2025 - Creator' dành cho người tạo nội dung sáng tạo xuất sắc.
  Các yếu tố hiển thị: Hình ảnh/icon; tiêu đề 'Signature 2025 - Creator'; đoạn mô tả; số lượng '01'; giá trị '5.000.000 VNĐ (cá nhân)' và '8.000.000 VNĐ (tập thể)'.
  Chức năng & Logic: Chỉ đọc; không có tương tác.
- qa:
  - Giải thưởng có 2 mức giá trị (cá nhân/tập thể) — hiển thị 2 giá trị như thế nào trên UI?
  - Số lượng và giá trị có được tải từ API hay hardcode?

---

### Item D.6: MVP (Award Card)
- nameJP: MVP賞カード
- nameTrans: MVP Award Card
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
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
  Mục đích và Bối cảnh: Thẻ thông tin giải thưởng 'MVP (Most Valuable Person)' dành cho người có giá trị đóng góp lớn nhất.
  Các yếu tố hiển thị: Hình ảnh/icon; tiêu đề 'MVP (Most Valuable Person)'; đoạn mô tả; số lượng '01'; giá trị '15.000.000 VNĐ'.
  Chức năng & Logic: Chỉ đọc; không có tương tác.
- qa:
  - Số lượng và giá trị giải thưởng có được tải từ API hay hardcode?

---

### Item D1: Sunkudos
- nameJP: サンクドスブロック
- nameTrans: Sun* Kudos Recognition Program Block
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang chi tiết Sun* Kudos khi click nút.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Khối quảng bá chương trình ghi nhận 'Sun* Kudos' ở cuối trang hệ thống giải thưởng.
  Các yếu tố hiển thị: Nhãn 'Phong trào ghi nhận'; tiêu đề 'Sun* Kudos'; đoạn mô tả; hình ảnh/logo minh họa (phải); nút CTA 'Chi tiết'.
  Chức năng & Logic: Click vào nút 'Chi tiết' điều hướng đến trang chi tiết Sun* Kudos.
- qa:
  - URL hoặc route đích khi click 'Chi tiết' là gì?
  - Trang Sun* Kudos mở ở tab mới hay tab hiện tại?

---

### Item D2: Content (Sun* Kudos)
- nameJP: サンクドスコンテンツブロック
- nameTrans: Sun* Kudos Content Block
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang Sun* Kudos khi click.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Khối nội dung trong section Sun* Kudos hiển thị thông tin chương trình ghi nhận.
  Các yếu tố hiển thị: Tiêu đề 'Phong trào ghi nhận' và 'Sun* Kudos'; đoạn mô tả; hình ảnh/logo minh họa (phải); nút CTA 'Chi tiết' (D2.1).
  Chức năng & Logic: Click điều hướng đến trang Sun* Kudos.
- qa:
  - Nội dung khối có thể được cập nhật động từ CMS không?

---

### Item D2.1: Button chi tiết
- nameJP: 詳細ボタン
- nameTrans: Detail Button
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Mở trang/tab Sun* Kudos.
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích và Bối cảnh: Nút text-link 'Chi tiết' trong khối Sun* Kudos cho phép người dùng xem thêm thông tin về chương trình.
  Các yếu tố hiển thị: Nút text-link với nhãn 'Chi tiết' trong khối nội dung Sun* Kudos.
  Chức năng & Logic: Click mở trang/tab Sun* Kudos.
- qa:
  - Mở ở tab mới hay tab hiện tại?
  - Có trạng thái hover/focus/disabled không?

---

### Item 7.4: (draft)
- nameJP:
- nameTrans:
- itemType:
- itemSubtype:
- buttonType:
- dataType:
- format:
- required:
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
- qa:
