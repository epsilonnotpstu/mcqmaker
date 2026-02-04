"use client";

import React, { useCallback, useState } from "react";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuestionCard from "@/components/quiz/QuestionCard";
// Removed per serial layout: no next/prev navigation
import { Question } from "@/lib/types";
import { submitExamAction } from "@/actions/submitExam";
import { Button } from "@/components/ui/button";

export default function ExamClient({ deadlineEpoch, questions }: { deadlineEpoch: number; questions: Question[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.floor((deadlineEpoch - Date.now()) / 1000)));
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <QuizHeader
          answeredCount={answers.filter((a) => a !== null).length}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
        />

        {/* Serial list of questions */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id ?? idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <p className="text-sm font-semibold mb-2">Question {idx + 1}</p>
              <QuestionCard
                question={q}
                selectedAnswer={answers[idx]}
                onSelectAnswer={(choice) => setAnswer(idx, choice)}
              />
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-4">
          <Button onClick={() => setConfirmOpen(true)} disabled={answers.every((a) => a === null)}>
            Submit
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Submit Exam?</h3>
            <p className="text-sm text-gray-600 mb-4">You won’t be able to change answers after submitting.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={doSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
