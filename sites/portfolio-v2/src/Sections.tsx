import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "motion/react";
import { ArrowUpRight, ChevronRight, Lock } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { person, products, projects, tracks, type Product } from "@shared/content";
import { Contrib } from "./Contrib";
import { BatLogo, Skyline, SignalOval } from "./Bat";
import { BranchIcon } from "./Chrome";
import { ago, go, hash, useLastPush } from "./lib";

const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Section header: a commit node on the graph line.                    */
/* ------------------------------------------------------------------ */
function Head({ id, cmd, title, children }: { id: string; cmd: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      className="relative mb-12 md:mb-16"
    >
      <span className="absolute -left-[56px] top-[5px] hidden h-[14px] w-[14px] rounded-full border-2 border-lime bg-bg shadow-[0_0_0_5px_#0b0b0a,0_0_18px_rgba(200,255,61,0.5)] md:block" />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px]">
        <span className="text-sun">commit {hash(id)}</span>
        <span className="text-dim">·</span>
        <span className="text-mute">
          <span className="text-lime">$</span> {cmd}
        </span>
      </div>
      <h2 className="mt-5 max-w-[16ch] text-[clamp(40px,6.4vw,96px)] font-semibold leading-[0.95] tracking-[-0.035em]">{title}</h2>
      {children && <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-mute">{children}</p>}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* HEAD                                                                */
/* ------------------------------------------------------------------ */
export function Hero({ ready }: { ready: boolean }) {
  const push = useLastPush("Mohanyadav-codes");
  const show = (d: number, y = 14) => ({
    initial: { opacity: 0, y },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.9, ease },
  });
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center pb-20 pt-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[70%] w-screen -translate-x-1/2 bg-[radial-gradient(ellipse_60%_55%_at_40%_40%,rgb(200_255_61/0.07),transparent_70%)]" />
      <div className="relative">
        <motion.span
          {...show(0, 0)}
          id="head-dot"
          className="absolute -left-[57px] top-[6px] hidden h-4 w-4 rounded-full bg-lime shadow-[0_0_0_6px_#0b0b0a,0_0_26px_rgba(200,255,61,0.8)] md:block"
        />
        <motion.div {...show(0.05)} className="font-mono text-[12.5px] leading-6">
          <div className="text-mute">
            <span className="text-lime">$</span> git log --author=<span className="text-add">"Mohan Yadav"</span> --graph -1
          </div>
          <div>
            <span className="text-sun">commit {hash("head")}</span> <span className="text-sky">(</span>
            <span className="font-semibold text-sky">HEAD</span>
            <span className="text-sky"> → </span>
            <span className="font-semibold text-add">main</span>
            <span className="text-sky">, </span>
            <span className="font-semibold text-bat">night-shift</span>
            <span className="text-sky">)</span>
          </div>
          <div className="text-dim">
            Author: {person.name} &lt;{person.email}&gt;
          </div>
        </motion.div>

        <h1 className="sr-only">{person.name}</h1>
        <motion.div {...show(0.1, 0)} className="mt-8 md:mt-10">
          <Contrib ready={ready} />
        </motion.div>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <motion.p {...show(0.9)} className="font-serif text-[clamp(26px,2.6vw,38px)] italic leading-[1.1] text-text/90">
              I build AI tools. <span className="text-lime">Then I film them.</span>
            </motion.p>
            <motion.div {...show(1.05)} className="mt-8 flex flex-wrap items-center gap-2 font-mono text-[12px]">
              {[person.role, person.since].map((t) => (
                <span key={t} className="rounded-md border border-line bg-panel/70 px-2.5 py-1 text-mute">
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            {...show(1.15, 20)}
            className="w-full rounded-xl border border-line bg-panel/90 font-mono text-[12.5px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-del/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-sun/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-add/80" />
              <span className="ml-2 text-[11px] text-dim">~/studio</span>
              <span className="ml-auto flex items-center gap-1.5 text-[10.5px] text-dim">
                <BatLogo className="h-2 w-[18px] text-bat/70" /> night-shift
              </span>
            </div>
            <div className="space-y-1 p-4 leading-6">
              <div className="text-mute">
                <span className="text-lime">$</span> ls shipping/
              </div>
              <div className="flex flex-wrap gap-x-4">
                <button onClick={() => go("branches")} className="text-sky hover:underline">
                  arclor/
                </button>
                <button onClick={() => go("branches")} className="text-del hover:underline">
                  cutdeck/
                </button>
                <span className="inline-flex items-center gap-1 text-dim">
                  <span className="redact inline-block h-3 w-16" />/
                </span>
              </div>
              {push && (
                <>
                  <div className="pt-2 text-mute">
                    <span className="text-lime">$</span> git log -1 --remote
                  </div>
                  <div className="text-text/80">
                    pushed to <span className="text-add">{push.repo}</span> <span className="text-dim">{ago(push.at)}</span>
                  </div>
                </>
              )}
              <div className="caret pt-2 text-mute">
                <span className="text-lime">$</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        {...show(1.4, 0)}
        onClick={() => go("branches")}
        className="absolute bottom-7 left-0 font-mono text-[11.5px] text-dim transition hover:text-lime"
      >
        <span className="bg-text/90 px-1 text-bg">-- more --</span> press <kbd className="text-mute">j</kbd> or scroll
      </motion.button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Branches: the products.                                             */
/* ------------------------------------------------------------------ */
const diffs: Record<string, { del: string[]; add: string[] }> = {
  arclor: {
    del: ["brief a motion designer", "wait two weeks for a first cut"],
    add: ["paste your website", "get a product video in minutes", "change it with a prompt"],
  },
  cutdeck: {
    del: ["scrub a two-hour video for clips", "reframe and caption by hand"],
    add: ["paste a YouTube link", "get vertical shorts with captions", "all on your own computer"],
  },
};

function Fork({ color, last }: { color: string; last?: boolean }) {
  return (
    <svg aria-hidden className="absolute -left-[49px] top-0 hidden h-full w-[50px] md:block" preserveAspectRatio="none" viewBox="0 0 50 100">
      <path d="M0 6 C 0 26, 40 18, 49 36" stroke={color} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
      {!last && <path d="M49 64 C 40 82, 0 74, 0 94" stroke={color} strokeWidth="2" fill="none" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" opacity="0.6" />}
    </svg>
  );
}

function ProductRow({ p, i }: { p: Product; i: number }) {
  const mx = useMotionValue(50), my = useMotionValue(50);
  const bg = useMotionTemplate`radial-gradient(520px circle at ${mx}% ${my}%, ${p.accent}22, transparent 60%)`;
  const d = diffs[p.id];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay: i * 0.05 }}
      className="relative"
    >
      <Fork color={p.accent} />
      <a
        href={p.url}
        target="_blank"
        rel="noopener"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 100);
          my.set(((e.clientY - r.top) / r.height) * 100);
        }}
        className="group relative grid overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-white/20 lg:grid-cols-[1.1fr_1fr]"
      >
        <motion.div style={{ background: bg }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px]">
            <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5" style={{ background: `${p.accent}22`, color: p.accent2 }}>
              <BranchIcon className="h-3 w-3" /> feat/{p.id}
            </span>
            <span className="rounded-md border border-add/30 px-2 py-0.5 text-add">merged · live</span>
            <span className="text-dim">{p.platforms.join(", ")} · {p.price}</span>
          </div>
          <h3 className="mt-6 text-[clamp(44px,5.5vw,76px)] font-semibold leading-none tracking-[-0.04em]">{p.name}</h3>
          <p className="mt-3 font-serif text-[26px] italic leading-tight" style={{ color: p.accent2 }}>
            {p.tagline}
          </p>
          <span className="mt-8 inline-flex items-center gap-2 font-mono text-[12.5px] text-text">
            <span className="border-b border-current pb-0.5 transition group-hover:text-lime">{p.url.replace("https://", "")}</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime" />
          </span>
        </div>
        <div className="relative border-t border-line bg-bg/60 font-mono text-[13px] lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between border-b border-line px-5 py-2.5 text-[11px] text-dim">
            <span>your-workflow.md</span>
            <span>
              <span className="text-add">+{d.add.length}</span> <span className="text-del">−{d.del.length}</span>
            </span>
          </div>
          <div className="py-3">
            <div className="px-5 pb-2 text-sky/80">@@ how you make it @@</div>
            {d.del.map((l, k) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + k * 0.12 }}
                className="flex bg-del/[0.07] px-5 py-1.5 text-del/90 line-through decoration-del/40"
              >
                <span className="w-6 shrink-0 no-underline">−</span>
                {l}
              </motion.div>
            ))}
            {d.add.map((l, k) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (d.del.length + k) * 0.12 }}
                className="flex bg-add/[0.07] px-5 py-1.5 text-add"
              >
                <span className="w-6 shrink-0">+</span>
                {l}
              </motion.div>
            ))}
          </div>
        </div>
      </a>
    </motion.div>
  );
}

function ClassifiedRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease }}
      className="relative"
    >
      <Fork color="#64625b" last />
      <div className="group relative grid overflow-hidden rounded-2xl border border-dashed border-line bg-panel/40 lg:grid-cols-[1.1fr_1fr]">
        <div className="p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px]">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-0.5 text-mute">
              <BranchIcon className="h-3 w-3" /> feat/<span className="redact inline-block h-3 w-14" />
            </span>
            <span className="rounded-md border border-sun/30 px-2 py-0.5 text-sun">not merged yet</span>
          </div>
          <h3 className="mt-6 flex items-center gap-4 text-[clamp(44px,5.5vw,76px)] font-semibold leading-none tracking-[-0.04em] text-text/40">
            Classified <Lock className="h-8 w-8 text-dim transition group-hover:text-sun" />
          </h3>
          <p className="mt-3 font-serif text-[26px] italic leading-tight text-dim">Still in the dark.</p>
        </div>
        <div className="border-t border-line bg-bg/40 p-5 font-mono text-[13px] lg:border-l lg:border-t-0">
          <div className="mb-3 text-[11px] text-dim">git diff --stat · access denied</div>
          {[72, 48, 88, 60, 36, 80].map((w, k) => (
            <div key={k} className="flex items-center gap-3 py-1.5">
              <span className={k < 2 ? "text-del/50" : "text-add/50"}>{k < 2 ? "−" : "+"}</span>
              <span className="redact h-3" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Branches() {
  return (
    <section id="branches" className="scroll-mt-20 py-28 md:py-36">
      <Head id="branches" cmd="git branch --list 'feat/*'" title={<>Tools that <span className="font-serif font-normal italic text-lime">ship.</span></>}>
        Two live. One secret.
      </Head>
      <div className="space-y-6">
        {products.map((p, i) => (
          <ProductRow key={p.id} p={p} i={i} />
        ))}
        <ClassifiedRow />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* git log: the projects.                                              */
/* ------------------------------------------------------------------ */
export function Log() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="log" className="scroll-mt-20 py-28 md:py-36">
      <Head id="log" cmd="git log --oneline projects/" title={<>Things I've <span className="font-serif font-normal italic text-lime">committed.</span></>}>
        Click a commit to open it.
      </Head>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel font-mono">
        {projects.map((p, i) => {
          const isOpen = open === i;
          return (
            <div key={p.name} className="border-b border-line last:border-b-0">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 text-left transition md:grid-cols-[90px_1fr_auto_auto] md:px-7 ${isOpen ? "bg-white/[0.025]" : "hover:bg-white/[0.02]"}`}
              >
                <span className="text-[13px] text-sun">{hash(p.name)}</span>
                <span className="min-w-0">
                  <span className="text-[clamp(18px,2.1vw,26px)] font-semibold tracking-tight text-text transition group-hover:text-lime">{p.name}</span>
                  {p.building && <span className="ml-3 rounded border border-sun/40 px-1.5 py-0.5 align-middle text-[10.5px] text-sun">wip</span>}
                  <span className="ml-3 hidden align-middle text-[12px] text-dim sm:inline">{p.kind}</span>
                </span>
                <span className="hidden gap-1.5 md:flex">
                  {p.stack.slice(0, 3).map((s) => (
                    <span key={s} className="rounded border border-line px-1.5 py-0.5 text-[10.5px] text-mute">
                      {s}
                    </span>
                  ))}
                </span>
                <ChevronRight className={`h-4 w-4 text-dim transition ${isOpen ? "rotate-90 text-lime" : ""}`} />
              </button>
              <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                <div className="grid gap-8 px-5 pb-8 pt-2 md:grid-cols-[90px_1fr_1fr] md:px-7">
                  <span className="hidden md:block" />
                  <div>
                    <p className="font-sans text-[17px] leading-relaxed text-text/90">{p.blurb}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener"
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lime px-3.5 py-2 text-[12px] font-semibold text-bg transition hover:brightness-110"
                    >
                      {p.url.includes("github.com") ? "View source" : "Open " + p.url.replace("https://", "")}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="text-[13px] leading-7">
                    {p.points.map((pt) => (
                      <div key={pt} className="flex gap-3 text-mute">
                        <span className="text-add">+</span>
                        {pt}
                      </div>
                    ))}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="rounded bg-white/5 px-2 py-0.5 text-[11px] text-text/70">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* package.json: the stack.                                            */
/* ------------------------------------------------------------------ */
export function Deps() {
  const keyOf = (l: string) => l.toLowerCase().replace(/ & /g, "_").replace(/\s+/g, "_");
  const total = tracks.reduce((n, t) => n + t.tools.length, 0);
  const L = ({ n: line, children, className = "" }: { n: number; children: ReactNode; className?: string }) => {
    return (
      <div className={`flex ${className}`}>
        <span className="w-10 shrink-0 select-none pr-4 text-right text-dim/60">{line}</span>
        <span className="min-w-0 flex-1">{children}</span>
      </div>
    );
  };
  return (
    <section id="deps" className="scroll-mt-20 py-28 md:py-36">
      <Head id="deps" cmd="cat package.json" title={<>What I <span className="font-serif font-normal italic text-lime">build with.</span></>}>
        {total} tools. AI first.
      </Head>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="flex items-center gap-2 border-b border-line bg-bg/50 px-4 py-2.5 font-mono text-[11.5px]">
          <span className="rounded-t-md border-b-2 border-lime px-2 pb-1 text-text">package.json</span>
          <span className="px-2 pb-1 text-dim">README.md</span>
          <span className="ml-auto text-dim">JSON · UTF-8</span>
        </div>
        <div className="overflow-x-auto py-5 pr-5 font-mono text-[13px] leading-[1.95] md:text-[14px]">
          <L n={1}>{"{"}</L>
          <L n={2}>
            <span className="pl-6 text-sky">"name"</span>: <span className="text-add">"mohan-yadav"</span>,
          </L>
          <L n={3}>
            <span className="pl-6 text-sky">"role"</span>: <span className="text-add">"{person.role}"</span>,
          </L>
          <L n={4}>
            <span className="pl-6 text-sky">"dependencies"</span>: {"{"}
          </L>
          {tracks.map((t, ti) => (
            <L n={5 + ti} key={t.id} className={t.highlight ? "bg-lime/[0.05]" : ""}>
              <span className="block pl-12 -indent-6">
                <span className={t.highlight ? "text-lime" : "text-plum"}>"{keyOf(t.label)}"</span>: [
                {t.tools.map((s, k) => (
                  <span key={s}>
                    <span className="cursor-default rounded px-0.5 text-add transition hover:bg-add/15 hover:text-text">"{s}"</span>
                    {k < t.tools.length - 1 && <span className="text-dim">, </span>}
                  </span>
                ))}
                ]{ti < tracks.length - 1 ? "," : ""}
                {t.highlight && <span className="ml-3 text-dim">// main thing</span>}
              </span>
            </L>
          ))}
          <L n={5 + tracks.length}>
            <span className="pl-6">{"}"}</span>
          </L>
          <L n={6 + tracks.length}>{"}"}</L>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* README: off duty.                                                   */
/* ------------------------------------------------------------------ */
export function Readme() {
  const yt = person.links.find((l) => l.label === "YouTube")!;
  const now: [string, string][] = [
    ["base", person.city],
    ["training", "B.Tech, 3rd year · DTU"],
    ["shipping", "Arclor, Cutdeck"],
    ["side_mission", "Freelance builds and videos"],
    ["started", "class 9"],
    ["soundtrack", "whatever fits the build"],
  ];
  return (
    <section id="readme" className="scroll-mt-20 py-28 md:py-36">
      <Head id="readme" cmd="cat README.md" title={<>Off the <span className="font-serif font-normal italic text-lime">clock.</span></>} />
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="rounded-2xl border border-line bg-panel p-7 md:p-10"
        >
          <div className="font-mono text-[12px] text-dim"># README.md</div>
          <p className="mt-6 text-[clamp(24px,2.6vw,34px)] font-medium leading-[1.25] tracking-[-0.015em]">
            Student by day. <span className="text-lime">Shipping AI tools</span> by night.{" "}
            <span className="text-mute">Music always on.</span>
          </p>
          <div className="mt-8 font-mono text-[12px] text-dim">## where to watch</div>
          <a
            href={yt.url}
            target="_blank"
            rel="noopener"
            className="group mt-4 inline-flex items-center gap-4 rounded-xl border border-line bg-bg/60 p-2 pr-5 transition hover:border-del/50"
          >
            <span className="grid h-11 w-14 place-items-center rounded-lg bg-[#ff2d2d]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span>
              <span className="block text-[15px] font-semibold">Watch the builds</span>
              <span className="block font-mono text-[11px] text-dim">youtube · {yt.handle}</span>
            </span>
            <ArrowUpRight className="ml-2 h-4 w-4 text-dim transition group-hover:text-text" />
          </a>
        </motion.article>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="rounded-2xl border border-line bg-panel font-mono text-[13px]"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-2.5 text-[11px] text-dim">
            <span>now.json</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-add" /> live
            </span>
          </div>
          <div className="p-5 leading-8">
            <div>{"{"}</div>
            {now.map(([k, v], i) => (
              <div key={k} className="group flex flex-wrap pl-5">
                <span className="text-sky">"{k}"</span>
                <span className="text-dim">:&nbsp;</span>
                <span className="text-add transition group-hover:text-lime">"{v}"</span>
                {i < now.length - 1 && <span className="text-dim">,</span>}
              </div>
            ))}
            <div>{"}"}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* git push: contact.                                                  */
/* ------------------------------------------------------------------ */
export function Push() {
  const [from, setFrom] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
 const href = `mailto:${person.email}?subject=${encodeURIComponent(title || "Hello from mohanbuilds.space")}&body=${encodeURIComponent(
    body + (from ? `\n\n— ${from}` : ""),
  )}`;
  return (
    <section id="push" className="scroll-mt-20 pb-16 pt-28 md:pt-36">
      <Head id="push" cmd="git push origin hello" title={<>Open a <span className="font-serif font-normal italic text-lime">pull request.</span></>}>
        Got an idea? Write it here. It opens in your email app.
      </Head>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = href;
          }}
          className="rounded-2xl border border-line bg-panel"
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3 font-mono text-[11.5px]">
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-mute">base: mohan/inbox</span>
            <span className="text-dim">←</span>
            <span className="rounded-md bg-lime/10 px-2 py-0.5 text-lime">compare: you/idea</span>
            <span className="ml-auto text-add">✓ Able to merge</span>
          </div>
          <div className="space-y-4 p-5 md:p-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title: e.g. Let's build an AI tool for…"
              className="w-full rounded-lg border border-line bg-bg px-4 py-3 text-[15px] outline-none transition placeholder:text-dim focus:border-lime/60"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Describe the idea. What should it do, and who is it for?"
              className="w-full resize-none rounded-lg border border-line bg-bg px-4 py-3 text-[15px] leading-relaxed outline-none transition placeholder:text-dim focus:border-lime/60"
            />
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Your name"
                className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-4 py-3 text-[15px] outline-none transition placeholder:text-dim focus:border-lime/60"
              />
              <button type="submit" className="rounded-lg bg-lime px-5 py-3 font-mono text-[13px] font-bold text-bg transition hover:brightness-110 active:scale-[0.98]">
                Create pull request
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-col justify-between rounded-2xl border border-line bg-panel p-6 font-mono text-[13px]">
          <div>
            <div className="text-[11.5px] text-mute">
              <span className="text-lime">$</span> cat CONTRIBUTING.md
            </div>
            <div className="mt-5 text-text"># Good first issues</div>
            <ul className="mt-3 space-y-2.5 text-text/80">
              <li><span className="mr-2 text-add">+</span>an AI tool you want built</li>
              <li><span className="mr-2 text-add">+</span>a product video for your launch</li>
              <li><span className="mr-2 text-add">+</span>a build or a video we make together</li>
            </ul>
          </div>
          <button
            onClick={lightSignal}
            className="group mt-8 flex items-center gap-3 rounded-xl border border-bat/25 bg-bat/[0.04] px-4 py-3.5 text-left transition hover:border-bat/70 hover:bg-bat/[0.08]"
          >
            <BatLogo className="h-3.5 w-8 shrink-0 text-bat transition group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span className="text-mute">
              Rather DM? <span className="text-bat">Light the signal</span> <span className="inline-block transition group-hover:translate-y-0.5">↓</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/** Scroll to the footer and light the signal. */
export function lightSignal() {
  go("signal");
  setTimeout(() => window.dispatchEvent(new Event("signal:light")), 650);
}

/* ------------------------------------------------------------------ */
/* Footer: light the signal to open the channels.                      */
/* ------------------------------------------------------------------ */
export function Signal() {
  const [lit, setLit] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const on = () => setLit(true);
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "l") lightSignal();
    };
    window.addEventListener("signal:light", on);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("signal:light", on);
      window.removeEventListener("keydown", key);
    };
  }, []);
  const copy = () => {
    navigator.clipboard?.writeText(person.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="signal" className="relative scroll-mt-12 overflow-hidden pt-28 md:pt-36">
      {/* Night sky, a shade lighter than the page so the beam has something to hit. */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-[#0e0e0c] to-[#121210]" />
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ background: "radial-gradient(ellipse 55% 40% at 50% 34%, rgba(255,255,255,0.14), transparent 70%)" }}
      />

      {/* The beam, from a rooftop up to the emblem. */}
      <motion.div
        className="pointer-events-none absolute bottom-[11.6vw] left-1/2 h-[82%] w-[70vw] max-w-[1100px] origin-bottom -translate-x-1/2"
        style={{
          background: "linear-gradient(to top, rgba(255,255,255,0.42), rgba(255,255,255,0.08) 70%, transparent)",
          clipPath: "polygon(48.5% 100%, 51.5% 100%, 76% 0, 24% 0)",
          filter: "blur(10px)",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={lit ? { scaleY: 1, opacity: [0, 1, 0.8, 1] } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center px-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[12px]">
          <span className="text-sun">commit {hash("signal")}</span>
          <span className="text-dim">·</span>
          <span className="text-mute">
            <span className="text-lime">$</span> ./light-the-signal.sh
          </span>
        </div>
        <h2 className="mt-5 text-[clamp(44px,7vw,108px)] font-semibold leading-[0.95] tracking-[-0.035em]">
          Light the{" "}
          <span className={`font-serif font-normal italic transition-all duration-700 ${lit ? "bat-glow text-bat" : "text-text/30"}`}>signal.</span>
        </h2>
        <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-mute">
          {lit ? "Pick a channel." : "Press the emblem."}
        </p>

        <motion.button
          onClick={() => setLit((l) => !l)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-pressed={lit}
          aria-label={lit ? "Turn the signal off" : "Light the signal"}
          className={`group relative mt-12 rounded-full transition-[filter] duration-700 ${lit ? "drop-shadow-[0_0_60px_rgba(255,255,255,0.55)]" : "hover:drop-shadow-[0_0_24px_rgba(255,255,255,0.18)]"}`}
        >
          <SignalOval lit={lit} className="w-[min(64vw,280px)]" />
          {!lit && (
            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-dim transition group-hover:text-bat">
              press to light · or hit <kbd className="text-mute">l</kbd>
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {lit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.35, duration: 0.6, ease }}
              className="mt-14 w-full"
            >
              <div className="mx-auto max-w-[640px] rounded-xl border border-line bg-panel/80 px-4 py-3 text-left font-mono text-[12px] leading-6 backdrop-blur">
                <div className="text-mute">
                  <span className="text-lime">$</span> git remote -v
                </div>
                <div className="text-dim">→ signal sent. {person.links.length + 1} channels open.</div>
              </div>
              <div className="mx-auto mt-4 grid max-w-[980px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {person.links.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.06, ease }}
                    className="group rounded-xl border border-line bg-panel/85 px-4 py-4 text-left backdrop-blur transition hover:-translate-y-0.5 hover:border-bat/60"
                  >
                    <div className="flex items-center justify-between text-[15px] font-semibold">
                      {l.label} <ArrowUpRight className="h-3.5 w-3.5 text-dim transition group-hover:text-bat" />
                    </div>
                    <div className="mt-1 truncate font-mono text-[11.5px] text-mute">{l.handle}</div>
                  </motion.a>
                ))}
                <motion.button
                  onClick={copy}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + person.links.length * 0.06, ease }}
                  className="group rounded-xl border border-bat/40 bg-bat/[0.06] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-bat"
                >
                  <div className="flex items-center justify-between text-[15px] font-semibold text-bat">
                    Email <span className="font-mono text-[10.5px] font-normal">{copied ? "copied" : "copy"}</span>
                  </div>
                  <div className="mt-1 truncate font-mono text-[11.5px] text-mute">{person.email}</div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-24">
        {/* The lamp on the rooftop the beam comes from. */}
        <motion.span
          className="absolute bottom-[11.4vw] left-1/2 z-10 h-[6px] w-[22px] -translate-x-1/2 rounded-full"
          animate={{ backgroundColor: lit ? "#ffffff" : "#2a2925", boxShadow: lit ? "0 0 24px 8px rgba(255,255,255,0.7)" : "0 0 0 0 rgba(0,0,0,0)" }}
          transition={{ duration: 0.5 }}
        />
        <Skyline className="block h-auto w-full" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-5 pb-6 font-mono text-[11px] text-dim sm:flex-row md:px-8">
          <span>© {new Date().getFullYear()} Mohan Builds · {person.city}</span>
          <span className="hidden md:inline">
            <kbd className="text-mute">q</kbd> top · <kbd className="text-mute">⌘K</kbd> jump · <kbd className="text-mute">l</kbd> signal
          </span>
          <span>(END) · the bat belongs to DC</span>
        </div>
      </div>
    </section>
  );
}
