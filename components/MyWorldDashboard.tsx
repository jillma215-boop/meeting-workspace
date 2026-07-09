import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

type WorldCardData = {
  title: string;
  japanese: string;
  icon: 'briefcase' | 'trending-up' | 'heart' | 'home' | 'pencil' | 'compass';
  background: string;
  accent: string;
  description: string;
  subtext: string;
  action?: string;
  href?: string;
  badge?: string;
};

const worlds: WorldCardData[] = [
  {
    title: 'Work',
    japanese: '仕事',
    icon: 'briefcase',
    background: 'linear-gradient(135deg, #FFF8F4 0%, #FDEBDD 100%)',
    accent: '#D66A3A',
    description: '仕事を整え、前に進める。',
    subtext: 'Rakumon・HR & General Affairs',
    action: 'Open Work →',
    href: '/work',
  },
  {
    title: 'Growth',
    japanese: '成長',
    icon: 'trending-up',
    background: 'linear-gradient(135deg, #F5FCF6 0%, #E6F6EA 100%)',
    accent: '#4F9E68',
    badge: 'Coming soon',
    description: '学び、振り返り、成長する。',
    subtext: 'Learning・Skills・Goals',
  },
  {
    title: 'Health',
    japanese: '健康',
    icon: 'heart',
    background: 'linear-gradient(135deg, #F5FAFF 0%, #EAF5FF 100%)',
    accent: '#4F8FD6',
    badge: 'Coming soon',
    description: '自分を支える土台を整える。',
    subtext: 'Energy・Exercise・Body',
  },
  {
    title: 'Life',
    japanese: '暮らし',
    icon: 'home',
    background: 'linear-gradient(135deg, #FBF8FF 0%, #F0EAFD 100%)',
    accent: '#8E74D9',
    badge: 'Coming soon',
    description: '大切な人と、日々を記録する。',
    subtext: 'Family・Home・Memories',
  },
  {
    title: 'Create',
    japanese: '創造',
    icon: 'pencil',
    background: 'linear-gradient(135deg, #FFF8FB 0%, #FDECF4 100%)',
    accent: '#D66A97',
    badge: 'Coming soon',
    description: 'アイデアを、かたちにする。',
    subtext: 'Ideas・Products・Writing',
  },
  {
    title: 'Explore',
    japanese: '探索',
    icon: 'compass',
    background: 'linear-gradient(135deg, #F5FCFB 0%, #E5F5F3 100%)',
    accent: '#3C9F96',
    badge: 'Coming soon',
    description: '好奇心のまま、まだ知らない世界へ。',
    subtext: 'AI & Future・Travel・Inspiration',
  },
];

function WorldIcon({ name }: { name: WorldCardData['icon'] }) {
  const common = {
    className: 'h-7 w-7',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  };

  const paths: Record<WorldCardData['icon'], ReactNode> = {
    briefcase: <><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" /><path d="M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><path d="M2 13h20" /><path d="M12 12v2" /></>,
    'trending-up': <><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></>,
    heart: <path d="M20.8 5.7a5.1 5.1 0 0 0-7.2 0L12 7.3l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2L12 21l8.8-8.1a5.1 5.1 0 0 0 0-7.2Z" />,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
    pencil: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m13.5 7.5 3 3" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-[#F2DFC5] px-6 py-10 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:px-8 md:px-12 md:py-14 lg:px-16">
      <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute right-12 top-8 h-44 w-44 rounded-full bg-[#EFB08B]/35 blur-3xl" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="max-w-3xl">
          <p className="font-inter text-xs font-extrabold uppercase tracking-[0.34em] text-[#9A6A38]">MY WORLD</p>
          <h1 className="mt-5 font-outfit text-5xl font-extrabold tracking-tight text-rakumon-text sm:text-6xl lg:text-7xl">Hello, Jill Ma</h1>
          <p className="mt-6 font-zen text-2xl font-bold leading-relaxed text-rakumon-text md:text-3xl">今日は、どの世界から始めますか？</p>
          <p className="mt-6 max-w-2xl whitespace-pre-line font-zen text-base leading-8 text-rakumon-body md:text-lg">
            仕事、成長、健康、暮らし、創造、探索。{`\n`}あなたの毎日は、いくつもの世界からできています。
          </p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="relative grid h-72 w-72 place-items-center rounded-full bg-[#FFF7EA]/78 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75),0_24px_60px_rgba(142,91,49,0.14)] sm:h-80 sm:w-80 lg:h-88 lg:w-88">
            <div className="absolute inset-5 rounded-full bg-white/35 blur-sm" />
            <Image src="/jill/jill-idle.png" alt="Jill Ma" width={360} height={360} priority className="digital-jill relative h-72 w-72 object-contain drop-shadow-[0_24px_30px_rgba(30,43,34,0.13)] sm:h-80 sm:w-80" />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorldCard({ world }: { world: WorldCardData }) {
  const isEnabled = Boolean(world.href);
  const cardStyle = { background: world.background };
  const accentLineStyle = {
    background: `linear-gradient(90deg, ${world.accent}66 0%, ${world.accent} 50%, ${world.accent}66 100%)`,
  };
  const card = (
    <article
      className={`group relative flex min-h-[17rem] flex-col overflow-hidden rounded-[28px] border border-white/70 p-6 shadow-[0_12px_36px_rgba(30,43,34,0.06)] transition duration-200 ease-out ${isEnabled ? 'hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(30,43,34,0.10)]' : 'cursor-not-allowed'}`}
      style={cardStyle}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={accentLineStyle} />
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl text-white shadow-[0_12px_24px_rgba(30,43,34,0.12)]" style={{ backgroundColor: world.accent }}>
          <WorldIcon name={world.icon} />
        </div>
        {world.badge && <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1 font-inter text-xs font-bold text-[#8B938B]">{world.badge}</span>}
      </div>
      <div className="mt-6">
        <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-[#1E2B22]">{world.title}</h2>
        <p className="mt-1 font-zen text-sm font-bold text-[#5F695F]">{world.japanese}</p>
      </div>
      <p className="mt-5 font-zen text-base leading-8 text-[#5F695F]">{world.description}</p>
      <p className="mt-auto pt-8 font-inter text-sm font-bold text-[#8B938B]">{world.subtext}</p>
      {world.action && <span className="mt-5 inline-flex font-inter text-sm font-extrabold transition duration-200 group-hover:translate-x-1" style={{ color: world.accent }}>{world.action}</span>}
    </article>
  );

  return isEnabled && world.href ? <Link href={world.href} aria-label="Open Work world">{card}</Link> : <div aria-disabled="true">{card}</div>;
}

export default function MyWorldDashboard() {
  return (
    <main className="min-h-screen bg-rakumon-bg px-5 py-8 text-rakumon-text sm:px-6 md:px-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        <Hero />
        <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="World cards">
          {worlds.map((world) => <WorldCard key={world.title} world={world} />)}
        </section>
      </div>
    </main>
  );
}
