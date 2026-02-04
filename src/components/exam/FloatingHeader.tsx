"use client";

import React from "react";
import { Clock, TrendingUp, AlertCircle } from "lucide-react";

interface FloatingHeaderProps {
  timeLeft: number;
  answeredCount: number;
  totalQuestions: number;
}

export default function FloatingHeader({ timeLeft, answeredCount, totalQuestions }: FloatingHeaderProps) {
  // Calculate progress percentage
  const progressPercent = (answeredCount / totalQuestions) * 100;
  
  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Time urgency styling
  const getTimeStyle = () => {
    if (timeLeft <= 300) return "text-red-500 animate-pulse"; // Last 5 minutes
    if (timeLeft <= 600) return "text-orange-500"; // Last 10 minutes
    return "text-green-500";
  };

  const getProgressColor = () => {
    if (progressPercent >= 80) return "bg-green-500";
    if (progressPercent >= 50) return "bg-blue-500";
    if (progressPercent >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center space-x-6 min-w-[400px]">
      {/* Timer Section */}
      <div className="flex items-center space-x-2">
        <div className={`p-2 rounded-full ${timeLeft <= 300 ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
          <Clock className={`w-4 h-4 ${getTimeStyle()}`} />
        </div>
        <div className="text-center">
          <div className={`font-bold text-lg ${getTimeStyle()}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Time Left</div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

      {/* Progress Section */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
          <TrendingUp className="w-4 h-4 text-purple-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Warning for low progress */}
      {timeLeft <= 600 && progressPercent < 50 && (
        <>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-xs text-orange-500 font-medium">Hurry Up!</span>
          </div>
        </>
      )}
    </div>
  );
}