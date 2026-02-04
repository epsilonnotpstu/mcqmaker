"use server";

import { prisma } from "@/lib/db";
import { parseQuestionsFromJS } from "@/lib/parseQuestions";
import { redirect } from "next/navigation";

export async function uploadQuestionsAction(formData: FormData) {
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
    prisma.question.deleteMany({}),
    prisma.question.createMany({
      data: parsed.map((q) => ({
        questionText: q.q,
        option1: q.options[0],
        option2: q.options[1],
        option3: q.options[2],
        option4: q.options[3],
        correctIndex: q.correct,
      })),
    }),
    prisma.examSettings.upsert({
      where: { id: 1 },
      update: { totalQuestions: parsed.length },
      create: { id: 1, totalQuestions: parsed.length },
    }),
  ]);

  redirect(`/admin/dashboard?uploaded=${parsed.length}`);
}
