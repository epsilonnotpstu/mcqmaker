import { prisma } from '@/lib/db';
import ScoreCard from '@/components/result/ScoreCard';
import AnswerReviewTable from '@/components/result/AnswerReviewTable';

export default async function ResultAttemptPage({ params }: { params: { attemptId: string } }) {
  const attempt = await prisma.studentAttempt.findUnique({ where: { id: params.attemptId } });
  const settings = await prisma.examSettings.findUnique({ where: { id: 1 } });
  if (!attempt || !settings || attempt.status !== 'submitted') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Result not available</p>
      </div>
    );
  }

  const answersObj = (attempt.answers || {}) as Record<string, number | null>;
  const dbQuestions = await prisma.question.findMany({ orderBy: { id: 'asc' } });

  const details: Array<{
    questionId: number;
    question: string;
    options: string[];
    selectedAnswer: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    points: number;
  }> = dbQuestions.map((q: { id: number; questionText: string; option1: string; option2: string; option3: string; option4: string; correctIndex: number }, idx: number) => {
    const selected = answersObj[idx]?.valueOf() ?? null;
    const isCorrect = selected === q.correctIndex;
    const points = selected === null ? 0 : isCorrect ? settings.marksPerCorrect : settings.negativePerWrong;
    return {
      questionId: q.id,
      question: q.questionText,
      options: [q.option1, q.option2, q.option3, q.option4],
      selectedAnswer: selected,
      correctAnswer: q.correctIndex,
      isCorrect,
      points: Number(points),
    };
  });

  const totalPossible = dbQuestions.length * settings.marksPerCorrect;
  const score = attempt.score ?? 0;
  const correctAnswers = details.filter((d) => d.isCorrect).length;
  const wrongAnswers = details.filter((d) => d.selectedAnswer !== null && !d.isCorrect).length;
  const unattempted = details.filter((d) => d.selectedAnswer === null).length;
  const percentage = Number(((score / totalPossible) * 100).toFixed(2));

  const result = {
    score: Number(score),
    totalQuestions: dbQuestions.length,
    correctAnswers,
    wrongAnswers,
    unattempted,
    totalPossible: Number(totalPossible),
    percentage,
    details,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <ScoreCard result={result} />
        <AnswerReviewTable details={result.details} />
      </div>
    </div>
  );
}
