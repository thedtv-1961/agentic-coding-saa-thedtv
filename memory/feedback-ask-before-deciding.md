---
name: feedback-ask-before-deciding
description: "Khi có điểm chưa rõ, phải hỏi user trước khi làm — không tự ý quyết định"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f261bb96-e506-4e33-b89b-9211ebf5054b
---

Khi gặp bất kỳ điểm nào chưa rõ ràng (về requirement, design, behavior, approach...), phải **hỏi user trước** — không được tự ý quyết định và tiến hành.

**Why:** User muốn kiểm soát các quyết định quan trọng; tự ý làm có thể đi sai hướng và mất công sửa lại.

**How to apply:** Trước khi bắt đầu bất kỳ task nào có điểm mơ hồ, dùng `AskUserQuestion` để hỏi — kể cả khi có "recommended" option. Chỉ proceed sau khi user đã confirm.
