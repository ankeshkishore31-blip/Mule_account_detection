import React from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcutHint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ shortcutHint, leftIcon, className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-2.5 text-[var(--ink-muted)] pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full h-8 px-2.5 text-[13px] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] border border-[var(--border)] rounded-[4px] transition-colors duration-[120ms] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
            leftIcon && 'pl-8',
            shortcutHint && 'pr-8',
            className
          )}
          {...props}
        />
        {shortcutHint && (
          <kbd className="absolute right-2.5 px-1 py-0.5 text-[10px] font-mono text-[var(--ink-faint)] bg-[var(--surface-sunk)] border border-[var(--border)] rounded-[2px] pointer-events-none">
            {shortcutHint}
          </kbd>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
