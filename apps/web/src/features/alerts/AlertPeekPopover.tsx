import React from 'react';
import { Alert } from '@mule-platform/shared-types';
import { ShieldAlert, Zap, Network, CornerDownRight } from 'lucide-react';

interface AlertPeekPopoverProps {
  alert: Alert | null;
  position: { top: number; left: number } | null;
}

export const AlertPeekPopover: React.FC<AlertPeekPopoverProps> = ({ alert, position }) => {
  if (!alert || !position) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: Math.min(window.innerHeight - 280, Math.max(50, position.top)),
        left: Math.min(window.innerWidth - 380, position.left + 24),
        zIndex: 50,
      }}
      className="w-[340px] bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] rounded-[6px] shadow-lg p-3 text-[12px] pointer-events-none animate-in fade-in zoom-in-95 duration-[140ms]"
      role="tooltip"
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
          <span>Signals Peek · {alert.id}</span>
        </div>
        <span className="font-mono text-[11px] text-[var(--ink-muted)]">
          Score: <strong className="text-[var(--ink)]">{alert.riskScore}</strong>
        </span>
      </div>

      {/* Account Info Line */}
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-[var(--ink-muted)] bg-[var(--surface-sunk)] px-2 py-1 rounded-[3px]">
        <span>{alert.accountId}</span>
        <span>{alert.upiHandleMasked}</span>
      </div>

      {/* 3 Key Signals */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase font-semibold text-[var(--ink-faint)] tracking-wider">
          Top Heuristic Signals (Rule Engine)
        </div>
        {alert.signals.map((sig, idx) => (
          <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
            <span className="shrink-0 text-[var(--accent)] mt-0.5">
              {idx === 0 ? (
                <Zap className="w-3 h-3" strokeWidth={1.5} />
              ) : idx === 1 ? (
                <Network className="w-3 h-3" strokeWidth={1.5} />
              ) : (
                <CornerDownRight className="w-3 h-3" strokeWidth={1.5} />
              )}
            </span>
            <span className="text-[var(--ink)]">{sig}</span>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="mt-2.5 pt-2 border-t border-[var(--border)] grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--ink-muted)]">
        <div>
          Pass-Through: <span className="tabular-nums text-[var(--ink)]">{alert.passThroughRatio}</span>
        </div>
        <div className="text-right">
          Degree: <span className="tabular-nums text-[var(--ink)]">{alert.graphDegree} edges</span>
        </div>
      </div>
    </div>
  );
};
