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
      className="flex gap-2 flex-col"
      aria-label={`${String(display).padStart(2, "0")} ${label.toLowerCase()}`}
    >
      <div className="flex gap-1">
        {digits.map((digit, i) => (
          <div
            key={i}
            data-testid="digit"
            className="w-10 h-14 flex items-center justify-center rounded border border-white/25 bg-white/10 backdrop-blur-sm text-white text-3xl leading-none"
            style={{ fontFamily: "'DSEG7Classic', monospace" }}
          >
            {digit}
          </div>
        ))}
      </div>
      <p className="flex text-white text-xs font-bold tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}
