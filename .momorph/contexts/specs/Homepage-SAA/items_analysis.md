# Items Analysis - Homepage SAA

Screen: Homepage SAA | Screen ID: i87tDx10uM | targetLanguage: Vietnamese

---

### Item 3.5 (no id): Keyvisual — Banner chính

- nameJP: キービジュアル
- nameTrans: Keyvisual - Main Banner
- itemType: others
- itemSubtype: hero
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
  Mục đích: Banner chính trang chủ giới thiệu chủ đề 'ROOT FURTHER' và đồng hồ đếm ngược sự kiện SAA 2025.
  Hiển thị: Tiêu đề lớn 'ROOT FURTHER'; nhãn 'Coming soon'; đồng hồ đếm ngược (DAYS/HOURS/MINUTES); thông tin sự kiện (thời gian; địa điểm); 2 nút CTA; hình nền họa tiết rễ cây.
  Chức năng: Click 'ABOUT AWARDS' → trang Awards Information; Click 'ABOUT KUDOS' → trang Sun* Kudos; đồng hồ cập nhật realtime theo phút; responsive: co/xếp chồng trên mobile.
- qa:
  - Thời gian sự kiện được cấu hình từ đâu (env var, CMS, DB)?
  - Khi đồng hồ về 0, toàn bộ hero section thay đổi như thế nào (ẩn Coming soon, hiện gì thêm)?
  - Responsive: trên mobile layout hero có đặc biệt gì so với desktop?

---

### Item 3.5 (2167:9027): mms_3.5_Keyvisual — Hình nền Keyvisual (hero)

- nameJP: キービジュアル背景
- nameTrans: Keyvisual BG
- itemType: others
- itemSubtype: background
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
  Mục đích: Ảnh nền toàn màn hình khu vực hero của trang chủ.
  Hiển thị: Nền tối trang trí với họa tiết rễ hữu cơ và branding sự kiện; phủ toàn chiều rộng hero section; overlay tối bán trong suốt để tăng khả năng đọc text.
  Chức năng: Hiển thị tĩnh, không tương tác; responsive chế độ cover, giữ tỉ lệ khung hình.
- qa:
  - Ảnh nền được lưu ở đâu (static asset, CMS, Supabase Storage)?
  - Có phiên bản ảnh khác nhau cho mobile/desktop không?

---

### Item 6: Widget Button — Nút hành động nhanh

- nameJP: ウィジェットボタン
- nameTrans: Widget Button (Quick Action)
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
- transitionNote: Mở menu các tùy chọn hành động nhanh
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút hành động nhanh cố định góc phải dưới màn hình, luôn hiển thị khi cuộn trang.
  Hiển thị: Pill 105x64px nền vàng bo tròn; icon bút chì bên trái; icon SAA bên phải; ký tự '/' phân cách.
  Chức năng: Click → mở menu các option hành động nhanh; vị trí fixed, z-index cao nhất.
- qa:
  - Menu hành động nhanh gồm những option nào?
  - Nút này hiển thị cho mọi role hay chỉ một số role nhất định?

---

### Item 7: Footer — Chân trang

- nameJP: フッター
- nameTrans: Footer
- itemType: others
- itemSubtype: navigation
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
  Mục đích: Thanh footer cuối trang chứa logo, liên kết điều hướng và thông tin bản quyền.
  Hiển thị: Logo SAA (trái); links 'About SAA 2025', 'Awards Information', 'Sun* Kudos' (giữa); bản quyền 'Bản quyền thuộc về Sun* © 2025' (phải).
  Chức năng: Click link → trang tương ứng; Click logo → đầu trang chủ; hover/active/normal state tương tự header.
- qa:
  - Text bản quyền có cập nhật theo năm tự động không?

---

### Item 7.1: LOGO — Logo Sun* Annual Awards (Footer)

- nameJP: ロゴ
- nameTrans: Logo Sun* Annual Awards
- itemType: others
- itemSubtype: logo
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Scroll lên đầu trang chủ
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Logo thương hiệu Sun* SAA trong footer (69x64px).
  Hiển thị: Biểu tượng Sun* SAA.
  Chức năng: Click → scroll lên đầu trang chủ; tương tự A1.1.
