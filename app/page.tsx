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

const WEEKDAY_MESSAGES: Record<number, string> = {
  0: '必要なところだけ、ゆっくり確認しておきましょう。',
  1: '今週のスタートです。少しずつ整えていきましょう。',
  2: '今日の内容を、無理なく整理していきましょう。',
  3: '今日の内容を、無理なく整理していきましょう。',
  4: '今日の内容を、無理なく整理していきましょう。',
  5: '一週間のまとめを整えるタイミングです。',
  6: '必要なところだけ、ゆっくり確認しておきましょう。',
};

const getWeekNumber = (date: Date) => {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const getTodayInfo = () => {
  const today = new Date();
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const date = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
    .map((value) => String(value).padStart(2, '0'))
    .join('.');

  return {
    weekday,
    date,
    week: getWeekNumber(today),
    message: WEEKDAY_MESSAGES[today.getDay()],
  };
};

type TodayInfo = ReturnType<typeof getTodayInfo>;

function TodayWidget({ today }: { today: TodayInfo | null }) {
  return (
    <aside className="w-full rounded-[20px] border border-rakumon-border bg-white px-6 py-6 shadow-premium md:max-w-[21rem] md:px-7">
      <p className="font-outfit text-xs font-bold uppercase tracking-[0.3em] text-rakumon-caption">Today</p>
      <div className="mt-5 flex items-end justify-between gap-5">
        <div>
          <p className="font-outfit text-4xl font-bold leading-none tracking-tight text-rakumon-text">{today?.weekday ?? 'Today'}</p>
          <p className="mt-3 font-number text-sm font-semibold tracking-[0.18em] text-rakumon-caption">{today?.date ?? '----.--.--'}</p>
        </div>
        <p className="rounded-full bg-rakumon-light px-3 py-1.5 font-outfit text-sm font-bold text-rakumon-green">Week {today?.week ?? '--'}</p>
      </div>
      <p className="mt-7 border-t border-rakumon-border pt-5 font-zen text-base leading-8 text-rakumon-body">
        {today?.message ?? '今日の内容を、無理なく整理していきましょう。'}
      </p>
    </aside>
  );
}

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('こんにちは、Jillさん。');
  const [today, setToday] = useState<TodayInfo | null>(null);
  useEffect(() => { setReports(loadReports()); setGreeting(getGreeting()); setToday(getTodayInfo()); }, []);
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
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
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
            <TodayWidget today={today} />
          </div>
        </section>
        <div className="mb-5 flex items-end justify-between"><div><p className="font-outfit text-xs font-bold uppercase tracking-[.25em] text-rakumon-green">Recent Reports</p><h2 className="mt-2 font-outfit text-3xl font-bold">Recent Reports</h2></div></div>
        {reports.length === 0 ? <div className="rounded-[20px] bg-white p-10 text-center shadow-premium"><h3 className="text-xl font-bold">まだレポートがありません</h3><p className="mt-2 text-rakumon-body">新規週次レポートを作成して開始しましょう</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reports.map((r) => <article key={r.id} className="rounded-[20px] bg-white p-6 shadow-premium transition duration-200 hover:-translate-y-1 hover:shadow-premiumHover"><div className="text-sm text-rakumon-caption">対象期間</div><div className="mt-1 font-number text-xl font-bold text-rakumon-text">{r.startDate} / {r.endDate}</div><span className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.status === 'Completed' ? 'bg-rakumon-light text-rakumon-green' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span><p className="mt-5 text-sm text-rakumon-body">Last updated<br /><span className="font-number text-rakumon-caption">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={() => setActive(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={() => del(r.id)} className="btn btn-danger">Delete</button></div></article>)}</div>}
      </div>
    </main>
  );
}
