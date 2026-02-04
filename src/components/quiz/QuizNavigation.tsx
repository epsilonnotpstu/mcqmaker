'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

export default function QuizNavigation({
  currentQuestion,
  totalQuestions,
  onPrev,
  onNext,
  onSubmit,
  canSubmit,
}: QuizNavigationProps) {
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === totalQuestions - 1;

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Side - Previous Button */}
          <div className="flex-1 flex justify-start">
            <Button
              onClick={onPrev}
              disabled={isFirst}
              variant="outline"
              size="lg"
              className="bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 border-2 min-w-[120px]"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              পূর্ববর্তী
            </Button>
          </div>

          {/* Center - Floating Submit Info */}
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
            <Send className="w-4 h-4" />
            <span>জমা দিতে নিচের ফ্লোটিং বাটন ব্যবহার করুন</span>
          </div>

          {/* Right Side - Next Button Only */}
          <div className="flex-1 flex justify-end">
            {!isLast && (
              <Button 
                onClick={onNext} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg min-w-[120px]"
              >
                পরবর্তী
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            অগ্রগতি: {currentQuestion + 1} / {totalQuestions} প্রশ্ন
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
