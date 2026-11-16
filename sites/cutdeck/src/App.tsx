import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, AudioLines, Check, ChevronDown, Cpu, Download, Gamepad2, KeyRound, Monitor, ScanFace, Scissors, ShieldCheck, Sparkles, Subtitles, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { person } from "@shared/content";
import { HeroVisual } from "./HeroVisual";
import { release } from "./release";
import { TrayDemo } from "./TrayDemo";

function DownloadButton({ big = false }: { big?: boolean }) {
  return (
    <a
      href={release.file}
      download
      className={`group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-b from-[#ff6d62] to-coral font-semibold text-white shadow-[0_14px_40px_-10px_rgba(255,90,78,0.75),inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:brightness-110 active:scale-[0.98] ${big ? "h-16 px-6 sm:px-8 text-[17px]" : "h-11 px-5 text-[14px]"}`}
    >
      <Download size={big ? 20 : 16} className="transition group-hover:translate-y-0.5" />
      <span className="whitespace-nowrap">Download<span className={big ? "" : "hidden sm:inline"}> for Windows</span></span>
      {big && <span className="rounded-lg bg-black/20 px-2 py-0.5 whitespace-nowrap font-mono text-[12px] font-medium max-sm:hidden">Free · {release.size}</span>}
    </a>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 30);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl" : ""}`}>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/icon.png" alt="" className="h-8 w-8 rounded-lg" />
          <span className="font-display text-[19px] font-bold tracking-tight">cutdeck</span>
        </a>
        <nav className="hidden items-center gap-8 text-[14px] text-mute md:flex">
          <a href="#how" className="hover:text-paper">How it works</a>
          <a href="#features" className="hover:text-paper">Features</a>
          <a href="#install" className="hover:text-paper">Install</a>
          <a href="#faq" className="hover:text-paper">FAQ</a>
        </nav>
        <DownloadButton />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-[-20%] h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-coral/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-10%] top-[30%] h-[50vh] w-[50vh] rounded-full bg-amber/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1240px] px-6 text-center">
        <motion.a
          href={person.links[0].url}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] text-mute hover:text-paper"
        >
          <span className="rounded-full bg-coral px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-white">New</span>
          Version {release.version} · Free for Windows
        </motion.a>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 120, damping: 20 }}
          className="font-display text-[clamp(52px,9vw,124px)] font-extrabold leading-[0.92] tracking-[-0.055em]"
        >
          Long videos in.
          <br />
          <span className="text-gradient">Shorts out.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mx-auto mt-6 max-w-[620px] text-[18px] leading-relaxed text-mute md:text-[20px]">
          Paste a YouTube, Kick or Twitch link. Cutdeck finds the moments worth posting, frames them vertical and adds captions. You swipe, it exports.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-9 flex flex-col items-center gap-3">
          <DownloadButton big />
          <span className="text-[13px] text-dim">{release.os} · macOS coming later</span>
        </motion.div>
        <div className="mt-14">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function Section({ id, eyebrow, title, sub, children }: { id: string; eyebrow: string; title: React.ReactNode; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mx-auto mb-14 max-w-[760px] text-center">
        <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.22em] text-coral">{eyebrow}</div>
        <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1] [text-wrap:balance] tracking-[-0.04em]">{title}</h2>
        {sub && <p className="mt-5 text-[17px] leading-relaxed text-mute">{sub}</p>}
      </motion.div>
      {children}
    </section>
  );
}

