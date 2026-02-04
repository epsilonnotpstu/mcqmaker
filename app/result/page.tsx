'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizResult } from '@/lib/types';
import ScoreCard from '@/components/result/ScoreCard';
import AnswerReviewTable from '@/components/result/AnswerReviewTable';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw } from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const _resultState = useState<QuizResult | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('quizResult');
    return saved ? JSON.parse(saved) : null;
  });

  const result = _resultState[0];

  useEffect(() => {
    if (!result) {
      router.push('/');
    }
  }, [result, router]);

  const handleRestart = () => {
    localStorage.removeItem('quizResult');
    router.push('/quiz/play');
  };

  const handleHome = () => {
    router.push('/');
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading result...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            পরীক্ষা সম্পন্ন হয়েছে!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            আপনার ফলাফল নিচে দেখুন
          </p>
        </div>

        <ScoreCard 
          result={result} 
          marksPerCorrect={4} 
          negativePerWrong={-1} 
          unattemptedPoints={0} 
        />

        <div className="flex justify-center gap-4">
          <Button onClick={handleHome} variant="outline" size="lg">
            <Home className="w-4 h-4 mr-2" />
            হোম পেজ
          </Button>
          <Button onClick={handleRestart} size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            আবার চেষ্টা করুন
          </Button>
        </div>

        <AnswerReviewTable details={result.details} />
      </div>
    </div>
  );
}
