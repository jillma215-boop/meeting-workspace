'use client';
import { useEffect, useMemo, useState } from 'react';
import { Report, createBlankReport, loadReports, saveReports } from '@/lib/report';
import { Editor } from '@/components/Editor';
import { MoriAssistant } from '@/components/MoriAssistant';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 10) return 'おはようございます、Jillさん。';
  if (hour >= 11 && hour <= 17) return 'こんにちは、Jillさん。';
  return 'お疲れさまです、Jillさん。';
};

const MORI_DASHBOARD_MESSAGE = '今週のレポートも、\n少しずつ整えていきましょう。';

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('こんにちは、Jillさん。');
  useEffect(() => { setReports(loadReports()); setGreeting(getGreeting()); }, []);
  const activeReport = useMemo(() => reports.find((r) => r.id === active), [reports, active]);
  const persist = (next: Report[]) => { setReports(next); saveReports(next); };
  const create = () => { const r = createBlankReport(); persist([r, ...reports]); setActive(r.id); };
  const update = (r: Report) => persist(reports.map((x) => (x.id === r.id ? { ...r, updatedAt: new Date().toISOString() } : x)));
  const del = (id: string) => { if (confirm('このレポートを削除しますか？')) persist(reports.filter((r) => r.id !== id)); };
  if (activeReport) return <Editor report={activeReport} onBack={() => setActive(null)} onChange={update} />;
  return (
    <main className="min-h-screen overflow-hidden bg-rakumon-bg px-5 py-8 text-rakumon-text md:px-8">
      <div className="relative mx-auto max-w-6xl">
        <section className="relative mb-10 overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-b from-rakumon-bg to-rakumon-sidebar px-7 py-10 shadow-premium md:px-12 md:py-14">
          <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-rakumon-green/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-7rem] left-[18rem] h-64 w-64 rounded-full bg-rakumon-green/5 blur-3xl" />
          <div className="relative max-w-3xl">
            <MoriAssistant
              className="mb-8"
              state="idle"
              title={greeting}
              message={MORI_DASHBOARD_MESSAGE}
            />
            <p className="font-outfit text-sm font-semibold uppercase tracking-[0.35em] text-rakumon-green">Rakumon Edition</p>
            <h1 className="mt-3 font-outfit text-5xl font-bold tracking-tight text-rakumon-text md:text-[56px]">Meeting Workspace</h1>
            <p className="mt-5 text-2xl font-semibold text-rakumon-text">AIで、報告業務をもっとスマートに。</p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-rakumon-body">毎週の運営報告を、入力・保存・プレビューまで一つのワークスペースで管理します。</p>
            <button onClick={create} className="btn btn-primary mt-9">＋ 新規週次レポート作成</button>
          </div>
        </section>
        <div className="mb-5 flex items-end justify-between"><div><p className="font-outfit text-xs font-bold uppercase tracking-[.25em] text-rakumon-green">Recent Reports</p><h2 className="mt-2 font-outfit text-3xl font-bold">Recent Reports</h2></div></div>
        {reports.length === 0 ? <div className="rounded-[20px] bg-white p-10 text-center shadow-premium"><h3 className="text-xl font-bold">まだレポートがありません</h3><p className="mt-2 text-rakumon-body">新規週次レポートを作成して開始しましょう</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reports.map((r) => <article key={r.id} className="rounded-[20px] bg-white p-6 shadow-premium transition duration-200 hover:-translate-y-1 hover:shadow-premiumHover"><div className="text-sm text-rakumon-caption">対象期間</div><div className="mt-1 font-number text-xl font-bold text-rakumon-text">{r.startDate} / {r.endDate}</div><span className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.status === 'Completed' ? 'bg-rakumon-light text-rakumon-green' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span><p className="mt-5 text-sm text-rakumon-body">Last updated<br /><span className="font-number text-rakumon-caption">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={() => setActive(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={() => del(r.id)} className="btn btn-danger">Delete</button></div></article>)}</div>}
      </div>
    </main>
  );
}
