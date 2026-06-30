export const runtime = 'edge';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FabController } from "@/app/components/shared/fab-controller";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {children}
      <FabController userId={user.id} />
    </>
  );
}
