import { motion } from "motion/react";
import type { ReactNode } from "react";
import { BatLogo } from "./BatLogo";

export function SceneHead({ n, label, title, children }: { n: string; label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-14 md:mb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mute"
      >
        <BatLogo className="h-2.5 w-6 text-signal" />
        <span className="text-signal">{n}</span>
        <span className="h-px w-10 bg-white/15" />
        {label}
      </motion.div>
      <div className="-mx-6 -my-6 overflow-hidden px-6 py-6">
        <motion.h2
          initial={{ y: "105%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(44px,7vw,104px)] font-bold uppercase leading-[0.95] tracking-[-0.045em]"
        >
          {title}
        </motion.h2>
      </div>
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-mute"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
