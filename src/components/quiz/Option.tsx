'use client';

import { Badge } from '@/components/ui/badge';
import { Check, Lock } from 'lucide-react';

interface OptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
}

export default function Option({
  option,
  index,
  isSelected,
  isLocked,
  onSelect,
}: OptionProps) {
  const labels = ['ক', 'খ', 'গ', 'ঘ'];

  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={`
        relative w-full p-5 text-left rounded-xl border-2 transition-all duration-200 group
        ${isSelected
          ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 shadow-lg scale-[1.02]'
          : isLocked
          ? 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
          : 'border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:border-gray-700 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 hover:shadow-md hover:scale-[1.01]'
        }
        ${isLocked && !isSelected ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        disabled:cursor-not-allowed
      `}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Badge
            variant={isSelected ? 'default' : 'outline'}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200 ${
              isSelected 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
                : 'bg-white dark:bg-gray-800 border-2 group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30'
            }`}
          >
            {labels[index]}
          </Badge>
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <span className={`flex-1 text-base md:text-lg leading-relaxed ${
          isSelected 
            ? 'text-green-900 dark:text-green-100 font-medium' 
            : 'text-gray-900 dark:text-gray-100'
        }`}>
          {option}
        </span>
        {isSelected && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">নির্বাচিত</span>
          </div>
        )}
      </div>
      
      {/* Subtle glow effect for selected option */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl bg-green-200/20 dark:bg-green-500/10 -z-10 blur-sm"></div>
      )}
    </button>
  );
}
