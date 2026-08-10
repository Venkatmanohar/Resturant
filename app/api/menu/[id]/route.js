import { NextResponse } from 'next/server';
import { updateMenuItem, deleteMenuItem } from '@/lib/db';
import { checkAdminRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const updated = await updateMenuItem(params.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await deleteMenuItem(params.id);
  return NextResponse.json({ ok: true });
}
