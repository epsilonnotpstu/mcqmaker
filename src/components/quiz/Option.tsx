'use client';

import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

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
        w-full p-4 text-left rounded-lg border-2 transition-all
        ${isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-950'
          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-950'
        }
        ${isLocked && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        disabled:cursor-not-allowed
      `}
    >
      <div className="flex items-center gap-3">
        <Badge
          variant={isSelected ? 'default' : 'outline'}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            isSelected ? 'bg-green-500' : ''
          }`}
        >
          {labels[index]}
        </Badge>
        <span className="flex-1 text-base">{option}</span>
        {isSelected && <Check className="w-5 h-5 text-green-600" />}
      </div>
    </button>
  );
}
