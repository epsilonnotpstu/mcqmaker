'use client';

import React, { useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loginAction } from './actions';

// Server action lives in ./actions.ts and is imported here

export default function AdminLoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(params.get('error'));
  const [isPending, startTransition] = useTransition();

  const redirectParam = params.get('redirect') || '/admin/dashboard';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('redirectTo', redirectParam);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (!res.ok) {
        setError(res.error || 'Login failed');
        return;
      }
      if (res.redirectTo) {
        router.replace(res.redirectTo);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && (
          <div className="mb-4 rounded bg-red-100 text-red-700 p-3 text-sm">{error}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold disabled:opacity-60"
          >
            {isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          Protected area. Make sure environment variables are configured.
        </p>
      </div>
    </div>
  );
}
