import { createClient } from "@supabase/supabase-js";

const FALLBACK_DATE = "2026-12-20T00:00:00+07:00";

export async function getCountdownDate(): Promise<string> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return FALLBACK_DATE;

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "countdown_date")
    .single();

  if (error || !data?.value) return FALLBACK_DATE;
  return data.value as string;
}
