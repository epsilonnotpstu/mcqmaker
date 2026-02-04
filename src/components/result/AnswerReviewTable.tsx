'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuestionResult } from '@/lib/types';
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

interface AnswerReviewTableProps {
  details: QuestionResult[];
}

export default function AnswerReviewTable({ details }: AnswerReviewTableProps) {
  const labels = ['ক', 'খ', 'গ', 'ঘ'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>বিস্তারিত উত্তর পর্যালোচনা</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {details.map((detail, index) => (
            <div
              key={detail.questionId}
              className="p-4 border rounded-lg space-y-3"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-lg mb-2">
                    প্রশ্ন {index + 1}: {detail.question}
                  </p>
                </div>
                <Badge
                  variant={
                    detail.selectedAnswer === null
                      ? 'secondary'
                      : detail.isCorrect
                      ? 'default'
                      : 'destructive'
                  }
                  className="flex items-center gap-1"
                >
                  {detail.selectedAnswer === null ? (
                    <>
                      <MinusCircle className="w-4 h-4" />
                      {detail.points}
                    </>
                  ) : detail.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      +{detail.points}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      {detail.points}
                    </>
                  )}
                </Badge>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {detail.options.map((option: string, optIndex: number) => {
                  const isCorrect = optIndex === detail.correctAnswer;
                  const isSelected = optIndex === detail.selectedAnswer;

                  return (
                    <div
                      key={optIndex}
                      className={`p-3 rounded border-2 ${
                        isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : isSelected
                          ? 'border-red-500 bg-red-50 dark:bg-red-950'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`w-8 h-8 flex items-center justify-center ${
                            isCorrect ? 'bg-green-500 text-white border-green-500' : ''
                          } ${
                            isSelected && !isCorrect
                              ? 'bg-red-500 text-white border-red-500'
                              : ''
                          }`}
                        >
                          {labels[optIndex]}
                        </Badge>
                        <span className="flex-1">{option}</span>
                        {isCorrect && (
                          <span className="text-green-600 font-semibold text-sm">
                            ✓ সঠিক উত্তর
                          </span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="text-red-600 font-semibold text-sm">
                            ✗ আপনার উত্তর
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
