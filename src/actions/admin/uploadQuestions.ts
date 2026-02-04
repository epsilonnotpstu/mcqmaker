"use server";

import { prisma } from "@/lib/db";
import { parseQuestionsFromJS } from "@/lib/parseQuestions";
import { redirect } from "next/navigation";

export async function uploadQuestionsAction(formData: FormData) {
  const examIdRaw = formData.get("examId");
  let examId: number | null = examIdRaw ? Number(examIdRaw) : null;
  if (!examId || Number.isNaN(examId)) {
    const active = await prisma.examSettings.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } });
    examId = active?.id ?? null;
  }
  if (!examId) {
    redirect("/admin/dashboard/addquestion?error=Select+an+exam+first");
  }
  const code = String(formData.get("questionsCode") || "");
  if (!code.trim()) {
    redirect("/admin/dashboard?error=Empty+input");
  }

  let parsed;
  try {
    parsed = parseQuestionsFromJS(code);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid input";
    redirect(`/admin/dashboard?error=${encodeURIComponent(msg)}`);
  }

  await prisma.$transaction([
    prisma.question.deleteMany({ where: { examId } }),
    prisma.question.createMany({
      data: parsed.map((q) => ({
        questionText: q.q,
        option1: q.options[0],
        option2: q.options[1],
        option3: q.options[2],
        option4: q.options[3],
        correctIndex: q.correct,
        examId: examId!,
      })),
    }),
    prisma.examSettings.update({
      where: { id: examId! },
      data: { totalQuestions: parsed.length },
    }),
  ]);

  redirect(`/admin/dashboard/addquestion?uploaded=${parsed.length}&examId=${examId}`);
}
