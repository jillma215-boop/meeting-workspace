'use client';

import { use, useEffect, useState } from 'react';
import { Report } from '@/lib/report';
import { Slide, reportCss } from '@/components/Editor';

export default function SharedReportPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.cookie = 'rakumon_internal_user=viewer; path=/; max-age=2592000; SameSite=Lax';
    fetch(`/api/reports/share/${shareId}`, { headers: { 'x-internal-user': 'viewer' } })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || '共有レポートを読み込めません。');
        return res.json();
      })
      .then(setReport)
      .catch((err: Error) => setError(err.message));
  }, [shareId]);

  if (error) return <main className="min-h-screen bg-rakumon-bg p-8 text-rakumon-text"><div className="mx-auto max-w-3xl rounded-[24px] bg-white p-8 shadow-premium"><h1 className="text-2xl font-bold">共有レポートを表示できません</h1><p className="mt-3 text-rakumon-body">{error}</p></div></main>;
  if (!report) return <main className="min-h-screen bg-rakumon-bg p-8 text-rakumon-text">読み込み中...</main>;

  return (
    <main className="min-h-screen bg-rakumon-bg text-rakumon-text">
      <style>{reportCss}</style>
      <header className="sticky top-0 z-10 border-b border-rakumon-border bg-rakumon-sidebar/95 px-6 py-4 backdrop-blur no-print">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4">
          <div className="mr-auto">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-rakumon-green">Read only / Latest version</p>
            <h1 className="text-xl font-bold">Rakumon 週次運営報告（共有）</h1>
            <p className="mt-1 text-sm text-rakumon-body">最終更新日時: {new Date(report.updatedAt).toLocaleString('ja-JP')} / 作成者: {report.author} / バージョン: v{report.version}</p>
          </div>
          <button onClick={() => navigator.clipboard?.writeText(location.href)} className="btn btn-primary">共有リンクをコピー</button>
          <button onClick={() => print()} className="btn btn-secondary">PDFをダウンロード</button>
        </div>
      </header>
      <section className="mx-auto max-w-7xl p-6">
        <div className="mb-5 rounded-[18px] border border-rakumon-border bg-white p-4 text-sm text-rakumon-body shadow-sm no-print">この共有URLは社内ログインユーザー向けです。閲覧は読み取り専用で、常にサーバーに保存された最新版を表示します。</div>
        {[0,1,2,3,4,5,6,7].map((page) => <Slide key={page} r={report} i={page} />)}
      </section>
    </main>
  );
}
