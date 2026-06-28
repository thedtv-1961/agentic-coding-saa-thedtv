"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CountdownDigitBlock from "./countdown-digit-block";
import { calcTimeLeft, type TimeLeft } from "@/utils/calc-time-left";

interface Props {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: Props) {
  const t = useTranslations("countdown");
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

  useEffect(() => {
    // If launch date already passed on mount, redirect immediately
    const initial = calcTimeLeft(targetDate);
    if (initial.days === 0 && initial.hours === 0 && initial.minutes === 0) {
      router.replace("/");
      return;
    }

    const tick = setInterval(() => {
      const next = calcTimeLeft(targetDate);
      setTimeLeft(next);

      if (next.days === 0 && next.hours === 0 && next.minutes === 0) {
        clearInterval(tick);
        router.replace("/");
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [targetDate, router]);

  return (
    <div className="flex gap-6 items-end">
      <CountdownDigitBlock value={timeLeft.days} label={t("days")} />
      <CountdownDigitBlock value={timeLeft.hours} label={t("hours")} />
      <CountdownDigitBlock value={timeLeft.minutes} label={t("minutes")} />
    </div>
  );
}
