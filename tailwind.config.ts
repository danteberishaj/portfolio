import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { bg: "#e9e9e4", surface: "#deded8", ink: "#232421", muted: "#62635c", primary: "#f65a2e", dim: "#74766d", signal: "#b63713" },
    fontFamily: { display: ["var(--font-display)", "sans-serif"], sans: ["var(--font-sans)", "sans-serif"], mono: ["var(--font-mono)", "monospace"] },
  } },
  plugins: [],
};
export default config;
