"use client";

import React from "react";
import { AlertTriangle, MousePointer } from "lucide-react";

interface UnansweredQuestionsTrackerProps {
  answers: (number | null)[];
  timeLeft: number;
  onQuestionClick: (questionIndex: number) => void;
}

export default function UnansweredQuestionsTracker({ 
  answers, 
  timeLeft, 
  onQuestionClick 
}: UnansweredQuestionsTrackerProps) {
  // Get unanswered question numbers
  const unansweredQuestions = answers
    .map((answer, index) => answer === null ? index + 1 : null)
    .filter((q): q is number => q !== null);

  // Show only in last 5 minutes (300 seconds)
  const showTracker = timeLeft <= 300 && unansweredQuestions.length > 0;

  if (!showTracker) return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-red-50 dark:bg-red-900/30 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-4 max-w-[200px]">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-700 dark:text-red-300">Unanswered</h3>
            <p className="text-xs text-red-600 dark:text-red-400">Click to go</p>
          </div>
        </div>

        {/* Question Numbers Grid */}
        <div className="grid grid-cols-4 gap-2">
          {unansweredQuestions.slice(0, 16).map((questionNum) => (
            <button
              key={questionNum}
              onClick={() => onQuestionClick(questionNum - 1)}
              className="relative group bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg p-2 transition-all duration-200 animate-bounce hover:animate-none hover:scale-110 shadow-lg hover:shadow-xl"
              style={{
                animationDelay: `${(questionNum % 4) * 0.1}s`,
                animationDuration: '1s'
              }}
            >
              {questionNum}
              
              {/* Hover tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Go to Q{questionNum}
              </div>
              
              {/* Click indicator */}
              <MousePointer className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </div>

        {/* Show count if more than 16 questions */}
        {unansweredQuestions.length > 16 && (
          <div className="mt-2 text-center text-xs text-red-600 dark:text-red-400">
            +{unansweredQuestions.length - 16} more
          </div>
        )}

        {/* Urgency message */}
        <div className="mt-3 text-center">
          <p className="text-xs text-red-700 dark:text-red-300 font-medium animate-pulse">
            ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} left!
          </p>
        </div>
      </div>
    </div>
  );
}