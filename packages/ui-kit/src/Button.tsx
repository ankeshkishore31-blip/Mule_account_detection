import React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  shortcut?: string;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      shortcut,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'group relative inline-flex items-center justify-center font-medium rounded-[4px] border border-transparent transition-all duration-[120ms] active:scale-[0.985] active:duration-[90ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:opacity-50 disabled:pointer-events-none select-none';

    const sizeStyles = {
      sm: 'h-7 px-2 text-[12px] gap-1.5',
      md: 'h-8 px-3 text-[13px] gap-2',
    };

    const variantStyles = {
      primary:
        'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] border-[var(--accent)]',
      secondary:
        'bg-[var(--surface)] text-[var(--ink)] border-[var(--border)] hover:bg-[var(--surface-sunk)] hover:border-[var(--ink-muted)]/40',
      danger:
        'bg-[var(--danger)] text-[#FAF8F4] hover:opacity-95 border-[var(--danger)]',
      ghost:
        'bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunk)]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {shortcut && (
          <span className="hidden group-hover:inline-flex items-center px-1 text-[10px] font-mono leading-tight bg-[var(--surface-sunk)] text-[var(--ink-muted)] border border-[var(--border)] rounded-[2px] ml-1">
            {shortcut}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
