# Design Context - Thể lệ UPDATE

- Screen ID: b1Filzi9i6
- Frame Name: Thể lệ UPDATE
- File Key: 9ypp4enmFmdK3YAFJLIu6C
- Design Status: done | Spec Status: done
- Total Items: 4

## Item Overview

| No  | designItemId  | itemName                  | type     | hasChildren | childIds          |
|-----|---------------|---------------------------|----------|-------------|-------------------|
| A   | 3204:6053     | A_Nội dung thể lệ         | FRAME    | true        | (none listed)     |
| B   | 3204:6092     | B_Button                  | FRAME    | true        | B.1, B.2          |
| B.1 | 3204:6093     | B.1_Button đóng           | INSTANCE | false       |                   |
| B.2 | 3204:6094     | B.2_Button viết kudos     | INSTANCE | false       |                   |

## Visual Notes

- Panel hiển thị thể lệ chương trình SAA 2025 trong modal overlay
- Cột trái (A): khu vực nội dung thể lệ có scroll
- Footer (B): chứa B.1 "Đóng" (secondary) và B.2 "Viết KUDOS" (primary - màu vàng)
- B.2 navigate đến linkedFrameId: 520:11602 (Viết Kudo)
