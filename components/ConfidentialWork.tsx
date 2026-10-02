"use client";
import Reveal from "./Reveal";
import { Arrow } from "./Icons";
const projects = [
  { client: "Fortune 500 FinTech", role: "Lead Frontend Engineer", challenge: "Rebuilt a high-traffic trading dashboard for real-time data, cutting render latency and modernizing a legacy stack.", impact: "60% faster load · 1M+ daily users", tags: "React / TypeScript / WebSocket" },
  { client: "Global Health Platform", role: "Full-Stack Developer", challenge: "Designed a HIPAA-compliant patient portal with accessible, animated flows and offline support.", impact: "WCAG AA accessibility · +35% engagement", tags: "Next.js / Node.js / PostgreSQL" },
  { client: "Enterprise SaaS Startup", role: "Frontend Lead", challenge: "Built a themeable component library and 3D onboarding experience adopted across five product teams.", impact: "Adopted by 5 teams · 40% fewer UI bugs", tags: "Three.js / Storybook / Design Systems" },
];
export default function ConfidentialWork() {
  return <section id="confidential" className="private-section section-shell"><div className="private-heading"><h2>Good work.<br /><span>Quietly shipped.</span></h2><p>Some projects stay behind closed doors. Here’s the impact, without the confidential details.</p></div><div className="private-list">{projects.map(project => <Reveal key={project.client}><article className="private-row"><div><span className="nda-label">Under NDA</span><h3>{project.client}</h3><p className="private-role">{project.role}</p></div><div><p>{project.challenge}</p><p className="private-tags">{project.tags}</p></div><p className="private-impact">{project.impact}</p></article></Reveal>)}</div><a className="text-link" href="#contact">Let’s talk through the details <Arrow diagonal /></a></section>;
}
