export type AwardCategory = {
  id: number;
  name: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  is_active: boolean;
};

export type Award = {
  id: number;
  category_id: number;
  number_of_winners: number;
  winner_unit: number | null; // 1=Cá nhân, 2=Tập thể, 3=Đơn vị, null=không áp dụng
  prize_value: number; // raw VNĐ (bigint)
  is_active: boolean;
  award_categories: AwardCategory;
};

export const WINNER_UNIT_LABEL: Record<number, string> = {
  1: "Cá nhân",
  2: "Tập thể",
  3: "Đơn vị",
};

export type GroupedAward = {
  category: AwardCategory;
  items: Award[];
};

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
