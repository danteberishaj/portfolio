"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type ProjectSlideshowProps = {
  /**
   * Screenshot paths (e.g. "/projects/app-1.png"). Drop your real images into
   * /public/projects and list them here. Leave empty to show placeholders.
   */
  images?: string[];
  /** Number of placeholder slides to render when no images are provided. */
  placeholderCount?: number;
  title: string;
  interval?: number;
};

export default function ProjectSlideshow({
  images = [],
  placeholderCount = 3,
  title,
  interval = 3500,
}: ProjectSlideshowProps) {
  const slideCount = images.length > 0 ? images.length : placeholderCount;
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const paginate = useCallback(
    (dir: number) => {
      setState(([prev]) => [(prev + dir + slideCount) % slideCount, dir]);
    },
    [slideCount]
  );

  // Don't autoplay for reduced-motion users; arrows and dots still work.
  useEffect(() => {
    if (paused || reduced || slideCount <= 1) return;
    const id = setInterval(() => paginate(1), interval);
    return () => clearInterval(id);
  }, [paginate, paused, reduced, interval, slideCount]);

  const variants = {
    enter: (dir: number) =>
      reduced
        ? { opacity: 0 }
        : { x: dir > 0 ? "100%" : "-100%", opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: (dir: number) =>
      reduced
        ? { opacity: 0 }
        : { x: dir > 0 ? "-100%" : "100%", opacity: 0 },
  };

  return (
    <div
      className="frame-ticks group relative aspect-[16/10] w-full overflow-hidden rounded-md border border-ink/10 bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 260, damping: 32 },
            opacity: { duration: 0.3 },
          }}
          className="absolute inset-0"
        >
          {images.length > 0 ? (
            <Image
              src={images[index]}
              alt={`${title} screenshot ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <div className="skeleton flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-muted/50">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.5-3.5L9 20" />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
                  Frame {String(index + 1).padStart(2, "0")} /{" "}
                  {String(slideCount).padStart(2, "0")}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {slideCount > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous screenshot"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-sm border border-ink/15 bg-bg/60 p-2 text-ink opacity-0 backdrop-blur transition-opacity hover:border-primary/50 hover:text-primary group-hover:opacity-100 focus-visible:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next screenshot"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-sm border border-ink/15 bg-bg/60 p-2 text-ink opacity-0 backdrop-blur transition-opacity hover:border-primary/50 hover:text-primary group-hover:opacity-100 focus-visible:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Segment indicators */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Go to screenshot ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-primary" : "w-3 bg-ink/30 hover:bg-ink/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
