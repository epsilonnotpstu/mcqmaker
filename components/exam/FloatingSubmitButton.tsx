'use client';

import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface FloatingSubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  answeredCount: number;
  totalQuestions: number;
}

export default function FloatingSubmitButton({
  onSubmit,
  isSubmitting,
  answeredCount,
  totalQuestions,
}: FloatingSubmitButtonProps) {
  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]">
      <div className="relative">
        {/* Floating Card */}
        <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-4">
            {/* Progress Info */}
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">উত্তর দেওয়া</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {answeredCount}/{totalQuestions}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ({completionPercentage}%)
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              size="lg"
              className={`
                relative overflow-hidden px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-500
                ${!isSubmitting
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 cursor-wait'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="animate-pulse">পরীক্ষা জমা দেওয়া হচ্ছে...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  {answeredCount === totalQuestions 
                    ? 'পরীক্ষা জমা দিন' 
                    : `জমা দিন (${answeredCount}/${totalQuestions})`
                  }
                </div>
              )}
              
              {/* Enhanced Shimmer effect for submitting */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              )}
              
              {/* Pulse animation when submitting */}
              {isSubmitting && (
                <div className="absolute inset-0 rounded-xl bg-white/20 animate-ping"></div>
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced pulsing glow effect when can submit */}
        {!isSubmitting && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-green-400/30 blur-xl animate-pulse -z-10"></div>
            <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-2xl animate-ping -z-20"></div>
          </>
        )}
        
        {/* Submitting glow effect */}
        {isSubmitting && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-orange-400/40 blur-xl animate-pulse -z-10"></div>
            <div className="absolute inset-0 rounded-2xl bg-red-500/30 blur-2xl animate-ping -z-20"></div>
          </>
        )}
      </div>
    </div>
  );
}