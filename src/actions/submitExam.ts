"use server";

import { prisma } from "@/lib/db";
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
  const dbQuestions = await prisma.question.findMany({ orderBy: { id: "asc" } });

  const questions: Question[] = dbQuestions.map((q: { id: number; questionText: string; option1: string; option2: string; option3: string; option4: string; correctIndex: number }) => ({
    id: q.id,
    question: q.questionText,
    options: [q.option1, q.option2, q.option3, q.option4],
    correctAnswer: q.correctIndex,
  }));

  const result = calculateScore(questions, answers);

  await prisma.studentAttempt.update({
    where: { id: attemptId },
    data: {
      submittedAt: new Date(),
      answers: Object.fromEntries(answers.map((v, i) => [i, v])),
      score: result.score,
      status: "submitted",
    },
  });

  redirect(`/result/${attemptId}`);
}
