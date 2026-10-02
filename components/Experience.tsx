"use client";
import useMotionPreference from "./useMotionPreference";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField, { type FieldMode } from "./ParticleField";
import ProjectGallery from "./ProjectGallery";

import Icon from "./PortfolioIcon";

const capabilities = [
  { title: "Interfaces", copy: "Fast, accessible interfaces that make complex things feel simple.", stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { title: "Motion & 3D", copy: "From a satisfying interaction to a world you can move through.", stack: ["Three.js", "WebGL", "Framer Motion", "GSAP"] },
  { title: "Systems", copy: "Considered foundations that keep design and engineering in sync.", stack: ["Design systems", "Node.js", "Figma"] },
];
const privateWork = [
  { title: "Fortune 500 FinTech", role: "Lead Frontend Engineer", detail: "Rebuilt a high-traffic trading dashboard for real-time data, cutting render latency and modernizing a legacy stack.", result: "60% faster load / 1M+ daily users" },
  { title: "Global Health Platform", role: "Full-Stack Developer", detail: "Designed a HIPAA-compliant patient portal with accessible, animated flows and offline support.", result: "WCAG AA accessibility / +35% engagement" },
  { title: "Enterprise SaaS Startup", role: "Frontend Lead", detail: "Built a themeable component library and 3D onboarding experience adopted across five product teams.", result: "5 teams / 40% fewer UI bugs" },
];

export default function Experience() {
  const [mode, setMode] = useState<FieldMode>("Flow");
  const [paused, setPaused] = useState(false);
  const [light, setLight] = useState(false);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const reduced = useMotionPreference();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored) setLight(stored === "light");
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }, [light]);
  function changeTheme() {
    setLight(!light); localStorage.setItem("portfolio-theme", light ? "dark" : "light");
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText("hello@example.com"); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }

  return <div className="experience">
    <a href="#work" className="skip-link">Skip to work</a>
    <header className="navigation">
      <a className="brand" href="#home" aria-label="Dante Berishaj, home"><span className="brand-symbol" aria-hidden><i /><i /><i /></span><span>DB<span className="brand-period">.</span></span></a>
      <span className="nav-role">Creative developer<br />Independent & curious</span>
      <nav id="mobile-links" className={menu ? "nav-links open" : "nav-links"} aria-label="Main navigation">
        <a href="#work" onClick={() => setMenu(false)}>Work</a>
        <a href="#about" onClick={() => setMenu(false)}>Approach</a>
        <a href="#contact" onClick={() => setMenu(false)}>Let’s talk <Icon name="arrow-up-right" /></a>
      </nav>
      <button className="theme-toggle" onClick={changeTheme} aria-label={light ? "Switch to dark theme" : "Switch to light theme"}><Icon name={light ? "moon" : "sun"} /></button>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-links">{menu ? "Close" : "Menu"}</button>
    </header>

    <main>
      <section id="home" ref={heroRef} className="opening">
        <ParticleField mode={mode} paused={paused || !!reduced} light={light} />
        <motion.div className="opening-title" style={reduced ? undefined : { y: heroY, opacity: heroOpacity }}>
          <h1><span>Not just seen.</span><span>Felt.</span></h1>
          <p>Creative development<br />for the way we experience the web.</p>
        </motion.div>
        <div className="opening-bottom">
          <a href="#work" className="discover-link"><span className="discover-circle"><Icon name="arrow-down" /></span><span>Discover the work</span></a>
          <div className="field-controls">
            <span className="field-hint"><span className="pointer-hint">Move your cursor. Make a little chaos.</span><span className="touch-hint">Choose a form. Make it yours.</span></span>
            <div className="field-switches" role="group" aria-label="Particle field controls">
              {(["Flow", "Orbit", "Terrain"] as FieldMode[]).map(item => <button key={item} aria-pressed={mode === item} onClick={() => setMode(item)}>{item}</button>)}
              <button className="pause-button" onClick={() => setPaused(!paused)} disabled={!!reduced} aria-label={paused ? "Play field animation" : "Pause field animation"}><Icon name={paused || reduced ? "play" : "pause"} /></button>
            </div>
          </div>
        </div>
      </section>

      <div className="practice-strip"><span>Design instinct.</span><span>Engineering discipline.</span><span className="strip-accent">A little unexpected.</span></div>
      <ProjectGallery />

      <section id="about" className="approach page-width">
        <div className="approach-heading"><h2>Good design is<br />good <span>development.</span></h2><p>I work in the space between an idea and how it feels to use. Every transition, every detail, every line of code is part of the experience.</p></div>
        <div className="capability-list">{capabilities.map((item, i) => <details key={item.title} className="capability-disclosure" open={i === 0}><summary><span>{item.title}</span><Icon name="plus" /></summary><div className="capability-body"><p>{item.copy}</p><div>{item.stack.map(tech => <span key={tech}>{tech}</span>)}</div></div></details>)}</div>
        <div className="about-footnote"><p>Usually experimenting with shaders, contributing to open source, or chasing a better cup of coffee.</p><div className="experience-facts"><span><b>5+</b> years</span><span><b>40+</b> projects</span><span><b>20+</b> clients</span></div></div>
      </section>

      <section id="confidential" className="private-work page-width">
        <div className="private-intro"><h2>Some work<br />stays <span>between us.</span></h2><p>Selected collaborations under NDA.<br />The details are private. The impact isn’t.</p></div>
        {privateWork.map(item => <details className="private-disclosure" key={item.title}><summary><span>{item.title}</span><span className="private-role">{item.role}</span><Icon name="arrow-up-right" /></summary><div className="private-detail"><p>{item.detail}</p><span>{item.result}</span><a href="#contact">Request a walkthrough <Icon name="arrow-right" /></a></div></details>)}
      </section>

      <section id="contact" className="closing page-width">
        <a className="closing-title" href="mailto:hello@example.com"><h2>Let’s make<br /><span>an impression.</span></h2><span className="closing-arrow"><Icon name="arrow-up-right" /></span></a>
        <div className="contact-row"><p>Available for new collaborations.<br />Thoughtful ideas deserve thoughtful execution.</p><div className="contact-address"><a href="mailto:hello@example.com">hello@example.com</a><button onClick={copyEmail}>{copied ? "Copied" : "Copy email"}</button><span role="status">{copyError ? "Please select the address to copy it." : copied ? "Copied to clipboard." : ""}</span></div></div>
        <footer><span>© {new Date().getFullYear()} Dante Berishaj</span><span>Built with curiosity. Next.js / Three.js / Motion</span><a href="#home">Back to top <Icon name="arrow-up-right" /></a></footer>
      </section>
    </main>
  </div>;
}
