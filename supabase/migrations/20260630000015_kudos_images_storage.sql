-- Bucket for kudos image attachments
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kudos-images',
  'kudos-images',
  true,
  5242880,  -- 5MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Authenticated users can upload
create policy "kudos_images_upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'kudos-images');

-- Authenticated users can read
create policy "kudos_images_select"
  on storage.objects for select to authenticated
  using (bucket_id = 'kudos-images');

-- Users can delete their own uploads
create policy "kudos_images_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'kudos-images' and (storage.foldername(name))[1] = auth.uid()::text);
