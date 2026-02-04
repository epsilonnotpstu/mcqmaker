'use client';

import { Clock } from 'lucide-react';
import { formatTime, getTimeColor } from '@/lib/time';

interface TimerDisplayProps {
  timeLeft: number;
}

export default function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5" />
      <span className="text-sm font-semibold">Time Left</span>
      <span
        aria-live="polite"
        className={`inline-flex items-center rounded-md border border-border px-2 py-1 font-mono text-lg font-bold ${getTimeColor(timeLeft)} bg-white dark:bg-gray-900`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
