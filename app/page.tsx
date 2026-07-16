import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { Reveal } from "@/components/landing/Reveal";
import { WaitlistForm } from "@/components/landing/WaitlistForm";

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="font-mono text-sm font-bold text-brand-500">{n}</span>
      <span className="h-px w-8 bg-brand-500/40" />
      <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
    </div>
  );
}

/* A mock X profile card — the hero centerpiece showing the WinDrop button. */
function ProfileMock() {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 h-20 rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400" />
      <div className="-mt-12 mb-3 flex items-end justify-between px-1">
        <div className="h-16 w-16 rounded-full border-4 border-white bg-gradient-to-br from-amber-400 to-pink-500 dark:border-slate-900" />
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 dark:border-slate-700">
            •••
          </span>
          <span className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-bold text-slate-800 dark:border-slate-600 dark:text-slate-100">
            Following
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 px-3.5 py-1.5 text-sm font-black text-white shadow-md shadow-brand-500/30">
            🎟️ WinDrop
          </span>
        </div>
      </div>
      <div className="px-1">
        <p className="text-lg font-black text-slate-900 dark:text-white">
          Satoshi
        </p>
        <p className="text-sm text-slate-500">@satoshi</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          building magic internet money · gm ☀️
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="group h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-800">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl dark:bg-brand-900/40">
        {icon}
      </div>
      <h3 className="mb-1.5 text-lg font-black text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {body}
      </p>
    </div>
  );
}

