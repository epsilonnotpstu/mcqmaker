import { prisma } from '@/lib/db';
import { parseQuestionsFromJS } from '@/lib/parseQuestions';
import { redirect } from 'next/navigation';

// Server action: update settings
export async function updateSettingsAction(formData: FormData) {
  'use server';
  const totalTimeMinutes = Number(formData.get('totalTimeMinutes')) || 60;
  const marksPerCorrect = Number(formData.get('marksPerCorrect')) || 4;
  const negativePerWrong = Number(formData.get('negativePerWrong')) || -1;
  const isActive = String(formData.get('isActive')) === 'on';

  await prisma.examSettings.upsert({
    where: { id: 1 },
    update: {
      totalTimeMinutes,
      marksPerCorrect,
      negativePerWrong,
      isActive,
    },
    create: {
      id: 1,
      totalTimeMinutes,
      marksPerCorrect,
      negativePerWrong,
      isActive,
    },
  });

  redirect('/admin/dashboard?updated=1');
}

// Server action: upload questions
export async function uploadQuestionsAction(formData: FormData) {
  'use server';
  const code = String(formData.get('questionsCode') || '');
  if (!code.trim()) {
    redirect('/admin/dashboard?error=Empty+input');
  }

  const parsed = parseQuestionsFromJS(code);

  // Replace all questions
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

  redirect('/admin/dashboard?uploaded=1');
}

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

  let settings;
  let totalQuestions = 0;
  try {
    settings = await prisma.examSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
    totalQuestions = await prisma.question.count();
  } catch (e) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Settings form */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Exam Settings</h2>
          <form action={updateSettingsAction} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Total Time (minutes)</label>
              <input name="totalTimeMinutes" type="number" defaultValue={settings.totalTimeMinutes} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Marks per correct</label>
              <input name="marksPerCorrect" type="number" step="0.1" defaultValue={settings.marksPerCorrect} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Negative per wrong</label>
              <input name="negativePerWrong" type="number" step="0.1" defaultValue={settings.negativePerWrong} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-2">
              <input id="isActive" name="isActive" type="checkbox" defaultChecked={settings.isActive} />
              <label htmlFor="isActive">Exam Active</label>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Save Settings</button>
            </div>
          </form>
          <p className="mt-3 text-sm text-gray-600">Total Questions: {totalQuestions}</p>
        </div>

        {/* Upload Questions */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Questions</h2>
          <form action={uploadQuestionsAction} className="space-y-3">
            <textarea name="questionsCode" rows={12} className="w-full border rounded px-3 py-2 font-mono" placeholder={"var questions = [\n  { q: \"Question text?\", options: [\"A\", \"B\", \"C\", \"D\"], correct: 0 },\n];"}></textarea>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Upload</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
