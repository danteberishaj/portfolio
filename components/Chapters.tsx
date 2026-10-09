"use client";
import Icon from "./PortfolioIcon";
import StillFrame from "./StillFrame";
import { projects, shotsOf, type Project } from "./projects";
import { theater, useTheater } from "./theater/store";

const pad = (n: number) => String(n).padStart(2, "0");

/** The work: an intertitle, then one chapter per project. Each chapter owns a 16:10 slot the camera frames. */
export default function Chapters({ still }: { still: boolean }) {
  return <section id="work" className="work">
    <section className="intertitle" data-scene="work-title">
      <div className="screen-stage sticky">
        <div className="projected"><h2>Selected<br /><span>perspectives.</span></h2><p>Different challenges.<br />The same attention to every detail.</p></div>
        <div className="slot" data-slot="work-title" />
      </div>
    </section>
    {projects.map((project, i) => <ProjectChapter key={project.kind} project={project} index={i} still={still} />)}
  </section>;
}

function ProjectChapter({ project, index, still }: { project: Project; index: number; still: boolean }) {
  const shots = shotsOf(project);
  const slide = useTheater((state) => state.slides[index]);
  const count = shots.length;
  const shot = shots[slide];
  const go = (n: number) => theater.setSlide(index, ((n % count) + count) % count);
  return <article className={`chapter chapter-${project.kind}`} id={`project-${project.kind}`} data-scene={`p${index}`}>
    <div className="stage">
      <div className="slot" data-slot={`p${index}`}>{still && <StillFrame project={index} shots={shots} />}</div>
      <div className="chapter-copy">
        <div className="chapter-title">
          <h3>{project.title}</h3>
          <p className="chapter-category">{project.category}</p>
          <p className="chapter-tags">{project.tags.join(" / ")}</p>
        </div>
        <div className="chapter-body">
          <p>{project.detail}</p>
          {project.link && <a className="case-link" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel ?? "Visit the site"} <Icon name="arrow-up-right" /><span className="visually-hidden"> (opens in a new tab)</span></a>}
          <details className="project-details"><summary>Behind the project <Icon name="plus" /></summary><p>{project.behind}</p></details>
          <span className="case-footnote">{project.footnote}</span>
        </div>
        <div className="chapter-controls">
          <span className="shots-caption" aria-live="polite"><b>{pad(slide + 1)}</b> / {pad(count)} <span>{shot.caption}</span></span>
          {!still && <p className="visually-hidden">{shot.alt}</p>}
          <div className="shots-dots" data-compact={count > 8 || undefined} role="group" aria-label="Choose a screenshot">
            {shots.map((item, i) => <button key={item.src} aria-pressed={slide === i} aria-label={item.caption} onClick={() => go(i)} />)}
          </div>
          <div className="shots-arrows">
            <button onClick={() => go(slide - 1)} aria-label="Previous screenshot"><Icon name="arrow-right" className="flip" /></button>
            <button onClick={() => go(slide + 1)} aria-label="Next screenshot"><Icon name="arrow-right" /></button>
          </div>
        </div>
      </div>
    </div>
  </article>;
}
