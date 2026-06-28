import { createClient } from "@/utils/supabase/server";
import HeaderNav from "./header-nav";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md">
      <HeaderNav userAvatarUrl={avatarUrl} />
    </header>
  );
}
