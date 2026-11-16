import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { person, products, projects } from "@shared/content";
import { Chip } from "./Chip";
import { groups, pins, type Pin } from "./pins";
import { ago, go, sections, useActiveSection, useClock, useLastPush } from "./lib";

const ease = [0.22, 1, 0.36, 1] as const;
const wrap = "mx-auto w-full max-w-[1360px] px-5 md:px-10";
const pad = (n: number) => String(n).padStart(2, "0");

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-[0.8em] w-[0.8em] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 9 9 3M4 3h5v5" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {[6, 10, 14, 18].map((p) => (
        <g key={p} fill="#121211">
          <rect x="1" y={p - 0.8} width="4" height="1.6" />
          <rect x="19" y={p - 0.8} width="4" height="1.6" />
          <rect x={p - 0.8} y="1" width="1.6" height="4" />
          <rect x={p - 0.8} y="19" width="1.6" height="4" />
        </g>
      ))}
      <rect x="4.5" y="4.5" width="15" height="15" rx="1.5" fill="#121211" />
      <circle cx="8" cy="8" r="1.6" fill="#ff4d00" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */
export function TopBar() {
  const active = useActiveSection();
  const clock = useClock();
  const { scrollYProgress } = useScroll();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/15 bg-paper/85 backdrop-blur-md">
      <div className={`${wrap} flex h-14 items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em]`}>
        <a href="#overview" className="flex items-center gap-2.5" onClick={(e) => (e.preventDefault(), go("overview"))}>
          <Logo className="h-[22px] w-[22px]" />
          <span className="w-semi font-sans text-[16px] font-[850] tracking-[-0.01em]">Mohan Builds</span>
        </a>
        <span className="hidden text-ink/45 xl:inline">MY-2026 · Datasheet · Rev 3.0</span>
        <nav className="ml-auto hidden items-center md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => (e.preventDefault(), go(s.id))}
              className={`relative px-2.5 py-2 transition-colors lg:px-3 ${active === s.id ? "text-ink" : "text-ink/50 hover:text-ink"}`}
            >
              <span className={active === s.id ? "text-sig" : "text-ink/30"}>{s.n}</span> <span className="hidden lg:inline">{s.label}</span>
              {active === s.id && <motion.span layoutId="nav" className="absolute inset-x-2.5 -bottom-[13px] h-[2px] bg-sig" />}
            </a>
          ))}
        </nav>
        <span className="ml-auto tabular-nums text-ink/70 md:ml-2">
          <span className="text-ink/40">IST</span> {clock}
        </span>
      </div>
      <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-ink" />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Section header, like a datasheet chapter                            */
