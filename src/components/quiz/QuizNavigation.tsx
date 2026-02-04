'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

export default function QuizNavigation({
  currentQuestion,
  totalQuestions,
  onPrev,
  onNext,
  onSubmit,
  // intentionally not destructuring `canSubmit` because it's unused
}: QuizNavigationProps) {
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === totalQuestions - 1;

  return (
    <div className="flex justify-between items-center gap-4">
      <Button
        onClick={onPrev}
        disabled={isFirst}
        variant="outline"
        size="lg"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        পূর্ববর্তী
      </Button>

      <div className="flex gap-3">
        {!isLast && (
          <Button onClick={onNext} size="lg">
            পরবর্তী
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
        
        <Button
          onClick={onSubmit}
          variant="default"
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="w-4 h-4 mr-2" />
          জমা দিন
        </Button>
      </div>
    </div>
  );
}
