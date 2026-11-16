import { tracks } from "@shared/content";

/** Short IC-style pin names for every tool in the stack. One tool, one pin. */
const short: Record<string, string> = {
  "Generative AI": "GENAI",
  LLMs: "LLM",
  "AI agents": "AGENT",
  "Multi-agent systems": "MAS",
  RAG: "RAG",
  "Computer vision": "CV",
  Embeddings: "EMBED",
  "Vector search": "VSRCH",
  "Prompt engineering": "PRMPT",
  "Speech recognition": "STT",
  "Image recognition": "IMGR",
  "OpenAI API": "OPENAI",
  "Anthropic API": "ANTHR",
  "Gemini API": "GEMINI",
  Ollama: "OLLAMA",
  OpenCV: "OPENCV",
  Qdrant: "QDRANT",
  TypeScript: "TS",
  Python: "PY",
  JavaScript: "JS",
  "C++": "CPP",
  SQL: "SQL",
  React: "REACT",
  "Next.js": "NEXT",
  "Tailwind CSS": "TW",
  GSAP: "GSAP",
  "Three.js": "THREE",
  Redux: "REDUX",
  Vite: "VITE",
  "Node.js": "NODE",
  Express: "EXPR",
  FastAPI: "FAPI",
  "REST APIs": "REST",
  WebSockets: "WS",
  PostgreSQL: "PG",
  MongoDB: "MONGO",
  Redis: "REDIS",
  Firebase: "FIRE",
  Supabase: "SUPA",
  Tauri: "TAURI",
  "React Native": "RN",
  Docker: "DOCKR",
  Git: "GIT",
  GitHub: "GH",
};

export interface Pin {
  n: number;
  name: string;
  tool: string;
  group: string;
  main: boolean;
}

export const pins: Pin[] = tracks.flatMap((t) =>
  t.tools.map((tool) => ({ n: 0, name: short[tool] ?? tool.slice(0, 5).toUpperCase(), tool, group: t.label, main: !!t.highlight })),
);
pins.forEach((p, i) => (p.n = i + 1));

/** Pin ranges per group, for the pinout table. */
export const groups = (() => {
  let n = 0;
  return tracks.map((t) => {
    const from = n + 1;
    n += t.tools.length;
    return { ...t, from, to: n };
  });
})();
