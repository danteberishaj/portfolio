"use client";
import { useState } from "react";
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
const EMAIL = "hello@example.com";

export function Approach() {
  return <section id="about" className="approach" data-scene="about">
    <div className="screen-stage sticky">
      <div className="projected">
        <h2>Good design is<br />good <span>development.</span></h2>
        <p>I work in the space between an idea and how it feels to use. Every transition, every detail, every line of code is part of the experience.</p>
      </div>
      <div className="slot" data-slot="about" />
    </div>
    <div className="page-width approach-body">
      <div className="capability-list">
        {capabilities.map((item, i) => <details key={item.title} className="capability-disclosure" open={i === 0}>
          <summary><span>{item.title}</span><Icon name="plus" /></summary>
          <div className="capability-body"><p>{item.copy}</p><div>{item.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
        </details>)}
      </div>
      <div className="about-footnote">
        <p>Usually experimenting with shaders, contributing to open source, or chasing a better cup of coffee.</p>
        <div className="experience-facts"><span><b>5+</b> years</span><span><b>40+</b> projects</span><span><b>20+</b> clients</span></div>
      </div>
    </div>
  </section>;
}

export function PrivateWork() {
  return <section id="confidential" className="private-work" data-scene="private">
    <div className="screen-stage sticky">
      <div className="projected">
        <h2>Some work<br />stays <span>between us.</span></h2>
        <p>Selected collaborations under NDA.<br />The details are private. The impact isn’t.</p>
      </div>
      <div className="slot" data-slot="private" />
    </div>
    <div className="page-width private-body">
      {privateWork.map((item) => <details className="private-disclosure" key={item.title}>
        <summary><span>{item.title}</span><span className="private-role">{item.role}</span><Icon name="plus" /></summary>
        <div className="private-detail"><p>{item.detail}</p><span>{item.result}</span></div>
      </details>)}
    </div>
  </section>;
}

export function Closing() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  return <section id="contact" className="closing" data-scene="contact">
    <div className="screen-stage">
      <div className="projected">
        <a className="closing-title" href={`mailto:${EMAIL}`}><h2>Let’s make<br /><span>an impression.</span></h2><span className="closing-arrow"><Icon name="arrow-up-right" /></span></a>
      </div>
      <div className="slot" data-slot="contact" data-eye="4" data-house="1" />
    </div>
    <div className="page-width closing-body">
      <div className="contact-row">
        <p>Available for new collaborations.<br />Thoughtful ideas deserve thoughtful execution.</p>
        <div className="contact-address">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <button onClick={copyEmail}>{copied ? "Copied" : "Copy email"}</button>
          <span role="status">{copyError ? "Please select the address to copy it." : copied ? "Copied to clipboard." : ""}</span>
        </div>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} Dante Berishaj</span>
        <span>Built with curiosity. Next.js / Three.js / WebGL</span>
        <a href="/?still">Still version</a>
        <a href="#home">Back to top <Icon name="arrow-up-right" /></a>
      </footer>
    </div>
  </section>;
}
