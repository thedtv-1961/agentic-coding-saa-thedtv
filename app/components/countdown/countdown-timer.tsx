"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import CountdownDigitBlock from "./countdown-digit-block";
import { calcTimeLeft, type TimeLeft } from "@/utils/calc-time-left";

interface Props {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: Props) {
  const t = useTranslations("countdown");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(targetDate));
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      const next = calcTimeLeft(targetDate);
      setTimeLeft(next);

      if (next.days === 0 && next.hours === 0 && next.minutes === 0) {
        clearInterval(tick);
        // Show "launched" state — the server (PRELAUNCH_MODE) controls the actual redirect.
        // Doing router.push('/') here would loop if PRELAUNCH_MODE is still true.
        setIsLaunched(true);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [targetDate]);

  if (isLaunched) {
    return (
      <p className="text-white text-2xl font-semibold animate-pulse">
        {t("launched")}
      </p>
    );
  }

  return (
    <div className="flex gap-6 items-end">
      <CountdownDigitBlock value={timeLeft.days} label={t("days")} />
      <CountdownDigitBlock value={timeLeft.hours} label={t("hours")} />
      <CountdownDigitBlock value={timeLeft.minutes} label={t("minutes")} />
    </div>
  );
}
