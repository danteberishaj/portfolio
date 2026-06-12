import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Name — Portfolio",
  description:
    "Creative developer building immersive web experiences with Next.js and Three.js.",
  openGraph: {
    title: "Your Name — Portfolio",
    description:
      "Creative developer building immersive web experiences with Next.js and Three.js.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
