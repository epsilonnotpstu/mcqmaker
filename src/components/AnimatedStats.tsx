'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, Trophy, Clock } from 'lucide-react';

interface StatsCounterProps {
  end: number;
  duration?: number;
  label: string;
  icon: React.ReactNode;
}

function StatsCounter({ end, duration = 2000, label, icon }: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white">{count}</div>
      <div className="text-blue-200 text-sm">{label}</div>
    </div>
  );
}

interface AnimatedStatsProps {
  totalExams: number;
  totalQuestions: number;
  totalAttempts: number;
}

export function AnimatedStats({ totalExams, totalQuestions, totalAttempts }: AnimatedStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
      <StatsCounter
        end={totalExams}
        label="মোট পরীক্ষা"
        icon={<BookOpen className="w-6 h-6 text-blue-200" />}
      />
      <StatsCounter
        end={totalQuestions}
        label="মোট প্রশ্ন"
        icon={<Trophy className="w-6 h-6 text-blue-200" />}
      />
      <StatsCounter
        end={totalAttempts}
        label="সম্পন্ন পরীক্ষা"
        icon={<Users className="w-6 h-6 text-blue-200" />}
      />
    </div>
  );
}