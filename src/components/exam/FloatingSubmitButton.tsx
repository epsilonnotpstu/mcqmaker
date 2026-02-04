'use client';

import { Button } from '@/components/ui/button';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

interface FloatingSubmitButtonProps {
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  answeredCount: number;
  totalQuestions: number;
}

export default function FloatingSubmitButton({
  onSubmit,
  canSubmit,
  isSubmitting,
  answeredCount,
  totalQuestions,
}: FloatingSubmitButtonProps) {
  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative">
        {/* Floating Card */}
        <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
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
              disabled={!canSubmit || isSubmitting}
              size="lg"
              className={`
                relative overflow-hidden px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300
                ${canSubmit && !isSubmitting
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">পরীক্ষা জমা দেওয়া হচ্ছে...</span>
                </div>
              ) : canSubmit ? (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  পরীক্ষা জমা দিন
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  সকল প্রশ্নের উত্তর দিন
                </div>
              )}
              
              {/* Shimmer effect for submitting */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              )}
            </Button>
          </div>
        </div>

        {/* Pulsing glow effect when can submit */}
        {canSubmit && !isSubmitting && (
          <div className="absolute inset-0 rounded-2xl bg-green-400/20 blur-xl animate-pulse -z-10"></div>
        )}
      </div>
    </div>
  );
}