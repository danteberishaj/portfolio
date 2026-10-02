"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function Reveal({ children, delay = 0, y = 32, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { y: [y, 0], opacity: [0.65, 1] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
