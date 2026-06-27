# Items Analysis - Login

## A: Header (662:14391)
- nameJP: ヘッダー
- nameTrans: Header (Navigation Bar)
- itemType: others
- itemSubtype: navigation
- buttonType: (none)
- dataType: (none)
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: (none)
- transitionNote: (none)
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: Top navigation bar fixed at the top of the Login page. Contains SAA brand logo (left) and language switcher button (right). Background: transparent/dark overlay. Fixed position at top of viewport.
- qa: Q: Is the header fixed (sticky) or static on scroll?

## A.1: Logo (I662:14391;186:2166)
- nameJP: ロゴ
- nameTrans: Logo SAA
- itemType: others
- itemSubtype: logo
- buttonType: (none)
- dataType: (none)
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: on_click
- transitionNote: Navigate to homepage
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: SAA brand logo (~69×64 px) left-aligned in the header. Alt text: 'Sun* Annual Awards 2025'. Static image. Clicking navigates to homepage.
- qa: Q: Should clicking the logo redirect to the homepage even from the login page (unauthenticated state)?

## A.2: Language Switcher (I662:14391;186:1601)
- nameJP: 言語切替ボタン
- nameTrans: Language Switcher Button
- itemType: button
- itemSubtype: (none)
- buttonType: icon_text
- dataType: string
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: VN
- userAction: on_click
- transitionNote: Open language dropdown (Dropdown-ngôn ngữ screen)
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: Button showing Vietnamese flag icon, 'VN' label, and down chevron (~110×40 px). Default: VN. Options: VN (Vietnamese), EN (English). Selecting an option updates the interface language and closes the dropdown.
- qa: Q: Is the selected language persisted in localStorage/cookie/user profile? Q: What is the full list of supported languages?

## B: Main Content (662:14393)
- nameJP: メインコンテンツ
- nameTrans: Main Content (Login)
- itemType: others
- itemSubtype: hero
- buttonType: (none)
- dataType: (none)
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: (none)
- transitionNote: (none)
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: Main content area centered vertically and horizontally. Contains Key Visual (top), Welcome Text (middle), Login Button (bottom). Background: dark with decorative root/line pattern. Responsive: stacks vertically on smaller screens.
- qa: (none)

## B.1: Key Visual (662:14395)
- nameJP: キービジュアル
- nameTrans: Key Visual 'Root Further'
- itemType: others
- itemSubtype: hero
- buttonType: (none)
- dataType: (none)
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: (none)
- transitionNote: (none)
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: 'ROOT FURTHER' stylized text/logo as the primary visual element. Prominent, centered. Decorative typography with root/organic motifs. Static display only. Scales proportionally on different screen sizes.
- qa: (none)

## B.2: Welcome Text (662:14753)
- nameJP: ウェルカムテキスト
- nameTrans: Welcome Text
- itemType: label
- itemSubtype: (none)
- buttonType: (none)
- dataType: string
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: (none)
- transitionNote: (none)
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: Two-line welcome message. Line 1: 'Bắt đầu hành trình của bạn cùng SAA 2025.' Line 2: 'Đăng nhập để khám phá!' White text, medium size, centered. Static display only.
- qa: Q: Should welcome text update when language switcher is changed to EN?

## B.3: Login Button (662:14425)
- nameJP: ログインボタン (Google)
- nameTrans: Login Button (Google)
- itemType: button
- itemSubtype: (none)
- buttonType: icon_text
- dataType: (none)
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: on_click
- transitionNote: On success → navigate to Homepage SAA; on failure → display error message
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: Primary Google OAuth login button. Icon: Google logo (left). Label: 'Đăng nhập bằng Google'. ~280×48 px. States: normal, hover (lighten), active (press), disabled/loading (spinner during auth). On success: redirect to Homepage SAA. On failure: display error message.
- qa: Q: What error message should be shown on login failure? Q: Should the button be disabled while authentication is in progress? Q: Is there a loading/spinner state during OAuth flow?

## C: Background Key Visual (662:14388)
- nameJP: 背景キービジュアル
- nameTrans: Background Key Visual
- itemType: others
- itemSubtype: background
- buttonType: (none)
- dataType: (none)
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: (none)
- transitionNote: (none)
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: Full-screen background image covering the entire viewport. Decorative root/organic pattern. Dark semi-transparent overlay for text readability. Static, no interaction. Responsive: cover entire viewport, no repeat.
- qa: (none)

## D: Footer (662:14447)
- nameJP: フッター
- nameTrans: Footer
- itemType: label
- itemSubtype: (none)
- buttonType: (none)
- dataType: (none)
- format: (none)
- required: (none)
- minLength: (none)
- maxLength: (none)
- defaultValue: (none)
- userAction: (none)
- transitionNote: (none)
- databaseTable: (none)
- databaseColumn: (none)
- databaseNote: (none)
- validationNote: (none)
- description: Footer bar at the bottom of the page. Text: 'Bản quyền thuộc về Sun* © 2025'. Small text, light color on dark background. Static display only. Fixed at bottom or flows with content depending on viewport height.
- qa: Q: Should footer text update when language switcher changes language?
