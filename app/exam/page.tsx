import { prisma } from '@/lib/db';
import { STUDENT_COOKIE_NAME } from '@/lib/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Question } from '@/lib/types';
import ExamClient from '@/components/exam/ExamClient';

export default async function ExamPage() {
  const cookieStore = await cookies();
  const attemptId = cookieStore.get(STUDENT_COOKIE_NAME)?.value;
  if (!attemptId) redirect('/enter');

  const settings = await prisma.examSettings.findUnique({ where: { id: 1 } });
  const attempt = await prisma.studentAttempt.findUnique({ where: { id: attemptId } });
  const dbQuestions = await prisma.question.findMany({ orderBy: { id: 'asc' } });

  if (!settings || !attempt || attempt.status !== 'ongoing') {
    redirect('/enter');
  }

  const totalSeconds = settings.totalTimeMinutes * 60;
  const deadlineEpoch = new Date(attempt.startedAt).getTime() + totalSeconds * 1000;

  const questions: Question[] = dbQuestions.map((q: { id: number; questionText: string; option1: string; option2: string; option3: string; option4: string; correctIndex: number }) => ({
    id: q.id,
    question: q.questionText,
    options: [q.option1, q.option2, q.option3, q.option4],
    correctAnswer: q.correctIndex,
  }));

  return <ExamClient deadlineEpoch={deadlineEpoch} questions={questions} />;
}
