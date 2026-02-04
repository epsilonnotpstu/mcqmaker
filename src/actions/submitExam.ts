"use server";

import { prisma, withRetry } from "@/lib/db";
import { STUDENT_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { calculateScore } from "@/lib/score";
import { Question } from "@/lib/types";

export async function submitExamAction(formData: FormData) {
  const cookieStore = await cookies();
  const attemptId = cookieStore.get(STUDENT_COOKIE_NAME)?.value;
  if (!attemptId) redirect("/enter");

  const answersRaw = String(formData.get("answers") || "{}");
  const answers: (number | null)[] = JSON.parse(answersRaw);
  
  try {
    // Use retry wrapper for database operations
    const attempt = await withRetry(() => 
      prisma.studentAttempt.findUnique({ where: { id: attemptId } })
    );
    if (!attempt) redirect("/enter");
    
    const dbQuestions = await withRetry(() => 
      prisma.question.findMany({ where: { examId: attempt.examId }, orderBy: { id: "asc" } })
    );
    
    const settings = await withRetry(() => 
      prisma.examSettings.findUnique({ where: { id: attempt.examId } })
    );

    const questions: Question[] = dbQuestions.map((q: { id: number; questionText: string; option1: string; option2: string; option3: string; option4: string; correctIndex: number }) => ({
      id: q.id,
      question: q.questionText,
      options: [q.option1, q.option2, q.option3, q.option4],
      correctAnswer: q.correctIndex,
    }));

    const result = calculateScore(questions, answers, {
      marksPerCorrect: Number(settings?.marksPerCorrect ?? 1),
      negativePerWrong: Number(settings?.negativePerWrong ?? 0),
      unattemptedPoints: 0,
    });

    await withRetry(() => 
      prisma.studentAttempt.update({
        where: { id: attemptId },
        data: {
          submittedAt: new Date(),
          answers: Object.fromEntries(answers.map((v, i) => [i, v])),
          score: result.score,
          status: "submitted",
        },
      })
    );

    // Small delay to ensure the submission animation is visible
    await new Promise(resolve => setTimeout(resolve, 1500));

  } catch (error) {
    console.error('Database operation failed after retries:', error);
    // Still redirect to result page even if submission partially failed
  }

  redirect(`/result/${attemptId}`);
}
