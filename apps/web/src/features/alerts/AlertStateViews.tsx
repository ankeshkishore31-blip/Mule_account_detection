import React, { useState } from 'react';
import { TableSkeletonRow, Button } from '@mule-platform/ui-kit';
import { AlertTriangle, ChevronDown, ChevronRight, RotateCcw, WifiOff } from 'lucide-react';

export const AlertTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 12 }) => {
  return (
    <div className="w-full flex flex-col" aria-busy="true" aria-label="Loading alerts queue">
      {Array.from({ length: rows }).map((_, i) => (
        <TableSkeletonRow key={i} />
      ))}
    </div>
  );
};

export const AlertEmptyState: React.FC<{ onResetFilters: () => void }> = ({ onResetFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4 select-none">
      <p className="text-[13px] text-[var(--ink-muted)] mb-3">
        No mule account alerts match the current filter criteria or queue query.
      </p>
      <Button variant="secondary" size="sm" onClick={onResetFilters}>
        Reset filters to default queue
      </Button>
    </div>
  );
};

interface AlertErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export const AlertErrorState: React.FC<AlertErrorStateProps> = ({ error, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-6 m-4 bg-[var(--surface)] border border-[var(--danger)]/30 rounded-[6px] max-w-[620px]">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" strokeWidth={1.5} />
        <div className="space-y-2 flex-1">
          <div className="font-semibold text-[14px] text-[var(--ink)]">
            Unable to load alert queue from Core Rule Engine
          </div>
          <p className="text-[13px] text-[var(--ink-muted)]">
            {error?.message || 'The upstream mule detection inference service timed out or was temporarily unreachable.'}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retry Connection
            </Button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[12px] text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1 font-mono transition-colors"
            >
              {showDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span>Technical details</span>
            </button>
          </div>

          {showDetails && (
            <pre className="mt-3 p-2.5 bg-[var(--surface-sunk)] border border-[var(--border)] rounded-[4px] text-[11px] font-mono text-[var(--ink-muted)] overflow-x-auto whitespace-pre-wrap">
              {error?.stack || JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export const OfflineBanner: React.FC<{ lastSyncedTime?: string; onReconnect?: () => void }> = ({
  lastSyncedTime = '14:22 IST',
  onReconnect,
}) => {
  return (
    <div
      role="status"
      className="h-7 px-3 bg-[var(--warn)]/10 text-[var(--warn)] border-b border-[var(--warn)]/25 flex items-center justify-between text-[11px] font-medium shrink-0"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Reconnecting — showing cached snapshot from {lastSyncedTime}</span>
      </div>
      {onReconnect && (
        <button
          onClick={onReconnect}
          className="underline hover:opacity-80 transition-opacity font-mono text-[10px]"
        >
          Force sync now
        </button>
      )}
    </div>
  );
};
