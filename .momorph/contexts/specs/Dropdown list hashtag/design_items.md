# Design Context - Dropdown list hashtag

## Screen Info
- Screen ID: p9zO-c4a4x
- Frame: Dropdown list hashtag
- File: SAA 2025 - Internal Live Coding (9ypp4enmFmdK3YAFJLIu6C)
- Design status: done | Spec status: done

## Mô tả màn hình
Dropdown danh sách hashtag cho phép người dùng chọn tối đa 5 hashtag. Hiển thị các mục đã chọn (nền tối + dấu check) và các mục chưa chọn (nền sáng). Khi đủ 5 lựa chọn, các mục còn lại bị disable.

## Item Overview

| No   | designItemId | itemName                    | type     | textInItem              | iconNameInItem       | hasChildren | childIds                  |
|------|-------------|----------------------------|----------|-------------------------|----------------------|-------------|---------------------------|
| A    | 1002:13185  | mms_A_Hashtag đã chọn 1    | FRAME    | #High-perorming         |                      | yes         | A.1, A.2                  |
| A.1  | 1002:13188  | mms_A.1_Hashtag             | FRAME    | #High-perorming         |                      | no          |                           |
| A.2  | 1002:13204  | mms_A.2_icon đã chọn       | INSTANCE |                         | checkmark (✓) circle | no          |                           |
| B    | 1002:13207  | mms_B_Hashtag đã chọn 2    | FRAME    | #BE PROFESSIONAL        |                      | yes         | B.1, B.2                  |
| B.1  | 1002:13210  | mms_B.1_Hashtag             | FRAME    | #BE PROFESSIONAL        |                      | no          |                           |
| B.2  | 1002:13214  | mms_B.2_icon đã chọn       | INSTANCE |                         | checkmark (✓) circle | no          |                           |
| C    | 1002:13216  | mms_C_Hashtag đã chọn 3    | FRAME    | #BE OPTIMISTIC          |                      | yes         | C.1, C.2                  |
| C.1  | 1002:13219  | mms_C.1_Hashtag             | FRAME    | #BE OPTIMISTIC          |                      | no          |                           |
| C.2  | 1002:13223  | mms_C.2_icon đã chọn       | INSTANCE |                         | checkmark (✓) circle | no          |                           |
| D    | 1002:13104  | mms_D_Hashtag chưa chọn    | INSTANCE | #Be A Team (+ others)   |                      | no          |                           |
