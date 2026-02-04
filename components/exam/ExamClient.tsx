"use client";

import React, { useCallback, useState } from "react";
import QuestionCard from "../../src/components/quiz/QuestionCard";
import QuizNavigation from "../../src/components/quiz/QuizNavigation";
import { Question } from "../../src/lib/types";
import { submitExamAction } from "../../src/actions/submitExam";
import { Card, CardContent } from '../ui/card';
import { AlertTriangle, Lock, Timer, CheckCircle, BookOpen, Target } from 'lucide-react';
import FloatingSubmitButton from './FloatingSubmitButton';

export default function ExamClient({ deadlineEpoch, questions }: { deadlineEpoch: number; questions: Question[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitOverlay, setShowSubmitOverlay] = useState(false);

  // Local timer
  React.useEffect(() => {
    if (submitted) return;
    const update = () => setTimeLeft(Math.max(0, Math.floor((deadlineEpoch - Date.now()) / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [deadlineEpoch, submitted]);

  const doSubmit = async () => {
    if (isSubmitting || submitted) return;
    
    // Show full screen overlay immediately
    setShowSubmitOverlay(true);
    setIsSubmitting(true);
    setSubmitted(true);
    
    try {
      const fd = new FormData();
      fd.set("answers", JSON.stringify(answers));
      await submitExamAction(fd);
    } catch (error) {
      console.error('Submit failed:', error);
      // On error, hide overlay and reset states
      setShowSubmitOverlay(false);
      setIsSubmitting(false);
      setSubmitted(false);
    }
  };

  const onTimeUp = useCallback(async () => {
    if (!submitted && !isSubmitting) {
      // Show overlay for auto submit
      setShowSubmitOverlay(true);
      setIsSubmitting(true);
      setSubmitted(true);
      
      try {
        const fd = new FormData();
        fd.set("answers", JSON.stringify(answers));
        await submitExamAction(fd);
      } catch (error) {
        console.error('Auto submit failed:', error);
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

        {/* Time Warning - Show when less than 2 minutes */}
        {timeLeft <= 120 && timeLeft > 0 && (
          <Card className="border-2 border-orange-400 bg-orange-50/90 dark:bg-orange-950/50 backdrop-blur-sm animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 justify-center text-center">
                <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400 animate-bounce" />
                <div>
                  <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200">
                    ⏰ সময় শেষ হয়ে আসছে!
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300">
                    {timeLeft <= 60 
                      ? 'আর মাত্র ১ মিনিট বাকি! দ্রুত সকল প্রশ্নের উত্তর সম্পন্ন করুন।'
                      : 'আর মাত্র ২ মিনিট বাকি! দ্রুত উত্তর দিন।'
                    }
                  </p>
                </div>
                <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400 animate-bounce" />
              </div>
            </CardContent>
          </Card>
        )}

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
                <span className={`text-lg font-mono ${timeLeft <= 60 ? 'animate-pulse' : ''}`}>
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                  {(timeLeft % 60).toString().padStart(2, '0')}
                </span>
                {timeLeft <= 60 && (
                  <span className="text-sm animate-bounce ml-2">⚠️</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <QuestionCard 
          question={currentQuestion} 
          selectedAnswer={currentAnswer} 
          onSelectAnswer={(idx: number) => setAnswer(currentQuestionIndex, idx)} 
        />

        {/* Navigation */}
        <QuizNavigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrev={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentQuestionIndex((i) => Math.min(questions.length - 1, i + 1))}
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
        
        {/* Floating Submit Button */}
        <FloatingSubmitButton
          onSubmit={doSubmit}
          isSubmitting={isSubmitting}
          answeredCount={answers.filter(a => a !== null).length}
          totalQuestions={questions.length}
        />
      </div>

      {/* Full Screen Submit Overlay */}
      {showSubmitOverlay && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Submit Animation */}
          <div className="relative z-10 bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 text-center max-w-md mx-4">
            <div className="space-y-6">
              {/* Spinning Animation */}
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-2 border-green-200 dark:border-green-800 rounded-full"></div>
                <div className="absolute inset-2 border-2 border-green-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                <CheckCircle className="absolute inset-0 m-auto w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  পরীক্ষা জমা দেওয়া হচ্ছে...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  অনুগ্রহ করে অপেক্ষা করুন
                </p>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
