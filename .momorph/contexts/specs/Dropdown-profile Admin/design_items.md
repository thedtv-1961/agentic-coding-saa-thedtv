# Design Context - Dropdown-profile Admin

Screen ID: 54rekaCHG1
Frame Name: Dropdown-profile Admin
File Key: 9ypp4enmFmdK3YAFJLIu6C
Design Status: done
Spec Status: done

## Item Overview

| No  | designItemId             | itemName             | type     | itemType  | itemSubtype  | hasChildren | childIds                                            |
|-----|--------------------------|----------------------|----------|-----------|--------------|-------------|-----------------------------------------------------|
| A   | 666:9728                 | mms_A_Dropdown-List  | INSTANCE | others    | navigation   | true        | A.1, A.2, A.3                                       |
| A.1 | I666:9728;666:9277       | mms_A.1_Profile      | INSTANCE | button    |              | false       |                                                     |
| A.2 | I666:9728;666:9452       | mms_A.2_Dashboard    | INSTANCE | others    | list_item    | false       |                                                     |
| A.3 | I666:9728;666:9278       | mms_A.3_Logout       | INSTANCE | button    |              | false       |                                                     |

## Visual Description (from frame image)

- **A** — Container dropdown nền tối (dark background), viền bo tròn, nổi trên giao diện
- **A.1** — Hàng đầu tiên: label "Profile" + icon người dùng bên phải; trạng thái active (nền highlight + glow)
- **A.2** — Hàng giữa: label "Dashboard" + icon grid/dots bên phải; trạng thái mặc định (không active)
- **A.3** — Hàng cuối: label "Logout" + icon mũi tên phải (chevron) bên phải; trạng thái mặc định
