import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginHeader from "@/app/components/login/login-header";
import LoginHero from "@/app/components/login/login-hero";
import LoginFooter from "@/app/components/login/login-footer";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/todo");

  const { error } = await searchParams;

  return (
    <main className="relative min-h-screen bg-[#0d1117] overflow-hidden">
      {/* Full-screen background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/login-background.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" aria-hidden="true" />

      {/* Page content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <LoginHeader />
        <LoginHero errorMessage={error} />
        <LoginFooter />
      </div>
    </main>
  );
}
