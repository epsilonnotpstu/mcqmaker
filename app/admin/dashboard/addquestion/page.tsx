import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { updateExamSettingsAction } from '@/actions/admin/updateExamSettings';
import { uploadQuestionsAction } from '@/actions/admin/uploadQuestions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminAddQuestionPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
            <h1 className="text-2xl font-bold mb-2">Add Question</h1>
            <p className="text-red-600 mb-4">DATABASE_URL not set.</p>
            <p className="text-sm text-gray-600">Create an .env file and set <strong>DATABASE_URL</strong>. See .env.example for a sample.</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine selected exam
  const allExams = await prisma.examSettings.findMany({ orderBy: { updatedAt: 'desc' } });
  const requestedExamId = params?.examId ? Number(params.examId) : undefined;
  let settings = requestedExamId ? allExams.find((e) => e.id === requestedExamId) : allExams.find((e) => e.isActive) || allExams[0];
  let totalQuestions = 0;
  try {
    if (!settings) {
      settings = await prisma.examSettings.create({ data: {} });
    }
    totalQuestions = await prisma.question.count({ where: { examId: settings.id } });
  } catch (e) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
            <h1 className="text-2xl font-bold mb-2">Add Question</h1>
            <p className="text-red-600 mb-4">Database initialization failed.</p>
            <p className="text-sm text-gray-600">Ensure your database is reachable and run Prisma migrations:</p>
            <pre className="mt-3 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">npx prisma generate\n
npx prisma migrate dev --name init</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add Question</h1>
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/10">Back to Dashboard</Link>
            <Link href="/admin/dashboard/newexam" className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/10">Create New Exam</Link>
          </div>
        </div>

        {params?.updated && (
          <div className="rounded bg-green-100 text-green-800 p-3 text-sm">Settings updated successfully.</div>
        )}
        {params?.uploaded && (
          <div className="rounded bg-green-100 text-green-800 p-3 text-sm">Uploaded {String(params.uploaded)} questions successfully.</div>
        )}
        {params?.error && (
          <div className="rounded bg-red-100 text-red-700 p-3 text-sm">{String(params.error)}</div>
        )}

        {/* Exam selector */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <div className="space-y-2">
            <div className="text-sm">Selected Exam:</div>
            <div className="text-sm text-gray-700">{(settings.subjectName || 'Subject')} — {(settings.examName || `Exam #${settings.id}`)} {settings.isActive ? '(Active)' : ''}</div>
            <div className="text-sm mt-2">Switch to:</div>
            <ul className="list-disc pl-5 space-y-1">
              {allExams.filter((ex) => ex.id !== settings!.id).map((ex) => (
                <li key={ex.id}>
                  <Link href={`/admin/dashboard/addquestion?examId=${ex.id}`} className="text-blue-600 hover:underline">
                    {(ex.subjectName || 'Subject')} — {(ex.examName || `Exam #${ex.id}`)} {ex.isActive ? '(Active)' : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Settings form */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Exam Settings</h2>
          <form action={updateExamSettingsAction} className="grid md:grid-cols-2 gap-4">
            <input type="hidden" name="examId" value={String(settings.id)} />
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Exam Name</label>
              <input name="examName" type="text" defaultValue={settings.examName ?? ''} placeholder="e.g. Mid Term Exam 2026" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <input name="subjectName" type="text" defaultValue={settings.subjectName ?? ''} placeholder="e.g. Biology / Food Science" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Chapter (optional)</label>
              <input name="chapterName" type="text" defaultValue={settings.chapterName ?? ''} placeholder="e.g. Food Preservation" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Total Time (minutes)</label>
              <input name="totalTimeMinutes" type="number" defaultValue={settings.totalTimeMinutes} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Marks per correct</label>
              <input name="marksPerCorrect" type="number" step="0.5" defaultValue={settings.marksPerCorrect} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Negative per wrong</label>
              <input name="negativePerWrong" type="number" step="0.01" defaultValue={settings.negativePerWrong} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-2">
              <input id="isActive" name="isActive" type="checkbox" defaultChecked={settings.isActive} />
              <label htmlFor="isActive">Exam Active</label>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="px-4 py-2">Save Settings</Button>
            </div>
          </form>
          <p className="mt-3 text-sm text-gray-600">Total Questions: {totalQuestions}</p>
        </div>

        {/* Upload Questions */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Questions</h2>
          <form action={uploadQuestionsAction} className="space-y-3">
            <input type="hidden" name="examId" value={String(settings.id)} />
            <textarea name="questionsCode" rows={12} className="w-full border rounded px-3 py-2 font-mono" placeholder={"Paste your questions in this format:\nvar questions = [\n  { q: \"Question here?\", options: [\"A\", \"B\", \"C\", \"D\"], correct: 0 },\n  // ...\n];"}></textarea>
            <div className="flex justify-end">
              <Button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700">Upload</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
