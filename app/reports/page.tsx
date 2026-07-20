'use client';
import { useEffect, useMemo, useState } from 'react';
import { Report, ReportType, createBlankReport, loadReports, saveReports } from '@/lib/report';
import { MonthlyReport, createMonthlyReport, loadMonthlyReports, saveMonthlyReports } from '@/lib/monthlyReport';
import { WeekSelectionModal } from '@/components/WeekSelectionModal';
import { WeekOption, formatWeekRange } from '@/lib/week';
import { MonthlyReportEditor } from '@/components/MonthlyReportEditor';
import { Editor } from '@/components/Editor';
import { MoriAssistant } from '@/components/MoriAssistant';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 10) return 'おはようございます、Jillさん。';
  if (hour >= 11 && hour <= 17) return 'こんにちは、Jillさん。';
  return 'お疲れさまです、Jillさん。';
};

const MORI_DASHBOARD_MESSAGE = '今日も一歩ずつ、\nレポートを整理していきましょう。';

const WEEKDAY_MESSAGES: Record<number, string> = {
  0: '必要なところだけ、ゆっくり確認しておきましょう。',
  1: '今週のスタートです。少しずつ整えていきましょう。',
  2: '今日の内容を、無理なく整理していきましょう。',
  3: '今日の内容を、無理なく整理していきましょう。',
  4: '今日の内容を、無理なく整理していきましょう。',
  5: '一週間のまとめを整えるタイミングです。',
  6: '必要なところだけ、ゆっくり確認しておきましょう。',
};

const reportTypes: Array<{ type: ReportType; icon: string; title: string; description: string }> = [
  { type: 'weekly', icon: '①', title: '新規週次レポート作成', description: '週次運営報告を作成します。' },
  { type: 'monthly', icon: '②', title: '新規月次レポート作成', description: '月次経営・運営報告を作成します。' },
  { type: 'project', icon: '③', title: '新規プログラムレポート作成', description: 'プログラム別レポートを作成します。' },
];