function How() {
  const steps = [
    { n: "01", t: "Paste a link", d: "Click the coral button in your screen corner and paste a YouTube, Kick or Twitch link. Or drop a video file on it." },
    { n: "02", t: "Swipe the deck", d: "Clips fan out as cards, best first. Hover to watch. Flick right to keep, left to skip." },
    { n: "03", t: "Post", d: "Kept clips export in 1080×1920. Drag one straight from the corner into YouTube, Instagram or WhatsApp." },
  ];
  return (
    <Section id="how" eyebrow="How it works" title={<>It lives in the <span className="text-gradient">corner</span> of your screen</>} sub="No editor to learn. One button that's always there.">
      <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <TrayDemo />
        <div className="flex flex-col gap-4">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[13px] text-coral">{s.n}</span>
                <div>
                  <div className="font-display text-[22px] font-semibold tracking-tight">{s.t}</div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-mute">{s.d}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const STYLES = [
  { name: "Beast", font: "Archivo Black", hl: "#FFE135", size: 44, stroke: 3, words: ["THIS", "IS", "INSANE"] },
  { name: "Hype", font: "Bangers", hl: "#5CFF8A", size: 56, stroke: 3.5, words: ["NO", "WAY"] },
  { name: "Bold", font: "Anton", hl: "#FF5A4E", size: 54, stroke: 3, words: ["WATCH", "THIS"] },
  { name: "Neon", font: "Bungee", hl: "#3CF0FF", size: 40, stroke: 2.5, words: ["GAME", "OVER"] },
  { name: "Clean", font: "Poppins", hl: "#FF5A4E", size: 38, stroke: 0, words: ["he said", "what"] },
];

function CaptionShowcase() {
  const [i, setI] = useState(0);
  const [w, setW] = useState(0);
  const s = STYLES[i];
  useEffect(() => {
    const t = setInterval(() => setW((x) => (x + 1) % (s.words.length + 2)), 380);
    return () => clearInterval(t);
  }, [s.words.length]);
  return (
    <div className="glass flex flex-col overflow-hidden rounded-3xl lg:col-span-2 lg:flex-row">
      <div className="flex-1 p-8">
        <Subtitles className="text-coral" size={22} />
        <div className="mt-4 font-display text-[26px] font-semibold tracking-tight">Captions that pop, word by word</div>
        <p className="mt-2 text-[15px] leading-relaxed text-mute">Five styles, timed to every word. Pick one per clip in the Studio, plus an optional hook banner for the first three seconds.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {STYLES.map((st, k) => (
            <button key={st.name} onClick={() => { setI(k); setW(0); }} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition ${k === i ? "border-coral/60 bg-coral/10 text-paper" : "border-white/10 text-mute hover:text-paper"}`}>
              {st.name}
            </button>
          ))}
        </div>
      </div>
      <div className="relative grid min-h-[260px] place-items-center bg-[radial-gradient(120%_90%_at_50%_10%,#ffb547,#c2471f_45%,#1d0b06)] lg:w-[46%]">
        <AnimatePresence mode="wait">
          <motion.div key={s.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-4 text-center leading-none" style={{ fontFamily: `"${s.font}"`, fontWeight: s.font === "Poppins" ? 700 : 400, fontSize: s.size, textShadow: s.stroke === 0 ? "0 4px 14px rgba(0,0,0,0.6)" : undefined }}>
            {s.words.map((word, k) => (
              <motion.span key={k} className="mx-[0.22em] inline-block" animate={{ scale: k === w ? 1.12 : 1, color: k === w ? s.hl : "#ffffff" }} transition={{ type: "spring", stiffness: 600, damping: 18 }} style={{ WebkitTextStroke: s.stroke ? `${s.stroke}px black` : undefined, paintOrder: "stroke fill" }}>
                {word}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Features() {
  const f = [
    { icon: Sparkles, t: "Finds the moments", d: "An AI editor reads the whole video and picks clips that open on a hook and end on the payoff. Shouting, hype and chat spikes count too." },
    { icon: ScanFace, t: "Frames it vertical", d: "Follows the speaker's face, switches between people, or puts a streamer's facecam above the gameplay." },
    { icon: Scissors, t: "Cuts the dead air", d: "Silences and “um”s go. Loud action with no talking stays." },
    { icon: Gamepad2, t: "Made for streams", d: "Four-hour VOD? It listens to the liveliest stretches only, so you get clips in minutes." },
    { icon: Timer, t: "Fast", d: "Downloads just the audio and the seconds it needs. Exports with your GPU when it can." },
    { icon: ShieldCheck, t: "Yours", d: "Runs on your computer. No account, no watermark, no credits, no upload of your video." },
  ];
  return (
    <Section id="features" eyebrow="Features" title={<>The editor you'd hire, <span className="text-gradient whitespace-nowrap">for free</span></>}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CaptionShowcase />
        {f.map((x, i) => (
          <motion.div key={x.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="glass group rounded-3xl p-7 transition hover:border-coral/30">
            <x.icon className="text-coral transition group-hover:scale-110" size={22} />
            <div className="mt-4 font-display text-[21px] font-semibold tracking-tight">{x.t}</div>
            <p className="mt-2 text-[14.5px] leading-relaxed text-mute">{x.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Install() {
  const steps = [
    { icon: Download, t: "Download and run the installer", d: `${release.size}. No admin rights needed; it installs just for you.` },
    { icon: Monitor, t: "“Windows protected your PC”?", d: "Cutdeck isn't code-signed yet. Click More info, then Run anyway." },
    { icon: KeyRound, t: "Paste a free AI key", d: "Get one in a minute at console.groq.com/keys (sign in with Google). It's stored in Windows Credential Manager." },
    { icon: Cpu, t: "Let it set up once", d: "Cutdeck downloads its video tools, about 150 MB, the first time. Then the coral button appears in your corner." },
  ];
  return (
    <Section id="install" eyebrow="Install" title="Up and running in three minutes">
      <div className="mx-auto grid max-w-[980px] gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div key={s.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass flex gap-5 rounded-3xl p-6">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-coral/10 text-coral"><s.icon size={20} /></div>
            <div>
              <div className="font-mono text-[11px] text-dim">STEP {i + 1}</div>
              <div className="mt-1 font-display text-[19px] font-semibold tracking-tight">{s.t}</div>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-mute">{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

const FAQ = [
  ["Is it really free?", "Yes. Cutdeck is free. The AI part uses your own key; Groq's free tier covers transcription and picking for normal use."],
  ["What can I clip?", "YouTube videos and past live streams, Kick and Twitch VODs, or any video file on your computer. Only clip content you have the right to use."],
  ["Does my video get uploaded?", "No. Video stays on your computer. Only compressed audio and the transcript go to the AI provider you chose. With an open-source model and on-device Whisper, nothing leaves at all."],
  ["What does it need?", "Windows 10 or 11, 8 GB RAM recommended. A GPU makes exports faster but isn't required."],
  ["Can I use other AI providers?", "Yes: Groq, Gemini, Grok (xAI), OpenAI, OpenRouter, or a local model through Ollama or LM Studio."],
  ["Mac?", "A macOS version is planned. Follow Mohan Builds on YouTube to hear when it ships."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions">
      <div className="mx-auto max-w-[780px] divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {FAQ.map(([q, a], i) => (
          <div key={q}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left">
              <span className="font-display text-[19px] font-semibold tracking-tight">{q}</span>
              <ChevronDown size={18} className={`shrink-0 text-mute transition ${open === i ? "rotate-180 text-coral" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-5 text-[15.5px] leading-relaxed text-mute">
                  {a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Cta() {
  return (
    <section className="relative mx-auto max-w-[1240px] px-6 pb-24">
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#2a110d] via-[#150b0a] to-ink-900 px-8 py-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[70%] -translate-x-1/2 rounded-full bg-coral/25 blur-[100px]" />
        <AudioLines className="relative mx-auto text-coral" size={30} />
        <h2 className="relative mt-5 font-display text-[clamp(38px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
          Your next ten Shorts
          <br />
          are already filmed.
        </h2>
        <div className="relative mt-9 flex flex-col items-center gap-3">
          <DownloadButton big />
          <span className="inline-flex items-center gap-1.5 text-[13px] text-dim"><Check size={13} /> No account · No watermark · No credits</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 px-6 py-8 text-[13px] text-dim md:flex-row">
        <div className="flex items-center gap-2.5">
          <img src="/icon.png" alt="" className="h-6 w-6 rounded-md" />
          <span>Cutdeck {release.version} · a <a href="https://mohanbuilds.space" className="text-paper hover:text-coral">Mohan Builds</a> app</span>
        </div>
        <div className="flex items-center gap-5">
          {person.links.slice(0, 3).map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="hover:text-paper">{l.label}</a>
          ))}
          <a href={`mailto:${person.email}`} className="inline-flex items-center gap-1 hover:text-paper">Contact <ArrowRight size={12} /></a>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <How />
        <Features />
        <Install />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <div className="grain" />
    </>
  );
}