- qa:

---

### Item 7.2: Button-IC — Nút 'About SAA 2025' (Footer)

- nameJP: アバウトSAAボタン
- nameTrans: About SAA 2025 Button (Footer)
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang About SAA 2025
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Link điều hướng đến trang About SAA 2025 trong footer.
  Hiển thị: Text link 'About SAA 2025'.
  Chức năng: Click → trang About SAA 2025; tương tự A1.2.
- qa:

---

### Item 7.3: Button-IC — Nút 'Awards Information' (Footer)

- nameJP: アワード情報ボタン
- nameTrans: Awards Information Button (Footer)
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang Awards Information
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Link điều hướng đến trang Awards Information trong footer.
  Hiển thị: Text link 'Awards Information'.
  Chức năng: Click → trang Awards Information; tương tự A1.3.
- qa:

---

### Item 7.4: Button-IC — Nút Sun* Kudos (Footer)

- nameJP: サンクドスボタン
- nameTrans: Sun* Kudos Button (Footer)
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang Sun* Kudos
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Link điều hướng đến trang Sun* Kudos trong footer.
  Hiển thị: Text link 'Sun* Kudos'.
  Chức năng: Click → trang Sun* Kudos; tương tự A1.5.
- qa:

---

### Item 7.5: Button-IC — Nút Tiêu chuẩn chung (Footer)

- nameJP: 共通基準ボタン
- nameTrans: Common Standards Button (Footer)
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang Tiêu chuẩn chung
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Link điều hướng đến trang Tiêu chuẩn chung trong footer.
  Hiển thị: Text link 'Tiêu chuẩn chung'.
  Chức năng: Click → trang Tiêu chuẩn chung.
- qa:
  - Trang 'Tiêu chuẩn chung' tồn tại riêng hay chỉ là anchor trong một trang khác?

---

### Item A1 (no id): Header — Thanh Header (Điều hướng chính)

- nameJP: ヘッダー
- nameTrans: Header (Main Navigation)
- itemType: others
- itemSubtype: navigation
- buttonType:
- dataType:
- format:
- required: true
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
  Mục đích: Header điều hướng chính gồm logo, các link và icon chức năng, cố định trên đầu trang.
  Hiển thị: Logo (trái); links 'About SAA 2025', 'Awards Information', 'Sun* Kudos'; bell, 'VI', user icon (phải).
  Chức năng: Click logo → trang chủ; Click link → trang/section tương ứng; active → đổi màu + underline; hover → highlight; Click VN/bell/avatar → mở menu tương ứng.
- qa:
  - Header có sticky/fixed khi cuộn không?
  - Trên mobile header collapse thành hamburger menu không?

---

### Item A1 (I2167:9091;186:2166): mms_A1_Header — Header component

- nameJP: ヘッダーコンポーネント
- nameTrans: Header Navigation Component
- itemType: others
- itemSubtype: navigation
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
  Mục đích: Instance component header điều hướng hiển thị trạng thái: selected (About SAA 2025); hover (Awards Information); normal (Sun* Kudos).
  Hiển thị: Logo SAA (trái); Nav links với 3 states khác nhau; Notification bell; Language 'VN'; User profile icon (phải); nền tối bán trong suốt.
  Chức năng: Xem chi tiết từ A1.1 đến A1.8; vị trí sticky/fixed trên cùng viewport.
- qa:

---

### Item A1.1: LOGO — Logo trang chủ (Header)

- nameJP: ロゴ
- nameTrans: Home Logo
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
- transitionNote: Scroll lên đầu trang About SAA 2025
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Logo thương hiệu Sun* SAA trong header để điều hướng về trang chủ.
  Hiển thị: Biểu tượng Sun* SAA 64x60px với alt text.
  Chức năng: Click → scroll về đầu trang chủ (About SAA 2025).
- qa:

---

### Item A1.2: Button-Selected state — Nút 'About SAA 2025' (đang chọn)

