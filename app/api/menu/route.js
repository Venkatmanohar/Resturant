import { NextResponse } from 'next/server';
import { getMenuItems, addMenuItem } from '@/lib/db';
import { checkAdminRequest } from '@/lib/auth';

export async function GET() {
  const items = await getMenuItems();
  return NextResponse.json(items);
}

export async function POST(request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.name || body.price === undefined) {
    return NextResponse.json({ error: 'name and price are required' }, { status: 400 });
  }
  const item = await addMenuItem(body);
  return NextResponse.json(item);
}
