'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'secondary' | 'destructive';

export function Badge({ children, className = '', variant = 'default', ...rest }: { children?: React.ReactNode; className?: string; variant?: Variant }) {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variants: Record<Variant, string> = {
    default: 'bg-blue-600 text-white border-transparent',
    outline: 'border-border text-foreground',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    destructive: 'bg-red-600 text-white border-transparent',
  };
  return (
    <span className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </span>
  );
}
