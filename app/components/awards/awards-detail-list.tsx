import type { GroupedAward } from "@/types/awards";
import { nameToSlug } from "@/types/awards";
import AwardDetailCard from "./award-detail-card";

interface Props {
  grouped: GroupedAward[];
}

export default function AwardsDetailList({ grouped }: Props) {
  return (
    <div className="flex flex-col gap-20">
      {grouped.map((g, index) => {
        const slug = nameToSlug(g.category.name);
        return (
          <section key={g.category.id} id={slug} className="scroll-mt-28">
            <AwardDetailCard grouped={g} reverse={index % 2 !== 0} />
          </section>
        );
      })}
    </div>
  );
}
