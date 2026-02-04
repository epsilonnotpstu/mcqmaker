"use server";

import { prisma } from "@/lib/db";
import { STUDENT_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSecureCookieOptions } from "@/lib/auth";

export async function enterAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!name || !phone) {
    return { ok: false, error: "Name and phone are required" };
  }
  if (!/^\d{11}$/.test(phone)) {
    return { ok: false, error: "Phone must be 11 digits" };
  }

  const settings = await prisma.examSettings.findUnique({ where: { id: 1 } });
  if (!settings || !settings.isActive) {
    return { ok: false, error: "No active exam at the moment" };
  }

  const attempt = await prisma.studentAttempt.create({
    data: {
      name,
      phone,
      status: "ongoing",
      answers: {},
    },
  });
  const cookieStore = await cookies();
  cookieStore.set(STUDENT_COOKIE_NAME, attempt.id, getSecureCookieOptions());
  redirect("/exam");
}