- nameJP: About SAA 2025 ボタン（選択中）
- nameTrans: About SAA 2025 Button (Selected)
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Scroll lên đầu trang About SAA 2025 nếu đang selected; điều hướng đến trang nếu chưa selected
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút menu 'About SAA 2025' trong header, đang ở trạng thái selected.
  Hiển thị: Text 'About SAA 2025' với màu vàng/underline khi selected; highlight khi hover; text thông thường khi normal.
  Chức năng: Click khi selected → scroll lên đầu trang; Click khi không selected → điều hướng đến trang About SAA 2025; hover → highlight.
- qa:
  - Active state được xác định bằng route matching hay manual control?

---

### Item A1.3: Button Hover State — Nút 'Awards Information' (hover)

- nameJP: Awards Information ボタン（ホバー）
- nameTrans: Awards Information Button (Hover State)
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang Awards Information
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút menu 'Awards Information' trong header, minh họa trạng thái hover.
  Hiển thị: Nền sáng highlight khi hover; màu vàng/underline khi selected; text thông thường khi normal.
  Chức năng: Click → Awards Information; hover → highlight; selected → scroll lên đầu trang.
- qa:

---

### Item A1.5: Button-Normal state — Nút 'Sun* Kudos'

- nameJP: Sun* Kudos ボタン（通常）
- nameTrans: Sun* Kudos Button (Normal)
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Điều hướng đến trang Sun* Kudos
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút menu 'Sun* Kudos' trong header, trạng thái bình thường.
  Hiển thị: Text thông thường khi normal; highlight khi hover; màu vàng/underline khi selected.
  Chức năng: Click → Sun* Kudos; hover → highlight; selected → scroll đầu trang.
- qa:

---

### Item A1.6: Notification — Nút Thông báo

- nameJP: 通知ボタン
- nameTrans: Notification Button
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
- transitionNote: Mở panel thông báo
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút icon thông báo 40x40px để mở panel thông báo.
  Hiển thị: Icon chuông; badge đỏ khi có thông báo chưa đọc; state enabled/disabled.
  Chức năng: Click → mở panel thông báo; badge hiển thị số lượng chưa đọc.
- qa:
  - Badge số lượng có giới hạn hiển thị không (vd: 99+)?
  - Panel thông báo là dropdown, modal hay slide-out?

---

### Item A1.7: Language — Nút chọn ngôn ngữ

- nameJP: 言語選択ボタン
- nameTrans: Language Switcher Button
- itemType: button
- itemSubtype:
- buttonType: icon_text
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue: VN
- userAction: on_click
- transitionNote: Mở menu chọn ngôn ngữ và reload giao diện theo ngôn ngữ được chọn
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút hiển thị ngôn ngữ hiện tại và cho phép chuyển đổi ngôn ngữ.
  Hiển thị: Label ngôn ngữ hiện tại 'VN' kèm icon cờ.
  Chức năng: Click → mở menu chọn ngôn ngữ; chọn VN/EN → đổi toàn bộ giao diện.
- qa:
  - Ngôn ngữ được lưu vào đâu (cookie, localStorage, session)?

---

### Item A1.8: Button-IC — Nút tài khoản

- nameJP: アカウントアイコンボタン
- nameTrans: Account Icon Button
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
- transitionNote: Mở dropdown menu tài khoản (Dropdown-profile)
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút icon 40x40px góc trên phải để truy cập menu tài khoản.
  Hiển thị: Icon user avatar.
  Chức năng: Click → mở dropdown menu tài khoản với option Profile/Sign out/Admin Dashboard (riêng role admin).
- qa:
  - Khi chưa đăng nhập nút này hiển thị gì?
  - Admin Dashboard option chỉ hiện với role admin — logic phân quyền ở đâu?

---

### Item B1: Countdown time — Section đếm ngược thời gian

