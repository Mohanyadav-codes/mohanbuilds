import { useState } from "react";
import { Loader } from "./Loader";
import { Cursor } from "./Cursor";
import { Devices, Footer, Hero, Notes, Order, Pinout, Specs, TopBar } from "./Sections";

export function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <div className="paper grain min-h-screen">
      {loading && <Loader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />}
      <Cursor />
      <TopBar />
      <main>
        <Hero ready={ready} />
        <Pinout />
        <Devices />
        <Notes />
        <Specs />
        <Order />
      </main>
      <Footer />
    </div>
  );
}
