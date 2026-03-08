import Image from "next/image";
import Link from "next/link";

const SUBSTACK_URL = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://substack.com";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Subtle gradient orbs for depth */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-navy/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/atium.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain opacity-90"
            />
            <span className="text-sm font-semibold tracking-tight text-white">
              Atium Research
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="#curriculum"
              className="hidden text-sm text-muted transition-colors hover:text-white sm:block"
            >
              Curriculum
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm text-muted transition-colors hover:text-white sm:block"
            >
              How It Works
            </a>
            <a
              href="#vision"
              className="hidden text-sm text-muted transition-colors hover:text-white sm:block"
            >
              Vision
            </a>
            <a
              href="#subscribe"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft hover:shadow-accent/30"
            >
              Subscribe
            </a>
          </div>
        </div>
      </nav>

      {/* Section 1 — Hero */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                New lessons every week
              </div>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Learn Quantitative Finance{" "}
                <span className="bg-linear-to-r from-accent-soft to-blue-400 bg-clip-text text-transparent">from First Principles</span>
              </h1>
              <p className="max-w-xl text-lg text-muted">
                Simple explanations, practical examples, and transparent strategies
                that show how systematic investing actually works.
              </p>
              <form
                action={SUBSTACK_URL}
                method="get"
                target="_blank"
                className="flex flex-col gap-3 sm:flex-row sm:gap-2"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-muted transition-colors focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-soft hover:shadow-accent/35"
                >
                  Subscribe to Newsletter
                  <ArrowIcon className="h-4 w-4" />
                </button>
              </form>
              <a
                href="#curriculum"
                className="inline-flex items-center gap-2 text-sm text-accent-soft transition-colors hover:text-accent"
              >
                Explore the Curriculum
                <ArrowIcon className="h-4 w-4 -rotate-90" />
              </a>
            </div>
            <div className="relative">
              <HeroChart />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — The Problem */}
      <section className="border-t border-white/5 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent-soft">
              The Problem
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Why Quant Finance Is So Hard to Learn
            </h2>
            <p className="mt-4 text-muted">
              The barriers are real, but the core ideas behind quantitative
              investing are simpler than you think.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEM_CARDS.map((card) => (
              <div
                key={card.title}
                className="group rounded-xl border border-white/5 bg-navy-card p-6 transition-all duration-300 hover:border-white/10 hover:bg-navy-light"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="rounded-xl border border-accent/30 bg-accent-dim px-6 py-4 text-center shadow-lg shadow-accent/5">
              <p className="font-medium text-white">
                But the core ideas behind quant investing are actually simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — What We Teach */}
      <section
        id="curriculum"
        className="border-t border-white/5 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent-soft">
              Curriculum
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Quant Finance from the Ground Up
            </h2>
            <p className="mt-4 text-muted">
              Each week we explain one concept and show how it connects to real
              systematic strategies.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CURRICULUM_MODULES.map((module) => (
              <div
                key={module.title}
                className="group relative rounded-xl border border-white/5 bg-navy-card p-6 transition-all duration-300 hover:border-accent/20 hover:bg-navy-light"
              >
                <span className="absolute right-4 top-4 text-xs text-muted/60">
                  {module.number}
                </span>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent-soft transition-colors group-hover:bg-accent/20">
                  {module.icon}
                </div>
                <h3 className="font-semibold text-white">{module.title}</h3>
                <p className="mt-2 text-sm text-muted">{module.description}</p>
                <span
                  className={`mt-4 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    module.difficulty === "Beginner"
                      ? "bg-success/15 text-success"
                      : module.difficulty === "Intermediate"
                        ? "bg-warning/15 text-warning"
                        : "bg-purple-500/15 text-purple-400"
                  }`}
                >
                  {module.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — How It Works */}
      <section
        id="how-it-works"
        className="border-t border-white/5 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent-soft">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              How the Newsletter Works
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-linear-to-r from-accent/30 to-transparent md:block" />
                )}
                <div className="relative rounded-xl border border-white/5 bg-navy-card p-6 transition-all duration-300 hover:border-accent/20 hover:bg-navy-light">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Long-Term Vision */}
      <section
        id="vision"
        className="border-t border-white/5 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent-soft">
              Vision
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              From Curiosity to Strategy
            </h2>
            <p className="mt-4 text-muted">
              Our goal is not just to explain quant finance, but to help readers
              develop the intuition and tools needed to build systematic
              strategies themselves.
            </p>
          </div>
          <ul className="mx-auto mt-8 max-w-xl space-y-3 text-muted">
            {VISION_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-lg border border-white/5 bg-navy-card/50 px-4 py-3 transition-colors hover:border-accent/15 hover:text-white">
                <CheckIcon className="h-5 w-5 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 6 — Final CTA */}
      <section
        id="subscribe"
        className="relative border-t border-white/5 py-12 sm:py-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(59,130,246,0.08),transparent)]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start Learning Quant Finance Today
          </h2>
          <p className="mt-4 text-muted">
            Join the newsletter and receive a new lesson each week exploring the
            core ideas behind systematic investing.
          </p>
          <form
            action={SUBSTACK_URL}
            method="get"
            target="_blank"
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-muted transition-colors focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30 sm:max-w-xs"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-soft hover:shadow-accent/35"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-muted">
            Free educational articles. Premium subscribers receive strategy
            breakdowns and research.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/atium.svg"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 object-contain opacity-80"
              />
              <span className="text-sm text-muted">Atium Research</span>
            </Link>
            <p className="text-xs text-muted">
              Making quantitative finance accessible to everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroChart() {
  const points = [
    [0, 100],
    [40, 95],
    [80, 110],
    [120, 105],
    [160, 130],
    [200, 125],
    [240, 150],
    [280, 145],
    [320, 180],
    [360, 200],
    [400, 220],
    [440, 250],
    [480, 280],
    [520, 300],
    [560, 320],
    [600, 347],
  ];
  const linePath = points
    .map(([x, y], i) => {
      const py = 120 - (y / 347) * 100;
      return `${i === 0 ? "M" : "L"} ${x} ${py}`;
    })
    .join(" ");
  const areaPath = `${linePath} L 600 120 L 0 120 Z`;

  return (
    <div className="rounded-xl border border-white/10 bg-navy-card p-6 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Cumulative Returns
          </p>
          <p className="text-2xl font-bold text-success">+247.3%</p>
          <p className="text-sm text-muted">Systematic Momentum Strategy</p>
        </div>
        <div className="flex gap-4 text-xs text-muted">
          <span>Sharpe 1.42</span>
          <span>Max DD -12.3%</span>
        </div>
      </div>
      <div className="relative h-40 overflow-hidden rounded-lg bg-navy">
        <svg
          viewBox="0 0 600 120"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="chartGradient"
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <pattern
              id="chartGrid"
              width="60"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 24"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="600" height="120" fill="url(#chartGrid)" />
          <path
            d={areaPath}
            fill="url(#chartGradient)"
          />
          <path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

const PROBLEM_CARDS = [
  {
    title: "Overly Academic",
    description:
      "Most resources assume advanced math and skip the intuition behind the concepts.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    title: "Secretive Industry",
    description:
      "Hedge funds rarely explain their strategies, keeping knowledge behind closed doors.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Hype Over Substance",
    description:
      "Online content focuses on hype and quick profits instead of teaching fundamentals.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
  },
  {
    title: "Expensive & Inaccessible",
    description:
      "Quality courses cost thousands, putting quant education out of reach for many.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const CURRICULUM_MODULES = [
  {
    number: "01",
    title: "Understanding Returns",
    description: "How to measure and compare investment performance.",
    difficulty: "Beginner" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Compounding & Growth",
    description: "Why exponential growth is the most powerful force in finance.",
    difficulty: "Beginner" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Volatility & Risk",
    description: "Measuring uncertainty and managing downside exposure.",
    difficulty: "Beginner" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Diversification",
    description: "How combining assets reduces risk without sacrificing returns.",
    difficulty: "Intermediate" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Trading Signals",
    description: "How data-driven rules generate systematic buy and sell decisions.",
    difficulty: "Intermediate" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Momentum & Mean Reversion",
    description: "Two foundational strategies that drive most quant models.",
    difficulty: "Intermediate" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    number: "07",
    title: "Backtesting",
    description: "Testing strategies against historical data to validate your edge.",
    difficulty: "Advanced" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "08",
    title: "Portfolio Construction",
    description: "Building optimized portfolios that balance risk and reward.",
    difficulty: "Advanced" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Concept",
    description:
      "Clear explanation of one core idea in quantitative finance.",
  },
  {
    title: "Example",
    description:
      "Simple examples and visualizations to build intuition.",
  },
  {
    title: "Implementation",
    description:
      "See how the idea is used in a real systematic strategy.",
  },
];

const VISION_ITEMS = [
  "how signals are created",
  "how portfolios are constructed",
  "how strategies are evaluated",
  "how systematic investing works in practice",
];