- nameJP: カウントダウン セクション
- nameTrans: Countdown Time Section
- itemType: others
- itemSubtype: countdown
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
  Mục đích: Section hiển thị đồng hồ đếm ngược đến thời điểm sự kiện SAA 2025, kèm thông tin sự kiện. Thời điểm sự kiện cấu hình qua biến môi trường (ISO-8601).
  Hiển thị: Label 'Coming soon'; 3 nhóm số (Days/Hours/Minutes), mỗi nhóm 2 chữ số; nhãn đơn vị tương ứng.
  Chức năng: Tự cập nhật theo thời gian thực (theo phút); khi về 0 ẩn 'Coming soon' và giữ trạng thái 00.
- qa:
  - Thời điểm sự kiện đọc từ env var hay API?
  - Sau khi về 0, toàn bộ section thay đổi giao diện hay chỉ ẩn nhãn 'Coming soon'?

---

### Item B1.2: Coming soon — Nhãn Coming soon

- nameJP: カミングスーンラベル
- nameTrans: Coming Soon Label
- itemType: label
- itemSubtype:
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
  Mục đích: Nhãn 'Coming soon' hiển thị dưới tiêu đề, thông báo sự kiện chưa bắt đầu.
  Hiển thị: Text label, không có tương tác.
  Chức năng: Bị ẩn khi thời gian vượt quá mốc thời điểm sự kiện bắt đầu.
- qa:

---

### Item B1.3: Countdown — Đồng hồ đếm ngược

- nameJP: カウントダウン時計
- nameTrans: Countdown Clock
- itemType: others
- itemSubtype: countdown
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
  Mục đích: Component đồng hồ đếm ngược hiển thị thời gian còn lại đến sự kiện.
  Hiển thị: 3 nhóm số (2 chữ số/nhóm), nhãn DAYS/HOURS/MINUTES phía dưới.
  Chức năng: Tự giảm và cập nhật theo thời gian; luôn hiển thị 2 chữ số (zero-pad); khi về 0 ẩn 'Coming soon' và giữ 00.
- qa:

---

### Item B1.3.1: Ngày — Ô Days

- nameJP: 日数表示
- nameTrans: Days Display Tile
- itemType: others
- itemSubtype: countdown_tile
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
  Mục đích: Ô hiển thị số ngày còn lại trong bộ đếm ngược.
  Hiển thị: 2 chữ số số ngày còn lại; nhãn 'DAYS'.
  Chức năng: Tự cập nhật khi thời gian giảm (theo phút).
- qa:

---

### Item B1.3.2: Hours — Ô Hours

- nameJP: 時間表示
- nameTrans: Hours Display Unit
- itemType: others
- itemSubtype: countdown_unit
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
  Mục đích: Ô hiển thị số giờ còn lại trong bộ đếm ngược.
  Hiển thị: 2 chữ số số giờ còn lại; nhãn 'HOURS'.
  Chức năng: Tự cập nhật khi thời gian giảm (theo phút).
- qa:

---

### Item B1.3.3: Minutes — Ô Minutes

- nameJP: 分表示
- nameTrans: Minutes Display Unit
- itemType: others
- itemSubtype: countdown_unit
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
  Mục đích: Ô hiển thị số phút còn lại trong bộ đếm ngược.
  Hiển thị: 2 chữ số số phút còn lại; nhãn 'MINUTES'.
  Chức năng: Tự cập nhật khi thời gian giảm (theo phút).
- qa:

---

### Item B2: Thông tin sự kiện — Thời gian và địa điểm

- nameJP: イベント情報
- nameTrans: Event Info (Time and Location)
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
  Mục đích: Hiển thị thông tin cơ bản sự kiện: thời gian; địa điểm và ghi chú phát sóng trực tiếp.
  Hiển thị: Nhãn 'Thời gian:' / 'Địa điểm:'; giá trị '26/12/2025' / 'Âu Cơ Art Center'; ghi chú 'Tường thuật trực tiếp qua sóng Livestream'.
  Chức năng: Static; chỉ hiển thị; responsive tự xuống hàng khi màn nhỏ.
- qa:
  - Thông tin sự kiện (thời gian; địa điểm) lấy từ đâu (env var; CMS; DB)?
  - Link Livestream có đi kèm không?

---

### Item B3: Call-To-Action — Nhóm nút CTA

