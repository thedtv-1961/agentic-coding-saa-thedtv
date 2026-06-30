import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import HeaderNav from "./header-nav";

export default async function Header() {
  const { user, isAdmin } = await getUserWithRole();
  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md">
      <HeaderNav userAvatarUrl={avatarUrl} isAdmin={isAdmin} />
    </header>
  );
}
