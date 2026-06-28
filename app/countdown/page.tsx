export const dynamic = "force-dynamic";

import { getCountdownDate } from "@/utils/supabase/get-countdown-date";
import CountdownBackground from "@/app/components/countdown/countdown-background";
import CountdownTitle from "@/app/components/countdown/countdown-title";
import CountdownTimer from "@/app/components/countdown/countdown-timer";

export default async function CountdownPage() {
  const targetDate = await getCountdownDate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <CountdownBackground />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <CountdownTitle />
        <CountdownTimer targetDate={targetDate} />
      </div>
    </div>
  );
}
