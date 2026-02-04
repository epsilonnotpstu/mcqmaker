"use client";

import React, { useCallback, useState } from "react";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizNavigation from "@/components/quiz/QuizNavigation";
import { Question } from "@/lib/types";
import { submitExamAction } from "@/actions/submitExam";

export default function ExamClient({ deadlineEpoch, questions }: { deadlineEpoch: number; questions: Question[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Local timer
  React.useEffect(() => {
    if (submitted) return;
    const update = () => setTimeLeft(Math.max(0, Math.floor((deadlineEpoch - Date.now()) / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [deadlineEpoch, submitted]);

  const doSubmit = async () => {
    setSubmitted(true);
    const fd = new FormData();
    fd.set("answers", JSON.stringify(answers));
    await submitExamAction(fd);
  };

  const onTimeUp = useCallback(() => {
    if (!submitted) {
      setSubmitted(true);
      const fd = new FormData();
      fd.set("answers", JSON.stringify(answers));
      // Fire and forget; page will redirect after server action
      submitExamAction(fd);
    }
  }, [submitted, answers]);

  React.useEffect(() => {
    if (timeLeft <= 0 && !submitted) onTimeUp();
  }, [timeLeft, submitted, onTimeUp]);

  const setAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => {
      const cp = [...prev];
      if (cp[questionIndex] === null) cp[questionIndex] = answerIndex;
      return cp;
    });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <QuizHeader currentQuestion={currentQuestionIndex} totalQuestions={questions.length} timeLeft={timeLeft} />

        <QuestionCard question={currentQuestion} selectedAnswer={currentAnswer} onSelectAnswer={(idx) => setAnswer(currentQuestionIndex, idx)} />

        <QuizNavigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrev={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentQuestionIndex((i) => Math.min(questions.length - 1, i + 1))}
          onSubmit={doSubmit}
          canSubmit={answers.every((a) => a !== null)}
        />

        {/* Question grid */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm font-semibold mb-3">প্রশ্ন স্ট্যাটাস:</p>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
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
        </div>
      </div>
    </div>
  );
}
