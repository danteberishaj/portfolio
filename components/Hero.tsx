"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Arrow } from "./Icons";
const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => <div className="sculpture-fallback" aria-hidden><span /><span /><span /></div> });
export default function Hero() {
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  return <section id="home" className="hero">

    <div className="hero-composition">
      <div className="hero-copy"><h1><span>Interfaces.</span><span>With <em>feeling.</em></span></h1><p>I turn ambitious ideas into expressive digital experiences. Built with care. Made to move.</p><a className="round-link" href="#work"><span className="round-arrow"><Arrow /></span><span>Explore the work</span></a></div>
      <div className="sculpture-stage"><div className="sculpture-disc" aria-hidden /><div className="sculpture-canvas" aria-hidden><Scene expanded={expanded} paused={paused || !!reduced} /></div><div className="sculpture-caption"><span>Form follows interaction.</span><div className="sculpture-controls"><button onClick={() => setExpanded(!expanded)} aria-pressed={expanded}>{expanded ? "Bring together" : "Pull apart"}<Arrow diagonal /></button><button onClick={() => setPaused(!paused)} aria-pressed={paused} disabled={!!reduced} aria-label={paused ? "Play sculpture animation" : "Pause sculpture animation"}>{paused || reduced ? "Play" : "Pause"}</button></div></div></div>
    </div><div className="hero-bottom"><span>Independent creative developer · Frontend & motion</span><a href="#work">A little curiosity goes a long way <Arrow /></a></div>
  </section>;
}
