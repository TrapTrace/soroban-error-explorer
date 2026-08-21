import React from 'react';

export default function ResourceGauge({ label, current = 0, max = 100000000, unit = 'instructions', warnPct = 0.70, critPct = 0.90 }) {
  const pct = max > 0 ? Math.min(Math.max((current / max) * 100, 0), 100) : 0;
  
  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
  let statusText = 'Normal';

  if (pct >= critPct * 100) {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-400 bg-rose-950/40 border-rose-800/40';
    statusText = pct >= 100 ? 'EXCEEDED' : 'High Load';
  } else if (pct >= warnPct * 100) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-400 bg-amber-950/40 border-amber-800/40';
    statusText = 'Moderate';
  }

  const formatVal = (val) => {
    if (unit === 'instructions') {
      return val >= 1_000_000 ? `${(val / 1_000_000).toFixed(2)}M` : val.toLocaleString();
    }
    if (unit === 'bytes') {
      return val >= 1024 * 1024 ? `${(val / (1024 * 1024)).toFixed(2)} MB` : `${(val / 1024).toFixed(1)} KB`;
    }
    return val.toLocaleString();
  };

  return (
    <div className="bg-ink-900/60 p-3 rounded-lg border border-ink-800">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-mono font-medium text-paper-200">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-paper-400">
            {formatVal(current)} / {formatVal(max)}
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${badgeColor}`}>
            {pct.toFixed(1)}% {statusText !== 'Normal' && `• ${statusText}`}
          </span>
        </div>
      </div>
      <div className="w-full bg-ink-950 rounded-full h-2 overflow-hidden border border-ink-800/50">
        <div 
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
