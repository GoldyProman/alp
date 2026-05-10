import { cookies } from 'next/headers';

const SESSION_COOKIE = 'alpine_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-change-in-production';

/**
 * Create a simple signed session token (not JWT, just base64 + timestamp + secret hash)
 */
export function createSessionToken() {
  const timestamp = Date.now();
  const payload = `${timestamp}:${SESSION_SECRET}`;
  const token = Buffer.from(payload).toString('base64url');
  return token;
}

/**
 * Validate a session token - checks it's not expired (24 hour sessions)
 */
export function validateSessionToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [timestamp, ...secretParts] = decoded.split(':');
    const secret = secretParts.join(':');
    
    if (secret !== SESSION_SECRET) return false;
    
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return tokenAge < maxAge;
  } catch {
    return false;
  }
}

/**
 * Get session from cookies (server-side)
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  if (!validateSessionToken(token)) return null;
  return { authenticated: true };
}

/**
 * Check if admin is authenticated - use in API routes
 */
export async function requireAuth() {
  const session = await getSession();
  return session !== null;
}

export { SESSION_COOKIE };
