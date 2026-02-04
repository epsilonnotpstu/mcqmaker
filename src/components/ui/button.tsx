'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'destructive' | 'ghost' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function Button({ children, className, variant = 'default', size = 'md', ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none';
  const sizes: Record<Size, string> = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4',
    lg: 'h-11 px-6 text-base',
  };
  const variants: Record<Variant, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    outline: 'border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/10',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
  };

  return (
    <button {...rest} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </button>
  );
}
