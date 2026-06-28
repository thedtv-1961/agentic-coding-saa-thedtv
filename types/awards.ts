export type Award = {
  id: string;
  category:
    | "top_talent"
    | "top_project"
    | "top_project_leader"
    | "best_manager"
    | "signature_creator"
    | "mvp";
  title: string;
  description: string;
};

export const AWARD_META: Record<
  Award["category"],
  { image: string; slug: string }
> = {
  top_talent: {
    image: "/images/awards/top-talent.png",
    slug: "top-talent",
  },
  top_project: {
    image: "/images/awards/top-project.png",
    slug: "top-project",
  },
  top_project_leader: {
    image: "/images/awards/top-project-leader.png",
    slug: "top-project-leader",
  },
  best_manager: {
    image: "/images/awards/best-manager.png",
    slug: "best-manager",
  },
  signature_creator: {
    image: "/images/awards/signature-2025-creator.png",
    slug: "signature-2025-creator",
  },
  mvp: {
    image: "/images/awards/mvp.png",
    slug: "mvp",
  },
};
