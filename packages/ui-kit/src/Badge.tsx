import React from 'react';
import { cn } from './utils';

export type BadgeVariant =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  className,
  children,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    critical: 'bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30',
    high: 'bg-[var(--warn)]/15 text-[var(--warn)] border-[var(--warn)]/30',
    medium: 'bg-[var(--secondary-soft)] text-[var(--secondary)] border-[var(--secondary)]/30',
    low: 'bg-[var(--surface-sunk)] text-[var(--ink-muted)] border-[var(--border)]',
    neutral: 'bg-[var(--surface-sunk)] text-[var(--ink-muted)] border-[var(--border)]',
    accent: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30',
    success: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30',
    warning: 'bg-[var(--warn)]/15 text-[var(--warn)] border-[var(--warn)]/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-medium leading-none rounded-full border tabular-nums select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
