import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    // middleware.ts không tích hợp next-intl middleware nên requestLocale luôn undefined.
    // Đọc trực tiếp từ cookie NEXT_LOCALE mà language-switcher đã set.
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    locale =
      cookieLocale && (routing.locales as readonly string[]).includes(cookieLocale)
        ? cookieLocale
        : routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
