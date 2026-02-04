'use client';

import { Progress } from '@/components/ui/progress';
import TimerDisplay from '@/components/shared/TimerDisplay';

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
}

export default function QuizHeader({
  currentQuestion,
  totalQuestions,
  timeLeft,
}: QuizHeaderProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          প্রশ্ন {currentQuestion + 1} / {totalQuestions}
        </h2>
        <TimerDisplay timeLeft={timeLeft} />
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