function TweetCard({
  name,
  handle,
  avatar,
  body,
}: {
  name: string;
  handle: string;
  avatar: string;
  body: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-3">
        <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${avatar}`} />
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-xs text-slate-500">{handle}</p>
        </div>
        <svg
          className="ml-auto text-slate-300 dark:text-slate-600"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M17.5 3h3l-7.3 8.3L22 21h-6.5l-5-6.1L4.7 21H1.6l7.8-8.9L2 3h6.6l4.6 5.6L17.5 3Zm-1.1 16h1.7L7.7 4.8H5.9L16.4 19Z" />
        </svg>
      </div>
      <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
        {body}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: "🎟️",
    title: "One tap from X",
    body: "A WinDrop button lands right next to Follow on every profile. See someone lucky? Gift them without leaving the timeline.",
  },
  {
    icon: "@",
    title: "By username or wallet",
    body: "Gift straight to an @handle or paste any Base wallet address. No forms, no friction.",
  },
  {
    icon: "🎰",
    title: "Powered by Megapot",
    body: "Every gift buys real Megapot lottery tickets on Base — a genuine shot at the jackpot, not points.",
  },
  {
    icon: "🔐",
    title: "Non-custodial",
    body: "You sign, you send. WinDrop never touches your keys or holds your funds. Ever.",
  },
  {
    icon: "🎲",
    title: "Surprise amounts",
    body: "Feeling generous? Hit the dice for a random ticket count and make the gift a little more thrilling.",
  },
  {
    icon: "🎉",
    title: "Instant receipts",
    body: "Confetti on success and a Basescan link every time, so the gift always feels real.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white dark:bg-slate-950">
      <LandingNav />

      {/* ============ HERO ============ */}
      <section className="relative">
        {/* decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute left-1/3 top-40 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Pre-launch · Built on Base
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                Gift lottery luck on X,{" "}
                <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                  in one tap.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Turn any X profile into a lucky gift. WinDrop drops a button next
                to Follow so you can send Megapot lottery tickets to anyone —
                instantly, on Base.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/gift"
                  className="rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 bg-animated-gradient animate-gradient-pan px-7 py-3.5 text-center text-base font-black text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl hover:shadow-brand-500/40 active:scale-[0.98]"
                >
                  🎁 Gift Now
                </Link>
                <a
                  href="#waitlist"
                  className="rounded-full border-2 border-slate-200 px-7 py-3.5 text-center text-base font-black text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  Join Waitlist
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
                <span>◆ Base</span>
                <span>◆ Megapot</span>
                <span>◆ USDC</span>
                <span>◆ Privy</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex justify-center md:justify-end">
            <div className="animate-float">
              <ProfileMock />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <Eyebrow n="01" label="How it works" />
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Three taps from timeline to jackpot.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Discover on X",
              body: "Spot the 🎟️ WinDrop button next to Follow on any profile you're browsing.",
            },
            {
              n: "02",
              title: "One-tap gift",
              body: "Pick 1, 5, 10 or 25 tickets — or roll the dice — and confirm in your wallet.",
            },
            {
              n: "03",
              title: "They're in the draw",
              body: "The recipient gets real Megapot tickets on Base and a shot at the jackpot.",
            },
          ].map((step, i) => (
            <Reveal key={step.n} delay={i * 120}>
              <div className="relative h-full rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-7 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/40">
                <span className="text-6xl font-black text-brand-500/15">
                  {step.n}
                </span>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        id="features"
        className="border-y border-slate-100 bg-slate-50/60 dark:border-slate-900 dark:bg-slate-900/30"
      >
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <Eyebrow n="02" label="Features" />
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Everything you need to spread the luck.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100}>
                <FeatureCard {...f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY WINDROP ============ */}
      <section id="why" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div>
              <Eyebrow n="03" label="Why WinDrop" />
              <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                A gift that&apos;s{" "}
                <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
                  built to spread.
                </span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Every gift is a moment — a notification, a screenshot, a
                &ldquo;wait, I could win?&rdquo; A tiny act of generosity that
                lands publicly on X and pulls the next person in.
              </p>
              <div className="mt-8">
                <Link
                  href="/gift"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Try the gift flow
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-4">
              {[
                {
                  stat: "1 tap",
                  label: "From profile to gifted — no app-switching.",
                },
                {
                  stat: "$1",
                  label: "Per Megapot ticket in USDC. Gift big or small.",
                },
                {
                  stat: "100%",
                  label: "Non-custodial. Your keys, your funds, always.",
                },
              ].map((b) => (
                <div
                  key={b.stat}
                  className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="bg-gradient-to-br from-brand-500 to-emerald-500 bg-clip-text text-4xl font-black text-transparent">
                    {b.stat}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="border-y border-slate-100 bg-slate-50/60 dark:border-slate-900 dark:bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <Eyebrow n="04" label="On the timeline" />
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              People are already feeling lucky.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "mia.base",
                handle: "@miaonchain",
                avatar: "from-brand-400 to-indigo-500",
                body: (
                  <>
                    someone just <b>WinDropped</b> me 5 Megapot tickets out of
                    nowhere 😭 best notification I&apos;ve had all week
                  </>
                ),
              },
              {
                name: "degen dave",
                handle: "@dave_eth",
                avatar: "from-amber-400 to-pink-500",
                body: (
                  <>
                    gifting lottery tickets from a profile in one tap is
                    dangerously fun. my whole timeline is in the draw now 🎟️
                  </>
                ),
              },
              {
                name: "0xluna",
                handle: "@lunabuilds",
                avatar: "from-emerald-400 to-teal-500",
                body: (
                  <>
                    finally a gift on crypto twitter that isn&apos;t a rug. real
                    tickets, real jackpot, on Base. <b>@WinDrop</b> gets it.
                  </>
                ),
              },
            ].map((t, i) => (
              <Reveal key={t.handle} delay={i * 120}>
                <TweetCard {...t} />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">
            Illustrative posts for this pre-launch preview.
          </p>
        </div>
      </section>

      {/* ============ WAITLIST ============ */}
      <section id="waitlist" className="mx-auto max-w-3xl px-5 py-24 text-center">
        <Reveal>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 text-3xl shadow-lg shadow-brand-500/30">
            🎁
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Be first to drop some luck.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate-600 dark:text-slate-400">
            Join the waitlist for early access to the WinDrop button and browser
            extension.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Or{" "}
            <Link href="/gift" className="font-bold text-brand-500 hover:underline">
              try the gift flow now
            </Link>{" "}
            — no waiting required.
          </p>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 512 512" aria-hidden>
              <defs>
                <linearGradient id="foot-mark" x1="0" y1="0" x2="512" y2="512">
                  <stop offset="0" stopColor="#3563ff" />
                  <stop offset="0.55" stopColor="#6d5cf6" />
                  <stop offset="1" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="120" fill="url(#foot-mark)" />
              <path
                d="M256 96C316 190 372 262 372 328a116 116 0 1 1-232 0C140 262 196 190 256 96Z"
                fill="#fff"
              />
              <path
                d="M256 250c8 34 18 44 52 52-34 8-44 18-52 52-8-34-18-44-52-52 34-8 44-18 52-52Z"
                fill="#facc15"
              />
            </svg>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              Win<span className="text-brand-500">Drop</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500">
            <a href="#how" className="transition hover:text-slate-900 dark:hover:text-white">
              How it works
            </a>
            <a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">
              Features
            </a>
            <Link href="/gift" className="transition hover:text-slate-900 dark:hover:text-white">
              Gift
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            Powered by Megapot on Base · Non-custodial
          </p>
        </div>
      </footer>
    </main>
  );
}
