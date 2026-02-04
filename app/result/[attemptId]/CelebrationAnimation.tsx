'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface CelebrationProps {
  show: boolean;
  grade: string;
  percentage: number;
}

export default function CelebrationAnimation({ show, grade, percentage }: CelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (show && percentage >= 80) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [show, percentage]);

  if (!show || percentage < 80) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s'
          }}
        >
          {particle.id % 3 === 0 ? (
            <Star className="w-6 h-6 text-yellow-400 animate-spin" />
          ) : particle.id % 3 === 1 ? (
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          ) : (
            <Trophy className="w-4 h-4 text-yellow-500 animate-bounce" />
          )}
        </div>
      ))}
      
      {/* Main celebration message */}
      {percentage >= 90 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-yellow-200 dark:border-yellow-800 animate-pulse">
            <div className="text-center space-y-4">
              <Trophy className="w-20 h-20 mx-auto text-yellow-500 animate-bounce" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                অভিনন্দন! 🎉
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                আপনি অসাধারণ ফলাফল অর্জন করেছেন!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}