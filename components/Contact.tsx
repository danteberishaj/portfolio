"use client";

import Reveal from "@/components/Reveal";

const socials = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "Dribbble", href: "#" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      {/* Glow backdrop */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-accent2">
            Get in touch
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Let&apos;s build something
            <br />
            <span className="text-gradient">unforgettable</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-lg text-white/60">
            Have a project in mind or just want to say hi? My inbox is always
            open.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <a
            href="mailto:hello@example.com"
            className="mt-10 inline-block rounded-full bg-gradient-to-r from-accent to-accent2 px-8 py-4 text-base font-medium text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105"
          >
            hello@example.com
          </a>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-sm text-white/55 transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <footer className="mx-auto mt-24 max-w-6xl border-t border-white/10 pt-8 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Your Name. Built with Next.js & Three.js.
      </footer>
    </section>
  );
}
