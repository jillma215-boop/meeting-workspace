import Link from 'next/link';

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EE] px-5 py-8 text-rakumon-text md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-bold text-rakumon-green transition hover:text-rakumon-text">← My World</Link>
        <header className="mt-7 rounded-[34px] border border-white/80 bg-white/70 p-8 shadow-premium md:p-10">
          <p className="font-outfit text-xs font-bold uppercase tracking-[0.32em] text-rakumon-green">Work</p>
          <h1 className="mt-4 font-outfit text-5xl font-bold tracking-tight">Work</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-rakumon-body">RakumonとHR & General Affairsを、落ち着いて見渡すためのワークスペースです。</p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <Link href="/work/rakumon" className="group rounded-[28px] border border-white bg-white p-7 shadow-premium transition duration-200 hover:-translate-y-1 hover:shadow-premiumHover">
            <p className="font-outfit text-3xl font-bold">Rakumon</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-rakumon-green">Product & Business</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Reports', 'Core Operations', 'ToB Business', 'ToC Business'].map((item) => <span key={item} className="rounded-2xl bg-[#F8F4EE] px-4 py-3 text-sm font-bold text-rakumon-body">{item}</span>)}
            </div>
            <span className="mt-8 inline-block text-sm font-bold text-rakumon-green transition group-hover:translate-x-1">Open Rakumon →</span>
          </Link>

          <article className="rounded-[28px] border border-[#E9E1D5] bg-white p-7 opacity-80 shadow-premium">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-outfit text-3xl font-bold">HR & General Affairs</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-rakumon-green">People & Office</p>
              </div>
              <span className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs font-bold text-rakumon-caption">Coming soon</span>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
