'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/lib/types';
import Option from './Option';

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">
          {question.question}
        </CardTitle>
        {question.subject && (
          <p className="text-sm text-muted-foreground">বিষয়: {question.subject}</p>
        )}
      </CardHeader>
      <CardContent>
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
        {isLocked && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            ✓ উত্তর লক হয়েছে - পরিবর্তন করা যাবে না
          </p>
        )}
      </CardContent>
    </Card>
  );
}
