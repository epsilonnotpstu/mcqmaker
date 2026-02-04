'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>{children}</div>;
}

export function CardHeader({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>;
}
