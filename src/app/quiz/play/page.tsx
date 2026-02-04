'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/quizStore';
import { questions } from '@/lib/questions';
import { calculateScore } from '@/lib/score';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import QuizHeader from '@/components/quiz/QuizHeader';
import QuestionCard from '@/components/quiz/QuestionCard';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuizPlayPage() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    answers,
    submitted,
    setCurrentQuestion,
    setAnswer,
    setSubmitted,
    resetQuiz,
  } = useQuizStore();

  // Initialize quiz
  useEffect(() => {
    resetQuiz(questions.length);
  }, [resetQuiz]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const result = calculateScore(questions, answers);
    localStorage.setItem('quizResult', JSON.stringify(result));
    router.push('/result');
  }, [answers, setSubmitted, router]);

  // Handle auto-submit when time's up
  const handleTimeUp = useCallback(() => {
    if (!submitted) {
      handleSubmit();
    }
  }, [submitted, handleSubmit]);

  const timeLeft = useQuizTimer(handleTimeUp);

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1);
    }
  };

  const handleSelectAnswer = (answerIndex: number) => {
    setAnswer(currentQuestionIndex, answerIndex);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <QuizHeader
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
        />

        {/* Time Warning */}
        {timeLeft <= 60 && timeLeft > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              সাবধান! মাত্র {timeLeft} সেকেন্ড বাকি আছে!
            </AlertDescription>
          </Alert>
        )}

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={currentAnswer}
          onSelectAnswer={handleSelectAnswer}
        />

        {/* Navigation */}
        <QuizNavigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canSubmit={answers.every((a: number | null) => a !== null)}
        />

        {/* Question Grid (Optional - shows which questions are answered) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm font-semibold mb-3">প্রশ্ন স্ট্যাটাস:</p>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`
                  w-10 h-10 rounded-md text-sm font-semibold
                  ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers[index] !== null
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>বর্তমান</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>উত্তর দেওয়া</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <span>বাকি</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
