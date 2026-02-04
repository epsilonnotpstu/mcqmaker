import { prisma } from '@/lib/db';
import ResultClient from './ResultClient';
import { redirect } from 'next/navigation';

export default async function ResultAttemptPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const p = await params;
  const attempt = await prisma.studentAttempt.findUnique({ 
    where: { id: p.attemptId },
    include: {
      exam: {
        include: {
          questions: {
            orderBy: { id: 'asc' }
          }
        }
      }
    }
  });
  
  if (!attempt || attempt.status !== 'submitted') {
    redirect('/');
  }

  const settings = await prisma.examSettings.findUnique({ where: { id: attempt.examId } });
  if (!settings) {
    redirect('/');
  }

  const answersObj = (attempt.answers || {}) as Record<string, number | null>;
  const dbQuestions = attempt.exam?.questions || [];

  const details: Array<{
    questionId: number;
    question: string;
    options: string[];
    correctAnswer: number;
    userAnswer: number | null;
    isCorrect: boolean;
  }> = dbQuestions.map((q, index) => {
    const userAnswer = answersObj[index.toString()] ?? null;
    const isCorrect = userAnswer === q.correctIndex;
    return {
      questionId: q.id,
      question: q.questionText,
      options: [q.option1, q.option2, q.option3, q.option4],
      correctAnswer: q.correctIndex,
      userAnswer,
      isCorrect,
    };
  });

  const totalQuestions = details.length;
  const correctAnswers = details.filter(d => d.isCorrect).length;
  const wrongAnswers = details.filter(d => d.userAnswer !== null && !d.isCorrect).length;
  const unattempted = details.filter(d => d.userAnswer === null).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const grade = percentage >= 80 ? 'A+' : percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : 'F';

  const resultData = {
    score: attempt.score || 0,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unattempted,
    percentage,
    grade,
    details,
    timeTaken: attempt.submittedAt && attempt.startedAt ? 
      Math.round((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 1000) : 0,
    submittedAt: attempt.submittedAt,
    startedAt: attempt.startedAt,
    examTitle: settings.examName || 'MCQ পরীক্ষা',
    marksPerCorrect: settings.marksPerCorrect || 1,
    negativePerWrong: settings.negativePerWrong || 0
  };

  return <ResultClient resultData={resultData} />;
}
