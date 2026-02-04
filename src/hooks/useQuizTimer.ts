import { useEffect, useRef } from 'react';
import { useQuizStore } from '@/store/quizStore';

export function useQuizTimer(onTimeUp: () => void) {
  const { timeLeft, decrementTime, submitted } = useQuizStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (submitted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [submitted, decrementTime]);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      onTimeUp();
    }
  }, [timeLeft, submitted, onTimeUp]);

  return timeLeft;
}
