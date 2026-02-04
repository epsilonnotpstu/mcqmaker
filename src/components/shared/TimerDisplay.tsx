'use client';

import { Clock } from 'lucide-react';
import { formatTime, getTimeColor } from '@/lib/time';

interface TimerDisplayProps {
  timeLeft: number;
}

export default function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  return (
    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimeColor(timeLeft)}`}>
      <Clock className="w-5 h-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
}
