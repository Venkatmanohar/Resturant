import { NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/auth';

export async function GET(request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
