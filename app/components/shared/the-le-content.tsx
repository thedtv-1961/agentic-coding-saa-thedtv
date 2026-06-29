// Static presentational content for Thể Lệ SAA 2025 — dark theme v2
// Text content sourced from MoMorph node tree (screenId: b1Filzi9i6)

import Image from "next/image";

const HERO_BADGES = [
  {
    name: "New Hero",
    src: "/images/the-le/new-hero.png",
    threshold: "Có 1-4 người gửi Kudos cho bạn",
    desc: "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.",
  },
  {
    name: "Rising Hero",
    src: "/images/the-le/rising-hero.png",
    threshold: "Có 5-9 người gửi Kudos cho bạn",
    desc: "Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.",
  },
  {
    name: "Super Hero",
    src: "/images/the-le/super-hero.png",
    threshold: "Có 10–20 người gửi Kudos cho bạn",
    desc: "Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.",
  },
  {
    name: "Legend Hero",
    src: "/images/the-le/legend-hero.png",
    threshold: "Có hơn 20 người gửi Kudos cho bạn",
    desc: "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.",
  },
] as const;

const COLLECTION_BADGES = [
  { name: "REVIVAL", src: "/images/the-le/revival.png" },
  { name: "TOUCH OF LIGHT", src: "/images/the-le/touch-of-light.png" },
  { name: "STAY GOLD", src: "/images/the-le/stay-gold.png" },
  { name: "FLOW TO HORIZON", src: "/images/the-le/flow-to-horizon.png" },
  { name: "BEYOND THE BOUNDARY", src: "/images/the-le/beyond-the-boundary.png" },
  { name: "ROOT FURTHER", src: "/images/the-le/root-further.png" },
] as const;

export default function TheLEContent() {
  return (
    <div className="px-10 pt-6 pb-4 space-y-6 text-white">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white">Thể lệ</h1>

      {/* Section 1: Người nhận Kudos */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wide text-[#FFEA9E]">
          Người nhận Kudos: Huy hiệu Hero cho những ảnh hưởng tích cực
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được
          hiển thị trực tiếp cạnh tên profile
        </p>
        <div className="space-y-3">
          {HERO_BADGES.map((badge) => (
            <div key={badge.name} className="flex items-start gap-3">
              <Image
                src={badge.src}
                alt={badge.name}
                width={120}
                height={32}
                className="shrink-0 mt-0.5 object-contain"
              />
              <div>
                <p className="text-xs font-medium text-white/90">{badge.threshold}</p>
                <p className="text-xs text-white/60 leading-relaxed mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Người gửi Kudos */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wide text-[#FFEA9E]">
          Người gửi Kudos: Sưu tập trọn bộ 6 icon, nhận ngay phần quà bí ẩn
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng
          đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một
          trong 6 icon độc quyền của SAA.
        </p>

        {/* 3×2 badge grid */}
        <div className="grid grid-cols-3 gap-4">
          {COLLECTION_BADGES.map((badge) => (
            <div key={badge.name} className="flex flex-col items-center gap-2">
              <Image
                src={badge.src}
                alt={badge.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-white/60 leading-relaxed">
          Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.
        </p>
      </section>

      {/* Section 3: Kudos Quốc Dân */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-[#FFEA9E]">
          Kudos Quốc Dân
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được
          trao phần quà đặc biệt từ SAA 2025: Root Further.
        </p>
      </section>

      {/* Bottom spacer for fixed footer */}
      <div className="h-2" />
    </div>
  );
}
