# Phase 03 — Login Page UI

**Status:** pending | **Priority:** high | **Effort:** ~2h

**Requires:** Phase 01 (next-intl), Phase 02 (auth action)

## MoMorph Refs

- Login screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz

## Design Summary

```
┌─────────────────────────────────────────┐
│ [Logo SAA]          [🇻🇳 VN ▼]          │  ← Header (fixed, transparent)
├─────────────────────────────────────────┤
│                                         │
│  ROOT                   [decorative     │
│  FURTHER                 background     │
│                          root pattern]  │
│  Bắt đầu hành trình...                 │
│  Đăng nhập để khám phá!                │
│                                         │
│  [ G  Đăng nhập bằng Google ]          │
│                                         │
├─────────────────────────────────────────┤
│      Bản quyền thuộc về Sun* © 2025     │  ← Footer (fixed bottom)
└─────────────────────────────────────────┘
```

## Assets (đã có)

```
public/images/login-background.png  (2880×2044)
public/images/saa-logo.png          (1517×1427)
public/icons/flag-vn.svg
public/icons/flag-en.svg
public/icons/google-logo.svg
```

## Files to Create

```
app/login/
├── page.tsx                    # Server Component (auth check + page shell)
└── layout.tsx                  # Optional: page metadata

app/components/login/
├── login-header.tsx            # Header: Logo + LanguageSwitcher
├── language-switcher.tsx       # Dropdown VN/EN (Client Component)
├── login-hero.tsx              # Key Visual + welcome text
├── login-button.tsx            # Google OAuth button (Client Component)
└── login-footer.tsx            # Copyright footer
```

## Implementation Steps

### 1. app/login/page.tsx (Server Component)

- Gọi `createClient()` + `supabase.auth.getUser()`
- Nếu đã đăng nhập → `redirect('/')`
- Lấy `searchParams.error` để hiển thị thông báo lỗi (nếu có)
- Render toàn bộ layout: Header + Hero + Footer
- Dùng `getTranslations('login')` cho server-side strings

```typescript
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import LoginHeader from '@/app/components/login/login-header';
import LoginHero from '@/app/components/login/login-hero';
import LoginFooter from '@/app/components/login/login-footer';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/');

  const { error } = await searchParams;
  const t = await getTranslations('login');

  return (
    <main className="relative min-h-screen bg-[#0d1117] overflow-hidden">
      {/* Background full-screen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login-background.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <LoginHeader />
        <LoginHero errorMessage={error} />
        <LoginFooter />
      </div>
    </main>
  );
}
```

### 2. app/components/login/login-header.tsx

- Logo (Next.js `<Image>`) click → navigate `/`
- Language Switcher bên phải

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from './language-switcher';

