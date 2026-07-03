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
 return <main className="min-h-screen bg-gradient-to-br from-white via-rakumon-50 to-slate-100 px-6 py-10"><div className="mx-auto max-w-6xl">
  <section className="mb-8 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold uppercase tracking-[0.35em] text-rakumon-700">Rakumon Edition</p><h1 className="mt-3 text-4xl font-bold text-slate-900">Meeting Workspace</h1><p className="mt-2 text-slate-600">週次運営報告の入力、下書き保存、スライドプレビュー、HTML書き出しを行うワークスペースです。</p><button onClick={create} className="mt-8 rounded-full bg-rakumon-700 px-6 py-3 font-semibold text-white shadow hover:bg-rakumon-500">新規週次レポート作成</button></section>
  <h2 className="mb-4 text-xl font-bold">保存済み週次レポート</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{reports.map(r=><article key={r.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="text-sm text-slate-500">対象期間</div><div className="mt-1 text-lg font-bold">{r.startDate} / {r.endDate}</div><span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${r.status==='Completed'?'bg-rakumon-100 text-rakumon-700':'bg-amber-100 text-amber-700'}`}>ステータス: {r.status}</span><p className="mt-4 text-sm text-slate-500">Last updated<br/>{new Date(r.updatedAt).toLocaleString('ja-JP')}</p><div className="mt-5 flex gap-2"><button onClick={()=>setActive(r.id)} className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-white">Open</button><button onClick={()=>del(r.id)} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600">Delete</button></div></article>)}</div>
 </div></main>
}
