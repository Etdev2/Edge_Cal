interface UncertaintyBarProps {
  lower: number; // 0 to 1 (e.g. 0.48)
  upper: number; // 0 to 1 (e.g. 0.78)
  hitRate: number; // 0 to 1 (e.g. 0.65)
  breakEvenProb: number; // 0 to 1 (e.g. 0.524)
}

export function UncertaintyBar({
  lower,
  upper,
  hitRate,
  breakEvenProb,
}: UncertaintyBarProps) {
  // Clamp percentages between 0 and 100
  const lowerPct = Math.max(0, Math.min(100, lower * 100));
  const upperPct = Math.max(0, Math.min(100, upper * 100));
  const hitPct = Math.max(0, Math.min(100, hitRate * 100));
  const breakEvenPct = Math.max(0, Math.min(100, breakEvenProb * 100));

  const rangeWidth = Math.max(2, upperPct - lowerPct);

  // Status color
  let statusColor = "bg-amber-400";
  if (lower > breakEvenProb) {
    statusColor = "bg-emerald-500";
  } else if (upper < breakEvenProb) {
    statusColor = "bg-rose-500";
  }

  return (
    <div className="space-y-2 py-1">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-400">95% Uncertainty Range:</span>
        <span className="font-mono text-slate-200">
          {lowerPct.toFixed(1)}% — {upperPct.toFixed(1)}%
        </span>
      </div>

      {/* Bar container */}
      <div className="relative h-6 bg-slate-950 rounded-lg p-1 border border-slate-800 overflow-hidden">
        {/* Shaded 95% confidence interval region */}
        <div
          className={`absolute top-1 bottom-1 rounded opacity-30 ${statusColor}`}
          style={{
            left: `${lowerPct}%`,
            width: `${rangeWidth}%`,
          }}
        />

        {/* Break-even vertical reference line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-sm"
          style={{ left: `${breakEvenPct}%` }}
          title={`Break-even: ${breakEvenPct.toFixed(1)}%`}
        >
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
        </div>

        {/* Historical Hit Rate Point */}
        <div
          className="absolute top-1 bottom-1 w-2 rounded-full bg-white shadow-md z-20"
          style={{ left: `calc(${hitPct}% - 4px)` }}
          title={`Hit rate: ${hitPct.toFixed(1)}%`}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded bg-amber-400" />
          <span>Break-Even ({breakEvenPct.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
          <span>Sample Hit Rate ({hitPct.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}
