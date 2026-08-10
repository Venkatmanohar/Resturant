import { NextResponse } from 'next/server';
import { getBusiness, updateBusiness } from '@/lib/db';
import { checkAdminRequest } from '@/lib/auth';

export async function GET() {
  const business = await getBusiness();
  return NextResponse.json(business);
}

export async function PUT(request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const updated = await updateBusiness(body);
  return NextResponse.json(updated);
}
