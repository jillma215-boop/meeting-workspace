'use client';
import { useEffect, useMemo, useState } from 'react';
import { Report, createBlankReport, loadReports, saveReports } from '@/lib/report';
import { Editor } from '@/components/Editor';

export default function Home(){
 const [reports,setReports]=useState<Report[]>([]); const [active,setActive]=useState<string|null>(null);
 useEffect(()=>setReports(loadReports()),[]);
 const activeReport=useMemo(()=>reports.find(r=>r.id===active),[reports,active]);
 const persist=(next:Report[])=>{setReports(next); saveReports(next)};
 const create=()=>{const r=createBlankReport(); persist([r,...reports]); setActive(r.id)};
 const update=(r:Report)=>persist(reports.map(x=>x.id===r.id?{...r,updatedAt:new Date().toISOString()}:x));
 const del=(id:string)=>{if(confirm('このレポートを削除しますか？')) persist(reports.filter(r=>r.id!==id));};
 if(activeReport) return <Editor report={activeReport} onBack={()=>setActive(null)} onChange={update}/>;
 return <main className="min-h-screen overflow-hidden bg-rakumon-bg px-6 py-10"><div className="pointer-events-none fixed inset-0 -z-0"><div className="absolute right-[-10%] top-[-20%] h-96 w-96 rounded-full bg-rakumon-light blur-3xl"/><div className="absolute left-[8%] top-[28%] h-64 w-64 rounded-full bg-white/70 blur-3xl"/></div><div className="relative mx-auto max-w-6xl">
  <section className="mb-10 overflow-hidden rounded-[32px] border border-rakumon-border bg-white p-10 shadow-premium"><div className="max-w-3xl"><p className="font-outfit text-sm font-semibold uppercase tracking-[0.35em] text-rakumon-green">Rakumon Edition</p><h1 className="mt-3 font-outfit text-5xl font-bold tracking-tight text-rakumon-text">Meeting Workspace</h1><p className="mt-4 text-2xl font-medium text-rakumon-text">AIで、報告業務をもっとスマートに。</p><p className="mt-3 max-w-2xl leading-7 text-rakumon-muted">毎週の運営報告を、入力・保存・プレビューまで一つのワークスペースで管理します。</p><button onClick={create} className="btn btn-primary mt-8">＋ 新規週次レポート作成</button></div></section>
  <div className="mb-4 flex items-end justify-between"><div><p className="font-outfit text-xs font-bold uppercase tracking-[.25em] text-rakumon-green">Recent Reports</p><h2 className="mt-1 text-2xl font-bold">保存済み週次レポート</h2></div></div>
  {reports.length===0?<div className="rounded-[20px] border border-rakumon-border bg-white p-10 text-center shadow-premium"><h3 className="text-xl font-bold">まだレポートがありません</h3><p className="mt-2 text-rakumon-muted">新規週次レポートを作成して開始しましょう</p></div>:<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reports.map(r=><article key={r.id} className="rounded-[20px] border border-rakumon-border bg-white p-6 shadow-premium transition duration-200 hover:-translate-y-1"><div className="text-sm text-rakumon-muted">対象期間</div><div className="mt-1 font-number text-xl font-bold">{r.startDate} / {r.endDate}</div><span className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.status==='Completed'?'bg-rakumon-light text-rakumon-green':'bg-amber-50 text-amber-700'}`}>{r.status}</span><p className="mt-5 text-sm text-rakumon-muted">Last updated<br/><span className="font-number">{new Date(r.updatedAt).toLocaleString('ja-JP')}</span></p><div className="mt-6 flex gap-2"><button onClick={()=>setActive(r.id)} className="btn btn-primary flex-1">Open</button><button onClick={()=>del(r.id)} className="btn btn-danger">Delete</button></div></article>)}</div>}
 </div></main>
}
