"use server";

import { prisma } from "@/lib/db";
import { STUDENT_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSecureCookieOptions } from "@/lib/auth";

export async function enterAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const examId = formData.get("examId") ? Number(formData.get("examId")) : null;

  if (!name || !phone) {
    return { ok: false, error: "Name and phone are required" };
  }
  if (!/^\d{11}$/.test(phone)) {
    return { ok: false, error: "Phone must be 11 digits" };
  }

  let settings;
  if (examId) {
    settings = await prisma.examSettings.findFirst({ 
      where: { id: examId },
      include: { _count: { select: { questions: true } } }
    });
    if (!settings) {
      return { ok: false, error: "Selected exam not found" };
    }
    if (settings._count.questions === 0) {
      return { ok: false, error: "Selected exam has no questions" };
    }
  } else {
    settings = await prisma.examSettings.findFirst({ 
      where: { isActive: true },
      include: { _count: { select: { questions: true } } },
      orderBy: { updatedAt: 'desc' }
    });
    if (!settings || !settings.isActive) {
      return { ok: false, error: "No active exam at the moment" };
    }
    if (settings._count.questions === 0) {
      return { ok: false, error: "Active exam has no questions" };
    }
  }

  const attempt = await prisma.studentAttempt.create({
    data: {
      name,
      phone,
      status: "ongoing",
      answers: {},
      examId: settings.id,
    },
  });
  const cookieStore = await cookies();
  cookieStore.set(STUDENT_COOKIE_NAME, attempt.id, getSecureCookieOptions());
  redirect("/exam");
}
