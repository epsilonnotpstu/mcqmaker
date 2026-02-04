"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const SettingsSchema = z.object({
  examName: z.string().trim().min(1, { message: "Exam Name is required" }).max(100).optional().or(z.literal("")),
  subjectName: z.string().trim().min(1, { message: "Subject Name is required" }).max(100).optional().or(z.literal("")),
  chapterName: z.string().trim().max(150).optional().or(z.literal("")),
  totalTimeMinutes: z
    .preprocess((v) => Number(v), z.number().int().min(1).max(1000))
    .default(60),
  marksPerCorrect: z.preprocess((v) => Number(v), z.number().min(0).max(100)).default(4),
  negativePerWrong: z.preprocess((v) => Number(v), z.number().min(-100).max(0)).default(-1),
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
    examName,
    subjectName,
    chapterName,
    totalTimeMinutes,
    marksPerCorrect,
    negativePerWrong,
    isActive,
  } = parsed.data;

  await prisma.examSettings.upsert({
    where: { id: 1 },
    update: {
      examName: examName || null,
      subjectName: subjectName || null,
      chapterName: chapterName || null,
      totalTimeMinutes,
      marksPerCorrect,
      negativePerWrong,
      isActive,
    },
    create: {
      id: 1,
      examName: examName || null,
      subjectName: subjectName || null,
      chapterName: chapterName || null,
      totalTimeMinutes,
      marksPerCorrect,
      negativePerWrong,
      isActive,
    },
  });

  redirect(`/admin/dashboard?updated=1`);
}
