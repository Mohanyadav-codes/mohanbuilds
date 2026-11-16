import { useState } from "react";
import { GraphLine, Palette, TopBar } from "./Chrome";
import { Branches, Deps, Footer, Hero, Log, Push, Readme } from "./Sections";

export function App() {
  const [palette, setPalette] = useState(false);
  return (
    <div className="grain">
      <TopBar onPalette={() => setPalette(true)} />
      <main className="relative mx-auto max-w-[1400px] px-5 md:pl-[88px] md:pr-8">
        <GraphLine />
        <Hero />
        <Branches />
        <Log />
        <Deps />
        <Readme />
        <Push />
        <Footer />
      </main>
      <Palette open={palette} setOpen={setPalette} />
    </div>
  );
}
