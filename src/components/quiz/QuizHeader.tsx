'use client';

import { Progress } from '@/components/ui/progress';
import TimerDisplay from '@/components/shared/TimerDisplay';

interface QuizHeaderProps {
  answeredCount: number;
  totalQuestions: number;
  timeLeft: number;
}

export default function QuizHeader({
  answeredCount,
  totalQuestions,
  timeLeft,
}: QuizHeaderProps) {
  const progress = Math.min(100, Math.floor((answeredCount / totalQuestions) * 100));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          উত্তর দেয়া: {answeredCount} / {totalQuestions}
        </h2>
        <TimerDisplay timeLeft={timeLeft} />
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