- nameJP: CTAボタングループ
- nameTrans: Call-To-Action Button Group
- itemType: button
- itemSubtype:
- buttonType: text_link
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Click ABOUT AWARDS → Awards Information; Click ABOUT KUDOS → Sun* Kudos
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nhóm 2 nút CTA chính trong hero section.
  Hiển thị: 'ABOUT AWARDS' (nút vàng; hover state); 'ABOUT KUDOS' (nút viền; normal state); cả 2 nút thay đổi state giống nhau.
  Chức năng: Click → điều hướng đến trang tương ứng.
- qa:

---

### Item B3.1: Button-IC About — Nút ABOUT AWARDS

- nameJP: About Awardsボタン
- nameTrans: ABOUT AWARDS Button
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
- transitionNote: Điều hướng đến trang Awards Information
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút CTA 'ABOUT AWARDS' trong hero section.
  Hiển thị: Nút vàng với text 'ABOUT AWARDS' và icon mũi tên; hover state.
  Chức năng: Click → Awards Information; state normal giống B3.2.
- qa:

---

### Item B3.2: Button-IC Kudos — Nút ABOUT KUDOS

- nameJP: About Kudosボタン
- nameTrans: ABOUT KUDOS Button
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
- transitionNote: Điều hướng đến trang Sun* Kudos
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút CTA 'ABOUT KUDOS' trong hero section.
  Hiển thị: Nút viền với text 'ABOUT KUDOS' và icon mũi tên; normal state.
  Chức năng: Click → Sun* Kudos; state hover giống B3.1.
- qa:

---

### Item B4 (no id): content — Đoạn mô tả Root Further

- nameJP: ルートファーザーコンテンツ
- nameTrans: Root Further Description Content
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
  Mục đích: Đoạn mô tả 'Root Further' giải thích tinh thần chương trình SAA 2025 ngay dưới hero section.
  Hiển thị: Văn bản mô tả nhiều đoạn; màu sáng trên nền tối; font kích thước trung bình.
  Chức năng: Hiển thị tĩnh; responsive tự xuống dòng và co lại trên màn hình nhỏ.
- qa:
  - Nội dung đoạn mô tả là static hay lấy từ CMS?

---

### Item B4 (5001:14827): mms_B4_content — Nội dung Root Further

- nameJP: ルートファーザーコンテンツブロック
- nameTrans: Root Further Content Block
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
  Mục đích: Content block mô tả chủ đề 'Root Further' của SAA 2025.
  Hiển thị: Text trang trí lớn 'ROOT' / 'FURTHER' làm nền; các đoạn văn mô tả chi tiết chủ đề; câu trích dẫn 'A tree with deep roots fears no storm'; text trắng trên nền tối.
  Chức năng: Hiển thị tĩnh; responsive text tự wrap và thu nhỏ trên màn hình nhỏ.
- qa:

---

### Item C1: Header Giải thưởng — Tiêu đề section Awards

- nameJP: 賞セクションヘッダー
- nameTrans: Awards Section Header
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
  Mục đích: Tiêu đề section giới thiệu hệ thống giải thưởng SAA 2025.
  Hiển thị: Caption nhỏ 'Sun* annual awards 2025'; tiêu đề lớn 'Hệ thống giải thưởng'; mô tả phụ 'Các hạng mục sẽ được trao giải theo TOP những người xuất sắc nhất.'.
  Chức năng: Hiển thị tĩnh; không tương tác.
- qa:

---

### Item C2 (no id): Award list — Danh sách giải thưởng

- nameJP: 賞一覧
- nameTrans: Award List
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Click card → Awards Information với hashtag slug hạng mục
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Danh sách các hạng mục giải thưởng hiển thị dạng lưới thẻ.
  Hiển thị: Ảnh vuông + hiệu ứng vòng sáng; tiêu đề hạng mục; mô tả 1-2 dòng; link 'Chi tiết'; layout responsive.
  Chức năng: Click ảnh/tiêu đề/'Chi tiết' → Awards Information#slug; hover → lift + glow; Mobile/Tablet: 2 cột; Desktop: 3 cột.
