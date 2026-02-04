"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuestionCard from "@/components/quiz/QuestionCard";
import FloatingSubmitButton from "./FloatingSubmitButton";
// Removed per serial layout: no next/prev navigation
import { Question } from "@/lib/types";
import { submitExamAction } from "@/actions/submitExam";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Clock, CheckCircle } from "lucide-react";

export default function ExamClient({ deadlineEpoch, questions }: { deadlineEpoch: number; questions: Question[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.floor((deadlineEpoch - Date.now()) / 1000)));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showSubmitAnimation, setShowSubmitAnimation] = useState(false);

  // Local timer
  React.useEffect(() => {
    if (submitted) return;
    const update = () => setTimeLeft(Math.max(0, Math.floor((deadlineEpoch - Date.now()) / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [deadlineEpoch, submitted]);

  const doSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitAnimation(true);
    setConfirmOpen(false);
    
    try {
      const fd = new FormData();
      fd.set("answers", JSON.stringify(answers));
      await submitExamAction(fd);
      
      // This code won't execute because submitExamAction redirects
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      setShowSubmitAnimation(false);
    }
  };

  const onTimeUp = useCallback(async () => {
    if (!submitted && !isSubmitting) {
      setIsSubmitting(true);
      setShowSubmitAnimation(true);
      
      try {
        const fd = new FormData();
        fd.set("answers", JSON.stringify(answers));
        await submitExamAction(fd);
        
        // This code won't execute because submitExamAction redirects
        setSubmitted(true);
      } catch (error) {
        console.error('Auto-submission error:', error);
      }
    }
  }, [submitted, isSubmitting, answers]);

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

        {/* Submit button - Hidden, replaced by floating button */}
        <div className="hidden">
          <Button onClick={() => setConfirmOpen(true)} disabled={answers.every((a) => a === null)}>
            Submit
          </Button>
        </div>
      </div>

      {/* Floating Submit Button */}
      <FloatingSubmitButton 
        onSubmit={() => setConfirmOpen(true)}
        isSubmitting={isSubmitting}
        submitted={submitted}
        answeredCount={answers.filter(a => a !== null).length}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        disabled={answers.every((a) => a === null)}
      />

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <Send className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Submit Exam?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                You have answered {answers.filter(a => a !== null).length} out of {questions.length} questions.
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-6">
                ⚠️ You will not be able to change answers after submitting.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmOpen(false)}
                  className="px-6 py-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={doSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Exam'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Animation Overlay */}
      {showSubmitAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="text-center space-y-6 bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <div className="relative">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-blue-400/30 animate-ping"></div>
                <div className="absolute w-24 h-24 rounded-full border-4 border-purple-400/50 animate-ping animation-delay-150"></div>
                <div className="absolute w-16 h-16 rounded-full border-4 border-pink-400/70 animate-ping animation-delay-300"></div>
              </div>
              
              {/* Center icon */}
              <div className="relative z-10 flex items-center justify-center w-32 h-32 mx-auto">
                {submitted ? (
                  <CheckCircle className="w-20 h-20 text-green-400 animate-bounce" />
                ) : (
                  <Loader2 className="w-20 h-20 text-blue-400 animate-spin" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                {submitted ? 'Exam Submitted Successfully!' : 'Submitting Your Exam...'}
              </h2>
              <p className="text-blue-200">
                {submitted ? 'Redirecting to results...' : 'Please wait while we process your answers'}
              </p>
              
              {!submitted && (
                <div className="flex items-center justify-center space-x-1 mt-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-200"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
