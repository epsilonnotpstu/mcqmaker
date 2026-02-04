import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const ADMIN_COOKIE_NAME = 'admin_token';
export const STUDENT_COOKIE_NAME = 'student_attempt_id';

function getJwtSecret(): string {
  const secret =
    process.env.ADMIN_JWT_SECRET ||
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV !== 'production' ? 'dev-admin-secret' : undefined);
  if (!secret) {
    throw new Error('Missing ADMIN_JWT_SECRET environment variable');
  }
  return secret;
}

export function getSecureCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true as const,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  };
}

export async function hashPassword(plain: string) {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export type AdminTokenPayload = {
  sub: string; // username
  iat?: number;
  exp?: number;
};

export function signAdminToken(payload: AdminTokenPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '12h',
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string') {
      return null;
    }
    const payload = decoded as JwtPayload;
    const sub = typeof payload.sub === 'string' ? payload.sub : undefined;
    if (!sub) return null;
    return {
      sub,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/**
 * Validate admin credentials against environment.
 * Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH (bcrypt hash).
 * Optionally, if ADMIN_PASSWORD is set (plain), it will be used for comparison (not recommended).
 */
export async function checkAdminCredentials(username: string, password: string): Promise<boolean> {
  const envUser = process.env.ADMIN_USERNAME;
  const envPassHash = process.env.ADMIN_PASSWORD_HASH;
  const envPassPlain = process.env.ADMIN_PASSWORD;

  // If no env is configured, allow default admin/admin for local simplicity
  if (!envUser) {
    return username === 'admin' && password === 'admin';
  }
  if (username !== envUser) return false;

  if (envPassHash) {
    // recommended path
    return verifyPassword(password, envPassHash);
  }

  if (envPassPlain) {
    // fallback, not recommended
    return password === envPassPlain;
  }

  // no password configured
  return false;
}
