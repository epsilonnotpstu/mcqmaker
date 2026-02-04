"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const SettingsSchema = z.object({
  examId: z.preprocess((v) => (v === undefined || v === null || v === "" ? undefined : Number(v)), z.number().int().positive()).optional(),
  examName: z.string().trim().min(1, { message: "Exam Name is required" }).max(100).optional().or(z.literal("")),
  subjectName: z.string().trim().min(1, { message: "Subject Name is required" }).max(100).optional().or(z.literal("")),
  chapterName: z.string().trim().max(150).optional().or(z.literal("")),
  totalTimeMinutes: z
    .preprocess((v) => Number(v), z.number().int().min(1).max(1000))
    .default(60),
  marksPerCorrect: z.preprocess((v) => Number(v), z.number().min(0).max(100)).default(4),
  negativePerWrong: z.preprocess((v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return n;
    // If user enters a positive value like 0.25 for negative marking,
    // convert it to -0.25 automatically for convenience.
    return n > 0 ? -n : n;
  }, z.number().min(-100).max(0)).default(-1),
  isActive: z.preprocess((v) => String(v) === "on", z.boolean()).default(false),
});

export async function updateExamSettingsAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = SettingsSchema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message || "Invalid form data";
    redirect(`/admin/dashboard?error=${encodeURIComponent(msg)}`);
  }

  const {
    examId,
    examName,
    subjectName,
    chapterName,
    totalTimeMinutes,
    marksPerCorrect,
    negativePerWrong,
    isActive,
  } = parsed.data;

  let targetId: number;
  if (examId) {
    await prisma.examSettings.update({
      where: { id: examId },
      data: {
        examName: examName || null,
        subjectName: subjectName || null,
        chapterName: chapterName || null,
        totalTimeMinutes,
        marksPerCorrect,
        negativePerWrong,
        isActive,
      },
    });
    targetId = examId;
  } else {
    const created = await prisma.examSettings.create({
      data: {
        examName: examName || null,
        subjectName: subjectName || null,
        chapterName: chapterName || null,
        totalTimeMinutes,
        marksPerCorrect,
        negativePerWrong,
        isActive,
      },
    });
    targetId = created.id;
  }

  if (isActive) {
    await prisma.examSettings.updateMany({
      where: { id: { not: targetId } },
      data: { isActive: false },
    });
  }

  redirect(`/admin/dashboard/addquestion?updated=1&examId=${targetId}`);
}
