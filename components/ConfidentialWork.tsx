"use client";

import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";

type ConfidentialProject = {
  /** Anonymized label — describe the client by industry/size, never by name. */
  client: string;
  role: string;
  /** What you were brought in to solve, said generically. */
  challenge: string;
  /** Anonymized, NDA-safe outcomes. Round/relative numbers are fine. */
  impact: { value: string; label: string }[];
  tags: string[];
};

const projects: ConfidentialProject[] = [
  {
    client: "Fortune 500 FinTech",
    role: "Lead Frontend Engineer",
    challenge:
      "Rebuilt a high-traffic trading dashboard for real-time data, cutting render latency and modernizing a legacy stack.",
    impact: [
      { value: "60%", label: "Faster load" },
      { value: "1M+", label: "Daily users" },
    ],
    tags: ["React", "TypeScript", "WebSocket"],
  },
  {
    client: "Global Health Platform",
    role: "Full-Stack Developer",
    challenge:
      "Designed a HIPAA-compliant patient portal with accessible, animated flows and offline support.",
    impact: [
      { value: "WCAG AA", label: "Accessibility" },
      { value: "+35%", label: "Engagement" },
    ],
    tags: ["Next.js", "Node.js", "PostgreSQL"],
  },
  {
    client: "Enterprise SaaS Startup",
    role: "Frontend Lead",
    challenge:
      "Built a themeable component library and 3D onboarding experience adopted across five product teams.",
    impact: [
      { value: "5 teams", label: "Adopted by" },
      { value: "−40%", label: "UI bugs" },
    ],
    tags: ["Three.js", "Storybook", "Design Systems"],
  },
];

function RedactedVisual() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#15151f] to-[#1d1d2b]">
      {/* Blurred faux-UI so the card reads as "real work, hidden" */}
      <div className="absolute inset-0 scale-105 blur-md select-none p-4">
        <div className="mb-3 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-2/3 rounded bg-accent/40" />
          <div className="h-2 w-1/2 rounded bg-white/20" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-accent2/30" />
            <div className="h-10 rounded bg-white/10" />
          </div>
          <div className="h-2 w-3/4 rounded bg-white/15" />
          <div className="h-2 w-2/3 rounded bg-white/10" />
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/40 backdrop-blur-[1px]">
        <div className="rounded-full border border-white/15 bg-white/5 p-3">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="text-white/80"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">
          Confidential
        </span>
      </div>
    </div>
  );
}

export default function ConfidentialWork() {
  return (
    <section
      id="confidential"
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <Reveal>
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-accent2">
          Under NDA
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          Confidential work I <span className="text-gradient">can&apos;t</span>{" "}
          fully show.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-xl text-white/55">
          Some of my best work lives behind NDAs. Here&apos;s the impact without
          the confidential details — happy to walk through more in a private
          conversation.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.client} delay={i * 0.1} y={60}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass flex h-full flex-col gap-5 rounded-2xl p-5"
            >
              <RedactedVisual />

              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent2">
                    NDA
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {project.client}
                  </h3>
                </div>
                <p className="mt-1 text-xs font-medium text-accent2">
                  {project.role}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                  {project.challenge}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                  {project.impact.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-lg font-bold text-gradient">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-white/50">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/60">
            Want a deeper look? I can share more under a mutual NDA or in a live
            walkthrough.
          </p>
          <a
            href="#contact"
            className="shrink-0 rounded-full bg-gradient-to-r from-accent to-accent2 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-transform hover:scale-105"
          >
            Request a walkthrough
          </a>
        </div>
      </Reveal>
    </section>
  );
}
