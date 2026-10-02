"use client";
import useMotionPreference from "./useMotionPreference";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Icon from "./PortfolioIcon";

const ProductObject = dynamic(() => import("./ProductObject"), { ssr: false });

const projects = [
  { title: "Aurora", fullName: "Aurora Commerce", category: "Commerce, in another dimension.", detail: "A headless e-commerce storefront with a 3D product viewer and instant search. Built for speed and conversion.", tags: ["Next.js", "Three.js", "Stripe"], kind: "aurora" },
  { title: "Nebula", fullName: "Nebula Dashboard", category: "A clearer picture of the complex.", detail: "Real-time analytics with animated data visualizations and a fully themeable design system.", tags: ["React", "D3", "WebSocket"], kind: "nebula" },
  { title: "Pulse", fullName: "Pulse Mobile App", category: "An interface that keeps up.", detail: "Cross-platform fitness app with gesture-driven UI, offline sync, and a custom motion language.", tags: ["React Native", "GSAP", "Supabase"], kind: "pulse" },
  { title: "Lumen", fullName: "Lumen Studio Site", category: "A studio with something to say.", detail: "An expressive agency website featuring scroll-triggered storytelling and WebGL transitions.", tags: ["Next.js", "WebGL", "Framer Motion"], kind: "lumen" },
];

function CommerceStudy() {
  const [color, setColor] = useState(0);
  return <div className="study study-commerce">
    <span className="study-wordmark">aurora</span>
    <div className="commerce-object"><ProductObject color={["#a6b29b", "#292e29", "#d3c5b2"][color]} /></div>
    <div className="commerce-label"><span>Less noise.<br />More possibility.</span><div className="material-swatches" role="group" aria-label="Product material">{["Sage", "Graphite", "Sand"].map((name, i) => <button key={name} onClick={() => setColor(i)} aria-pressed={color === i} aria-label={name}><i style={{background:["#a6b29b","#292e29","#d3c5b2"][i]}} /></button>)}</div></div>
    <span className="study-note">Live 3D concept / Change the material</span>
  </div>;
}

function DataStudy() {
  const [period, setPeriod] = useState(0);
  const [selected, setSelected] = useState(7);
  const values = period ? [34, 52, 47, 68, 59, 78, 68, 92] : [22, 35, 30, 48, 43, 58, 52, 74];
  return <div className="study study-data">
    <div className="data-top"><span>nebula</span><div className="period-toggle">{["Week", "Month"].map((label, i) => <button key={label} aria-pressed={period === i} onClick={() => setPeriod(i)}>{label}</button>)}</div></div>
    <div className="data-value"><span>Activity, at a glance.</span><strong>{values[selected]}<small>k</small></strong><span>Illustrative activity data</span></div>
    <div className="data-chart" role="group" aria-label="Explore sample activity data">{values.map((value, i) => <button key={i} onClick={() => setSelected(i)} aria-pressed={selected === i} aria-label={`Sample ${i + 1}: ${value} thousand events`}><span style={{transform:`scaleY(${value / 100})`}} /><small>{String(i+1).padStart(2,"0")}</small></button>)}</div>
    <span className="study-note">Interactive data study / Select a bar</span>
  </div>;
}

function MotionStudy() {
  const [pace, setPace] = useState(45);
  const reduced = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const waveform = "M0 80H120L145 65 170 110 195 25 225 120 255 80H330L355 65 380 110 405 25 435 120 465 80H600";
  return <div ref={ref} className="study study-pulse">
    <div className="pulse-title"><span>pulse</span><strong>Find your<br />own rhythm.</strong></div>
    <svg className="pulse-wave" viewBox="0 0 600 160" aria-hidden>
      <path d={waveform} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" opacity={reduced ? 1 : .25} />
      {!reduced && <motion.path d={waveform} pathLength={1} fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" strokeDasharray=".2 .8" animate={{strokeDashoffset:visible ? [1,0] : 0}} transition={{duration:60/(pace+60),repeat:visible ? Infinity : 0,ease:"linear"}} />}
    </svg>
    <div className="pace-control"><label htmlFor="pace">Set the pace <span>{pace + 60} BPM</span></label><input id="pace" type="range" min="10" max="85" value={pace} onChange={event => setPace(Number(event.target.value))} /><div><span>Easy</span><span>All in</span></div></div>
    <span className="study-note">Motion study / Illustrative heart rate</span>
  </div>;
}

function TypeStudy() {
  const [offset, setOffset] = useState(false);
  const reduced = useMotionPreference();
  return <div className={`study study-type ${offset ? "type-switched" : ""}`}>
    <span className="type-studio">Lumen®<br />Independent design studio</span>
    <div className="type-composition" aria-label="Make room for the unexpected">{["MAKE", "ROOM", "FOR", "MORE."].map((word,i) => <motion.span key={word} animate={{ transform: `translateX(${offset ? (i % 2 ? -18 : 28) : 0}px)` }} transition={{duration:reduced ? 0 : .5, ease:[.23,1,.32,1]}}>{word}</motion.span>)}</div>
    <button className="type-change" onClick={() => setOffset(!offset)} aria-pressed={offset}>Shift perspective <Icon name="arrow-right" /></button>
    <span className="study-note">Interactive typography study</span>
  </div>;
}

export default function ProjectGallery() {
  return <section id="work" className="work page-width">
    <div className="work-heading"><h2>Selected<br /><span>perspectives.</span></h2><div><p>Different challenges.<br />The same attention to every detail.</p><a href="#project-aurora">Explore the collection <Icon name="arrow-down" /></a></div></div>
    <div className="project-stack">{projects.map(project => <article className={`case-study case-${project.kind}`} id={`project-${project.kind}`} key={project.kind}>
      <div className="case-copy"><span className="case-category">{project.tags.join(" / ")}</span><h3>{project.title}<span>{project.category}</span></h3><p>{project.detail}</p><details className="project-details"><summary>Behind the project <Icon name="plus" /></summary><p>{project.fullName}. This interactive study demonstrates part of the interface concept. Live project links and production screenshots have not been supplied.</p></details><span className="case-footnote">Selected work / Interactive concept</span></div>
      <div className="case-art">{project.kind === "aurora" ? <CommerceStudy /> : project.kind === "nebula" ? <DataStudy /> : project.kind === "pulse" ? <MotionStudy /> : <TypeStudy />}</div>
    </article>)}</div>
  </section>;
}
