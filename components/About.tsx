"use client";

import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Three.js",
  "WebGL",
  "Framer Motion",
  "Node.js",
  "Tailwind CSS",
  "GSAP",
  "Figma",
];

const stats = [
  { value: "5+", label: "Years experience" },
  { value: "40+", label: "Projects shipped" },
  { value: "20+", label: "Happy clients" },
];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
      <Reveal>
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-accent2">
          About me
        </p>
      </Reveal>

      <div className="grid gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20">
        <div>
          <Reveal delay={0.05}>
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              I turn ideas into{" "}
              <span className="text-gradient">interactive</span> realities.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 text-base leading-relaxed text-white/65 md:text-lg">
              I&apos;m a creative developer who lives at the intersection of
              design and engineering. For the past few years I&apos;ve been
              crafting fast, accessible, and downright delightful web
              experiences — from marketing sites with buttery scroll animations
              to full-blown 3D product configurators.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
              When I&apos;m not pushing pixels you&apos;ll find me experimenting
              with shaders, contributing to open source, or chasing the perfect
              cup of coffee.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:border-accent/50 hover:text-white"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={0.1 + i * 0.1}>
              <div className="glass rounded-2xl p-6">
                <div className="text-4xl font-bold text-gradient md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/55">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