/* ------------------------------------------------------------------ */
function Head({ id, title, children }: { id: string; title: ReactNode; children?: ReactNode }) {
  const s = sections.find((x) => x.id === id)!;
  return (
    <div className="border-t-2 border-ink pt-3">
      <div className="flex justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">
        <span>
          MY-2026 · Section {s.n} · {s.label}
        </span>
        <span>Sheet {Number(s.n)} of 6</span>
      </div>
      <div className="mt-10 grid items-end gap-6 md:mt-14 md:grid-cols-12">
        <Reveal className="md:col-span-2">
          <div className="outline-num w-wide text-[clamp(64px,8vw,124px)] font-[900] leading-[0.78]">{s.n}</div>
        </Reveal>
        <Reveal delay={0.05} className="md:col-span-6">
          <h2 className="w-cond text-[clamp(48px,6.6vw,108px)] font-[850] uppercase leading-[0.84] tracking-[-0.005em]">{title}</h2>
        </Reveal>
        {children && (
          <Reveal delay={0.1} className="md:col-span-4 md:pb-1">
            <p className="max-w-[420px] text-[16px] leading-[1.6] text-ink2">{children}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 Overview                                                         */
/* ------------------------------------------------------------------ */
function Line({ text, ready, delay }: { text: string; ready: boolean; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.02em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1.1, ease, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const [pin, setPin] = useState<Pin>(pins[4]);
  const onPin = useCallback((p: Pin) => setPin(p), []);
  const fade = (d: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, ease, delay: d },
  });
  const meta: [string, ReactNode][] = [
    ["Part no.", "MY-2026"],
    ["Function", person.role],
    ["Location", `${person.city}, IN · UTC+5:30`],
    [
      "Status",
      <span className="inline-flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-sig/60" />
          <span className="relative h-2 w-2 rounded-full bg-sig" />
        </span>
        Active, shipping
      </span>,
    ],
  ];

  return (
    <section id="overview" className="relative pt-14">
      <div className={wrap}>
        <motion.div {...fade(0.15)} className="mt-6 grid grid-cols-2 border-y border-ink/25 font-mono text-[11px] md:grid-cols-4">
          {meta.map(([k, v], i) => (
            <div key={k} className={`px-0 py-2.5 md:px-4 ${i ? "md:border-l md:border-ink/25" : "md:pl-0"} ${i % 2 ? "pl-4 border-l border-ink/25 md:pl-4" : ""}`}>
              <div className="uppercase tracking-[0.14em] text-ink/45">{k}</div>
              <div className="mt-0.5 text-ink">{v}</div>
            </div>
          ))}
        </motion.div>

        <div className="mt-10 grid items-center gap-10 lg:mt-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div {...fade(0.25)} className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
              Product datasheet · <span className="text-sig">Rev 3.0</span>
            </motion.div>
            <h1 className="w-cond mt-3 text-[clamp(104px,17.5vw,268px)] font-[900] uppercase leading-[0.8] tracking-[-0.012em]">
              <Line text="Mohan" ready={ready} delay={0.1} />
              <Line text="Yadav" ready={ready} delay={0.2} />
            </h1>
            <motion.p {...fade(0.45)} className="w-wide mt-7 max-w-[640px] text-[clamp(20px,2.1vw,29px)] font-[650] leading-[1.18] tracking-[-0.02em]">
              Full-stack AI engineer, in a <span className="text-sig">single package.</span>
            </motion.p>
            <motion.div {...fade(0.55)} className="mt-8 flex flex-wrap gap-3 font-mono text-[12px] uppercase tracking-[0.12em]">
              <a
                href="#devices"
                onClick={(e) => (e.preventDefault(), go("devices"))}
                className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-paper transition-colors hover:bg-sig"
              >
                See the devices <span aria-hidden>↓</span>
              </a>
              <a
                href="#order"
                onClick={(e) => (e.preventDefault(), go("order"))}
                className="inline-flex items-center gap-2 border border-ink px-5 py-3 transition-colors hover:bg-ink hover:text-paper"
              >
                Place an order
              </a>
            </motion.div>
          </div>

          <motion.figure
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.3, ease, delay: 0.1 }}
          >
            <div className="mx-auto max-w-[560px]">
              <Chip onPin={onPin} />
            </div>
            <figcaption className="mx-auto mt-2 max-w-[560px] border-t border-ink/30 pt-2 font-mono text-[11px] leading-[1.7]">
              <div className="flex justify-between gap-4 text-ink/55">
                <span>Fig. 1 · MY-2026, 44-pin QFP, top view</span>
                <span className="hidden sm:inline">hover a pin</span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-2 text-ink">
                <span className="text-sig">PIN {pad(pin.n)}</span>
                <span className="font-semibold">{pin.name}</span>
                <span className="leader" />
                <span>{pin.tool}</span>
                <span className="text-ink/45">· {pin.group}</span>
              </div>
            </figcaption>
          </motion.figure>
        </div>

        <motion.div {...fade(0.7)} className="mt-14 grid gap-8 border-t border-ink/25 pt-6 pb-24 md:grid-cols-3 md:gap-10 md:pb-32">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">1 · Features</h3>
            <ul className="mt-4 space-y-2.5 text-[15.5px] leading-[1.45]">
              {[
                "Builds AI tools that run on your own machine",
                "Makes videos about building them",
                "Two devices in production: Arclor and Cutdeck",
                person.since,
                person.study,
              ].map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-[7px] h-[7px] w-[7px] shrink-0 bg-sig" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">2 · Applications</h3>
            <ul className="mt-4 space-y-2.5 text-[15.5px] leading-[1.45]">
              {["Generative AI products", "AI agents and multi-agent systems", "RAG over your own data", "Computer vision", "Product videos and launch films"].map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-[7px] h-[7px] w-[7px] shrink-0 border border-ink" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">3 · Description</h3>
            <p className="mt-4 text-[15.5px] leading-[1.6] text-ink2">
              The MY-2026 is a full-stack AI engineer based in New Delhi. It takes in an idea and puts out a working tool, usually by
              morning. {person.line}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Pinout                                                           */
/* ------------------------------------------------------------------ */
const pinType: Record<string, string> = {
  AI: "I/O · primary",
  Languages: "Core",
  Frontend: "Output",
  Backend: "I/O",
  Data: "Memory",
  "Apps & ops": "Ship",
};

export function Pinout() {
  return (
    <section id="pinout" className="py-24 md:py-32">
      <div className={wrap}>
        <Head id="pinout" title={<>Pin functions</>}>
          {pins.length} pins, one tool each. The AI pins carry most of the signal, so they come first.
        </Head>
        <Reveal className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-y-2 border-ink font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/60">
                <th className="w-[110px] py-3 pr-4 font-medium">Pins</th>
                <th className="w-[180px] py-3 pr-4 font-medium">Group</th>
                <th className="w-[140px] py-3 pr-4 font-medium">Type</th>
                <th className="py-3 font-medium">Function</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} className={`group border-b border-ink/20 align-top transition-colors hover:bg-paper2 ${g.highlight ? "bg-sig/[0.06]" : ""}`}>
                  <td className="relative py-5 pr-4 font-mono text-[13px] tabular-nums">
                    <span className={`absolute inset-y-0 -left-3 w-[3px] origin-top scale-y-0 transition-transform group-hover:scale-y-100 ${g.highlight ? "bg-sig" : "bg-ink"}`} />
                    {pad(g.from)}–{pad(g.to)}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="w-cond text-[30px] font-[850] uppercase leading-none">{g.label}</div>
                    {g.highlight && <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-sig">main thing</div>}
                  </td>
                  <td className="py-5 pr-4 font-mono text-[12px] text-ink2">{pinType[g.label] ?? "I/O"}</td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {pins
                        .filter((p) => p.n >= g.from && p.n <= g.to)
                        .map((p) => (
                          <span
                            key={p.n}
                            data-hot
                            className={`inline-flex items-baseline gap-1.5 border px-2 py-1 text-[13.5px] transition-colors hover:border-ink hover:bg-ink hover:text-paper ${g.highlight ? "border-sig/40" : "border-ink/20"}`}
                          >
                            <span className="font-mono text-[10px] text-ink/45">{pad(p.n)}</span>
                            {p.tool}
                          </span>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Devices                                                          */
/* ------------------------------------------------------------------ */
const io: Record<string, { part: string; in: string; out: string; runs: string }> = {
  arclor: { part: "MB-ARC1", in: "Your website URL", out: "Product video, editable with prompts", runs: "In the browser" },
  cutdeck: { part: "MB-CDK1", in: "A YouTube link", out: "Vertical shorts with captions", runs: "On your own computer" },
};

function Flow({ from, to, name, color, locked }: { from: string; to: string; name: string; color: string; locked?: boolean }) {
  const Box = ({ k, v }: { k: string; v: string }) => (
    <div className="min-w-0 flex-1 border border-ink/35 bg-card px-3 py-3">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink/50">{k}</div>
      <div className={`mt-1 text-[14px] font-medium leading-snug ${locked ? "redact w-fit" : ""}`}>{v}</div>
    </div>
  );
  const Wire = () => (
    <div className="relative flex w-8 shrink-0 items-center md:w-14">
      <div className="h-px w-full bg-ink/60" />
      <div className="absolute right-0 h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-ink/70" />
      {!locked && <span className="flow-dot absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full" style={{ background: color }} />}
    </div>
  );
  return (
    <div className="flex items-stretch">
      <Box k="Input" v={from} />
      <Wire />
      <div
        className="flex w-[120px] shrink-0 flex-col items-center justify-center px-2 py-3 text-center text-paper md:w-[150px]"
        style={{ background: locked ? undefined : "#121211" }}
      >
        {locked ? (
          <div className="hatch flex h-full w-full items-center justify-center border border-dashed border-ink/50 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">
            Keep out
          </div>
        ) : (
          <>
            <span className="mb-1 h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            <span className="w-cond text-[24px] font-[850] uppercase leading-none">{name}</span>
          </>
        )}
      </div>
      <Wire />
      <Box k="Output" v={to} />
    </div>
  );
}

export function Devices() {
  const live = products.filter((p) => p.status === "live");
  return (
    <section id="devices" className="py-24 md:py-32">
      <div className={wrap}>
        <Head id="devices" title={<>Product family</>}>
          Every tool from Mohan Builds is its own device, with its own site. Two are in production. The third is still in the fab.
        </Head>

        <Reveal className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-y-2 border-ink font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/60">
                {["Device", "Part no.", "Function", "Platform", "Price", "Status"].map((h) => (
                  <th key={h} className="py-3 pr-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {live.map((p) => (
                <tr key={p.id} className="border-b border-ink/20">
                  <td className="py-3 pr-4 font-semibold">{p.name}</td>
                  <td className="py-3 pr-4 font-mono text-[12.5px]">{io[p.id]?.part}</td>
                  <td className="py-3 pr-4 text-ink2">{p.tagline}</td>
                  <td className="py-3 pr-4">{p.platforms.join(", ")}</td>
                  <td className="py-3 pr-4">{p.price}</td>
                  <td className="py-3 pr-4 font-mono text-[12px] uppercase">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#1fa64a]" />
                    In production
                  </td>
                </tr>
              ))}
              <tr className="border-b border-ink/20 text-ink/60">
                <td className="py-3 pr-4 font-semibold">Classified</td>
                <td className="py-3 pr-4 font-mono text-[12.5px]">MB-X03</td>
                <td className="py-3 pr-4">
                  <span className="redact">the third tool, still secret</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="redact">Platform</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="redact">Free</span>
                </td>
                <td className="py-3 pr-4 font-mono text-[12px] uppercase">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-sig" />
                  In fab
                </td>
              </tr>
            </tbody>
          </table>
        </Reveal>

        <div className="mt-16 space-y-6">
          {live.map((p, i) => {
            const d = io[p.id];
            return (
              <Reveal key={p.id}>
                <article className="grid border border-ink/80 bg-card lg:grid-cols-12">
                  <div className="relative p-6 md:p-9 lg:col-span-5">
                    <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                      <span>
                        {d.part} <span className="text-ink/40">· Device {pad(i + 1)}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[#1a8f40]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1fa64a]" /> live
                      </span>
                    </div>
                    <h3 className="w-cond mt-8 text-[clamp(72px,9vw,136px)] font-[900] uppercase leading-[0.8]" style={{ color: p.accent }}>
                      {p.name}
                    </h3>
                    <p className="w-wide mt-5 text-[19px] font-[650] leading-snug tracking-[-0.015em]">{p.tagline}</p>
                    <p className="mt-3 max-w-[460px] text-[15.5px] leading-[1.6] text-ink2">{p.blurb}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex items-center gap-2 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
                      style={{ background: p.accent }}
                    >
                      {p.url.replace("https://", "")} <Arrow />
                    </a>
                  </div>
                  <div className="border-t border-ink/80 p-6 md:p-9 lg:col-span-7 lg:border-l lg:border-t-0">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">Fig. 3.{i + 1} · Functional block diagram</div>
                    <div className="paper mt-4 border border-ink/20 p-4 md:p-7">
                      <Flow from={d.in} to={d.out} name={p.name} color={p.accent} />
                    </div>
                    <dl className="mt-6 grid grid-cols-2 gap-x-6 font-mono text-[12px] md:grid-cols-4">
                      {[
                        ["Platform", p.platforms.join(", ")],
                        ["Price", p.price],
                        ["Runs", d.runs],
                        ["Status", "In production"],
                      ].map(([k, v]) => (
                        <div key={k} className="border-t border-ink/25 py-2.5">
                          <dt className="uppercase tracking-[0.14em] text-ink/45">{k}</dt>
                          <dd className="mt-0.5">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              </Reveal>
            );
          })}

          <Reveal>
            <article className="grid border border-dashed border-ink/50 lg:grid-cols-12">
              <div className="p-6 md:p-9 lg:col-span-5">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                  <span>
                    MB-X03 <span className="text-ink/40">· Device 03</span>
                  </span>
                  <span className="text-sig">in fab</span>
                </div>
                <h3 className="w-cond mt-8 flex items-end gap-4 text-[clamp(72px,9vw,136px)] font-[900] uppercase leading-[0.8] text-ink/25">
                  Classified
                </h3>
                <p className="w-wide mt-5 text-[19px] font-[650] leading-snug tracking-[-0.015em] text-ink/50">The third tool. Still in the dark.</p>
                <p className="mt-3 max-w-[460px] text-[15.5px] leading-[1.6] text-ink/55">It ships when it's ready. Follow the builds to see it first.</p>
              </div>
              <div className="border-t border-dashed border-ink/50 p-6 md:p-9 lg:col-span-7 lg:border-l lg:border-t-0">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">Fig. 3.3 · Block diagram withheld</div>
                <div className="hatch mt-4 border border-ink/20 p-4 md:p-7">
                  <Flow from="something you have" to="something you want" name="?" color="#ff4d00" locked />
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 Application notes                                                */
/* ------------------------------------------------------------------ */
export function Notes() {
  const [open, setOpen] = useState(0);
  return (
    <section id="notes" className="py-24 md:py-32">
      <div className={wrap}>
        <Head id="notes" title={<>Application notes</>}>
          Projects I've built, written up the way chip makers write up reference designs. Open any note.
        </Head>
        <div className="mt-14 border-t-2 border-ink">
          {projects.map((p, i) => {
            const on = open === i;
            return (
              <Reveal key={p.name} delay={i * 0.04}>
                <div className="border-b border-ink/25">
                  <button
                    onClick={() => setOpen(on ? -1 : i)}
                    aria-expanded={on}
                    className="group grid w-full grid-cols-[64px_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[110px_1fr_220px_220px_40px] md:py-6"
                  >
                    <span className="font-mono text-[12px] text-ink/55">AN-{pad(i + 1)}</span>
                    <span className="w-cond flex items-center gap-4 text-[clamp(34px,4.4vw,64px)] font-[850] uppercase leading-[0.9] transition-colors group-hover:text-sig">
                      {p.name}
                      {p.building && (
                        <span className="hidden rotate-[-4deg] border-2 border-sig px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-sig sm:inline">
                          PRELIMINARY
                        </span>
                      )}
                    </span>
                    <span className="hidden font-mono text-[12px] text-ink2 md:block">{p.kind}</span>
                    <span className="hidden font-mono text-[11.5px] text-ink/55 md:block">{p.stack.slice(0, 3).join(" · ")}</span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center border border-ink text-[18px] transition-all ${on ? "rotate-45 bg-ink text-paper" : "group-hover:bg-ink group-hover:text-paper"}`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-8 pb-10 md:grid-cols-[110px_1fr_1fr] md:gap-4">
                          <div />
                          <div className="md:pr-10">
                            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/50">Abstract</div>
                            <p className="w-wide mt-3 text-[clamp(19px,1.8vw,24px)] font-[600] leading-[1.3] tracking-[-0.015em]">{p.blurb}</p>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-7 inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sig"
                            >
                              {p.url.includes("github.com") ? "Read the source" : `Open ${p.url.replace("https://", "")}`} <Arrow />
                            </a>
                          </div>
                          <div>
                            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/50">Design</div>
                            <ol className="mt-3 border-t border-ink/25">
                              {p.points.map((pt, k) => (
                                <li key={pt} className="flex gap-4 border-b border-ink/25 py-2.5 text-[15px]">
                                  <span className="font-mono text-[12px] text-sig">{k + 1}.</span>
                                  {pt}
                                </li>
                              ))}
                            </ol>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {p.stack.map((s) => (
                                <span key={s} className="border border-ink/25 px-2 py-0.5 font-mono text-[11.5px]">
                                  {s}
                                </span>
                              ))}
                              {p.team && <span className="border border-ink/25 px-2 py-0.5 font-mono text-[11.5px]">Team build</span>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Characteristics                                                  */
/* ------------------------------------------------------------------ */
const activity = [0.86, 0.8, 0.62, 0.38, 0.18, 0.08, 0.07, 0.1, 0.14, 0.2, 0.22, 0.2, 0.24, 0.21, 0.22, 0.26, 0.3, 0.36, 0.46, 0.57, 0.69, 0.8, 0.9, 0.95, 0.86];

function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function Curve() {
  useClock();
  const W = 520;
  const H = 240;
  const L = 34;
  const B = 26;
  const x = (h: number) => L + (h / 24) * (W - L - 8);
  const y = (v: number) => 10 + (1 - v) * (H - B - 10);
  const pts = activity.map((v, h) => [x(h), y(v)] as [number, number]);
  const d = smooth(pts);
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hr = now.getHours() + now.getMinutes() / 60;
  const v0 = activity[Math.floor(hr)];
  const v1 = activity[Math.ceil(hr)] ?? v0;
  const vy = v0 + (v1 - v0) * (hr - Math.floor(hr));

  return (
    <figure>
      <div className="paper border border-ink/30 p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Build activity by time of day, peaking late at night">
          {[0, 6, 12, 18, 24].map((h) => (
            <g key={h}>
              <line x1={x(h)} x2={x(h)} y1="10" y2={H - B} stroke="#12121122" />
              <text x={x(h)} y={H - 8} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill="#12121199">
                {pad(h)}:00
              </text>
            </g>
          ))}
          {[0, 0.5, 1].map((v) => (
            <line key={v} x1={L} x2={W - 8} y1={y(v)} y2={y(v)} stroke="#12121122" />
          ))}
          <text x="8" y={y(1) + 4} fontFamily="IBM Plex Mono" fontSize="9" fill="#12121188">
            max
          </text>
          <text x="8" y={y(0) + 4} fontFamily="IBM Plex Mono" fontSize="9" fill="#12121188">
            0
          </text>
          <rect x={x(9)} y="10" width={x(17) - x(9)} height={H - B - 10} fill="#1212110d" />
          <text x={(x(9) + x(17)) / 2} y="26" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9.5" fill="#12121199">
            CLASSES
          </text>
          <motion.path
            d={`${d} L${x(24)},${y(0)} L${x(0)},${y(0)} Z`}
            fill="#ff4d00"
            fillOpacity="0.1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <motion.path
            d={d}
            fill="none"
            stroke="#ff4d00"
            strokeWidth="2.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
          />
          <line x1={x(hr)} x2={x(hr)} y1="10" y2={H - B} stroke="#121211" strokeDasharray="3 3" />
          <circle cx={x(hr)} cy={y(vy)} r="5" fill="#121211" stroke="#ebeae3" strokeWidth="2" />
          <g transform={`translate(${Math.min(x(hr) + 8, W - 92)}, ${Math.max(y(vy) - 26, 14)})`}>
            <rect width="84" height="18" fill="#121211" />
            <text x="6" y="12.5" fontFamily="IBM Plex Mono" fontSize="10" fill="#ebeae3">
              you are here
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 font-mono text-[11px] text-ink/55">Fig. 5 · Typical build activity vs. time of day, IST. Illustrative, not to scale.</figcaption>
    </figure>
  );
}

export function Specs() {
  const push = useLastPush("Mohanyadav-codes");
  const yt = person.links.find((l) => l.label === "YouTube")!;
  const rows: [string, string, ReactNode, string][] = [
    ["Devices in production", "live, public", "2", "units"],
    ["Devices in fab", "classified", "1", "unit"],
    ["Pin count", "across 6 groups", String(pins.length), "pins"],
    ["Coding since", "first line of code", "class 9", "—"],
    ["Training", "B.Tech, DTU", "3rd", "year"],
    ["Mode, day", "on campus", "student", "—"],
    ["Mode, night", "after classes", "builder", "—"],
    ["Background music", "any build", "on", "—"],
    [
      "Last push",
      "GitHub, live reading",
      push ? <span className="text-sig">{push.repo}</span> : <span className="blink">reading…</span>,
      push ? ago(push.at) : "—",
    ],
  ];
  return (
    <section id="specs" className="py-24 md:py-32">
      <div className={wrap}>
        <Head id="specs" title={<>Characteristics</>}>
          Typical values, measured in New Delhi with a little music on in the background.
        </Head>
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <Reveal className="overflow-x-auto lg:col-span-7">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14.5px]">
              <thead>
                <tr className="border-y-2 border-ink font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/60">
                  <th className="py-3 pr-4 font-medium">Parameter</th>
                  <th className="py-3 pr-4 font-medium">Conditions</th>
                  <th className="py-3 pr-4 font-medium">Typ</th>
                  <th className="py-3 font-medium">Unit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([k, c, v, u]) => (
                  <tr key={k} className="border-b border-ink/20 transition-colors hover:bg-paper2">
                    <td className="py-3 pr-4 font-medium">{k}</td>
                    <td className="py-3 pr-4 text-ink/60">{c}</td>
                    <td className="py-3 pr-4 font-mono text-[13.5px]">{v}</td>
                    <td className="py-3 font-mono text-[12.5px] text-ink/60">{u}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className="space-y-10 lg:col-span-5">
            <Reveal>
              <Curve />
            </Reveal>
            <Reveal delay={0.05}>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">5.1 · Operating notes</div>
              <p className="w-wide mt-3 text-[clamp(19px,1.7vw,23px)] font-[600] leading-[1.32] tracking-[-0.015em]">
                By day I'm a student in Delhi. By night I ship <span className="text-sig">AI tools</span>, then film how I built them.{" "}
                <span className="text-ink/45">There's always a little music on in the background.</span>
              </p>
              <a
                href={yt.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-6 inline-flex items-center gap-4 border border-ink bg-card py-2 pl-2 pr-5 transition-colors hover:bg-ink hover:text-paper"
              >
                <span className="flex h-11 w-14 items-center justify-center bg-[#ff0033] text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">Watch the builds</span>
                  <span className="block font-mono text-[11px] opacity-60">youtube · {yt.handle}</span>
                </span>
                <Arrow className="ml-2" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 06 Ordering                                                         */
/* ------------------------------------------------------------------ */
const kinds = [
  { k: "B", label: "Build", hint: "a tool or product" },
  { k: "V", label: "Video", hint: "a product or launch film" },
  { k: "C", label: "Collab", hint: "something together" },
  { k: "H", label: "Hello", hint: "just saying hi" },
];

export function Order() {
  const [kind, setKind] = useState("B");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const code = `MY-2026-${kind}`;
  const k = kinds.find((x) => x.k === kind)!;

  const send = (e: FormEvent) => {
    e.preventDefault();
    const subject = `[${code}] ${title || k.label}`;
    const text = `${body}${name ? `\n\n— ${name}` : ""}`;
    window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };
  const field = "w-full border border-ink/40 bg-card px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-ink/40 focus:border-ink focus:bg-white";

  return (
    <section id="order" className="py-24 md:py-32">
      <div className={wrap}>
        <Head id="order" title={<>Ordering information</>}>
          Got an idea, a build or a video you want to make together? Pick a part number and send it. It opens your email app, already filled in.
        </Head>

        <Reveal className="mt-14">
          <div className="border-2 border-ink bg-card p-6 md:p-10">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">Fig. 6 · Part number decoder</div>
            <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-2">
              <span className="w-cond text-[clamp(56px,10vw,148px)] font-[900] uppercase leading-[0.8]">MY-2026</span>
              <span className="w-cond text-[clamp(56px,10vw,148px)] font-[900] leading-[0.8] text-ink/30">-</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={kind}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="w-cond text-[clamp(56px,10vw,148px)] font-[900] leading-[0.8] text-sig"
                >
                  {kind}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="mt-6 grid gap-4 border-t border-ink/25 pt-4 font-mono text-[12px] md:grid-cols-[auto_1fr] md:gap-10">
              <div>
                <span className="text-ink/45">MY-2026</span> = Mohan Yadav, full-stack AI engineer
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-ink/45">suffix</span> =
                {kinds.map((x) => (
                  <button
                    key={x.k}
                    type="button"
                    onClick={() => setKind(x.k)}
                    className={`border px-2.5 py-1 transition-colors ${kind === x.k ? "border-sig bg-sig text-white" : "border-ink/30 hover:border-ink"}`}
                  >
                    {x.k} · {x.label}
                  </button>
                ))}
                <span className="text-ink/55">({k.hint})</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <form onSubmit={send} className="h-full border border-ink/80 p-6 md:p-8">
              <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">
                <span>Order form</span>
                <span>
                  to: <span className="normal-case tracking-normal text-ink">{person.email}</span>
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Subject, e.g. An AI tool for my store" className={field} />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="What should it do, and who is it for?"
                  className={`${field} resize-none`}
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center justify-center gap-2 bg-ink px-6 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sig"
                  >
                    Send {code} <Arrow />
                  </button>
                </div>
              </div>
            </form>
          </Reveal>
          <Reveal delay={0.05} className="lg:col-span-5">
            <div className="h-full border border-ink/80 p-6 md:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">Distributors</div>
              <ul className="mt-4 border-t border-ink/25">
                {person.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-baseline gap-3 border-b border-ink/25 py-3 transition-colors hover:text-sig"
                    >
                      <span className="w-[92px] shrink-0 text-[15px] font-semibold">{l.label}</span>
                      <span className="truncate font-mono text-[12.5px] text-ink/60 group-hover:text-sig">{l.handle}</span>
                      <span className="leader" />
                      <Arrow className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(person.email);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1600);
                    }}
                    className="group flex w-full items-baseline gap-3 border-b border-ink/25 py-3 text-left transition-colors hover:text-sig"
                  >
                    <span className="w-[92px] shrink-0 text-[15px] font-semibold">Email</span>
                    <span className="truncate font-mono text-[12.5px] text-ink/60 group-hover:text-sig">{person.email}</span>
                    <span className="leader" />
                    <span className="shrink-0 font-mono text-[11px] uppercase">{copied ? "copied" : "copy"}</span>
                  </button>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer: revision history                                            */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer className="pt-10">
      <div className={wrap}>
        <div className="border-t-2 border-ink pt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/55">Revision history</div>
        <table className="mt-4 w-full border-collapse text-left font-mono text-[12.5px]">
          <tbody>
            {[
              ["3.0", "Arclor and Cutdeck in production", "current"],
              ["—", "Device 03 taped out, details withheld", "in fab"],
            ].map(([r, d, s]) => (
              <tr key={d} className="border-b border-ink/20">
                <td className="w-16 py-2.5">{r}</td>
                <td className="py-2.5">{d}</td>
                <td className={`py-2.5 text-right uppercase ${s === "current" ? "text-sig" : "text-ink/55"}`}>{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 max-w-[760px] text-[12.5px] leading-[1.6] text-ink/55">
          Information furnished by Mohan Builds is believed to be accurate and reliable. Specifications are subject to change without
          notice, usually because something shipped overnight.
        </p>
      </div>
      <div className="mt-14 overflow-hidden">
        <div className={wrap}>
          <div className="w-wide select-none whitespace-nowrap text-center text-[clamp(44px,9.6vw,150px)] font-[900] uppercase leading-[0.8] tracking-[-0.04em]">
            Mohan Builds<span className="text-sig">.</span>
          </div>
        </div>
      </div>
      <div className={`${wrap} mt-8 flex flex-col justify-between gap-3 border-t border-ink/25 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55 sm:flex-row`}>
        <span>© {new Date().getFullYear()} Mohan Builds · {person.city}</span>
        <a href="#overview" onClick={(e) => (e.preventDefault(), go("overview"))} className="hover:text-sig">
          Back to sheet 1 ↑
        </a>
      </div>
    </footer>
  );
}
