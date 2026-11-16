import { useState } from "react";
import { GraphLine, Palette, TopBar } from "./Chrome";
import { Loader } from "./Loader";
import { Branches, Deps, Hero, Log, Push, Readme, Signal } from "./Sections";

export function App() {
  const [palette, setPalette] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <div className="grain">
      {loading && <Loader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />}
      <TopBar onPalette={() => setPalette(true)} />
      <main className="relative mx-auto max-w-[1400px] px-5 md:pl-[88px] md:pr-8">
        <GraphLine />
        <Hero ready={ready} />
        <Branches />
        <Log />
        <Deps />
        <Readme />
        <Push />
      </main>
      <Signal />
      <Palette open={palette} setOpen={setPalette} />
    </div>
  );
}
