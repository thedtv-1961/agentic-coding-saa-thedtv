# Items Analysis - Viết Kudo

**Screen:** Viết Kudo (screenId: ihQ26W78P2)
**Target Language:** Vietnamese

---

### Item A: mms_A_Gửi lời cám ơn và ghi nhận đến đồng đội

- **nameJP:** Gửi lời cám ơn và ghi nhận đến đồng đội
- **nameTrans:** Tiêu đề modal gửi lời cảm ơn
- **itemType:** label
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Tiêu đề của modal gửi lời cảm ơn; hiển thị ở đầu form để người dùng biết mục đích thao tác.
  Thành phần Hiển thị: Văn bản 'Gửi lời cám ơn và ghi nhận đến đồng đội'; kiểu chữ lớn; căn giữa; nằm ở đầu modal.
  Chức năng & Logic: Chỉ hiển thị tĩnh; không tương tác.
- **qa:** -

---

### Item B: mms_B_Chọn người nhận

- **nameJP:** Recipient Selector
- **nameTrans:** Chọn người nhận Kudo
- **itemType:** others
- **itemSubtype:** form_field
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** true
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Section bắt buộc để chọn người nhận Kudo; form không thể submit nếu chưa chọn.
  Thành phần Hiển thị: Nhãn 'Người nhận*' (in đậm; bên trái) + ô tìm kiếm với placeholder 'Tìm kiếm' và icon dropdown (bên phải; flex-grow).
  Chức năng & Logic: Click ô tìm kiếm mở dropdown autocomplete Sunner; gõ để lọc; click mục để điền tên; bắt buộc có giá trị hợp lệ trước khi gửi.
- **qa:**
  - Dropdown hiển thị tất cả Sunner hay chỉ những người cùng team?
  - Có thể chọn nhiều người nhận hay chỉ một?
  - Khi người nhận đã chọn rồi, UI thể hiện tên/avatar như thế nào?

---

### Item B.1: mms_B.1_Title

- **nameJP:** Title
- **nameTrans:** Nhãn 'Người nhận'
- **itemType:** label
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nhãn định danh trường 'Người nhận' kèm dấu * báo bắt buộc.
  Thành phần Hiển thị: Văn bản 'Người nhận' và dấu '*' màu đỏ; kiểu in đậm.
  Chức năng & Logic: Chỉ hiển thị; không tương tác.
- **qa:** -

---

### Item B.2: mms_B.2_Search

- **nameJP:** search
- **nameTrans:** Trường tìm kiếm người nhận
- **itemType:** text_form
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** string
- **format:** none
- **required:** true
- **minLength:** 1
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Mở dropdown autocomplete danh sách Sunner
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:**
  Condition: Để trống
  Error: "Vui lòng chọn người nhận"
- **description:**
  Mục đích và Ngữ cảnh: Ô tìm và chọn người nhận Kudo bắt buộc trong form.
  Thành phần Hiển thị: Text field với placeholder 'Tìm kiếm'; icon dropdown bên phải; viền trắng.
  Chức năng & Logic: Autocomplete lọc kết quả theo ký tự nhập; click mục để điền tên người nhận; khi rỗng hiển thị viền đỏ và thông báo lỗi.
- **qa:**
  - Format nào dùng để validate người nhận hợp lệ (ID hay email)?
  - Có hiển thị avatar bên cạnh tên không?

---

### Item C: mms_C_Chức năng

- **nameJP:** Chức năng
- **nameTrans:** Thanh công cụ định dạng
- **itemType:** text_form
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** string
- **format:** none
- **required:** true
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Container thanh công cụ định dạng văn bản cho ô soạn thảo lời cảm ơn.
  Thành phần Hiển thị: Dãy nút B; I; S; số thứ tự; link; quote và link 'Tiêu chuẩn cộng đồng' bên phải.
  Chức năng & Logic: Cung cấp các tùy chọn định dạng cho nội dung trong textarea; mỗi nút bật/tắt định dạng tương ứng.
- **qa:** -

---

### Item C.1: mms_C.1_bold

- **nameJP:** bold
- **nameTrans:** Nút in đậm
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** toggle
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Bật/tắt định dạng in đậm cho văn bản được chọn
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút toggle in đậm trong thanh công cụ soạn thảo.
  Thành phần Hiển thị: Nút 'B' (Bold).
  Chức năng & Logic: Click bật/tắt định dạng in đậm cho văn bản đang chọn hoặc nội dung sắp nhập.
- **qa:** -

---

### Item C.2: mms_C.2_italic

