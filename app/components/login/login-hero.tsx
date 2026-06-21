import { getTranslations } from "next-intl/server";
import LoginButton from "./login-button";

interface LoginHeroProps {
  errorMessage?: string;
}

export default async function LoginHero({ errorMessage }: LoginHeroProps) {
  const t = await getTranslations("login");
  return (
    <section className="flex-1 flex flex-col justify-center px-12 pt-24 pb-20">
      <h1
        className="text-white font-bold leading-none mb-8 select-none"
        style={{ fontSize: "clamp(4rem, 10vw, 9rem)", letterSpacing: "-0.02em" }}
      >
        ROOT
        <br />
        FURTHER
      </h1>

      <p className="text-white/90 text-lg font-medium mb-1">
        {t("welcome_line1")}
      </p>
      <p className="text-white/90 text-lg font-medium mb-8">
        {t("welcome_line2")}
      </p>

      {errorMessage && (
        <p className="text-red-400 text-sm mb-4">{t("error_message")}</p>
      )}

      <LoginButton label={t("login_button")} />
    </section>
  );
}
