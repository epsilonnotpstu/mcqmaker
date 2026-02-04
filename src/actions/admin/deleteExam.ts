"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deleteExamAction(formData: FormData) {
  const examId = formData.get("examId");
  
  if (!examId || isNaN(Number(examId))) {
    redirect("/admin/dashboard?error=Invalid+exam+ID");
  }

  const id = Number(examId);
  
  try {
    // Check if exam exists
    const exam = await prisma.examSettings.findUnique({
      where: { id },
      select: { id: true, examName: true, subjectName: true }
    });
    
    if (!exam) {
      redirect("/admin/dashboard?error=Exam+not+found");
    }
    
    // Delete exam (will cascade delete questions and attempts due to foreign key constraints)
    await prisma.examSettings.delete({
      where: { id }
    });
    
    // Revalidate the page to reflect changes
    revalidatePath("/admin/dashboard");
    
  } catch (error) {
    console.error("Error deleting exam:", error);
    revalidatePath("/admin/dashboard");
    redirect("/admin/dashboard?error=Failed+to+delete+exam");
  }
  
  // Success redirect
  redirect("/admin/dashboard?success=Exam+deleted+successfully");
}