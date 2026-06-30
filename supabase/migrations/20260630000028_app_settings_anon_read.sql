-- Prelaunch gate (middleware) chạy TRƯỚC auth nên không có user → phải đọc
-- countdown_date bằng anon/publishable key. Trước đây gate dùng service_role để
-- bypass RLS, nhưng dùng key quyền-cao trong edge middleware vừa rủi ro vừa dễ
-- hỏng khi secret cấu hình sai (đã gây fail-open trên production).
--
-- app_settings chỉ chứa cấu hình công khai (countdown_date, nomination_enabled),
-- nên cho phép anon SELECT là an toàn. WRITE vẫn chỉ dành cho admin (policy cũ).
create policy "app_settings_select_anon"
  on public.app_settings for select to anon using (true);

grant select on public.app_settings to anon;