export default async function LoginHeader() {
  const t = await getTranslations('login');
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" aria-label={t('logo_alt')}>
        <Image
          src="/images/saa-logo.png"
          alt={t('logo_alt')}
          width={69}
          height={64}
          priority
        />
      </Link>
      <LanguageSwitcher />
    </header>
  );
}
```

### 3. app/components/login/language-switcher.tsx (Client Component)

- State: `open` (dropdown mở/đóng), `locale` (current: 'vi' | 'en')
- Click button → toggle dropdown
- Chọn locale → set cookie `NEXT_LOCALE`, reload page (`router.refresh()`)
- Hiển thị: flag icon + locale label + chevron
- Hover: highlight + pointer cursor

```typescript
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const LOCALES = [
  { code: 'vi', label: 'VN', flag: '/icons/flag-vn.svg' },
  { code: 'en', label: 'EN', flag: '/icons/flag-en.svg' },
] as const;

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  function selectLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`;
    setOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Image src={current.flag} alt={current.label} width={24} height={16} />
        <span className="text-white text-sm font-medium">{current.label}</span>
        <svg className={`w-4 h-4 text-white transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 bg-[#1a1a2e] border border-white/20 rounded-lg overflow-hidden shadow-lg"
        >
          {LOCALES.map((locale) => (
            <li key={locale.code}>
              <button
                role="option"
                aria-selected={locale.code === currentLocale}
                onClick={() => selectLocale(locale.code)}
                className="flex items-center gap-2 px-4 py-2 w-full text-left text-white text-sm hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Image src={locale.flag} alt={locale.label} width={24} height={16} />
                <span>{locale.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 4. app/components/login/login-hero.tsx

- "ROOT FURTHER" text lớn (dùng text, không phải image — font effect qua CSS)
- Welcome text 2 dòng từ translations
- Login button phía dưới
- Hiển thị error message nếu có

```typescript
import { getTranslations } from 'next-intl/server';
import LoginButton from './login-button';

interface LoginHeroProps {
  errorMessage?: string;
}

export default async function LoginHero({ errorMessage }: LoginHeroProps) {
  const t = await getTranslations('login');
  return (
    <section className="flex-1 flex flex-col justify-center px-12 pt-24 pb-20">
      <h1 className="text-white font-bold leading-none mb-8"
        style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', letterSpacing: '-0.02em' }}>
        ROOT<br />FURTHER
      </h1>
      <p className="text-white/90 text-lg font-medium mb-1">{t('welcome_line1')}</p>
      <p className="text-white/90 text-lg font-medium mb-8">{t('welcome_line2')}</p>

      {errorMessage && (
        <p className="text-red-400 text-sm mb-4">
          Đăng nhập thất bại. Vui lòng thử lại.
        </p>
      )}

      <LoginButton label={t('login_button')} />
    </section>
  );
}
```

### 5. app/components/login/login-button.tsx (Client Component)

- Màu nền: vàng nhạt (`#e8d5a3` theo design)
- Icon Google bên trái
- States: normal, hover (shadow/lighten), loading (spinner + disabled)
- Khi click → gọi server action `signInWithGoogle`

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signInWithGoogle } from '@/app/login/actions';

interface LoginButtonProps {
  label: string;
}

export default function LoginButton({ label }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await signInWithGoogle();
    // loading stays true during redirect
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-gray-900
        bg-[#e8d5a3] hover:bg-[#f0e0b0] hover:shadow-lg
        disabled:opacity-70 disabled:cursor-not-allowed
        transition-all duration-150 w-fit cursor-pointer"
    >
      {loading ? (
        <svg className="w-5 h-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <Image src="/icons/google-logo.svg" alt="Google" width={20} height={20} />
      )}
      <span>{label}</span>
    </button>
  );
}
```

### 6. app/components/login/login-footer.tsx

```typescript
import { getTranslations } from 'next-intl/server';

export default async function LoginFooter() {
  const t = await getTranslations('login');
  return (
    <footer className="relative z-10 text-center py-4 border-t border-white/10">
      <p className="text-white/70 text-sm font-medium">{t('footer')}</p>
    </footer>
  );
}
```

## Visual Spec Notes

| Element | Value |
|---------|-------|
| Background color | `#0d1117` (dark navy) |
| Background image | `/images/login-background.png`, `cover`, `center` |
| Dark overlay | `bg-black/40` |
| Header bg | transparent |
| "ROOT FURTHER" font | Bold, large, white, clamp(4rem, 10vw, 9rem) |
| Login button bg | `#e8d5a3` (warm cream/beige) |
| Footer border | `border-white/10` |

## Todo

- [ ] Tạo `app/login/page.tsx`
- [ ] Tạo `app/components/login/login-header.tsx`
- [ ] Tạo `app/components/login/language-switcher.tsx`
- [ ] Tạo `app/components/login/login-hero.tsx`
- [ ] Tạo `app/components/login/login-button.tsx`
- [ ] Tạo `app/components/login/login-footer.tsx`
- [ ] Chạy dev server, kiểm tra visual so với design
- [ ] `npm run build` không có lỗi

## Success Criteria

- Layout khớp design: Header cố định trên, Footer cố định dưới, Hero chiếm full height giữa
- Background image cover toàn màn hình với dark overlay
- Login button vàng nhạt, có loading spinner khi click
- Language switcher dropdown hiển thị flag + label, đổi locale khi chọn
- Logo click về `/`
- Error message hiển thị khi URL có `?error=`
