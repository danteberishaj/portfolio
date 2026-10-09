import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({ src: "../public/fonts/barlow-condensed-600.woff2", variable: "--font-display", display: "swap", weight: "600" });
const sans = localFont({ src: "../public/fonts/archivo-latin.woff2", variable: "--font-sans", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  title: "Dante Berishaj | Creative Developer",
  description: "Thoughtful interfaces, expressive motion, and creative development. Explore interactive work built with Next.js, Three.js, and WebGL.",
};
export const viewport: Viewport = { themeColor: "#0b0d0b", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