- **nameJP:** italic
- **nameTrans:** Nút in nghiêng
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Bật/tắt định dạng in nghiêng cho văn bản được chọn
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút toggle in nghiêng trong thanh công cụ soạn thảo.
  Thành phần Hiển thị: Nút 'I' (Italic).
  Chức năng & Logic: Click bật/tắt định dạng in nghiêng cho văn bản đang chọn.
- **qa:** -

---

### Item C.3: mms_C.3_Stroke

- **nameJP:** Stroke
- **nameTrans:** Nút gạch ngang
- **itemType:** others
- **itemSubtype:** decorative
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Bật/tắt định dạng gạch ngang cho văn bản được chọn
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút toggle gạch ngang trong thanh công cụ soạn thảo.
  Thành phần Hiển thị: Nút 'S' (Strikethrough).
  Chức năng & Logic: Click bật/tắt định dạng gạch ngang cho văn bản đang chọn.
- **qa:** -

---

### Item C.4: mms_C.4_number

- **nameJP:** number
- **nameTrans:** Nút danh sách có số
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Bật/tắt định dạng danh sách có số cho đoạn văn
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút bật/tắt danh sách có số thứ tự trong thanh công cụ soạn thảo.
  Thành phần Hiển thị: Icon danh sách số.
  Chức năng & Logic: Click áp dụng/loại bỏ định dạng ordered list cho đoạn hiện tại.
- **qa:** -

---

### Item C.5: mms_C.5_link

- **nameJP:** link
- **nameTrans:** Nút chèn liên kết
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Mở hộp thoại nhập URL để chèn liên kết
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút chèn/chỉnh sửa hyperlink trong thanh công cụ soạn thảo.
  Thành phần Hiển thị: Icon link/chain.
  Chức năng & Logic: Click mở hộp thoại nhập URL; sau khi xác nhận chèn liên kết vào vùng văn bản.
- **qa:**
  - Hộp thoại link có tùy chọn 'mở trong tab mới' không?
  - Có validate định dạng URL không?

---

### Item C.6: mms_C.6_quote

- **nameJP:** quote
- **nameTrans:** Nút trích dẫn
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Bật/tắt định dạng blockquote cho đoạn văn
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút chèn blockquote trong thanh công cụ soạn thảo.
  Thành phần Hiển thị: Icon quote (dấu ngoặc kép đôi).
  Chức năng & Logic: Click bật/tắt định dạng trích dẫn (blockquote) cho đoạn văn đang chọn.
- **qa:** -

---

### Item D: mms_D_text filed

- **nameJP:** text filed
- **nameTrans:** Textarea lời cảm ơn
- **itemType:** text_form
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** string
- **format:** none
- **required:** true
- **minLength:** -
- **maxLength:** 1000
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:**
  Condition: Để trống
  Error: "Vui lòng nhập nội dung lời cảm ơn"
- **description:**
  Mục đích và Ngữ cảnh: Ô soạn thảo chính để nhập lời cảm ơn/ghi nhận; trường bắt buộc.
  Thành phần Hiển thị: Toolbar định dạng ở trên; textarea với placeholder 'Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!'; link 'Tiêu chuẩn cộng đồng' bên phải toolbar.
  Chức năng & Logic: Nhập nội dung lời cảm ơn có hỗ trợ rich text; gõ '@' + tên để nhắc đồng nghiệp; bắt buộc không được để trống.
- **qa:**
  - Có giới hạn số ký tự tối đa không? Có hiển thị bộ đếm không?
  - Khi gõ '@' có hiển thị gợi ý tên người không?

---

### Item D.1: mms_D.1_Gợi ý

- **nameJP:** Gợi ý và bộ đếm ký tự
- **nameTrans:** Hint text and character counter
- **itemType:** label
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Văn bản gợi ý hiển thị bên dưới textarea để hướng dẫn người dùng.
  Thành phần Hiển thị: Text nhỏ 'Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác'.
  Chức năng & Logic: Luôn hiển thị bên dưới textarea; không tương tác.
- **qa:** -

---

### Item E: mms_E_Frame 536

- **nameJP:** Frame 536
- **nameTrans:** Trường Hashtag
- **itemType:** text_form
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** string
- **format:** none
- **required:** true
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:**
  Condition: Không có hashtag nào
  Error: "Vui lòng thêm ít nhất 1 hashtag"
  Condition: Thêm quá 5 hashtag
  Error: "Tối đa 5 hashtag"
