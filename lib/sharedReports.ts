import { promises as fs } from 'fs';
import path from 'path';
import { Report, normalizeReport } from './report';

export type SharedReport = Report & { shareId: string; isShared: boolean; sharedAt: string; deletedAt?: string };

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'shared-reports.json');

async function readStore(): Promise<Record<string, SharedReport>> {
  await fs.mkdir(dataDir, { recursive: true });
  const raw = await fs.readFile(dataFile, 'utf8').catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return '{}';
    throw error;
  });
  const parsed = JSON.parse(raw) as Record<string, Partial<SharedReport>>;
  return Object.fromEntries(Object.entries(parsed).map(([id, report]) => [id, normalizeSharedReport(report)]));
}

async function writeStore(store: Record<string, SharedReport>) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2));
}

function normalizeSharedReport(raw: Partial<SharedReport>): SharedReport {
  const normalized = normalizeReport(raw);
  const shareId = raw.shareId || normalized.shareId || normalized.id;
  return { ...normalized, shareId, isShared: raw.isShared ?? true, sharedAt: raw.sharedAt || normalized.sharedAt || normalized.updatedAt, deletedAt: raw.deletedAt ?? undefined };
}

export async function upsertSharedReport(report: Report) {
  const store = await readStore();
  const shareId = report.shareId || report.id;
  const previous = store[shareId];
  const now = new Date().toISOString();
  const shared: SharedReport = normalizeSharedReport({
    ...report,
    shareId,
    isShared: true,
    sharedAt: previous?.sharedAt ?? now,
    updatedAt: now,
    version: (previous?.version ?? Math.max(report.version || 1, 0)) + 1,
    deletedAt: undefined,
  });
  store[shareId] = shared;
  await writeStore(store);
  return shared;
}

export async function getSharedReport(shareId: string) {
  const store = await readStore();
  const report = store[shareId];
  if (!report || report.deletedAt || !report.isShared) return null;
  return report;
}

export async function stopSharingReport(shareId: string) {
  const store = await readStore();
  const report = store[shareId];
  if (!report) return null;
  const stopped = { ...report, isShared: false };
  store[shareId] = stopped;
  await writeStore(store);
  return stopped;
}

export async function deleteSharedReport(shareId: string) {
  const store = await readStore();
  const report = store[shareId];
  if (!report) return null;
  const deleted = { ...report, isShared: false, deletedAt: new Date().toISOString() };
  store[shareId] = deleted;
  await writeStore(store);
  return deleted;
}
