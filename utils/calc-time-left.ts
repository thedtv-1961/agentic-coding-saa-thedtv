export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

export function calcTimeLeft(targetDate: string): TimeLeft {
  const ms = new Date(targetDate).getTime();
  const diff = isNaN(ms) ? -1 : ms - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}
