/** The bat emblem. `oval` adds the classic yellow ellipse behind it. */
export const BAT_PATH =
  "M100 32 L106 14 L111 33 C120 34 132 26 140 14 C160 22 185 30 198 50 C186 52 176 58 172 70 C165 62 152 62 146 70 C140 62 128 62 124 74 C116 72 106 80 100 96 C94 80 84 72 76 74 C72 62 60 62 54 70 C48 62 35 62 28 70 C24 58 14 52 2 50 C15 30 40 22 60 14 C68 26 80 34 89 33 L94 14 Z";

export function BatLogo({
  className = "",
  oval = false,
  fill = "currentColor",
  ovalFill = "#e5141b",
}: {
  className?: string;
  oval?: boolean;
  fill?: string;
  ovalFill?: string;
}) {
  return (
    <svg viewBox={oval ? "-14 -22 228 150" : "0 8 200 92"} className={className} aria-hidden>
      {oval && <ellipse cx="100" cy="53" rx="112" ry="72" fill={ovalFill} stroke="#0a0a0a" strokeWidth="6" />}
      <path d={BAT_PATH} fill={oval ? "#0a0a0a" : fill} transform={oval ? "translate(100 53) scale(0.86) translate(-100 -53)" : undefined} />
    </svg>
  );
}
