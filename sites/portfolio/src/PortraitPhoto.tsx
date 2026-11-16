import { useEffect, useState } from "react";

/**
 * The hero portrait: one still photo, half Mohan and half Batman.
 * Made by `portrait-tools/compose.mjs`. The only motion is a slow glow in the
 * cowl's eye and the photo lighting up when lightning hits the page.
 */
export function PortraitPhoto() {
  const [flash, setFlash] = useState(0);
  useEffect(() => {
    const on = () => setFlash((n) => n + 1);
    window.addEventListener("gotham:lightning", on);
    return () => window.removeEventListener("gotham:lightning", on);
  }, []);

  return (
    <div className="relative h-full" style={{ aspectRatio: "1122 / 1402" }}>
      <img
        src={PortraitPhoto.src}
        alt="Mohan Yadav, half as himself and half in the cowl"
        className="h-full w-full select-none object-contain"
        draggable={false}
      />
      {/* Lightning: the same photo, brighter and colder, flashed on top. */}
      <img
        key={flash}
        src={PortraitPhoto.src}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-contain mix-blend-screen ${flash ? "portrait-flash" : "opacity-0"}`}
        draggable={false}
      />
      {/* Eye glow inside the cowl. */}
      <div
        aria-hidden
        className="portrait-eye absolute h-[3.2%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: "60.2%", top: "28%" }}
      />
    </div>
  );
}
PortraitPhoto.src = "/hero-batman.webp";
