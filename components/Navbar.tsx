"use client";
import { useState } from "react";
import { Arrow, Asterisk } from "./Icons";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><a href="#home" className="wordmark" aria-label="Dante Berishaj, home"><Asterisk /><span>DB<span className="wordmark-suffix">®</span></span></a><nav aria-label="Main navigation" className={open ? "main-nav is-open" : "main-nav"}>{[{ name: "Work", href: "#work" }, { name: "About", href: "#about" }, { name: "Contact", href: "#contact" }].map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.name}</a>)}</nav><a href="#contact" className="header-contact">Let’s make it happen <Arrow diagonal /></a><button className="menu-toggle" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button></header>;
}
