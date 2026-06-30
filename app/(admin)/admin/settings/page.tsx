export const runtime = 'edge';

import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import { SettingsTable } from "@/app/components/admin/settings-table";

const EDITABLE_KEYS = ["countdown_date"] as const;

interface SettingRow {
  key: string;
  value: string | null;
}

export default async function AdminSettingsPage() {
  const { isAdmin } = await getUserWithRole();
  if (!isAdmin) redirect("/admin");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("key, value");

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Failed to load settings: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">App Settings</h1>
      <SettingsTable
        rows={(data as SettingRow[]) ?? []}
        editableKeys={[...EDITABLE_KEYS]}
      />
    </div>
  );
}