const reportTypeLabels: Record<ReportType, string> = {
  weekly: '週次',
  monthly: '月次',
  project: 'プログラム',
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

function ReportCreationModal({ selected, onSelect, onClose, onCreate }: { selected: ReportType; onSelect: (type: ReportType) => void; onClose: () => void; onCreate: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-rakumon-text/30 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-report-title">
      <div className="w-full max-w-3xl rounded-[28px] border border-white/80 bg-rakumon-bg p-6 shadow-premium md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-outfit text-xs font-bold uppercase tracking-[0.3em] text-rakumon-green">Report Type</p>
            <h2 id="create-report-title" className="mt-2 text-2xl font-bold text-rakumon-text">新しいレポートを作成</h2>
            <p className="mt-2 text-sm leading-7 text-rakumon-body">用途に合わせてレポートを選択してください。</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-white px-3 py-1.5 text-rakumon-caption transition hover:bg-rakumon-light hover:text-rakumon-green" aria-label="閉じる">×</button>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {reportTypes.map((option) => {
            const isSelected = selected === option.type;
            return (
              <button
                key={option.type}
                onClick={() => onSelect(option.type)}
                className={`group rounded-[22px] border bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-rakumon-green/50 hover:shadow-premiumHover ${isSelected ? 'border-rakumon-green ring-4 ring-rakumon-green/10' : 'border-rakumon-border'}`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl font-outfit text-lg font-bold transition ${isSelected ? 'bg-rakumon-green text-white' : 'bg-rakumon-light text-rakumon-green group-hover:bg-rakumon-green group-hover:text-white'}`}>{option.icon}</span>
                <span className="mt-5 block font-bold text-rakumon-text">{option.title}</span>
                <span className="mt-3 block text-sm leading-7 text-rakumon-body">{option.description}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex justify-end gap-3 border-t border-rakumon-border pt-5">
          <button onClick={onClose} className="btn btn-secondary">キャンセル</button>
          <button onClick={onCreate} className="btn btn-primary">作成</button>
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ report, onBack }: { report: Report; onBack: () => void }) {
  return (
    <main className="min-h-screen bg-rakumon-bg px-5 py-8 text-rakumon-text md:px-8">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-white/70 bg-white p-10 text-center shadow-premium">
        <span className="inline-flex rounded-full bg-rakumon-light px-4 py-2 text-sm font-bold text-rakumon-green">{reportTypeLabels[report.type]} Report</span>
        <h1 className="mt-6 font-outfit text-4xl font-bold">Coming Soon</h1>
        <p className="mt-4 text-rakumon-body">{report.type === 'monthly' ? '月次レポート' : 'プロジェクトレポート'}の編集画面は準備中です。</p>
        <button onClick={onBack} className="btn btn-primary mt-8">← Dashboard</button>
      </div>
    </main>
  );
}

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [activeMonthly, setActiveMonthly] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('こんにちは、Jillさん。');
  const [today, setToday] = useState<TodayInfo | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWeekSelectOpen, setIsWeekSelectOpen] = useState(false);
  const [duplicateWeek, setDuplicateWeek] = useState<{ week: WeekOption; report: Report } | null>(null);
  const [selectedType, setSelectedType] = useState<ReportType>('weekly');
  useEffect(() => { setReports(loadReports()); setMonthlyReports(loadMonthlyReports()); setGreeting(getGreeting()); setToday(getTodayInfo()); }, []);
  const activeReport = useMemo(() => reports.find((r) => r.id === active), [reports, active]);
  const activeMonthlyReport = useMemo(() => monthlyReports.find((r) => r.id === activeMonthly), [monthlyReports, activeMonthly]);
  const persist = (next: Report[]) => { setReports(next); saveReports(next); };
  const persistMonthly = (next: MonthlyReport[]) => { setMonthlyReports(next); saveMonthlyReports(next); };
  const createWeekly = (week: WeekOption, allowDuplicate = false) => { const existing = reports.find((r) => r.type === 'weekly' && r.weekYear === week.weekYear && r.weekNumber === week.weekNumber); if (existing && !allowDuplicate) { setDuplicateWeek({ week, report: existing }); return; } const r = allowDuplicate && existing ? { ...existing, id: crypto.randomUUID(), weekYear: week.weekYear, weekNumber: week.weekNumber, startDate: week.startDate, endDate: week.endDate, status: 'Draft' as const, updatedAt: new Date().toISOString(), version: 1, shareId: undefined, sharedAt: null, isShared: false } : createBlankReport('weekly', week); persist([r, ...reports]); setIsWeekSelectOpen(false); setDuplicateWeek(null); setActive(r.id); };
  const create = () => { if (selectedType === 'monthly') { const r = createMonthlyReport(); persistMonthly([r, ...monthlyReports]); setIsCreateOpen(false); setActiveMonthly(r.id); return; } if (selectedType === 'weekly') { setIsCreateOpen(false); setIsWeekSelectOpen(true); return; } const r = createBlankReport(selectedType); persist([r, ...reports]); setIsCreateOpen(false); setActive(r.id); };
  const update = (r: Report) => persist(reports.map((x) => (x.id === r.id ? { ...r, version: Math.max(r.version ?? 1, x.version ?? 1) + 1, updatedAt: new Date().toISOString() } : x)));
  const updateMonthly = (r: MonthlyReport) => persistMonthly(monthlyReports.map((x) => (x.id === r.id ? r : x)));
  const del = (id: string) => { if (confirm('このレポートを削除しますか？')) persist(reports.filter((r) => r.id !== id)); };
  const delMonthly = (id: string) => { if (confirm('この月次レポートを削除しますか？')) persistMonthly(monthlyReports.filter((r) => r.id !== id)); };
  const recentReports = [...reports.map((r) => ({ kind: 'report' as const, updatedAt: r.updatedAt, report: r })), ...monthlyReports.map((r) => ({ kind: 'monthly' as const, updatedAt: r.updatedAt, report: r }))].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (activeMonthlyReport) return <MonthlyReportEditor report={activeMonthlyReport} onBack={() => setActiveMonthly(null)} onChange={updateMonthly} />;
  if (activeReport?.type === 'weekly') return <Editor report={activeReport} onBack={() => setActive(null)} onChange={update} />;
  if (activeReport) return <ComingSoon report={activeReport} onBack={() => setActive(null)} />;
  return (
    <main className="min-h-screen overflow-hidden bg-rakumon-bg px-5 py-8 text-rakumon-text md:px-8">
      {isCreateOpen && <ReportCreationModal selected={selectedType} onSelect={setSelectedType} onClose={() => setIsCreateOpen(false)} onCreate={create} />}
      {isWeekSelectOpen && <WeekSelectionModal onClose={() => setIsWeekSelectOpen(false)} onConfirm={(week) => createWeekly(week)} />}
      {duplicateWeek && <div className="fixed inset-0 z-[60] grid place-items-center bg-rakumon-text/30 px-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-[24px] bg-rakumon-bg p-6 shadow-premium"><h2 className="text-xl font-bold">この週のレポートはすでに存在します。</h2><p className="mt-3 text-sm text-rakumon-body">W{duplicateWeek.week.weekNumber} / {formatWeekRange(duplicateWeek.week.startDate, duplicateWeek.week.endDate)}</p><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button onClick={() => { setActive(duplicateWeek.report.id); setDuplicateWeek(null); setIsWeekSelectOpen(false); }} className="btn btn-primary">既存レポートを開く</button><button onClick={() => createWeekly(duplicateWeek.week, true)} className="btn btn-secondary">新しく複製して作成</button></div></div></div>}
      <div className="relative mx-auto max-w-6xl">
        <section className="relative mb-10 overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-b from-rakumon-bg to-rakumon-sidebar px-7 py-10 shadow-premium md:px-12 md:py-14">
          <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-rakumon-green/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-7rem] left-[18rem] h-64 w-64 rounded-full bg-rakumon-green/5 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
              <MoriAssistant className="mb-8" state="idle" title={greeting} message={MORI_DASHBOARD_MESSAGE} />
              <p className="font-outfit text-sm font-semibold uppercase tracking-[0.35em] text-rakumon-green">Rakumon Workplace</p>
              <h1 className="mt-3 font-outfit text-5xl font-bold tracking-tight text-rakumon-text md:text-[56px]">Report Workspace</h1>
              <p className="mt-5 text-2xl font-semibold text-rakumon-text">AIで、報告業務をもっとスマートに。</p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-rakumon-body">週次運営報告・月次経営/運営報告・プログラム別レポートを、<br />ひとつのワークスペースで管理します。</p>
              <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary mt-9">＋ 新規レポート作成</button>
            </div>
            <TodayWidget today={today} />
          </div>
        </section>
        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-[22px] border border-white bg-white p-6 shadow-premium"><p className="font-outfit text-xl font-bold">Weekly Report</p><p className="mt-2 font-bold text-rakumon-green">週次運営報告</p><p className="mt-4 text-sm text-rakumon-caption">毎週の運営状況・KPI・課題を整理します。</p><button onClick={() => setIsWeekSelectOpen(true)} className="btn btn-primary mt-5">＋ 新規週次レポート作成</button></article><article className="rounded-[22px] border border-white bg-white p-6 shadow-premium"><p className="font-outfit text-xl font-bold">Monthly Report</p><p className="mt-2 font-bold text-rakumon-green">月次経営・運営報告</p><p className="mt-4 text-sm text-rakumon-caption">月次のKPI・トピック・課題を整理します。</p><button onClick={() => { const r=createMonthlyReport(); persistMonthly([r,...monthlyReports]); setActiveMonthly(r.id); }} className="btn btn-primary mt-5">＋ 新規月次レポート作成</button></article><article className="rounded-[22px] border border-white bg-white p-6 shadow-premium"><p className="font-outfit text-xl font-bold">Program Report</p><p className="mt-2 font-bold text-rakumon-green">プログラム別レポート</p><p className="mt-4 text-sm text-rakumon-caption">Coming Soon</p></article>
        </section>
        <div className="mb-5 flex items-end justify-between"><div><p className="font-outfit text-xs font-bold uppercase tracking-[.25em] text-rakumon-green">Recent Reports</p><h2 className="mt-2 font-outfit text-3xl font-bold">Recent Reports</h2><p className="mt-2 text-sm text-rakumon-body">週報・月報・プログラムレポートをここから開けます。</p></div></div>
        {recentReports.length === 0 ? <div className="rounded-[20px] bg-white p-10 text-center shadow-premium"><h3 className="text-xl font-bold">まだレポートがありません</h3><p className="mt-2 text-rakumon-body">新規レポートを作成して開始しましょう</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recentReports.map((item) => item.kind === 'report' ? (() => { const r = item.report; if (r.type !== 'weekly') return <article key={r.id} className="rounded-[20px] bg-white p-6 shadow-premium"><span className="rounded-full bg-rakumon-light px-3 py-1 text-xs font-bold text-rakumon-green">{reportTypeLabels[r.type]}</span><div className="mt-4 font-outfit text-xl font-bold text-rakumon-text">Program Report</div><span className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{r.status}</span><p className="mt-5 text-sm text-rakumon-body">Last updated<br /><span className="font-number text-rakumon-caption">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={() => setActive(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={() => del(r.id)} className="btn btn-danger">Delete</button></div></article>; return <article key={r.id} className="rounded-[20px] bg-white p-6 shadow-premium transition duration-200 hover:-translate-y-1 hover:shadow-premiumHover"><div className="flex items-center justify-between gap-3"><div className="text-sm text-rakumon-caption">対象期間</div><span className="rounded-full bg-rakumon-light px-3 py-1 text-xs font-bold text-rakumon-green">週次</span></div><div className="mt-3 font-number text-2xl font-bold text-rakumon-text">W{r.weekNumber}</div><div className="mt-1 font-number text-sm text-rakumon-caption">{formatWeekRange(r.startDate, r.endDate)}</div><span className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.status === 'Completed' ? 'bg-rakumon-light text-rakumon-green' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span><p className="mt-5 text-sm text-rakumon-body">Last updated<br /><span className="font-number text-rakumon-caption">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={() => setActive(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={() => del(r.id)} className="btn btn-danger">Delete</button></div></article>; })() : (() => { const r = item.report; return <article key={r.id} className="rounded-[20px] bg-white p-6 shadow-premium"><span className="rounded-full bg-rakumon-light px-3 py-1 text-xs font-bold text-rakumon-green">月次</span><div className="mt-4 font-number text-xl font-bold text-rakumon-text">{r.reportYear}年{r.reportMonth}月</div><span className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.status === 'completed' ? 'bg-rakumon-light text-rakumon-green' : 'bg-amber-50 text-amber-700'}`}>{r.status === 'completed' ? 'Completed' : 'Draft'}</span><p className="mt-5 text-sm text-rakumon-body">最終更新<br /><span className="font-number text-rakumon-caption">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={() => setActiveMonthly(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={() => delMonthly(r.id)} className="btn btn-danger">Delete</button></div></article>; })())}</div>}
      </div>
    </main>
  );
}
