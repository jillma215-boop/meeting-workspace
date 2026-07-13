import { NextRequest, NextResponse } from 'next/server';
import { upsertSharedReport } from '@/lib/sharedReports';

function isInternalUser(request: NextRequest) {
  return Boolean(request.headers.get('x-internal-user') || request.cookies.get('rakumon_internal_user')?.value);
}

export async function POST(request: NextRequest) {
  if (!isInternalUser(request)) return NextResponse.json({ error: '社内ログインが必要です。' }, { status: 401 });
  const report = await request.json();
  const shared = await upsertSharedReport(report);
  return NextResponse.json(shared);
}
