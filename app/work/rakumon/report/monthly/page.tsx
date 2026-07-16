'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MonthlyReport, createMonthlyReport, loadMonthlyReports, saveMonthlyReports } from '@/lib/monthlyReport';
import { MonthlyReportEditor } from '@/components/MonthlyReportEditor';

export default function MonthlyReportPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => setReports(loadMonthlyReports()), []);
  const persist = (next: MonthlyReport[]) => { setReports(next); saveMonthlyReports(next); };
  const current = reports.find((r) => r.id === active);
  if (current) return <MonthlyReportEditor report={current} onBack={() => setActive(null)} onChange={(report) => persist(reports.map((r) => r.id === report.id ? report : r))} />;
  return <main className="min-h-screen bg-[#F7F4EE] px-5 py-8 text-rakumon-text md:px-8"><div className="mx-auto max-w-6xl"><nav className="flex flex-wrap gap-3 text-sm font-bold text-rakumon-green"><Link href="/">My World</Link><span>/</span><Link href="/work">Work</Link><span>/</span><Link href="/work/rakumon">Rakumon Workplace</Link><span>/</span><Link href="/reports">Report Workspace</Link></nav><header className="mt-7 rounded-[34px] border border-white/80 bg-white/70 p-8 shadow-premium"><p className="font-outfit text-xs font-bold uppercase tracking-[0.32em] text-rakumon-green">Monthly Report</p><h1 className="mt-4 font-outfit text-5xl font-bold tracking-tight">Rakumon 月次運営報告</h1><p className="mt-4 text-rakumon-body">2025年・2026年の月次KPI比較、プレビュー、PDF/HTML出力を行います。</p><button onClick={() => { const r=createMonthlyReport(); persist([r,...reports]); setActive(r.id); }} className="btn btn-primary mt-8">＋ 新規月次レポート作成</button></header><section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reports.map((r) => <article key={r.id} className="rounded-[20px] bg-white p-6 shadow-premium"><span className="rounded-full bg-rakumon-light px-3 py-1 text-xs font-bold text-rakumon-green">Monthly Report</span><div className="mt-4 font-number text-xl font-bold">{r.reportYear}年{r.reportMonth}月</div><span className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.status === 'completed' ? 'bg-rakumon-light text-rakumon-green' : 'bg-amber-50 text-amber-700'}`}>{r.status === 'completed' ? 'Completed' : 'Draft'}</span><p className="mt-5 text-sm text-rakumon-body">最終更新 <span className="font-number text-rakumon-caption">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={() => setActive(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={() => confirm('削除しますか？') && persist(reports.filter((x) => x.id !== r.id))} className="btn btn-danger">Delete</button></div></article>)}</section></div></main>;
}