- qa:
  - Slug của từng hạng mục được sinh ra như thế nào?
  - Số lượng hạng mục là cố định (6) hay có thể mở rộng từ DB?

---

### Item C2 (5005:14974): mms_C2_Award list — Lưới giải thưởng

- nameJP: 賞グリッド
- nameTrans: Award List Grid
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required:
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Click → Awards Information với hash anchor hạng mục
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Grid 6 thẻ giải thưởng hiển thị trong 2 hàng 3 cột.
  Hiển thị: 3 cột (desktop); 2 cột (tablet); 1 cột (mobile); mỗi thẻ: thumbnail + tiêu đề + mô tả + link 'Chi tiết'.
  Chức năng: Click bất kỳ element trong card → Awards Information với hash anchor; hover → lift + glow; xem C2.1 đến C2.6.
- qa:

---

### Item C2.1: Thẻ giải 'Top Talent'

- nameJP: トップタレントカード
- nameTrans: Top Talent Award Card
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#top-talent
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Thẻ hiển thị hạng mục giải thưởng 'Top Talent'.
  Hiển thị: Ảnh graphic vuông (phần trên); tiêu đề 'Top Talent'; mô tả 'Vinh danh top cá nhân xuất sắc trên mọi phương diện'; link 'Chi tiết'.
  Chức năng: Click ảnh/tiêu đề/'Chi tiết' → Awards Information#top-talent; hover → lift + glow.
- qa:

---

### Item C2.1.1: Picture-Award — Ảnh giải thưởng Top Talent

- nameJP: トップタレント賞画像
- nameTrans: Top Talent Award Picture
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#top-talent
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Ảnh thumbnail hạng mục 'Top Talent' trong lưới giải thưởng.
  Hiển thị: Hình vuông bo góc; viền mảnh màu vàng; hiệu ứng ánh sáng; tiêu đề/mô tả bên dưới (ngoài vùng ảnh).
  Chức năng: Click → Awards Information#top-talent; hover → lift + glow; không có trạng thái input; luôn enabled.
- qa:
  - Ảnh được lưu ở đâu (static asset; Supabase Storage)?

---

### Item C2.1.2: Top Talent — Tên hạng mục

- nameJP: トップタレント名
- nameTrans: Top Talent (Award Name Label)
- itemType: label
- itemSubtype:
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#top-talent
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Hiển thị tên hạng mục giải thưởng 'Top Talent'.
  Hiển thị: Text label tên hạng mục.
  Chức năng: Click → Awards Information#top-talent.
- qa:

---

### Item C2.1.3: Mô tả Top Talent

- nameJP: トップタレント説明
- nameTrans: Top Talent Description
- itemType: label
- itemSubtype:
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
  Mục đích: Dòng mô tả ngắn về hạng mục 'Top Talent'.
  Hiển thị: Text mô tả; tối đa 2 dòng; truncate với dấu ba chấm nếu quá dài.
  Chức năng: Hiển thị tĩnh; không tương tác.
- qa:
  - maxLength của mô tả hạng mục là bao nhiêu ký tự?

---

### Item C2.1.4: Button-IC — Nút Chi tiết (Top Talent)

- nameJP: 詳細ボタン（トップタレント）
- nameTrans: Detail Button (Top Talent)
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
- transitionNote: Awards Information#top-talent
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút 'Chi tiết' mở trang thông tin chi tiết hạng mục Top Talent.
  Hiển thị: Text 'Chi tiết' kèm icon mũi tên.
  Chức năng: Click → Awards Information#top-talent.
- qa:

---

### Item C2.2: Top Project Award

- nameJP: トッププロジェクトカード
- nameTrans: Top Project Award Card
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#top-project
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Thẻ hiển thị hạng mục giải thưởng 'Top Project'.
  Hiển thị: Ảnh graphic vuông; tiêu đề 'Top Project'; mô tả; link 'Chi tiết'.
  Chức năng: Click → Awards Information#top-project; hover → lift + glow.
- qa:

---

### Item C2.3: Top Project Leader Award

