"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";

// Three.js is client-only — load the canvas without SSR.
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: text drifts up and fades as you scroll past the hero.
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden"
    >
      {/* 3D background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* Gradient vignette so text stays readable */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0a0a0f_85%)]" />

      <motion.div
        style={{ y, opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-20 flex flex-col items-center px-6 text-center"
      >
        <motion.span
          variants={item}
          className="mb-5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur"
        >
          Creative Developer
        </motion.span>

        <motion.h1
          variants={item}
          className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          Building <span className="text-gradient">immersive</span>
          <br />
          web experiences
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base text-white/60 md:text-lg"
        >
          I design and develop interactive interfaces where motion, 3D, and
          performance meet. Scroll to explore my work.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap justify-center gap-4">
          <a
            href="#work"
            className="rounded-full bg-gradient-to-r from-accent to-accent2 px-7 py-3 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/5"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        aria-label="Scroll down"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1.5">
          <motion.div
            className="h-2 w-1 rounded-full bg-white/70"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.a>
    </section>
  );
}
