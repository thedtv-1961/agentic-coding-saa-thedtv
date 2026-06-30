/**
 * Post-deploy seed script: tạo test users nếu profiles table rỗng.
 * Dùng Supabase Admin API (service_role key) — hoạt động cả local lẫn production.
 *
 * Usage:
 *   node scripts/seed-users.mjs
 *
 * Required env vars (từ .env hoặc CI secrets):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌ Thiếu env vars: SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_USERS = [
  {
    email: "admin@sun-asterisk.com",
    password: "password123",
    full_name: "Admin SAA",
    role: "admin",
  },
  {
    email: "user1@sun-asterisk.com",
    password: "password123",
    full_name: "Nguyễn Văn A",
    role: "user",
  },
  {
    email: "user2@sun-asterisk.com",
    password: "password123",
    full_name: "Trần Thị B",
    role: "user",
  },
];

async function main() {
  // Kiểm tra profiles table có data chưa
  const { count, error: countError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("❌ Không đọc được profiles table:", countError.message);
    process.exit(1);
  }

  if (count > 0) {
    console.log(`✅ profiles đã có ${count} user(s) — bỏ qua seed.`);
    return;
  }

  console.log("🌱 profiles rỗng — bắt đầu seed...");

  for (const u of SEED_USERS) {
    // Tạo auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, avatar_url: null },
    });

    if (error) {
      // Bỏ qua nếu email đã tồn tại
      if (error.message.includes("already been registered")) {
        console.log(`  ⚠️  ${u.email} đã tồn tại — bỏ qua.`);
        continue;
      }
      console.error(`  ❌ Tạo ${u.email} thất bại:`, error.message);
      continue;
    }

    // Cập nhật role nếu là admin (trigger tạo profile với role='user' mặc định)
    if (u.role === "admin") {
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", data.user.id);

      if (roleError) {
        console.warn(`  ⚠️  Set admin role cho ${u.email} thất bại:`, roleError.message);
      }
    }

    console.log(`  ✅ ${u.email} (${u.role})`);
  }

  console.log("🎉 Seed hoàn tất.");
}

main().catch((err) => {
  console.error("❌ Seed thất bại:", err);
  process.exit(1);
});
