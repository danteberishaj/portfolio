"use client";
import { useState } from "react";
import { Asterisk } from "./Icons";
const capabilities = [
  { name: "Interfaces that feel right.", detail: "Fast, accessible interfaces with a considered detail in every interaction.", skills: "Next.js · React · TypeScript · Tailwind CSS" },
  { name: "Motion with a purpose.", detail: "From a small moment of feedback to an immersive 3D world. Movement that makes an experience make sense.", skills: "Three.js · WebGL · Framer Motion · GSAP" },
  { name: "Built to go further.", detail: "Reusable systems that bring design and engineering together, and leave room for the next big idea.", skills: "Node.js · Design Systems · Figma" },
];
export default function About() {
  const [active, setActive] = useState(0);
  return <section id="about" className="about-section section-shell"><div className="about-intro"><div className="about-mark"><Asterisk /></div><h2>A developer’s mind.<br /><span>A designer’s eye.</span></h2><div className="about-copy"><p>I’m a creative developer who lives at the intersection of design and engineering. I craft fast, accessible web experiences — from expressive marketing sites to full-blown 3D product configurators.</p><p>Off the clock? Experimenting with shaders, contributing to open source, or chasing the perfect cup of coffee.</p><div className="experience-line"><span><strong>5+</strong> years</span><span><strong>40+</strong> projects</span><span><strong>20+</strong> clients</span></div></div></div><div className="capabilities">{capabilities.map((item, i) => <div key={item.name} className={`capability ${active === i ? "active" : ""}`}><h3><button aria-expanded={active === i} aria-controls={`capability-${i}`} onClick={() => setActive(active === i ? -1 : i)}>{item.name}<span aria-hidden>{active === i ? "−" : "+"}</span></button></h3><div id={`capability-${i}`} className="capability-content" hidden={active !== i}><p>{item.detail}</p><p className="skills">{item.skills}</p></div></div>)}</div></section>;
}
