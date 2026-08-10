import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

// Visit this once after deploying, with your admin password as ?key=
// e.g. https://yoursite.vercel.app/api/init-db?key=YOUR_ADMIN_PASSWORD
export async function GET(request) {
  const key = request.nextUrl.searchParams.get('key');
  if (!key || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  await initDb();
  return NextResponse.json({ ok: true, message: 'Database ready.' });
}
