'use client';

import { useState, useEffect } from 'react';
import { X, Clock, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FloatingExamInfoProps {
  examName: string;
  subjectName: string;
  totalQuestions: number;
  timeMinutes: number;
}

export function FloatingExamInfo({ examName, subjectName, totalQuestions, timeMinutes }: FloatingExamInfoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">LIVE</span>
          </div>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-blue-200 dark:border-blue-500 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">LIVE পরীক্ষা</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <span className="text-xs">−</span>
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <h4 className="font-bold text-gray-900 dark:text-white">{subjectName} — {examName}</h4>
            
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{totalQuestions} প্রশ্ন</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeMinutes} মিনিট</span>
              </div>
            </div>
          </div>
          
          <Link href="/enter" className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              এখনই শুরু করুন
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}