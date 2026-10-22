import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mule-platform/ui-kit';
import { ShieldBan, Send, UserCheck, CheckCircle2, X } from 'lucide-react';

interface AlertBulkActionBarProps {
  selectedCount: number;
  onFreeze: () => void;
  onEscalate: () => void;
  onAssignToMe: () => void;
  onDismiss: () => void;
  onClearSelection: () => void;
}

export const AlertBulkActionBar: React.FC<AlertBulkActionBarProps> = ({
  selectedCount,
  onFreeze,
  onEscalate,
  onAssignToMe,
  onDismiss,
  onClearSelection,
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[var(--surface)] border border-[var(--border)] shadow-xl rounded-[6px] px-3.5 py-2 flex items-center gap-4 text-[13px] select-none"
        >
          {/* Selected count info */}
          <div className="flex items-center gap-2 border-r border-[var(--border)] pr-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="font-semibold text-[var(--ink)] tabular-nums">
              {selectedCount}
            </span>
            <span className="text-[var(--ink-muted)]">selected</span>
            <button
              onClick={onClearSelection}
              className="p-1 hover:text-[var(--ink)] text-[var(--ink-muted)] transition-colors rounded-[2px]"
              title="Clear selection (Esc)"
              aria-label="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={onFreeze}
              shortcut="F"
              icon={<ShieldBan className="w-3.5 h-3.5" strokeWidth={1.5} />}
            >
              Freeze Accounts
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onEscalate}
              shortcut="E"
              icon={<Send className="w-3.5 h-3.5" strokeWidth={1.5} />}
            >
              Escalate STR
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onAssignToMe}
              icon={<UserCheck className="w-3.5 h-3.5" strokeWidth={1.5} />}
            >
              Assign to Me
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" strokeWidth={1.5} />}
            >
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