- **description:**
  Mục đích và Ngữ cảnh: Section bắt buộc để thêm hashtag cho bài Kudo; tối thiểu 1; tối đa 5.
  Thành phần Hiển thị: Nhãn 'Hashtag*'; nút '+ Hashtag'; ghi chú 'Tối đa 5'; các chip hashtag đã thêm kèm nút xóa.
  Chức năng & Logic: Click '+ Hashtag' mở dropdown thêm hashtag; click 'x' trên chip để xóa; validate tối thiểu 1 và tối đa 5.
- **qa:**
  - Dropdown hashtag lấy dữ liệu từ danh sách cố định hay người dùng có thể tự nhập?
  - Hashtag có cho phép ký tự đặc biệt không?

---

### Item E.1: mms_E.1_Title

- **nameJP:** Title
- **nameTrans:** Nhãn 'Hashtag'
- **itemType:** label
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nhãn định danh trường 'Hashtag' kèm dấu * báo bắt buộc.
  Thành phần Hiển thị: Văn bản 'Hashtag' và dấu '*'.
  Chức năng & Logic: Chỉ hiển thị; không tương tác.
- **qa:** -

---

### Item E.2: mms_E.2_Tag Group

- **nameJP:** Tag Group
- **nameTrans:** Nhóm Hashtag
- **itemType:** others
- **itemSubtype:** tag_group
- **buttonType:** -
- **dataType:** string
- **format:** none
- **required:** true
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Mở dropdown chọn hashtag
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:**
  Condition: Chưa chọn hashtag nào
  Error: "Vui lòng thêm ít nhất 1 hashtag"
- **description:**
  Mục đích và Ngữ cảnh: Vùng hiển thị và quản lý các hashtag đã chọn trong form Kudo.
  Thành phần Hiển thị: Nút '+ Hashtag'; các chip hashtag đã thêm kèm nút 'x'; ghi chú 'Tối đa 5'.
  Chức năng & Logic: Click '+ Hashtag' mở dropdown; click chip 'x' xóa hashtag; ẩn nút thêm khi đã đủ 5.
- **qa:**
  - Có hiển thị số lượng hashtag hiện tại/tổng tối đa không?

---

### Item F: mms_F_Frame 537

- **nameJP:** Frame 537
- **nameTrans:** Khung tải ảnh
- **itemType:** others
- **itemSubtype:** image_upload
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:**
  Condition: Thêm quá 5 ảnh
  Error: Ẩn nút '+ Image' khi đã đủ 5 ảnh
- **description:**
  Mục đích và Ngữ cảnh: Section tùy chọn để đính kèm ảnh cho bài Kudo; tối đa 5 ảnh.
  Thành phần Hiển thị: Nhãn 'Image'; dãy thumbnail ảnh kèm nút 'x'; nút '+ Image' và ghi chú 'Tối đa 5'.
  Chức năng & Logic: Click '+ Image' mở file picker; click 'x' trên thumbnail xóa ảnh; ẩn nút thêm khi đủ 5; không bắt buộc.
- **qa:**
  - Định dạng ảnh được chấp nhận (JPG; PNG; WEBP...)?
  - Giới hạn dung lượng mỗi ảnh là bao nhiêu?

---

### Item F.1: mms_F.1_Title

- **nameJP:** Title
- **nameTrans:** Nhãn 'Image'
- **itemType:** label
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nhãn định danh section đính kèm ảnh.
  Thành phần Hiển thị: Văn bản 'Image'.
  Chức năng & Logic: Chỉ hiển thị; không tương tác.
- **qa:** -

---

### Item F.2: mms_F.2_Image

- **nameJP:** Image
- **nameTrans:** Hình thu nhỏ ảnh
- **itemType:** others
- **itemSubtype:** image_thumbnail
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Click 'x' xóa ảnh khỏi danh sách
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Thumbnail ảnh đính kèm thứ nhất trong dãy ảnh của form Kudo.
  Thành phần Hiển thị: Ảnh thu nhỏ kèm nút 'x' ở góc để xóa.
  Chức năng & Logic: Click 'x' xóa ảnh này khỏi danh sách đính kèm.
- **qa:** -

---

### Item F.3: mms_F.3_Image

- **nameJP:** Image
- **nameTrans:** Ảnh thumbnail thứ hai
- **itemType:** others
- **itemSubtype:** image_item
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Click 'x' xóa ảnh khỏi danh sách
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Thumbnail ảnh đính kèm thứ hai trong dãy ảnh của form Kudo.
  Thành phần Hiển thị: Ảnh thu nhỏ kèm nút 'x' ở góc để xóa.
  Chức năng & Logic: Click 'x' xóa ảnh này khỏi danh sách đính kèm.
- **qa:** -

---

### Item F.4: mms_F.4_Image

