'use client';

import { useTransition, useState } from 'react';
import { prisma } from '@/lib/db';
import { STUDENT_COOKIE_NAME } from '@/lib/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function enterAction(formData: FormData) {
  'use server';
  const { getSecureCookieOptions } = await import('@/lib/auth');
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();

  if (!name || !phone) {
    return { ok: false, error: 'Name and phone are required' };
  }
  if (!/^\d{11}$/.test(phone)) {
    return { ok: false, error: 'Phone must be 11 digits' };
  }

  const settings = await prisma.examSettings.findUnique({ where: { id: 1 } });
  if (!settings || !settings.isActive) {
    return { ok: false, error: 'No active exam at the moment' };
  }

  const attempt = await prisma.studentAttempt.create({
    data: {
      name,
      phone,
      status: 'ongoing',
      answers: {},
    },
  });
  const cookieStore = await cookies();
  cookieStore.set(STUDENT_COOKIE_NAME, attempt.id, getSecureCookieOptions());
  redirect('/exam');
}

export default function EnterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await enterAction(fd);
      if (res && !res.ok) {
        setError(res.error || 'Failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-xl border bg-white dark:bg-gray-900 p-6 shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Enter Exam</h1>
        {error && <div className="mb-4 rounded bg-red-100 text-red-700 p-3 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" required className="w-full border rounded px-3 py-2" placeholder="11 digits" />
          </div>
          <button type="submit" disabled={isPending} className="w-full rounded bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold disabled:opacity-60">
            {isPending ? 'Starting…' : 'Start Exam'}
          </button>
        </form>
      </div>
    </div>
  );
}
