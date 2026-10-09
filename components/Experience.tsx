"use client";
import dynamic from "next/dynamic";
import Chapters from "./Chapters";
import Grain from "./Grain";
import Nav from "./Nav";
import Icon from "./PortfolioIcon";
import { Approach, Closing } from "./Sections";
import { useTheater } from "./theater/store";
import useStillMode from "./useStillMode";

const Theater = dynamic(() => import("./theater/Theater"), { ssr: false });

/** The page. The DOM is the script in reading order; the theater canvas, when it runs, is the camera behind it. */
export default function Experience() {
  const mode = useStillMode();
  const ready = useTheater((state) => state.ready);
  const still = mode === "still";
  const curtain = mode === "pending" || (mode === "theater" && !ready);
  return <div className="experience" data-mode={mode}>
    <a href="#work" className="skip-link">Skip to work</a>
    {mode === "theater" && <Theater />}
    <Nav motion={mode === "theater"} />
    <main className="script">
      <section id="home" className="hero" data-scene="hero">
        <div className="screen-stage">
          <div className="projected"><h1><span>Not just seen.</span><span>Felt.</span></h1></div>
          <div className="slot" data-slot="hero" />
        </div>
        <div className="hero-foot">
          <p>Creative development<br />for the way we experience the web.</p>
          <a href="#work" className="cta"><span className="cta-circle"><Icon name="arrow-down" /></span><span>See the work</span></a>
        </div>
      </section>
      <Chapters still={still} />
      <Approach />
      <Closing />
    </main>
    <div className="vignette" aria-hidden />
    {mode === "theater" && <Grain />}
    <div className="curtain" data-open={!curtain || undefined} aria-hidden />
  </div>;
}
