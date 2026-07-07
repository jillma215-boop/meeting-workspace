'use client';
import { useEffect, useMemo, useState } from 'react';
import { Report, createBlankReport, loadReports, saveReports } from '@/lib/report';
import { Editor } from '@/components/Editor';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 10) return { title: 'おはようございます。', body: '今週も一歩ずつ進めていきましょう。' };
  if (hour >= 11 && hour <= 16) return { title: 'こんにちは。', body: '今週のレポートを整理する時間です。' };
  if (hour >= 17 && hour <= 22) return { title: 'お疲れさまです。', body: '今日の内容を記録して、一日を締めくくりましょう。' };
  return { title: '今日もお疲れさまでした。', body: '無理せず、必要なところだけ整えておきましょう。' };
};

const formatDate = (date: Date) => `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
const weekNumber = (date: Date) => {
  const first = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - first.getTime()) / 86400000);
  return Math.ceil((days + first.getDay() + 1) / 7);
};
const lastUpdatedLabel = (reports: Report[]) => {
  if (!reports.length) return 'No reports';
  const latest = reports.reduce((a, b) => (new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b));
  const diff = Math.floor((Date.now() - new Date(latest.updatedAt).getTime()) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
};

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [greeting, setGreeting] = useState(getGreeting());
  const [today, setToday] = useState(new Date());
  useEffect(() => { setReports(loadReports()); setGreeting(getGreeting()); setToday(new Date()); }, []);
  const activeReport = useMemo(() => reports.find((r) => r.id === active), [reports, active]);
  const persist = (next: Report[]) => { setReports(next); saveReports(next); };
  const create = () => { const r = createBlankReport(); persist([r, ...reports]); setActive(r.id); };
  const update = (r: Report) => persist(reports.map((x) => (x.id === r.id ? { ...r, updatedAt: new Date().toISOString() } : x)));
  const del = (id: string) => { if (confirm('このレポートを削除しますか？')) persist(reports.filter((r) => r.id !== id)); };
  const drafts = reports.filter((r) => r.status === 'Draft').length;
  const completed = reports.filter((r) => r.status === 'Completed').length;
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  if (activeReport) return <Editor report={activeReport} onBack={() => setActive(null)} onChange={update} />;
  return (
    <main className="min-h-screen overflow-hidden bg-rakumon-bg px-5 py-8 text-rakumon-text md:px-8">
      <div className="relative mx-auto max-w-6xl">
        <section className="relative mb-12 overflow-hidden rounded-[40px] border border-white/70 bg-gradient-to-b from-rakumon-bg to-rakumon-sidebar px-7 py-10 shadow-premium md:px-12 md:py-14">
          <div className="pointer-events-none absolute right-[-9rem] top-[-9rem] h-96 w-96 rounded-full bg-rakumon-green opacity-[.04] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-8rem] left-[28%] h-80 w-80 rounded-full bg-rakumon-green opacity-[.035] blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-9 text-rakumon-body">
                <p className="text-xl font-medium tracking-[-.01em] text-rakumon-text">{greeting.title}</p>
                <p className="mt-2 text-base leading-7 text-rakumon-body">{greeting.body}</p>
              </div>
              <p className="font-outfit text-sm font-semibold uppercase tracking-[0.35em] text-rakumon-green">Rakumon Edition</p>
              <h1 className="mt-3 font-outfit text-5xl font-bold tracking-tight text-rakumon-text md:text-[56px]">Meeting Workspace</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-rakumon-body">週次報告を静かに整え、保存し、会議にふさわしいプレビューへ。月曜の朝に開きたくなる、プレミアムな業務ノートです。</p>
              <button onClick={create} className="btn btn-primary mt-10">新規週次レポート作成</button>
            </div>
            <aside className="rounded-[28px] bg-white p-7 shadow-[0_24px_70px_rgba(30,43,34,.08)] ring-1 ring-rakumon-border/60">
              <div className="flex items-start justify-between border-b border-rakumon-border pb-6">
                <div><p className="font-outfit text-3xl font-bold text-rakumon-text">{weekday}</p><p className="mt-2 font-number text-sm text-rakumon-caption">{formatDate(today)}</p></div>
                <span className="rounded-full bg-rakumon-light px-4 py-2 font-number text-sm font-bold text-rakumon-green">Week{weekNumber(today)}</span>
              </div>
              <div className="mt-7 space-y-5">
                {[['Draft Reports', drafts], ['Completed Reports', completed]].map(([label, value]) => <div key={label} className="flex items-center justify-between"><span className="text-rakumon-body">{label}</span><span className="font-number text-[40px] font-bold leading-none text-rakumon-text">{value}</span></div>)}
                <div className="flex items-center justify-between border-t border-rakumon-border pt-5"><span className="text-rakumon-body">Last Updated</span><span className="font-medium text-rakumon-text">{lastUpdatedLabel(reports)}</span></div>
              </div>
            </aside>
          </div>
        </section>
        <div className="mb-6 flex items-end justify-between"><div><p className="font-outfit text-xs font-bold uppercase tracking-[.25em] text-rakumon-green">Recent Reports</p><h2 className="mt-2 font-outfit text-[32px] font-bold">Recent Reports</h2></div></div>
        {reports.length === 0 ? <div className="rounded-[24px] bg-white p-12 text-center shadow-premium"><h3 className="text-xl font-bold">まだレポートがありません</h3><p className="mt-2 text-rakumon-body">新規週次レポートを作成して開始しましょう</p></div> : <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">{reports.map((r, i) => <article key={r.id} className={`group relative rounded-[20px] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-premiumHover ${i === 0 ? 'md:col-span-2 lg:col-span-1 shadow-[0_18px_48px_rgba(30,43,34,.08)] ring-1 ring-rakumon-border/70' : 'shadow-premium'}`}>{i === 0 && <span className="absolute right-5 top-5 rounded-full bg-rakumon-light px-3 py-1 text-xs font-bold text-rakumon-green">Latest</span>}<div className="text-sm text-rakumon-caption">対象期間</div><div className={`mt-1 font-number font-bold text-rakumon-text ${i === 0 ? 'text-2xl' : 'text-xl'}`}>{r.startDate} / {r.endDate}</div><span className={`mt-5 inline-flex rounded-full px-3.5 py-1.5 text-xs font-bold ${r.status === 'Completed' ? 'bg-rakumon-light text-rakumon-green' : 'bg-amber-100/70 text-amber-800'}`}>{r.status}</span><p className="mt-5 text-sm leading-6 text-rakumon-body">Last updated<br /><span className="font-number text-rakumon-caption">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={() => setActive(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={() => del(r.id)} className="btn btn-danger">Delete</button></div></article>)}</div>}
      </div>
    </main>
  );
}
