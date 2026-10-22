import React from 'react';
import { QueueFilter } from '@mule-platform/shared-types';
import { Inbox, AlertTriangle, Network, Clock, ListFilter, AlertCircle, WifiOff } from 'lucide-react';
import { cn } from '@mule-platform/ui-kit';

interface FilterCounts {
  myQueue: number;
  highRisk: number;
  rings: number;
  newToday: number;
  all: number;
}

interface AlertFiltersRailProps {
  activeCategory: QueueFilter;
  onSelectCategory: (category: QueueFilter) => void;
  counts: FilterCounts;
  isSimulatedError: boolean;
  onToggleSimulateError: () => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
}

export const AlertFiltersRail: React.FC<AlertFiltersRailProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
  isSimulatedError,
  onToggleSimulateError,
  isOfflineMode,
  onToggleOffline,
}) => {
  const filterItems: Array<{
    id: QueueFilter;
    label: string;
    icon: React.ReactNode;
    count: number;
    shortcut: string;
  }> = [
    {
      id: 'MY_QUEUE',
      label: 'My queue',
      icon: <Inbox className="w-4 h-4" strokeWidth={1.5} />,
      count: counts.myQueue,
      shortcut: '1',
    },
    {
      id: 'HIGH_RISK',
      label: 'High risk (>= 75)',
      icon: <AlertTriangle className="w-4 h-4 text-[var(--warn)]" strokeWidth={1.5} />,
      count: counts.highRisk,
      shortcut: '2',
    },
    {
      id: 'RINGS',
      label: 'Syndicate rings',
      icon: <Network className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />,
      count: counts.rings,
      shortcut: '3',
    },
    {
      id: 'NEW_TODAY',
      label: 'New today',
      icon: <Clock className="w-4 h-4" strokeWidth={1.5} />,
      count: counts.newToday,
      shortcut: '4',
    },
    {
      id: 'ALL',
      label: 'All alerts',
      icon: <ListFilter className="w-4 h-4" strokeWidth={1.5} />,
      count: counts.all,
      shortcut: '5',
    },
  ];

  return (
    <aside className="w-56 bg-[var(--surface-sunk)] border-r border-[var(--border)] flex flex-col justify-between p-2 select-none shrink-0">
      <div>
        <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
          Saved Filters
        </div>
        <nav className="flex flex-col gap-0.5 mt-1" aria-label="Alert queue filters">
          {filterItems.map(item => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors duration-[120ms] text-left group',
                  isActive
                    ? 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] shadow-xs'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]/60 border border-transparent'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-full border',
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20'
                        : 'bg-[var(--surface)] text-[var(--ink-faint)] border-[var(--border)]'
                    )}
                  >
                    {item.count}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* State simulation testbed for reviewer testing */}
      <div className="p-2 border-t border-[var(--border)] flex flex-col gap-1.5 text-[11px] text-[var(--ink-muted)]">
        <span className="text-[10px] uppercase font-semibold text-[var(--ink-faint)] tracking-wider">
          State Inspector
        </span>
        <button
          onClick={onToggleSimulateError}
          className={cn(
            'flex items-center justify-between px-2 py-1 rounded-[3px] border transition-colors text-left',
            isSimulatedError
              ? 'bg-[var(--danger)]/15 border-[var(--danger)] text-[var(--danger)] font-medium'
              : 'border-[var(--border)] hover:bg-[var(--surface)]'
          )}
        >
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            Simulate 504 Error
          </span>
          <span className="font-mono text-[10px]">{isSimulatedError ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={onToggleOffline}
          className={cn(
            'flex items-center justify-between px-2 py-1 rounded-[3px] border transition-colors text-left',
            isOfflineMode
              ? 'bg-[var(--warn)]/15 border-[var(--warn)] text-[var(--warn)] font-medium'
              : 'border-[var(--border)] hover:bg-[var(--surface)]'
          )}
        >
          <span className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" strokeWidth={1.5} />
            Simulate Reconnecting
          </span>
          <span className="font-mono text-[10px]">{isOfflineMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </aside>
  );
};
