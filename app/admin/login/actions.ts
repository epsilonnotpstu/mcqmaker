"use server";

import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME } from '@/lib/constants';
import { checkAdminCredentials, getSecureCookieOptions, signAdminToken } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const redirectTo = String(formData.get('redirectTo') || '/admin/dashboard');

  if (!username || !password) {
    return { ok: false, error: 'Username and password are required.' };
  }

  const valid = await checkAdminCredentials(username, password);
  if (!valid) {
    return { ok: false, error: 'Invalid credentials.' };
  }

  const token = signAdminToken({ sub: username });
  const opts = getSecureCookieOptions();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, opts);

  return { ok: true, redirectTo };
}
