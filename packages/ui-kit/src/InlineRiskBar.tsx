import React from 'react';
import { cn } from './utils';

interface InlineRiskBarProps {
  score: number;
  className?: string;
}

export const InlineRiskBar: React.FC<InlineRiskBarProps> = ({ score, className }) => {
  const clampedScore = Math.max(0, Math.min(100, score));

  const barColor =
    clampedScore >= 80
      ? 'bg-[var(--danger)]'
      : clampedScore >= 60
      ? 'bg-[var(--warn)]'
      : clampedScore >= 40
      ? 'bg-[var(--secondary)]'
      : 'bg-[var(--accent)]';

  return (
    <div
      className={cn('inline-flex items-center justify-end gap-2', className)}
      aria-label={`Risk score ${clampedScore} out of 100`}
    >
      <span className="font-mono text-[12px] font-medium text-[var(--ink)] tabular-nums w-6 text-right">
        {clampedScore}
      </span>
      <div
        className="w-[40px] h-[5px] bg-[var(--surface-sunk)] border border-[var(--border)] rounded-[2px] overflow-hidden flex items-center p-[0.5px]"
        role="progressbar"
        aria-valuenow={clampedScore}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-[1px] transition-all duration-[160ms]', barColor)}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  );
};
