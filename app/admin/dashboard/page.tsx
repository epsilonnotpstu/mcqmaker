import { prisma } from '@/lib/db';
import Link from 'next/link';
// import { Button } from '@/components/ui/button';

// Server action: update settings
// Moved to actions/admin/updateExamSettings.ts

// Server action: upload questions
// Moved to actions/admin/uploadQuestions.ts

export default async function AdminDashboardPage() {
  // Gracefully handle missing DATABASE_URL / DB not ready
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-red-600 mb-4">DATABASE_URL not set.</p>
            <p className="text-sm text-gray-600">Create an .env file and set <strong>DATABASE_URL</strong>. See .env.example for a sample.</p>
          </div>
        </div>
      </div>
    );
  }

  const settings = await prisma.examSettings.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } });
  // If no active exam, show a call to action
  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-3xl mx-auto py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Link href="/admin/dashboard/newexam" className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/10">Create New Exam</Link>
          </div>
          <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
            <p className="text-gray-700">No active exam found. Create a new exam to get started, then upload questions.</p>
          </div>
        </div>
      </div>
    );
  }
  const questions = await prisma.question.findMany({ where: { examId: settings.id }, orderBy: { id: 'asc' } });
  const attempts = await prisma.studentAttempt.findMany({ where: { status: 'submitted', examId: settings.id } });

  const rows = attempts.map((att) => {
    const answersObj = (att.answers || {}) as Record<string, number | null>;
    let score = 0;
    let wrong = 0;
    for (let i = 0; i < questions.length; i++) {
      const selected = answersObj[String(i)] ?? null;
      const correct = questions[i]?.correctIndex ?? -1;
      if (selected === null || selected === undefined) continue;
      if (selected === correct) {
        score += Number(settings?.marksPerCorrect ?? 0);
      } else {
        wrong += 1;
        score += Number(settings?.negativePerWrong ?? 0);
      }
    }
    return {
      id: att.id,
      name: att.name,
      phone: att.phone,
      score: Number(score),
      wrong,
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link href={`/admin/dashboard/addquestion?examId=${settings.id}`} className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/10">Manage Questions</Link>
            <Link href="/admin/dashboard/newexam" className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/10">Create New Exam</Link>
          </div>
        </div>

        {/* Subject dropdown with exam names */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Active Exam</div>
            <div className="text-xl font-semibold">{settings.subjectName || 'Subject'} — {settings.examName || `Exam #${settings.id}`}</div>
            <div className="text-sm text-gray-700">Chapter: {settings.chapterName || '—'} · Total Time: {settings.totalTimeMinutes}m · Questions: {settings.totalQuestions}</div>
          </div>
        </div>

        {/* Attempts table sorted by score */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Submitted Students</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Score</th>
                  <th className="py-2 px-3">Wrong</th>
                  <th className="py-2 px-3">View</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="py-2 px-3">{r.name}</td>
                    <td className="py-2 px-3">{r.phone}</td>
                    <td className="py-2 px-3 font-semibold">{r.score}</td>
                    <td className="py-2 px-3">{r.wrong}</td>
                    <td className="py-2 px-3">
                      <Link href={`/result/${r.id}`} className="text-blue-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="py-4 px-3 text-center text-gray-500" colSpan={5}>No submissions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
