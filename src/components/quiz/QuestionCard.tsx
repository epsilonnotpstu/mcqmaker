'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/lib/types';
import Option from './Option';
import { HelpCircle, Lock, CheckCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  const isLocked = selectedAnswer !== null;

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
      <CardHeader className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0">
            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl leading-relaxed text-gray-900 dark:text-white">
              {question.question}
            </CardTitle>
            {question.subject && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                বিষয়: {question.subject}
              </p>
            )}
          </div>
        </div>
        
        {isLocked && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✓ উত্তর নির্বাচিত এবং লক হয়েছে - পরিবর্তন করা যাবে না
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <Option
              key={index}
              option={option}
              index={index}
              isSelected={selectedAnswer === index}
              isLocked={isLocked}
              onSelect={() => onSelectAnswer(index)}
            />
          ))}
        </div>
        
        {!isLocked && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                সতর্কতা: একবার উত্তর নির্বাচন করলে পরিবর্তন করা যাবে না
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
