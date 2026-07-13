import { NextRequest, NextResponse } from 'next/server';
import { deleteSharedReport, getSharedReport, stopSharingReport } from '@/lib/sharedReports';

type Context = { params: Promise<{ shareId: string }> };

function isInternalUser(request: NextRequest) {
  return Boolean(request.headers.get('x-internal-user') || request.cookies.get('rakumon_internal_user')?.value);
}

export async function GET(request: NextRequest, context: Context) {
  if (!isInternalUser(request)) return NextResponse.json({ error: '社内ログインが必要です。' }, { status: 401 });
  const { shareId } = await context.params;
  const report = await getSharedReport(shareId);
  if (!report) return NextResponse.json({ error: '共有レポートが見つかりません。' }, { status: 404 });
  return NextResponse.json(report);
}

export async function PATCH(request: NextRequest, context: Context) {
  if (!isInternalUser(request)) return NextResponse.json({ error: '社内ログインが必要です。' }, { status: 401 });
  const { shareId } = await context.params;
  const body = await request.json();
  if (body.action !== 'stop') return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  const report = await stopSharingReport(shareId);
  if (!report) return NextResponse.json({ error: '共有レポートが見つかりません。' }, { status: 404 });
  return NextResponse.json(report);
}

export async function DELETE(request: NextRequest, context: Context) {
  if (!isInternalUser(request)) return NextResponse.json({ error: '社内ログインが必要です。' }, { status: 401 });
  const { shareId } = await context.params;
  const report = await deleteSharedReport(shareId);
  if (!report) return NextResponse.json({ error: '共有レポートが見つかりません。' }, { status: 404 });
  return NextResponse.json(report);
}
