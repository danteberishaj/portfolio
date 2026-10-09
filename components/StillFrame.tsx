"use client";
import Image from "next/image";
import type { Shot } from "./projects";
import useMotionPreference from "./useMotionPreference";
import { useTheater } from "./theater/store";

/** The still version of a project's screen: the real images in a 16:10 frame with a short crossfade. */
export default function StillFrame({ project, shots }: { project: number; shots: Shot[] }) {
  const index = useTheater((state) => state.slides[project]);
  const reduced = useMotionPreference();
  return <div className="still-frame" data-reduced={reduced || undefined}>
    {shots.map((shot, i) => <div key={shot.src} className="still-image" data-active={index === i || undefined} aria-hidden={index !== i || undefined}>
      <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 767px) 92vw, 62vw" priority={project === 0 && i === 0} />
    </div>)}
  </div>;
}
