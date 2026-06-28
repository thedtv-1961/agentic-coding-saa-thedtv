interface Props {
  value: number;
  label: string;
}

export default function CountdownDigitBlock({ value, label }: Props) {
  // Always display exactly 2 digits — clamp to 99 max per spec (LED 2-digit design)
  const display = Math.min(value, 99);
  const digits = String(display).padStart(2, "0").split("");

  return (
    <div
      className="flex flex-col items-center gap-3"
      aria-label={`${String(display).padStart(2, "0")} ${label.toLowerCase()}`}
    >
      <div className="flex gap-2">
        {digits.map((digit, i) => (
          <div
            key={i}
            data-testid="digit"
            className="w-16 h-20 flex items-center justify-center rounded-lg border border-white/25 bg-white/10 backdrop-blur-sm text-white text-5xl leading-none"
            style={{ fontFamily: "'DSEG7Classic', monospace" }}
          >
            {digit}
          </div>
        ))}
      </div>
      <span className="text-white text-xs font-bold tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}
