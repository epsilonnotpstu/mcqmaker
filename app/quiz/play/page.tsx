'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/quizStore';
import { questions } from '@/lib/questions';
import { calculateScore } from '@/lib/score';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import QuizHeader from '@/components/quiz/QuizHeader';
import QuestionCard from '@/components/quiz/QuestionCard';
// Removed per serial layout: no next/prev navigation
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function QuizPlayPage() {
  const router = useRouter();
  const {
    answers,
    submitted,
    setAnswer,
    setSubmitted,
    resetQuiz,
  } = useQuizStore();

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const config = { marksPerCorrect: 4, negativePerWrong: -1, unattemptedPoints: 0 };
    const result = calculateScore(questions, answers, config);
    localStorage.setItem('quizResult', JSON.stringify(result));
    router.push('/result');
  }, [answers, setSubmitted, router]);

  useEffect(() => {
    resetQuiz(questions.length);
  }, [resetQuiz]);

  const handleTimeUp = useCallback(() => {
    if (!submitted) {
      handleSubmit();
    }
  }, [submitted, handleSubmit]);

  const timeLeft = useQuizTimer(handleTimeUp);

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswer(questionIndex, answerIndex);
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <QuizHeader
          answeredCount={answers.filter((a: number | null) => a !== null).length}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
        />

        {timeLeft <= 60 && timeLeft > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              সাবধান! মাত্র {timeLeft} সেকেন্ড বাকি আছে!
            </AlertDescription>
          </Alert>
        )}

        {/* Serial list of questions */}
        <div className="space-y-6">
          {questions.map((q, index: number) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <p className="text-sm font-semibold mb-2">Question {index + 1}</p>
              <QuestionCard
                question={q}
                selectedAnswer={answers[index]}
                onSelectAnswer={(ansIdx) => handleSelectAnswer(index, ansIdx)}
              />
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit} disabled={answers.every((a: number | null) => a === null)}>
            Submit
          </Button>
        </div>

        {/* Removed status grid in favor of serial layout */}
      </div>
    </div>
  );
}
