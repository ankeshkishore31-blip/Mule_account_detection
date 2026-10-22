import React, { forwardRef } from 'react';
import { RiskTier } from '@mule-platform/shared-types';
import { Input } from '@mule-platform/ui-kit';
import { Search } from 'lucide-react';

interface AlertQueueToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  riskTier: RiskTier | 'ALL';
  onRiskTierChange: (tier: RiskTier | 'ALL') => void;
}

export const AlertQueueToolbar = forwardRef<HTMLInputElement, AlertQueueToolbarProps>(
  ({ search, onSearchChange, riskTier, onRiskTierChange }, ref) => {
    return (
      <div className="h-10 px-3 border-b border-[var(--border)] flex items-center justify-between gap-3 bg-[var(--surface)] shrink-0 select-none">
        <div className="w-80">
          <Input
            ref={ref}
            placeholder="Filter by account, IFSC, UPI handle, or ALT ID (/)..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            shortcutHint="/"
            leftIcon={<Search className="w-3.5 h-3.5" />}
          />
        </div>

        <div className="flex items-center gap-1.5 text-[12px] font-mono text-[var(--ink-muted)]">
          <span>Filter Tier:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => onRiskTierChange(tier)}
              className={`px-2 py-0.5 rounded-[3px] text-[11px] border transition-colors ${
                riskTier === tier
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-medium'
                  : 'bg-[var(--surface-sunk)] text-[var(--ink-muted)] border-[var(--border)] hover:bg-[var(--surface)]'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

AlertQueueToolbar.displayName = 'AlertQueueToolbar';
