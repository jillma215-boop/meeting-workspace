export type ReportStatus = 'Draft' | 'Completed';
export type KPIField = { label: string; value: string; comparison: string; comment: string };
export type Topic = { title: string; description: string };
export type Inquiry = { total: string; top3: string[]; examples: string; resolved: string; pending: string; insight: string };
export type TobRow = { id: string; project: string; status: string; weeklyAction: string; confirmation: string; nextAction: string };
export type ActionRow = { id: string; item: string; owner: string; due: string; status: string; note: string };
export type Report = {
  id: string; startDate: string; endDate: string; status: ReportStatus; updatedAt: string;
  overview: { summary: string; topics: Topic[]; issues: string; nextFocus: string };
  kpis: KPIField[]; studentInquiry: Inquiry; teacherInquiry: Inquiry;
  tob: TobRow[]; operations: { done: string; issues: string; improvements: string; development: string; risks: string };
  nextActions: ActionRow[];
};
export const STORAGE_KEY = 'rakumon-weekly-reports-v1';
const kpiLabels = ['週次売上','商品別売上','週次質問数','新規登録ユーザー','回答数','回答率','平均応答時間','満足度'];
export const emptyInquiry = (): Inquiry => ({ total: '', top3: ['', '', ''], examples: '', resolved: '', pending: '', insight: '' });
export const createBlankReport = (): Report => {
  const now = new Date(); const start = new Date(now); start.setDate(now.getDate() - now.getDay() + 1); const end = new Date(start); end.setDate(start.getDate()+6);
  return { id: crypto.randomUUID(), startDate: start.toISOString().slice(0,10), endDate: end.toISOString().slice(0,10), status: 'Draft', updatedAt: now.toISOString(), overview: { summary: '', topics: [{title:'',description:''},{title:'',description:''},{title:'',description:''}], issues: '', nextFocus: '' }, kpis: kpiLabels.map(label=>({label,value:'',comparison:'',comment:''})), studentInquiry: emptyInquiry(), teacherInquiry: emptyInquiry(), tob: [{id: crypto.randomUUID(), project:'', status:'', weeklyAction:'', confirmation:'', nextAction:''}], operations: { done:'', issues:'', improvements:'', development:'', risks:'' }, nextActions: [{id: crypto.randomUUID(), item:'', owner:'', due:'', status:'', note:''}] };
};
export const sampleReport: Report = { id: 'sample-rakumon-weekly', startDate: '2026-06-22', endDate: '2026-06-28', status: 'Draft', updatedAt: new Date().toISOString(), overview: { summary: '問い合わせ対応は安定。ToB案件は確認事項を来週前半に解消し、導入準備を進める。', topics: [{title:'回答品質の安定',description:'先生回答の一次確認フローにより満足度が改善傾向。'},{title:'法人向け資料更新',description:'導入検討企業向けのFAQと運用イメージを更新。'},{title:'夏期講習前の準備',description:'質問増加に備えた運営シフト案を作成。'}], issues: '未対応問い合わせの滞留が一部発生。仕様確認が必要な案件は開発側との同期を早める。', nextFocus: '未対応チケットの翌営業日解消、ToB確認事項の整理、夏期繁忙期の体制確定。' }, kpis: kpiLabels.map((label,i)=>({label,value:['¥1,240,000','基礎講座 62% / 応用 38%','1,486件','324名','1,431件','96.3%','18分','4.4/5'][i],comparison:['+8%','応用 +4pt','+12%','+6%','+10%','-0.8pt','-3分','+0.1'][i],comment:'週次定例で確認'})), studentInquiry: { total:'128件', top3:['解説内容の確認','決済・プラン変更','学習進捗の相談'], examples:'「途中式をもう少し詳しく知りたい」など。', resolved:'116件', pending:'12件', insight:'解説粒度への期待が高く、テンプレート改善余地あり。' }, teacherInquiry: { total:'42件', top3:['回答方針確認','稼働シフト','報酬確認'], examples:'難問時のエスカレーション基準に関する確認。', resolved:'39件', pending:'3件', insight:'新任先生向けオンボーディング資料の補強が必要。' }, tob: [{id:'tob-1',project:'A塾トライアル',status:'提案中',weeklyAction:'運用FAQを送付',confirmation:'利用開始日',nextAction:'7/2条件確認'},{id:'tob-2',project:'B社研修',status:'要件整理',weeklyAction:'ヒアリング実施',confirmation:'対象学年',nextAction:'見積更新'}], operations: { done:'問い合わせ分類の見直し、FAQ更新、先生向け周知を実施。', issues:'仕様確認待ちチケットのリードタイム。', improvements:'問い合わせタグを統一し、集計しやすくした。', development:'管理画面の検索条件追加を相談中。', risks:'夏期の質問増加に対する回答体制不足。' }, nextActions: [{id:'act-1',item:'未対応問い合わせ棚卸し',owner:'運営',due:'2026-07-01',status:'進行中',note:'優先度高から対応'},{id:'act-2',item:'ToB確認事項整理',owner:'Biz',due:'2026-07-03',status:'未着手',note:'A塾・B社'}] };
export function loadReports(): Report[]{ if(typeof window==='undefined') return []; const raw=localStorage.getItem(STORAGE_KEY); if(!raw){localStorage.setItem(STORAGE_KEY, JSON.stringify([sampleReport])); return [sampleReport];} try{return JSON.parse(raw) as Report[]}catch{return [sampleReport]} }
export function saveReports(reports: Report[]){ localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); }
