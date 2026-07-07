import Image from 'next/image';
import Link from 'next/link';

const worlds = [
  {
    title: 'Work',
    japanese: '仕事',
    description: '仕事を整え、前に進める。',
    items: 'Rakumon · HR & General Affairs',
    href: '/work',
    active: true,
  },
  {
    title: 'Growth',
    japanese: '成長',
    description: '学び、振り返り、成長する。',
    items: 'Learning · Skills · Goals',
    active: false,
  },
  {
    title: 'Health',
    japanese: '健康',
    description: '自分を支える土台を整える。',
    items: 'Energy · Exercise · Body',
    active: false,
  },
  {
    title: 'Life',
    japanese: '暮らし',
    description: '大切な人と、日々を記録する。',
    items: 'Family · Home · Memories',
    active: false,
  },
  {
    title: 'Create',
    japanese: '創造',
    description: 'アイデアを、かたちにする。',
    items: 'Ideas · Products · Writing',
    active: false,
  },
  {
    title: 'Explore',
    japanese: '探索',
    description: '好奇心のまま、まだ知らない世界へ。',
    items: 'AI & Future · Travel · Inspiration',
    active: false,
  },
];

export default function MyWorldPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EE] px-5 py-8 text-rakumon-text md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/70 px-6 py-9 shadow-premium md:px-10 lg:px-12">
          <div className="pointer-events-none absolute right-8 top-8 h-36 w-36 rounded-full bg-[#F1D8B6]/30 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="max-w-3xl">
              <p className="font-outfit text-xs font-bold uppercase tracking-[0.32em] text-rakumon-green">My World</p>
              <h1 className="mt-4 font-outfit text-5xl font-bold tracking-tight md:text-6xl">Hello, Jill.</h1>
              <p className="mt-5 text-2xl font-bold leading-relaxed">今日は、どの世界から始めますか？</p>
              <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 text-rakumon-body md:text-lg">
                仕事、成長、健康、暮らし、創造、探索。{`\n`}あなたの毎日は、いくつもの世界からできています。
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative grid h-52 w-52 place-items-center rounded-full bg-[#F8EFE1] md:h-60 md:w-60">
                <Image src="/jill/jill-idle.png" alt="Digital Jill" width={180} height={180} priority className="h-40 w-40 object-contain drop-shadow-[0_18px_24px_rgba(30,43,34,0.10)] md:h-44 md:w-44" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {worlds.map((world) => {
            const card = (
              <article className={`group flex min-h-[15rem] flex-col rounded-[28px] border bg-white p-6 shadow-premium transition duration-200 ${world.active ? 'border-white hover:-translate-y-1 hover:shadow-premiumHover' : 'border-[#E9E1D5] opacity-80'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-outfit text-2xl font-bold">{world.title}</p>
                    <p className="mt-1 text-sm font-bold text-rakumon-green">{world.japanese}</p>
                  </div>
                  {!world.active && <span className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs font-bold text-rakumon-caption">Coming soon</span>}
                </div>
                <p className="mt-6 text-base leading-8 text-rakumon-body">{world.description}</p>
                <p className="mt-auto pt-8 text-sm font-bold text-rakumon-caption">{world.items}</p>
                {world.active && <span className="mt-5 text-sm font-bold text-rakumon-green transition group-hover:translate-x-1">Open Work →</span>}
              </article>
            );

            return world.active && world.href ? <Link key={world.title} href={world.href}>{card}</Link> : <div key={world.title}>{card}</div>;
          })}
        </section>
      </div>
    </main>
  );
}
