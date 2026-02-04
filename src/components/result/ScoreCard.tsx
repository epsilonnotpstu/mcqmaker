'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuizResult } from '@/lib/types';
import { CheckCircle2, XCircle, MinusCircle, Trophy } from 'lucide-react';
import { QUIZ_CONFIG } from '@/lib/questions';

interface ScoreCardProps {
  result: QuizResult;
}

export default function ScoreCard({ result }: ScoreCardProps) {
  const isPassed = result.percentage >= QUIZ_CONFIG.passPercentage;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>পরীক্ষার ফলাফল</span>
          <Badge
            variant={isPassed ? 'default' : 'destructive'}
            className="text-lg px-4 py-2"
          >
            {isPassed ? '✓ পাস' : '✗ ফেল'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            {result.score}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            মোট {result.totalPossible} এর মধ্যে
          </p>
          <p className="text-2xl font-semibold mt-3 text-purple-600 dark:text-purple-400">
            {result.percentage}%
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">
              {result.correctAnswers}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">সঠিক</p>
          </div>

          <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold text-red-600">
              {result.wrongAnswers}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">ভুল</p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MinusCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-2xl font-bold text-gray-600">
              {result.unattempted}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">বাদ</p>
          </div>
        </div>

        {/* Marking Scheme */}
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 border-t pt-4">
          <p>• সঠিক উত্তর: +{QUIZ_CONFIG.correctPoints} নম্বর</p>
          <p>• ভুল উত্তর: {QUIZ_CONFIG.wrongPoints} নম্বর</p>
          <p>• উত্তর না দিলে: {QUIZ_CONFIG.unattemptedPoints} নম্বর</p>
        </div>
      </CardContent>
    </Card>
  );
}
