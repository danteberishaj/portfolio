"use client";

import { AnimatePresence, motion } from "framer-motion";
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

  const paginate = useCallback(
    (dir: number) => {
      setState(([prev]) => [(prev + dir + slideCount) % slideCount, dir]);
    },
    [slideCount]
  );

  useEffect(() => {
    if (paused || slideCount <= 1) return;
    const id = setInterval(() => paginate(1), interval);
    return () => clearInterval(id);
  }, [paginate, paused, interval, slideCount]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink"
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
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="skeleton flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-white/30">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.5-3.5L9 20" />
                </svg>
                <span className="text-xs uppercase tracking-widest">
                  Screenshot {index + 1}
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
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/60 group-hover:opacity-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next screenshot"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/60 group-hover:opacity-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Go to screenshot ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