- **nameJP:** Image
- **nameTrans:** Ảnh thumbnail thứ ba
- **itemType:** others
- **itemSubtype:** image_thumbnail
- **buttonType:** -
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Click 'x' xóa ảnh khỏi danh sách
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Thumbnail ảnh đính kèm thứ ba trong dãy ảnh của form Kudo.
  Thành phần Hiển thị: Ảnh thu nhỏ kèm nút 'x' ở góc để xóa.
  Chức năng & Logic: Click 'x' xóa ảnh này khỏi danh sách đính kèm.
- **qa:** -

---

### Item F.5: mms_F.5_Frame 542

- **nameJP:** Frame 542
- **nameTrans:** Nút thêm ảnh
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Mở file picker để chọn ảnh; sau khi chọn hiển thị thumbnail
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút cho phép người dùng thêm ảnh đính kèm vào bài Kudo.
  Thành phần Hiển thị: Icon '+'; nhãn 'Image'; ghi chú nhỏ 'Tối đa 5'.
  Chức năng & Logic: Click mở file picker; sau khi chọn ảnh hiển thị thumbnail; ẩn khi đã có 5 ảnh.
- **qa:**
  - Có hỗ trợ chọn nhiều ảnh cùng lúc từ file picker không?

---

### Item G: mms_G_Gửi ẩn danh

- **nameJP:** Gửi ẩn danh
- **nameTrans:** Gửi lời cám ơn và ghi nhận ẩn danh
- **itemType:** text_form
- **itemSubtype:** -
- **buttonType:** -
- **dataType:** boolean
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Bật: hiển thị text field nhập tên ẩn danh
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Tùy chọn cho phép người gửi ẩn danh khi gửi Kudo; không bắt buộc.
  Thành phần Hiển thị: Nhãn 'Gửi lời cám ơn và ghi nhận ẩn danh'; có thể là checkbox hoặc toggle.
  Chức năng & Logic: Click bật/tắt chế độ ẩn danh; khi bật hiển thị thêm trường nhập tên ẩn danh.
- **qa:**
  - itemType có nên là checkbox thay vì text_form không?
  - Khi bật ẩn danh; tên hiển thị với người nhận là gì?
  - Trường tên ẩn danh có bắt buộc điền không?

---

### Item H: mms_H_Frame 538

- **nameJP:** Frame 538
- **nameTrans:** Thanh hành động
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** -
- **transitionNote:** -
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Footer modal chứa hai nút hành động 'Hủy' và 'Gửi'.
  Thành phần Hiển thị: Nút 'Hủy' (text + icon X; bên trái) và nút 'Gửi' (icon_text; nền vàng; bên phải).
  Chức năng & Logic: Container nhóm hai nút; nút 'Gửi' disabled khi chưa điền đủ các trường bắt buộc.
- **qa:** -

---

### Item H.1: mms_H.1_Button

- **nameJP:** Nút Hủy
- **nameTrans:** Cancel button
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Đóng modal; hủy mọi thay đổi; không gửi dữ liệu
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút hủy thao tác viết Kudo và đóng modal.
  Thành phần Hiển thị: Text 'Hủy' kèm icon X.
  Chức năng & Logic: Click đóng modal và hủy toàn bộ thay đổi; luôn enabled khi modal hiển thị.
- **qa:**
  - Có hiển thị confirm dialog khi đã nhập dữ liệu và nhấn Hủy không?

---

### Item H.2: mms_H.2_Button

- **nameJP:** Button
- **nameTrans:** Submit button
- **itemType:** button
- **itemSubtype:** -
- **buttonType:** icon_text
- **dataType:** -
- **format:** -
- **required:** false
- **minLength:** -
- **maxLength:** -
- **defaultValue:** -
- **userAction:** on_click
- **transitionNote:** Validate form; gửi dữ liệu; show loading; đóng modal khi thành công
- **databaseTable:** -
- **databaseColumn:** -
- **databaseNote:** -
- **validationNote:** -
- **description:**
  Mục đích và Ngữ cảnh: Nút chính để gửi lời cảm ơn sau khi điền đủ form.
  Thành phần Hiển thị: Text 'Gửi' kèm icon ▷; nền vàng (nút chính).
  Chức năng & Logic: Click validate form và gửi; disabled khi Người nhận hoặc Nội dung hoặc Hashtag chưa điền; show loading khi đang gửi; đóng modal khi thành công.
- **qa:**
  - Sau khi gửi thành công có hiển thị toast/notification không?
  - Nếu gửi thất bại có hiển thị thông báo lỗi không?
