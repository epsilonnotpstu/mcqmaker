import { updateExamSettingsAction } from '../../../../src/actions/admin/updateExamSettings';
import Link from 'next/link';

export default async function NewExamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Exam</h1>
          <Link href="/admin/dashboard/addquestion" className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/10">Manage Exams</Link>
        </div>

        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
          <form action={updateExamSettingsAction} className="grid md:grid-cols-2 gap-4">
            {/* No examId field: creates a new exam */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Exam Name</label>
              <input name="examName" type="text" placeholder="e.g. Mid Term Exam 2026" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <input name="subjectName" type="text" placeholder="e.g. Biology / Food Science" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Chapter (optional)</label>
              <input name="chapterName" type="text" placeholder="e.g. Food Preservation" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Total Time (minutes)</label>
              <input name="totalTimeMinutes" type="number" defaultValue={60} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block textsm mb-1">Marks per correct</label>
              <input name="marksPerCorrect" type="number" step="0.5" defaultValue={4} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Negative per wrong</label>
              <input name="negativePerWrong" type="number" step="0.01" defaultValue={-1} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-2">
              <input id="isActive" name="isActive" type="checkbox" defaultChecked />
              <label htmlFor="isActive">Set as Active</label>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium border border-border bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20">Create Exam</button>
            </div>
          </form>
          <p className="mt-3 text-sm text-gray-600">After creating, you&apos;ll be redirected to add questions for this exam.</p>
        </div>
      </div>
    </div>
  );
}
