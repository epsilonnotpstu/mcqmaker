'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'destructive';

export function Alert({ children, className = '', variant = 'default', ...rest }: { children?: React.ReactNode; className?: string; variant?: Variant }) {
  const base = 'relative w-full rounded-lg border px-4 py-3 text-sm';
  const variants: Record<Variant, string> = {
    default: 'border-border bg-card text-foreground',
    destructive: 'border-red-200 text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-200 dark:border-red-900',
  };
  return (
    <div role="alert" className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = '', ...rest }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mt-2', className)} {...rest}>
      {children}
    </div>
  );
}
