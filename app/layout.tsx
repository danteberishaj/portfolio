import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({ src: "../public/fonts/barlow-condensed-600.woff2", variable: "--font-display", display: "swap", weight: "600" });
const sans = localFont({ src: "../public/fonts/archivo-latin.woff2", variable: "--font-sans", display: "swap", weight: "100 900" });
const mono = localFont({ src: "../public/fonts/jetbrains-mono-latin.woff2", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Your Name | Creative Developer",
  description: "Thoughtful interfaces, expressive motion, and creative development. Explore interactive work built with Next.js, Three.js, and WebGL.",
};
export const viewport: Viewport = { themeColor: "#101310" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
    <script type="application/json" id="design-direction" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      thesis: "A cinematic digital performance. The interface itself is the portfolio proof.",
      world: "Ink black, pale celadon, condensed Barlow lettering and Archivo text; no chrome sculpture or orange fields.",
      story: "Shape a flowing field, explore large interactive project scenes, understand the developer, start a conversation.",
      firstViewport: "Full-bleed procedural line field, oversized condensed typography anchored left, small description, controls along the bottom.",
      form: "Live generative performance canvas, candidate 6, seed 7e1533bb. User delegated a wholly new direction.",
      motion: "Pointer-reactive canvas, three simulation modes, CSS sticky project layering, interruptible state feedback. Reduced-motion and offscreen suspension."
    }) }} />{children}</body></html>;
}
