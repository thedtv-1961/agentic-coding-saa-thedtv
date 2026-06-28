# Items Analysis - Dropdown-ngôn ngữ

Screen: Dropdown-ngôn ngữ | screenId: hUyaaugye2
Target language: Tiếng Việt

---

### Item A: Dropdown-List

- nameJP: 言語選択ドロップダウン
- nameTrans: Language Selection Dropdown
- itemType: dropdown
- itemSubtype: 
- buttonType: 
- dataType: string
- required: false
- format: none
- minLength: 
- maxLength: 
- defaultValue: VN
- userAction: on_click
- transitionNote: Click vào selected item để mở/đóng danh sách lựa chọn ngôn ngữ
- databaseTable: 
- databaseColumn: 
- databaseNote: 
- validationNote: 
- description:
  Mục đích và Bối cảnh: Container dropdown chứa danh sách lựa chọn ngôn ngữ giao diện (VN/EN).
  Các thành phần hiển thị: Vùng trên (selected) hiển thị cờ + mã ngôn ngữ đang chọn (VN); vùng dưới (options) hiển thị các lựa chọn còn lại (EN). Nền xám đậm cho selected; nền đen cho option.
  Chức năng và Logic: Click vào selected item để mở/đóng menu (không có animation); chọn một ngôn ngữ sẽ reload trang với ngôn ngữ mới (qua global i18n store).
- qa:

---

### Item A.1: tiếng Việt

- nameJP: ベトナム語オプション
- nameTrans: Vietnamese Language Option
- itemType: others
- itemSubtype: list_item
- buttonType: 
- dataType: 
- required: false
- format: 
- minLength: 
- maxLength: 
- defaultValue: VN
- userAction: on_click
- transitionNote: Chọn Tiếng Việt → reload trang; ngôn ngữ giao diện cập nhật sang Tiếng Việt qua global i18n store
- databaseTable: 
- databaseColumn: 
- databaseNote: 
- validationNote: 
- description:
  Mục đích và Bối cảnh: Item lựa chọn ngôn ngữ Tiếng Việt trong dropdown ngôn ngữ.
  Các thành phần hiển thị: Icon cờ Việt Nam (bên trái) + mã ngôn ngữ "VN" (chữ trắng); nền xám đậm thể hiện trạng thái đang được chọn (selected state từ global i18n store).
  Chức năng và Logic: Click để chọn Tiếng Việt → reload trang với ngôn ngữ Tiếng Việt; trạng thái selected xác định từ global i18n store; hover hiển thị highlight.
- qa:
  - Item VN vẫn có thể click khi ngôn ngữ hiện tại là VN; nhưng không có sự kiện nào xảy ra (no-op) vì đây đã là ngôn ngữ đang chọn.

---

### Item A.2: tiếng Anh

- nameJP: 英語オプション
- nameTrans: English Language Option
- itemType: button
- itemSubtype: 
- buttonType: icon_text
- dataType: 
- required: false
- format: 
- minLength: 
- maxLength: 
- defaultValue: 
- userAction: on_click
- transitionNote: Chọn EN → reload trang; ngôn ngữ giao diện cập nhật sang Tiếng Anh qua global i18n store
- databaseTable: 
- databaseColumn: 
- databaseNote: 
- validationNote: 
- description:
  Mục đích và Bối cảnh: Item lựa chọn ngôn ngữ Tiếng Anh trong dropdown ngôn ngữ.
  Các thành phần hiển thị: Icon cờ Anh (bên trái) + mã ngôn ngữ "EN" (chữ trắng); nền đen thể hiện trạng thái chưa được chọn.
  Chức năng và Logic: Click để chọn EN → reload trang với ngôn ngữ Tiếng Anh qua global i18n store; hover đổi nền để thể hiện trạng thái tương tác; selected có nền highlight phân biệt.
- qa:
  - TODO: Màu nền cụ thể cho hover/active state của item EN là bao nhiêu? (sẽ trao đổi sau)