- nameJP: トッププロジェクトリーダーカード
- nameTrans: Top Project Leader Award Card
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#top-project-leader
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Thẻ hiển thị hạng mục giải thưởng 'Top Project Leader'.
  Hiển thị: Ảnh graphic vuông; tiêu đề 'Top Project Leader'; mô tả; link 'Chi tiết'.
  Chức năng: Click → Awards Information#top-project-leader; hover → lift + glow.
- qa:

---

### Item C2.4: Giải Best Manager

- nameJP: ベストマネージャーカード
- nameTrans: Best Manager Award Card
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#best-manager
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Thẻ hiển thị hạng mục giải thưởng 'Best Manager'.
  Hiển thị: Ảnh graphic vuông; tiêu đề 'Best Manager'; mô tả; link 'Chi tiết'.
  Chức năng: Click → Awards Information#best-manager; hover → lift + glow.
- qa:

---

### Item C2.5: Signature 2025 - Creator Award

- nameJP: シグネチャー2025クリエイターカード
- nameTrans: Signature 2025 Creator Award Card
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#signature-2025-creator
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Thẻ hiển thị hạng mục giải thưởng 'Signature 2025 - Creator'.
  Hiển thị: Ảnh graphic vuông; tiêu đề 'Signature 2025 - Creator'; mô tả; link 'Chi tiết'.
  Chức năng: Click → Awards Information#signature-2025-creator; hover → lift + glow.
- qa:

---

### Item C2.6: MVP Award

- nameJP: MVPカード
- nameTrans: MVP Award Card
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Awards Information#mvp
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Thẻ hiển thị hạng mục giải thưởng 'MVP (Most Valuable Person)'.
  Hiển thị: Ảnh graphic vuông; tiêu đề 'MVP (Most Valuable Person)'; mô tả; link 'Chi tiết'.
  Chức năng: Click → Awards Information#mvp; hover → lift + glow.
- qa:

---

### Item D1: Sunkudos — Sun* Kudos promo block

- nameJP: Sun*クドスプロモブロック
- nameTrans: Sun* Kudos Promo Block
- itemType: others
- itemSubtype: card
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Mở trang chi tiết Sun* Kudos
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Khối quảng bá 'Sun* Kudos' với tiêu đề; mô tả ngắn và nút hành động.
  Hiển thị: Label 'Phong trào ghi nhận'; tiêu đề 'Sun* Kudos'; đoạn mô tả tóm tắt; button 'Chi tiết' (icon); logo KUDOS.
  Chức năng: Click 'Chi tiết' → trang chi tiết Sun* Kudos.
- qa:

---

### Item D2: Content — Khối nội dung Sun* Kudos

- nameJP: Sun*クドスコンテンツブロック
- nameTrans: Sun* Kudos Content Block
- itemType: others
- itemSubtype: info_block
- buttonType:
- dataType:
- format:
- required: false
- minLength:
- maxLength:
- defaultValue:
- userAction: on_click
- transitionNote: Click Chi tiết → tab Sun* Kudos
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Khối thông tin quảng bá Sun* Kudos kèm ảnh minh họa và nút CTA.
  Hiển thị: Tiêu đề 'Sun* Kudos'; dòng mô tả nhỏ 'Phong trào ghi nhận'; nội dung mô tả chiến dịch; ảnh/nền minh họa bên phải; nút 'Chi tiết'.
  Chức năng: Click 'Chi tiết' → tab Sun* Kudos.
- qa:
  - Nội dung mô tả là static hay lấy từ CMS?

---

### Item D2.1: Button-IC — Nút Chi tiết (Sun* Kudos)

- nameJP: 詳細ボタン（Sun*クドス）
- nameTrans: Detail Button (Sun* Kudos)
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
- transitionNote: Mở tab Sun* Kudos
- databaseTable:
- databaseColumn:
- databaseNote:
- validationNote:
- description:
  Mục đích: Nút 'Chi tiết' mở trang chi tiết Sun* Kudos.
  Hiển thị: Text 'Chi tiết' kèm icon mũi tên.
  Chức năng: Click → mở tab Sun* Kudos.
- qa:
