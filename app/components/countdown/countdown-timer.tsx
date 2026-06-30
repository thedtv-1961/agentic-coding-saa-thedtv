"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CountdownDigitBlock from "./countdown-digit-block";
import { calcTimeLeft, type TimeLeft } from "@/utils/calc-time-left";

interface Props {
  targetDate: string;
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0 };

export default function CountdownTimer({ targetDate }: Props) {
  const t = useTranslations("countdown");
  const router = useRouter();
  // Không dùng lazy init để tránh hydration mismatch (server/client dùng Date.now() khác nhau)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO);

  useEffect(() => {
    const tick = () => {
      const next = calcTimeLeft(targetDate);
      setTimeLeft(next);

      if (next.days === 0 && next.hours === 0 && next.minutes === 0) {
        router.replace("/");
        return false;
      }
      return true;
    };

    if (!tick()) return;

    const id = setInterval(() => {
      if (!tick()) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [targetDate, router]);

  return (
    <div className="flex gap-6 items-end">
      <CountdownDigitBlock value={timeLeft.days} label={t("days")} />
      <CountdownDigitBlock value={timeLeft.hours} label={t("hours")} />
      <CountdownDigitBlock value={timeLeft.minutes} label={t("minutes")} />
    </div>
  );
}
