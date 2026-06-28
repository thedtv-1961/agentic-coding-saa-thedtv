import type { Award } from "@/types/awards";
import { AWARD_META } from "@/types/awards";
import AwardDetailCard from "./award-detail-card";

interface Props {
  awards: Award[];
}

export default function AwardsDetailList({ awards }: Props) {
  return (
    <div className="flex flex-col gap-20">
      {awards.map((award) => {
        const slug = AWARD_META[award.category]?.slug ?? award.category;
        return (
          <section key={award.id} id={slug} className="scroll-mt-28">
            <AwardDetailCard award={award} />
          </section>
        );
      })}
    </div>
  );
}
