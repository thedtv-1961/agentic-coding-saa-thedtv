/**
 * Post-deploy seed script: tạo data mặc định nếu các bảng rỗng.
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

// ── Seed data ────────────────────────────────────────────────────────────────

const SEED_USERS = [
  {
    email: "admin@sun-asterisk.com",
    password: "Aa@123456",
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

const SEED_HASHTAGS = [
  "#Teamwork", "#Innovation", "#Leadership", "#CustomerFirst",
  "#Growth", "#Ownership", "#Excellence", "#Collaboration",
  "#Integrity", "#Impact",
];

const SEED_APP_SETTINGS = [
  { key: "countdown_date", value: "2025-12-20T00:00:00+07:00" },
  { key: "nomination_enabled", value: "false" },
];

const SEED_AWARD_CATEGORIES = [
  {
    id: 1,
    name: "Top Talent",
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    content:
      "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
    image_url: "/images/awards/top-talent.png",
    is_active: true,
  },
  {
    id: 2,
    name: "Top Project",
    title: "Top Project",
    description:
      "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
    content:
      "Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng.",
    image_url: "/images/awards/top-project.png",
    is_active: true,
  },
  {
    id: 3,
    name: "Top Project Leader",
    title: "Top Project Leader",
    description:
      "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá",
    content:
      "Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy Aim High – Be Agile trong mọi bài toán và bối cảnh.",
    image_url: "/images/awards/top-project-leader.png",
    is_active: true,
  },
  {
    id: 4,
    name: "Best Manager",
    title: "Best Manager",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    content:
      "Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức.",
    image_url: "/images/awards/best-manager.png",
    is_active: true,
  },
  {
    id: 5,
    name: "Signature 2025 Creator",
    title: "Signature 2025 – Creator",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    content:
      "Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ. Trong năm 2025, giải thưởng Signature vinh danh Creator – cá nhân/tập thể mang tư duy chủ động và nhạy bén.",
    image_url: "/images/awards/signature-2025-creator.png",
    is_active: true,
  },
  {
    id: 6,
    name: "MVP",
    title: "MVP (Most Valuable Person)",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    content:
      "Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*.",
    image_url: "/images/awards/mvp.png",
    is_active: true,
  },
];

// category_id references award_categories.id above
const SEED_AWARDS = [
  { category_id: 1, number_of_winners: 10, winner_unit: 1, prize_value: 7000000, is_active: true },
  { category_id: 2, number_of_winners: 2, winner_unit: 2, prize_value: 15000000, is_active: true },
  { category_id: 3, number_of_winners: 3, winner_unit: 1, prize_value: 7000000, is_active: true },
  { category_id: 4, number_of_winners: 1, winner_unit: 1, prize_value: 10000000, is_active: true },
  { category_id: 5, number_of_winners: 1, winner_unit: 1, prize_value: 5000000, is_active: true },
  { category_id: 5, number_of_winners: 1, winner_unit: 2, prize_value: 8000000, is_active: true },
  { category_id: 6, number_of_winners: 1, winner_unit: 1, prize_value: 15000000, is_active: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function isEmpty(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`Không đọc được ${table}: ${error.message}`);
  return count === 0;
}

// ── Seed functions ────────────────────────────────────────────────────────────

async function seedHashtags() {
  if (!(await isEmpty("hashtags"))) {
    console.log("  ✅ hashtags — đã có data, bỏ qua.");
    return;
  }
  const { error } = await supabase
    .from("hashtags")
    .insert(SEED_HASHTAGS.map((name) => ({ name })));
  if (error) throw new Error(`hashtags seed thất bại: ${error.message}`);
  console.log(`  ✅ hashtags — đã seed ${SEED_HASHTAGS.length} hashtags.`);
}

async function seedAppSettings() {
  if (!(await isEmpty("app_settings"))) {
    console.log("  ✅ app_settings — đã có data, bỏ qua.");
    return;
  }
  const { error } = await supabase.from("app_settings").insert(SEED_APP_SETTINGS);
  if (error) throw new Error(`app_settings seed thất bại: ${error.message}`);
  console.log(`  ✅ app_settings — đã seed ${SEED_APP_SETTINGS.length} keys.`);
}

async function seedAwardCategories() {
  if (!(await isEmpty("award_categories"))) {
    console.log("  ✅ award_categories — đã có data, bỏ qua.");
    return;
  }
  const { error } = await supabase.from("award_categories").insert(SEED_AWARD_CATEGORIES);
  if (error) throw new Error(`award_categories seed thất bại: ${error.message}`);
  console.log(`  ✅ award_categories — đã seed ${SEED_AWARD_CATEGORIES.length} categories.`);
}

async function seedAwards() {
  if (!(await isEmpty("awards"))) {
    console.log("  ✅ awards — đã có data, bỏ qua.");
    return;
  }
  // awards phụ thuộc award_categories — seed categories trước
  await seedAwardCategories();
  const { error } = await supabase.from("awards").insert(SEED_AWARDS);
  if (error) throw new Error(`awards seed thất bại: ${error.message}`);
  console.log(`  ✅ awards — đã seed ${SEED_AWARDS.length} awards.`);
}

async function seedProfiles() {
  if (!(await isEmpty("profiles"))) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    console.log(`  ✅ profiles — đã có ${count} user(s), bỏ qua.`);
    return;
  }

  for (const u of SEED_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, avatar_url: null },
    });

    if (error) {
      if (error.message.includes("already been registered")) {
        console.log(`    ⚠️  ${u.email} đã tồn tại — bỏ qua.`);
        continue;
      }
      console.error(`    ❌ Tạo ${u.email} thất bại:`, error.message);
      continue;
    }

    if (u.role === "admin") {
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", data.user.id);
      if (roleError) {
        console.warn(`    ⚠️  Set admin role thất bại:`, roleError.message);
      }
    }

    console.log(`    ✅ ${u.email} (${u.role})`);
  }
  console.log("  ✅ profiles — seed hoàn tất.");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Kiểm tra và seed data mặc định...\n");

  try {
    await seedAppSettings();
    await seedHashtags();
    // seedAwards gọi seedAwardCategories bên trong nếu cần
    if (await isEmpty("award_categories")) {
      await seedAwardCategories();
    } else {
      console.log("  ✅ award_categories — đã có data, bỏ qua.");
    }
    await seedAwards();
    await seedProfiles();
  } catch (err) {
    console.error("\n❌ Seed thất bại:", err.message);
    process.exit(1);
  }

  console.log("\n🎉 Seed hoàn tất.");
}

main();
