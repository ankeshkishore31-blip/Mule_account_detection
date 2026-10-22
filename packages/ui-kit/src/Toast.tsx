import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { RotateCcw, X } from 'lucide-react';
import { cn } from './utils';

export interface ToastProps {
  id: string;
  message: string;
  durationMs?: number;
  onUndo?: () => void;
  onDismiss: () => void;
}

export const UndoToast: React.FC<ToastProps> = ({
  message,
  durationMs = 5000,
  onUndo,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remaining);
      if (elapsed >= durationMs) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'relative overflow-hidden flex items-center justify-between gap-3 px-3.5 py-2.5',
        'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] shadow-md rounded-[6px]',
        'min-w-[320px] max-w-[420px]'
      )}
    >
      <div className="flex items-center gap-2 text-[13px] font-medium leading-none">
        <span>{message}</span>
      </div>

      <div className="flex items-center gap-2">
        {onUndo && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onUndo}
            icon={<RotateCcw className="w-3.5 h-3.5 text-[var(--accent)]" />}
          >
            Undo
          </Button>
        )}
        <button
          onClick={onDismiss}
          className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-0.5 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar at the bottom */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] transition-all duration-[50ms]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
