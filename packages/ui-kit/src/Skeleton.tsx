import React from 'react';
import { cn } from './utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--surface-sunk)] border border-[var(--border)]/40 rounded-[2px]',
        className
      )}
      {...props}
    />
  );
};

export const TableSkeletonRow: React.FC = () => {
  return (
    <div className="flex items-center h-[36px] px-3 border-b border-[var(--border)] gap-4 select-none">
      <Skeleton className="w-4 h-4 rounded-[2px]" />
      <Skeleton className="w-14 h-4" />
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-16 h-4" />
      <Skeleton className="w-12 h-4" />
      <Skeleton className="w-20 h-4 ml-auto" />
      <Skeleton className="w-16 h-4" />
    </div>
  );
};
