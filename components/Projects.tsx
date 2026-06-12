"use client";

import Reveal from "@/components/Reveal";
import ProjectSlideshow from "@/components/ProjectSlideshow";
import { motion } from "framer-motion";

type Project = {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  // Add screenshot paths here later, e.g. ["/projects/aurora-1.png", ...]
  images?: string[];
  placeholderCount?: number;
};

const projects: Project[] = [
  {
    title: "Aurora Commerce",
    description:
      "A headless e-commerce storefront with a 3D product viewer and instant search. Built for speed and conversion.",
    tags: ["Next.js", "Three.js", "Stripe"],
    link: "#",
    placeholderCount: 3,
  },
  {
    title: "Nebula Dashboard",
    description:
      "Real-time analytics dashboard with animated data visualizations and a fully themeable design system.",
    tags: ["React", "D3", "WebSocket"],
    link: "#",
    placeholderCount: 4,
  },
  {
    title: "Pulse Mobile App",
    description:
      "Cross-platform fitness app with gesture-driven UI, offline sync, and a custom motion language.",
    tags: ["React Native", "GSAP", "Supabase"],
    link: "#",
    placeholderCount: 3,
  },
  {
    title: "Lumen Studio Site",
    description:
      "Award-style agency website featuring scroll-triggered storytelling and WebGL transitions.",
    tags: ["Next.js", "WebGL", "Framer Motion"],
    link: "#",
    placeholderCount: 3,
  },
];

export default function Projects() {
  return (
    <section
      id="work"
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <Reveal>
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-accent2">
          Selected work
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          Projects I&apos;m <span className="text-gradient">proud</span> of.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-xl text-white/55">
          Screenshots are placeholders for now — drop your real images into{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-accent2">
            /public/projects
          </code>{" "}
          and list them in each project.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.1} y={60}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col gap-5"
            >
              <ProjectSlideshow
                title={project.title}
                images={project.images}
                placeholderCount={project.placeholderCount}
              />
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-sm text-accent2 transition-colors hover:text-white"
                    >
                      View →
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
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
    </section>
  );
}
