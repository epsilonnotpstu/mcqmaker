'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('relative w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10', className)}>
      <div className="h-2 bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
