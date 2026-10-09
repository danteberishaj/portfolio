"use client";
import { useState } from "react";
import Icon from "./PortfolioIcon";
import { theater, useTheater } from "./theater/store";

export default function Nav({ motion }: { motion: boolean }) {
  const [menu, setMenu] = useState(false);
  const paused = useTheater((state) => state.paused);
  return <header className="navigation">
    <a className="brand" href="#home" aria-label="Dante Berishaj, home" onClick={() => setMenu(false)}>
      <span className="brand-symbol" aria-hidden><i /><i /><i /></span>
      <span>DB<span className="brand-period">.</span></span>
    </a>
    <nav id="site-links" className={menu ? "nav-links open" : "nav-links"} aria-label="Main navigation">
      <a href="#work" onClick={() => setMenu(false)}>Work</a>
      <a href="#about" onClick={() => setMenu(false)}>Approach</a>
      <a href="#contact" onClick={() => setMenu(false)}>Let’s talk <Icon name="arrow-up-right" /></a>
    </nav>
    {motion && <button className="motion-toggle" onClick={() => theater.setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Play the room's motion" : "Pause the room's motion"}>
      <Icon name={paused ? "play" : "pause"} /><span>{paused ? "Play" : "Pause"}</span>
    </button>}
    <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="site-links">{menu ? "Close" : "Menu"}</button>
  </header>;
}
