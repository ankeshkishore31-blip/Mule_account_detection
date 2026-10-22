import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Alert } from '@mule-platform/shared-types';
import { AlertTableRow } from './AlertTableRow';
import { AlertPeekPopover } from './AlertPeekPopover';

interface AlertVirtualTableProps {
  alerts: Alert[];
  selectedIds: Set<string>;
  activeAlertId: string | null;
  onToggleSelect: (id: string) => void;
  onSelectAlert: (alert: Alert) => void;
  onRevealPii: (alert: Alert) => void;
}

export const AlertVirtualTable: React.FC<AlertVirtualTableProps> = ({
  alerts,
  selectedIds,
  activeAlertId,
  onToggleSelect,
  onSelectAlert,
  onRevealPii,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [peekState, setPeekState] = React.useState<{
    alert: Alert | null;
    rect: DOMRect | null;
  }>({ alert: null, rect: null });

  const rowVirtualizer = useVirtualizer({
    count: alerts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // 36px dense row height
    overscan: 10,
  });

  const handlePeekHover = (alert: Alert, rect: DOMRect) => {
    setPeekState({ alert, rect });
  };

  const handlePeekLeave = () => {
    setPeekState({ alert: null, rect: null });
  };

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto overflow-x-auto relative focus:outline-none"
      role="grid"
      aria-rowcount={alerts.length}
      tabIndex={0}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          minWidth: '920px',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const alert = alerts[virtualRow.index];
          if (!alert) return null;

          return (
            <div
              key={alert.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <AlertTableRow
                alert={alert}
                isSelected={selectedIds.has(alert.id)}
                isActive={activeAlertId === alert.id}
                onToggleSelect={onToggleSelect}
                onSelectRow={onSelectAlert}
                onPeekHover={handlePeekHover}
                onPeekLeave={handlePeekLeave}
                onRevealPii={onRevealPii}
              />
            </div>
          );
        })}
      </div>

      {/* 400ms Peek Popover */}
      {peekState.alert && peekState.rect && (
        <AlertPeekPopover
          alert={peekState.alert}
          position={{ top: peekState.rect.top, left: peekState.rect.right }}
        />
      )}
    </div>
  );
};
