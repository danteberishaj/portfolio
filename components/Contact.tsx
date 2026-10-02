"use client";
import { useState } from "react";
import { Arrow, Asterisk } from "./Icons";
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyEmail() {
    try { await navigator.clipboard.writeText("hello@example.com"); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  return <section id="contact" className="contact-section section-shell"><div className="contact-top"><span><i /> Available for new projects</span><Asterisk /></div><h2>Have something<br />in <em>mind?</em><a href="mailto:hello@example.com" aria-label="Email me about a project"><Arrow diagonal /></a></h2><div className="contact-bottom"><p>Let’s make something<br />people want to spend time with.</p><div className="email-contact"><a href="mailto:hello@example.com">hello@example.com</a><button onClick={copyEmail}>{copied ? "Copied" : "Copy email"}</button><span role="status" className="copy-status">{copyError ? "Please select the email address to copy it." : copied ? "Email address copied." : ""}</span></div></div><footer><span>© {new Date().getFullYear()} Dante Berishaj</span><span>Made with intention. Next.js / Three.js / Motion</span><a href="#home">Back to top <Arrow /></a></footer></section>;
}
