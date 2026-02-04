'use client';

import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface FloatingSubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  submitted: boolean;
  answeredCount: number;
  totalQuestions: number;
  timeLeft: number;
  disabled?: boolean;
}

export default function FloatingSubmitButton({
  onSubmit,
  isSubmitting,
  submitted,
  answeredCount,
  totalQuestions,
  timeLeft,
  disabled = false
}: FloatingSubmitButtonProps) {
  const isUrgent = timeLeft <= 300; // Last 5 minutes
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button 
        onClick={onSubmit}
        disabled={disabled || isSubmitting || submitted}
        size="lg"
        className={`
          relative overflow-hidden
          bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
          text-white font-semibold py-3 px-6 rounded-full shadow-lg
          transform transition-all duration-300 ease-in-out
          hover:scale-105 hover:shadow-xl
          ${isUrgent ? 'animate-pulse ring-4 ring-red-300 !bg-gradient-to-r !from-red-500 !to-pink-600' : ''}
          ${submitted ? '!bg-green-500 hover:!bg-green-600' : ''}
        `}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            {isUrgent && timeLeft > 0 ? `⚡ Submit (${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')})` : `Submit (${answeredCount}/${totalQuestions})`}
          </>
        )}
        
        {/* Progress indicator */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
        
        {/* Glow effect when urgent */}
        {isUrgent && (
          <div className="absolute inset-0 rounded-full bg-red-400/20 animate-pulse" />
        )}
      </Button>
    </div>
  );
}