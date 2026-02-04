"use client";

import React, { useCallback, useState } from "react";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizNavigation from "@/components/quiz/QuizNavigation";
import { Question } from "@/lib/types";
import { submitExamAction } from "@/actions/submitExam";
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Lock, Timer, CheckCircle, BookOpen, Target } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            অনলাইন পরীক্ষা চলমান
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MCQ পরীক্ষা
          </h1>
        </div>

        {/* Warning Message - Prominent */}
        <Card className="border-2 border-red-200 bg-red-50/80 dark:bg-red-950/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                  ⚠️ গুরুত্বপূর্ণ সতর্কতা
                </h3>
                <p className="text-lg text-red-700 dark:text-red-300 font-medium">
                  একবার উত্তর নির্বাচন করলে সেটি লক হয়ে যাবে এবং অন্য অপশন নির্বাচন করা যাবে না।
                </p>
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <Lock className="w-4 h-4" />
                  <span>প্রতিটি প্রশ্নের উত্তর সতর্কভাবে নির্বাচন করুন</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Header */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    প্রশ্ন {currentQuestionIndex + 1} / {questions.length}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    উত্তর দেওয়া হয়েছে: {answers.filter(a => a !== null).length}টি
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg">
                <Timer className="w-5 h-5" />
                <span className="text-lg font-mono">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                  {(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <QuestionCard 
          question={currentQuestion} 
          selectedAnswer={currentAnswer} 
          onSelectAnswer={(idx) => setAnswer(currentQuestionIndex, idx)} 
        />

        {/* Navigation */}
        <QuizNavigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrev={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentQuestionIndex((i) => Math.min(questions.length - 1, i + 1))}
          onSubmit={doSubmit}
          canSubmit={answers.every((a) => a !== null)}
        />

        {/* Question Grid - Enhanced */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                প্রশ্ন স্ট্যাটাস
              </h3>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {questions.map((_, index) => {
                const isAnswered = answers[index] !== null;
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`
                      relative w-12 h-12 rounded-lg text-sm font-semibold transition-all duration-200
                      ${
                        isCurrent
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                          : isAnswered
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {index + 1}
                    {isAnswered && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">বর্তমান প্রশ্ন</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">উত্তর দেওয়া</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">উত্তর দেওয়া হয়নি</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
