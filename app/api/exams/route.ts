import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const exams = await prisma.examSettings.findMany({
      where: {
        totalQuestions: { gt: 0 } // Only show exams that have questions
      },
      select: {
        id: true,
        examName: true,
        subjectName: true,
        chapterName: true,
        totalTimeMinutes: true,
        totalQuestions: true,
        isActive: true,
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ exams: [] }, { status: 500 });
  }
}