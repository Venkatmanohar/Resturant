import crypto from 'crypto';

export const COOKIE_NAME = 'mk_admin_auth';

function secret() {
  return process.env.ADMIN_SECRET || 'fallback-secret-change-me';
}

export function makeToken() {
  return crypto.createHmac('sha256', secret()).update('admin-session').digest('hex');
}

export function isValidToken(token) {
  if (!token) return false;
  const expected = makeToken();
  // constant-time-ish compare
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function checkAdminRequest(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return isValidToken(token);
}
