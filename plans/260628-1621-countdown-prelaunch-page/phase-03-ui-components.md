---
phase: 3
title: "UI Components — Countdown Timer"
status: completed
priority: P1
effort: "~45m"
---

# Phase 3 — UI Components — Countdown Timer

## Overview

Implement 4 components theo Figma spec. Nền tối với họa tiết organic, title text, và 3 LED digit blocks (Days / Hours / Minutes). CountdownTimer là Client Component duy nhất (dùng setInterval).

## Design Spec

- **Background**: full-screen, dark overlay, organic colorful pattern
- **Title**: "Sự kiện sẽ bắt đầu sau" — centered, white, medium size
- **Digit blocks**: 2 chữ số dạng LED (hộp tối, số sáng), nhãn in hoa bên dưới
- **Layout**: vertical stack, căn giữa màn hình
- **Figma**: screenId `8PJQswPZmU`, fileKey `9ypp4enmFmdK3YAFJLIu6C`

## Component Tree

```
CountdownPage (Server)
├── CountdownBackground      — static, full-screen bg
├── CountdownTitle           — static label
└── CountdownTimer           — "use client", chạy đồng hồ
     └── CountdownDigitBlock × 3   — reusable digit + label
```

## Implementation Steps

### 1. countdown-background.tsx

```tsx
// app/components/countdown/countdown-background.tsx
export default function CountdownBackground() {
  return (
    <>
      {/* Background image — organic colorful pattern */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/countdown-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Dark overlay for contrast */}
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
    </>
  );
}
```

**Asset**: cần file `public/images/countdown-bg.jpg` — lấy từ Figma export hoặc placeholder tối.

### 2. countdown-title.tsx

```tsx
// app/components/countdown/countdown-title.tsx
import { useTranslations } from 'next-intl';

export default function CountdownTitle() {
  const t = useTranslations('countdown');
  return (
    <h1 className="text-white text-xl font-medium text-center tracking-wide">
      {t('title')}
    </h1>
  );
}
```

### 3. countdown-digit-block.tsx

```tsx
// app/components/countdown/countdown-digit-block.tsx
interface Props {
  value: number;
  label: string;
}

export default function CountdownDigitBlock({ value, label }: Props) {
  const digits = String(value).padStart(2, '0').split('');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {digits.map((digit, i) => (
          <div
            key={i}
            className="w-16 h-20 flex items-center justify-center bg-black/70 rounded-lg border border-white/10 text-white text-5xl font-bold font-mono"
          >
            {digit}
          </div>
        ))}
      </div>
      <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}
```

### 4. countdown-timer.tsx

```tsx
// app/components/countdown/countdown-timer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CountdownDigitBlock from './countdown-digit-block';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

interface Props {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: Props) {
  const router = useRouter();
  const t = useTranslations('countdown');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(targetDate));

  useEffect(() => {
    const tick = setInterval(() => {
      const next = calcTimeLeft(targetDate);
      setTimeLeft(next);

      if (next.days === 0 && next.hours === 0 && next.minutes === 0) {
        clearInterval(tick);
        router.push('/');
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [targetDate, router]);

  return (
    <div className="flex gap-6 items-end">
      <CountdownDigitBlock value={timeLeft.days} label={t('days')} />
      <CountdownDigitBlock value={timeLeft.hours} label={t('hours')} />
      <CountdownDigitBlock value={timeLeft.minutes} label={t('minutes')} />
    </div>
  );
}
```

**Lưu ý**: `calcTimeLeft` tính theo `minutes` — khi `minutes === 0` nhưng giây còn > 0, timer vẫn hiển thị 00 phút. Điều này chấp nhận được vì spec không có Seconds.

## Files to Create

- `app/components/countdown/countdown-background.tsx`
- `app/components/countdown/countdown-title.tsx`
- `app/components/countdown/countdown-digit-block.tsx`
- `app/components/countdown/countdown-timer.tsx`
- `public/images/countdown-bg.jpg` — background asset

## Success Criteria

- [ ] 3 LED digit blocks hiển thị đúng Days/Hours/Minutes
- [ ] Giá trị tự cập nhật mỗi giây (kiểm tra bằng target date gần)
- [ ] Khi về 00/00/00, `router.push('/')` được gọi
- [ ] Số luôn 2 chữ số (zero-padded: "05", "00")
- [ ] Responsive: layout không vỡ trên mobile
- [ ] Background image + overlay render đúng

## Where People Slip

- `setInterval` trong useEffect phải return cleanup — thiếu → memory leak
- `calcTimeLeft` dùng `Date.now()` mỗi lần tick, không dùng state cũ — tránh drift
- `padStart(2, '0')` phải áp dụng ở digit block, không ở timer — tách concerns rõ ràng
