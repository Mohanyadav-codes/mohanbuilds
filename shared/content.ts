// Everything the sites say about Mohan and the studio lives here.
// To launch a new product: add it to `products`, then build its own site under sites/.

export const person = {
  name: "Mohan Yadav",
  handle: "Mohan Builds",
  role: "Full-stack AI engineer",
  study: "B.Tech, 3rd year · Delhi Technological University",
  city: "New Delhi",
  since: "Writing code since class 9",
  line: "I build AI tools that run on your own machine, and make videos about building them.",
  email: "yadavmohanhere@gmail.com",
  links: [
    { label: "YouTube", handle: "@Mohan.Builds", url: "https://www.youtube.com/@Mohan.Builds" },
    { label: "X", handle: "@Mohan_Yadav___", url: "https://x.com/Mohan_Yadav___" },
    { label: "Instagram", handle: "@mohan.builds", url: "https://www.instagram.com/mohan.builds/" },
    { label: "GitHub", handle: "Mohanyadav-codes", url: "https://github.com/Mohanyadav-codes" },
    { label: "LinkedIn", handle: "mohan-yadav-dev", url: "https://www.linkedin.com/in/mohan-yadav-dev/" },
  ],
};

export interface Product {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  url: string;
  status: "live" | "soon";
  platforms: string[];
  price: string;
  accent: string;
  accent2: string;
}

export const products: Product[] = [
  {
    id: "cutdeck",
    name: "Cutdeck",
    tagline: "Long videos in. Shorts out.",
    blurb: "Paste a YouTube link. Cutdeck finds the moments worth posting, frames them for vertical and adds captions, on your own computer.",
    url: "https://cutdeck.mohanbuilds.com",
    status: "live",
    platforms: ["Windows"],
    price: "Free",
    accent: "#FF5A4E",
    accent2: "#FFB547",
  },
];

export interface Project {
  name: string;
  kind: string;
  blurb: string;
  points: string[];
  stack: string[];
  url: string;
  team?: boolean;
  hue: number;
}

export const projects: Project[] = [
  {
    name: "Gito",
    kind: "AI agent · RAG",
    blurb: "Paste a GitHub link and talk to the codebase.",
    points: ["Pulls any repo from a link", "Hybrid RAG over the code", "Chat UI and a terminal CLI"],
    stack: ["Python", "RAG", "React"],
    url: "https://github.com/Mohanyadav-codes/Gito---Github-repo-partner",
    hue: 22,
  },
  {
    name: "Vision Attendance",
    kind: "Computer vision",
    blurb: "Face-recognition attendance that can't be fooled by someone walking past.",
    points: ["State machine: detected → confirmed → present", "Tracks people who step out of frame", "React admin panel, Flask API, live MJPEG"],
    stack: ["Python", "OpenCV", "Flask", "React"],
    url: "https://github.com/Mohanyadav-codes/Computer-Vision-AI-attendance-system",
    hue: 190,
  },
  {
    name: "Research Agent",
    kind: "LLM agent · search",
    blurb: "Describe a problem; get the papers that matter from 250M+ on OpenAlex.",
    points: ["LLM maps your words to research terms", "Evidence quotes verified against abstracts", "Every API call costed in the UI"],
    stack: ["JavaScript", "LLMs", "OpenAlex"],
    url: "https://github.com/Kuldeep-ux-cell/Research-Agent",
    team: true,
    hue: 265,
  },
  {
    name: "Jester AI",
    kind: "AI agent",
    blurb: "An agent that does dark work, in the funniest way possible.",
    points: ["Agent with a personality", "Humour by design"],
    stack: ["AI agents", "LLMs"],
    url: "https://github.com/Mohanyadav-codes/Jester-AI",
    hue: 300,
  },
  {
    name: "API Ninja",
    kind: "Developer tool",
    blurb: "A fast, dark API testing client in the browser.",
    points: ["Any method, live status and latency", "One-click JSON copy", "Built for speed"],
    stack: ["React", "Tailwind"],
    url: "https://github.com/Mohanyadav-codes/API-Ninja",
    hue: 150,
  },
];

export interface Track {
  id: string;
  label: string;
  tools: string[];
  highlight?: boolean;
}

export const tracks: Track[] = [
  {
    id: "A1",
    label: "AI",
    highlight: true,
    tools: [
      "Generative AI",
      "LLMs",
      "AI agents",
      "Multi-agent systems",
      "RAG",
      "Computer vision",
      "Embeddings",
      "Vector search",
      "Prompt engineering",
      "Speech recognition",
      "Image recognition",
      "OpenAI API",
      "Anthropic API",
      "Gemini API",
      "Ollama",
      "OpenCV",
      "Qdrant",
    ],
  },
  { id: "V1", label: "Languages", tools: ["TypeScript", "Python", "JavaScript", "C++", "SQL"] },
  { id: "V2", label: "Frontend", tools: ["React", "Next.js", "Tailwind CSS", "GSAP", "Three.js", "Redux", "Vite"] },
  { id: "V3", label: "Backend", tools: ["Node.js", "Express", "FastAPI", "REST APIs", "WebSockets"] },
  { id: "V4", label: "Data", tools: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "Supabase"] },
  { id: "V5", label: "Apps & ops", tools: ["Tauri", "React Native", "Docker", "Git", "GitHub"] },
];
