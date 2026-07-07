import Link from 'next/link';

const modules = [
  {
    title: 'Reports',
    items: ['Weekly Report', 'Monthly Report', 'Program Report'],
    href: '/',
    active: true,
  },
  {
    title: 'Core Operations',
    items: ['Inquiries', 'Teachers', 'Support', 'Testing', 'Issues & Improvements'],
    active: false,
  },
  {
    title: 'ToB Business',
    items: ['Pipeline', 'Proposals', 'Contracts', 'Schools', 'Usage', 'Interviews'],
    active: false,
  },
  {
    title: 'ToC Business',
    items: ['Product', 'Users', 'Content & SNS', 'Campaigns', 'Surveys', 'Insights'],
    active: false,
  },
];

export default function RakumonPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EE] px-5 py-8 text-rakumon-text md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-3 text-sm font-bold text-rakumon-green">
          <Link href="/my-world" className="transition hover:text-rakumon-text">My World</Link>
          <span className="text-rakumon-caption">/</span>
          <Link href="/work" className="transition hover:text-rakumon-text">Work</Link>
        </nav>
        <header className="mt-7 rounded-[34px] border border-white/80 bg-white/70 p-8 shadow-premium md:p-10">
          <p className="font-outfit text-xs font-bold uppercase tracking-[0.32em] text-rakumon-green">Rakumon</p>
          <h1 className="mt-4 font-outfit text-5xl font-bold tracking-tight">Rakumon Workspace</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-rakumon-body">Product & Businessの主要領域を、必要な深さで開いていくためのホームです。</p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {modules.map((module) => {
            const content = (
              <article className={`group flex min-h-[19rem] flex-col rounded-[28px] border bg-white p-7 shadow-premium transition duration-200 ${module.active ? 'border-white hover:-translate-y-1 hover:shadow-premiumHover' : 'border-[#E9E1D5] opacity-80'}`}>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-outfit text-3xl font-bold">{module.title}</h2>
                  {!module.active && <span className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs font-bold text-rakumon-caption">Coming soon</span>}
                  {module.active && <span className="rounded-full bg-rakumon-light px-3 py-1 text-xs font-bold text-rakumon-green">Active</span>}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {module.items.map((item) => <span key={item} className="rounded-2xl bg-[#F8F4EE] px-4 py-3 text-sm font-bold text-rakumon-body">{item}</span>)}
                </div>
                {module.active && <span className="mt-auto pt-8 text-sm font-bold text-rakumon-green transition group-hover:translate-x-1">Open Report Workspace →</span>}
              </article>
            );
            return module.active && module.href ? <Link key={module.title} href={module.href}>{content}</Link> : <div key={module.title}>{content}</div>;
          })}
        </section>
      </div>
    </main>
  );
}
