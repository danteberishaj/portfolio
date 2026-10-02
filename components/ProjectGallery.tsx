"use client";
import useMotionPreference from "./useMotionPreference";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./PortfolioIcon";

type Project = {
  title: string;
  fullName: string;
  category: string;
  detail: string;
  tags: string[];
  kind: "geo" | "vocis" | "fjale" | "offday" | "geoapp" | "canna" | "chrx" | "incentiv";
  /** Public URL of the shipped project, when one exists. */
  link?: string;
  /** Label for the live link, e.g. "Play it live" or "Visit the site". */
  linkLabel?: string;
  /** Copy for the "Behind the project" disclosure. */
  behind: string;
  footnote: string;
};

const projects: Project[] = [
  { title: "Geo Guesser", fullName: "Geo Guesser", category: "Where in the world are you?", detail: "A browser game that drops you onto a random street somewhere on Earth. Explore the view, drop a pin on the map, and get scored on how close you landed. Five rounds, closest guess wins.", tags: ["Vue", "Mapillary", "MapLibre"], kind: "geo", link: "https://geo-guesser-rouge.vercel.app/", linkLabel: "Play it live", behind: "Street-level imagery is streamed through the Mapillary viewer, the guess map runs on MapLibre with OpenFreeMap tiles, and each round reveals the true location with a line drawn to your guess. Built with Vue and Vite, deployed on Vercel.", footnote: "Shipped project / Production screenshots" },
  { title: "vocisXultra", fullName: "vocisXultra Foundation", category: "Voices from beyond.", detail: "Landing page for the vocisXultra Foundation, a non-profit choir founded in Prishtina. One long, editorial page introduces the ensemble, a repertoire spanning six centuries, the season, and a booking enquiry form, in English, Albanian, and German.", tags: ["Next.js", "React", "Trilingual"], kind: "vocis", link: "https://vocis-xultra.vercel.app/", linkLabel: "Visit the site", behind: "Built with Next.js and deployed on Vercel. Each language lives on its own route (en, sq, de) with hreflang alternates for search engines, the hero photograph is served responsively through the Next image pipeline, and the booking form collects everything needed to quote a concert.", footnote: "Shipped project / Production screenshots" },
  { title: "FJALË", fullName: "FJALË", category: "An Albanian word, every day.", detail: "A daily word game for the Albanian language in the spirit of Wordle. Five tiles, six guesses, and all 36 letters of the alphabet, with digraphs like SH and RR filling a single tile. Hints, an honour mode, an alphabet passport, and stats with no account.", tags: ["Vanilla JS", "PWA", "Albanian"], kind: "fjale", link: "https://www.xn--fjal-opa.com/", linkLabel: "Play today’s word", behind: "Hand-written JavaScript modules with no framework, served as an installable progressive web app on the internationalised domain fjalë.com. Light and dark themes follow the system, the word lists are preloaded to cut cold-start latency, and streaks, stats, and an archive calendar live on the device with no account and no tracking.", footnote: "Shipped project / Production screenshots" },
  { title: "Offday", fullName: "Offday", category: "Time off, without the back-and-forth.", detail: "A SaaS product for managing a team’s time off: one shared calendar, requests with one-click approvals, balances that count working days, shifts with cover suggestions, holidays, Excel export, and a workspace assistant. Shown here from the marketing page through to the manager’s workspace.", tags: ["Next.js", "React", "SaaS"], kind: "offday", behind: "A complete product rather than a mockup: the marketing site and the application share one Next.js codebase. Each company’s data lives in an isolated workspace, passwords are salted and hashed with scrypt, sessions use HTTP-only cookies, and sign-in has cross-site request checks and rate limits. A request’s private note is visible only to the requester and their managers. Offday is still in development, so there is no public link yet.", footnote: "In development / Product screenshots" },
  { title: "Geo Guesser World 3D!", fullName: "Geo Guesser World 3D!", category: "The world, in your pocket.", detail: "The Android edition of Geo Guesser, published on Google Play. Five-round challenges with street-level exploration, a world-map pin, and distance-based scoring. No account required, and on tablets the guess map fits the whole world to the screen.", tags: ["Android", "Google Play", "Mobile"], kind: "geoapp", link: "https://play.google.com/store/apps/details?id=com.snaxxtech.geoguesser&hl=en", linkLabel: "Get it on Google Play", behind: "Published under SnaxxGames with a PEGI 3 rating. The images here are the store listing’s own screenshots, composed for this page. The latest release made saved progress safer on phones that start slowly and stopped the guess map from repeating on wide screens.", footnote: "Shipped app / Google Play listing" },
  { title: "GoodCannaNow", fullName: "GoodCannaNow patient booking", category: "Patient intake, made simple.", detail: "A booking and intake flow for medical cannabis certification in Louisiana, built for GoodCannaNow on the Vianova Connect platform. Patients say whether they are new or renewing, enter identity and address details, upload an ID, complete a medical intake, and give consent, all in one guided form.", tags: ["Nuxt", "Vue", "Healthcare"], kind: "canna", link: "https://app.goodcannanow.com/goodcannanow/", linkLabel: "Open the booking flow", behind: "Built with Nuxt on Vianova Connect. The app ships a strict content security policy and HSTS, allows payment tokenisation only through Stripe and BlueSnap, and submits patient information encrypted in transit. Required fields, matching email and phone confirmation, and a photo ID upload keep certifications from being rejected at the dispensary.", footnote: "Shipped project / Production screenshots" },
  { title: "CannaHealRx", fullName: "CannaHealRx appointment booking", category: "Book an evaluation in minutes.", detail: "Online appointment booking for CannaHealRx, a telehealth clinic for medical cannabis certification in several US states. Patients pick their state, choose a date and time, complete a patient intake with ID upload, and pay, in three guided steps.", tags: ["Nuxt", "Vue", "Telehealth"], kind: "chrx", link: "https://app.cannahealrx.com/cannahealrx/book/", linkLabel: "Open the booking flow", behind: "Built with Nuxt on the same booking platform as GoodCannaNow, with the same content security policy, HSTS, and Stripe and BlueSnap tokenisation. Available dates and times load per state, a chosen slot is held for twenty minutes while the patient completes the intake, and each qualifying condition in the questionnaire carries its ICD-10 code.", footnote: "Shipped project / Production screenshots" },
  { title: "Incentiv Portal", fullName: "Incentiv Portal", category: "Onchain, without the friction.", detail: "The web portal for Incentiv, an EVM Layer 1 built around native account abstraction. Sign in with a passkey, MetaMask, or WalletConnect, reconnect a returning account, or recover a wallet from its recovery phrase, then land on a dashboard with rewards to claim.", tags: ["Next.js", "React", "Web3"], kind: "incentiv", link: "https://portal.incentiv.io/", linkLabel: "Open the portal", behind: "Built with Next.js. Sign-in is wallet based rather than password based: passkeys, MetaMask, or WalletConnect, with a separate quick path for returning accounts and a two-step wallet recovery that warns people never to paste another wallet’s seed phrase. Only the public screens are shown here, since the dashboard sits behind sign-in. The last five slides show incentiv.io, the network’s public site, for context.", footnote: "Shipped project / Public screens" },
];

type Shot = { src: string; alt: string; caption: string };
type ShotTheme = { tone: "dark" | "light"; bg: string; ink: string; muted: string; accent: string; frame: string; line: string; dot: string };

const geoTheme: ShotTheme = { tone: "dark", bg: "#111827", ink: "#e5ecf6", muted: "#9fb0c7", accent: "#5eead4", frame: "#0b1120", line: "#ffffff14", dot: "#ffffff38" };
const fjaleTheme: ShotTheme = { tone: "dark", bg: "#0e0d0b", ink: "#f3efe6", muted: "#a39d91", accent: "#d9961a", frame: "#161411", line: "#ffffff14", dot: "#ffffff38" };
const offdayTheme: ShotTheme = { tone: "dark", bg: "#171214", ink: "#f6eef1", muted: "#a8979d", accent: "#f2899f", frame: "#100c0e", line: "#ffffff14", dot: "#ffffff38" };
const cannaTheme: ShotTheme = { tone: "light", bg: "#e8efe9", ink: "#15231a", muted: "#5a6b5f", accent: "#2e7d4f", frame: "#ffffff", line: "#15231a18", dot: "#15231a33" };
const chrxTheme: ShotTheme = { tone: "light", bg: "#e6ebf4", ink: "#121a2e", muted: "#56617a", accent: "#2f7de1", frame: "#ffffff", line: "#121a2e18", dot: "#121a2e33" };
const incentivTheme: ShotTheme = { tone: "dark", bg: "#161614", ink: "#f3f1ec", muted: "#a39f96", accent: "#f26419", frame: "#0d0d0c", line: "#ffffff14", dot: "#ffffff38" };
const vocisTheme: ShotTheme = { tone: "light", bg: "#e9eef4", ink: "#141a24", muted: "#5b6675", accent: "#0e5a8a", frame: "#ffffff", line: "#141a2418", dot: "#141a2433" };

const geoShots: Shot[] = [
  { src: "/projects/geoguesser-1.jpg", alt: "Geo Guesser start screen explaining the five-round game, with a Play button.", caption: "Start a game" },
  { src: "/projects/geoguesser-2.jpg", alt: "A street-level view of a city block with a small world map in the corner and a round counter at the top.", caption: "Explore the street" },
  { src: "/projects/geoguesser-3.jpg", alt: "The world map expanded over the street view, with a guess pin placed in Europe and a Make guess button.", caption: "Drop a pin" },
  { src: "/projects/geoguesser-4.jpg", alt: "Result map drawing a dashed line from the guess to Helsinki, scoring 1,097 points for a guess 3,033 km away.", caption: "See how close you were" },
];

const vocisShots: Shot[] = [
  { src: "/projects/vocis-1.jpg", alt: "vocisXultra home page: the headline Voices from beyond over a bright, glass-walled rehearsal hall with a grand piano.", caption: "Welcome" },
  { src: "/projects/vocis-2.jpg", alt: "The Singers section: a grid of portrait photographs of ensemble members with their names and voice parts.", caption: "Meet the ensemble" },
  { src: "/projects/vocis-3.jpg", alt: "Repertoire section listing eras from Renaissance to Baroque with composers and date ranges.", caption: "Six centuries of repertoire" },
  { src: "/projects/vocis-4.jpg", alt: "Past events shown as three photo cards for Opening Night, Six Centuries, and Summer Residency, above a booking enquiry form.", caption: "Events and bookings" },
  { src: "/projects/vocis-5.jpg", alt: "The same home page in Albanian, with the headline Zëra nga përtej and translated navigation.", caption: "In three languages" },
];

const fjaleShots: Shot[] = [
  { src: "/projects/fjale-1.jpg", alt: "FJALË board mid-game with three guesses. Green, gold, and grey tiles mark letters in place, elsewhere, or absent, above an on-screen Albanian keyboard.", caption: "Guess the word" },
  { src: "/projects/fjale-2.jpg", alt: "How-to-play dialog explaining the tile colours and noting that Albanian has 36 letters, with digraphs filling one tile.", caption: "How to play" },
  { src: "/projects/fjale-3.jpg", alt: "Alphabet passport dialog: a grid of all 36 Albanian letters, collected one per daily word.", caption: "Alphabet passport" },
  { src: "/projects/fjale-4.jpg", alt: "Statistics dialog with streak, best streak, games played, win rate, guess distribution, and an archive calendar.", caption: "Stats and archive" },
  { src: "/projects/fjale-5.jpg", alt: "The same mid-game board rendered in the light theme.", caption: "Light theme" },
];

const offdayShots: Shot[] = [
  { src: "/projects/offday-1.jpg", alt: "Offday marketing page hero: the headline Time off, without the back-and-forth, two call-to-action buttons, and a preview of the team calendar.", caption: "Landing page" },
  { src: "/projects/offday-2.jpg", alt: "The old way section contrasting a broken spreadsheet, a chat thread, and a forwarded email with a clean Offday card listing who is out on Friday.", caption: "The problem" },
  { src: "/projects/offday-3.jpg", alt: "How it works in three steps: create your workspace, add your team by email, then request, approve, done.", caption: "How it works" },
  { src: "/projects/offday-4.jpg", alt: "Features grid: a shared calendar with department filter, balances that skip weekends, clear roles, overlap detection, and private notes.", caption: "Features" },
  { src: "/projects/offday-5.jpg", alt: "Privacy and security section showing who can see a request’s private note, with cards for isolated workspaces, hashed passwords, and real sessions.", caption: "Privacy and security" },
  { src: "/projects/offday-6.jpg", alt: "Pricing section: one plan at ten dollars a month for up to 25 people, with a slider that recalculates the price per person.", caption: "Pricing" },
  { src: "/projects/offday-7.jpg", alt: "The team calendar inside the app for October 2026, with colour-coded time off per person and a Needs your attention panel of pending requests.", caption: "Team calendar" },
  { src: "/projects/offday-8.jpg", alt: "The Make room for a break modal: team member, type of time off, first and last day, a working-day count, and an optional note.", caption: "Request time off" },
  { src: "/projects/offday-9.jpg", alt: "Requests screen with tabs for all, pending, approved, and declined, a search box, month filter, Excel export, and approve and decline actions per row.", caption: "Requests and approvals" },
  { src: "/projects/offday-10.jpg", alt: "Shifts screen: a weekly grid of morning, evening, and weekend shifts per employee, with days off marked and gaps that need cover.", caption: "Shifts" },
  { src: "/projects/offday-11.jpg", alt: "Employees screen listing eight people with department, annual allowance, vacation remaining, and a default shift selector.", caption: "Employees" },
  { src: "/projects/offday-12.jpg", alt: "The Offday assistant panel open over the calendar, offering suggested questions like Who is off today and What’s pending.", caption: "Workspace assistant" },
  { src: "/projects/offday-13.jpg", alt: "My profile screen with personal details and a card showing 25 vacation days available for the year.", caption: "Profile and balance" },
  { src: "/projects/offday-14.jpg", alt: "The team calendar in the light theme.", caption: "Light theme" },
];

const geoappShots: Shot[] = [
  { src: "/projects/geoapp-1.jpg", alt: "Geo Guesser World 3D! app icon, a smiling globe with a map pin, beside a phone showing the game’s start screen.", caption: "On Google Play" },
  { src: "/projects/geoapp-2.jpg", alt: "Three phone screenshots: a street-level view, the world map with a guess pin, and a result screen showing the distance and points.", caption: "Explore, guess, score" },
  { src: "/projects/geoapp-3.jpg", alt: "Two tablet screenshots of the game, with the guess map fitting the whole world to the wider screen.", caption: "On tablets" },
];

const cannaShots: Shot[] = [
  { src: "/projects/canna-1.jpg", alt: "GoodCannaNow booking page: a welcome header and the first questions asking whether the patient is new or renewing and whether they are waiting at the dispensary.", caption: "Welcome and patient type" },
  { src: "/projects/canna-2.jpg", alt: "Personal information section with name, email and phone confirmation, date of birth, ID number, and a government photo ID upload.", caption: "Personal information" },
  { src: "/projects/canna-3.jpg", alt: "Address section with street, city, state, zip code, and unit fields.", caption: "Address" },
  { src: "/projects/canna-4.jpg", alt: "Medical intake form with a qualifying condition selector and a series of yes or no health questions.", caption: "Medical intake" },
  { src: "/projects/canna-5.jpg", alt: "Review and consent section with the terms acceptance checkbox, an encryption notice, and a Save and Continue button.", caption: "Review and consent" },
];

const chrxShots: Shot[] = [
  { src: "/projects/chrx-1.jpg", alt: "CannaHealRx booking page with a three-step tracker for Book Time, Patient Info, and Payment, and a State of Certification dropdown.", caption: "Schedule your evaluation" },
  { src: "/projects/chrx-2.jpg", alt: "The state dropdown open, listing Virginia, Ohio, Michigan, Louisiana, and Pennsylvania.", caption: "Choose a state" },
  { src: "/projects/chrx-3.jpg", alt: "Date strip for the week with Friday 2 October selected and a grid of five-minute appointment slots, the first one highlighted.", caption: "Pick a date and time" },
  { src: "/projects/chrx-4.jpg", alt: "Patient Info step with a twenty-minute countdown, new or renewing choice, and the personal information fields.", caption: "Patient information" },
  { src: "/projects/chrx-5.jpg", alt: "Questionnaire section listing qualifying medical conditions with ICD-10 codes and yes or no health questions.", caption: "Medical questionnaire" },
  { src: "/projects/chrx-6.jpg", alt: "ID and medical record upload boxes, a source question, and the terms acceptance checkbox above Back and Next buttons.", caption: "Uploads and consent" },
];

const incentivShots: Shot[] = [
  { src: "/projects/incentiv-1.jpg", alt: "Incentiv Portal sign-in card with Passkey, MetaMask, and WalletConnect buttons, links to reconnect or recover a wallet, and a preview of the dashboard.", caption: "Sign in" },
  { src: "/projects/incentiv-2.jpg", alt: "The returning-user sign-in card titled Sign in with, offering the same three options plus links to create a new account or recover a wallet.", caption: "Welcome back" },
  { src: "/projects/incentiv-3.jpg", alt: "Step one of two of wallet recovery: a recovery phrase field with a red warning never to enter another wallet’s secret phrase.", caption: "Recover a wallet" },
  { src: "/projects/incentiv-4.jpg", alt: "incentiv.io hero with the headline Build. Incentivize. Settle. beside a pink poodle mascot wearing a neon visor.", caption: "incentiv.io" },
  { src: "/projects/incentiv-5.jpg", alt: "Built for Onchain Participation section with a small orange robot and spinning rings of blocks.", caption: "Built for onchain participation" },
  { src: "/projects/incentiv-6.jpg", alt: "Incentives Power the Economy section with the robot feeding a glowing token into a machine.", caption: "Incentives power the economy" },
  { src: "/projects/incentiv-7.jpg", alt: "The Next Expansion section about agents, with the robot plugged into a glowing cable.", caption: "The next expansion" },
  { src: "/projects/incentiv-8.jpg", alt: "The World Grows section, a close-up of the robot’s visor reading Transacting 100 dollars to John.", caption: "The world grows" },
];

function ScreenshotStudy({ shots, theme, note }: { shots: Shot[]; theme: ShotTheme; note: string }) {
  const [index, setIndex] = useState(0);
  const reduced = useMotionPreference();
  const count = shots.length;
  const shot = shots[index];
  const vars = { "--shot-bg": theme.bg, "--shot-ink": theme.ink, "--shot-muted": theme.muted, "--shot-accent": theme.accent, "--shot-frame": theme.frame, "--shot-line": theme.line, "--shot-dot": theme.dot } as CSSProperties;
  return <div className="study study-shots" data-tone={theme.tone} style={vars}>
    <div className="shots-frame">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={shot.src} className="shots-image" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : .35 }}>
          <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1480px) 55vw, 820px" />
        </motion.div>
      </AnimatePresence>
    </div>
    <div className="shots-controls">
      <span className="shots-caption" aria-live="polite"><b>{String(index + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")} <span>{shot.caption}</span></span>
      <div className="shots-dots" data-compact={count > 8 || undefined} role="group" aria-label="Choose a screenshot">{shots.map((item, i) => <button key={item.src} aria-pressed={index === i} aria-label={item.caption} onClick={() => setIndex(i)} />)}</div>
      <div className="shots-arrows">
        <button onClick={() => setIndex((index - 1 + count) % count)} aria-label="Previous screenshot"><Icon name="arrow-right" className="flip" /></button>
        <button onClick={() => setIndex((index + 1) % count)} aria-label="Next screenshot"><Icon name="arrow-right" /></button>
      </div>
    </div>
    <span className="study-note">{note}</span>
  </div>;
}

const GeoStudy = () => <ScreenshotStudy shots={geoShots} theme={geoTheme} note="Production screenshots / Browse the rounds" />;
const FjaleStudy = () => <ScreenshotStudy shots={fjaleShots} theme={fjaleTheme} note="Production screenshots / Browse the game" />;
const OffdayStudy = () => <ScreenshotStudy shots={offdayShots} theme={offdayTheme} note="Product screenshots / Browse the product" />;
const GeoAppStudy = () => <ScreenshotStudy shots={geoappShots} theme={geoTheme} note="Store listing screenshots / Browse the app" />;
const CannaStudy = () => <ScreenshotStudy shots={cannaShots} theme={cannaTheme} note="Production screenshots / Browse the flow" />;
const ChrxStudy = () => <ScreenshotStudy shots={chrxShots} theme={chrxTheme} note="Production screenshots / Browse the flow" />;
const IncentivStudy = () => <ScreenshotStudy shots={incentivShots} theme={incentivTheme} note="Public screens / Browse the portal and site" />;
const VocisStudy = () => <ScreenshotStudy shots={vocisShots} theme={vocisTheme} note="Production screenshots / Browse the page" />;

const studies = { geo: GeoStudy, vocis: VocisStudy, fjale: FjaleStudy, offday: OffdayStudy, geoapp: GeoAppStudy, canna: CannaStudy, chrx: ChrxStudy, incentiv: IncentivStudy };

export default function ProjectGallery() {
  return <section id="work" className="work page-width">
    <div className="work-heading"><h2>Selected<br /><span>perspectives.</span></h2><div><p>Different challenges.<br />The same attention to every detail.</p><a href={`#project-${projects[0].kind}`}>Explore the collection <Icon name="arrow-down" /></a></div></div>
    <div className="project-stack">{projects.map(project => {
      const Study = studies[project.kind];
      return <article className={`case-study case-${project.kind}`} id={`project-${project.kind}`} key={project.kind}>
        <div className="case-copy">
          <span className="case-category">{project.tags.join(" / ")}</span>
          <h3>{project.title}<span>{project.category}</span></h3>
          <p>{project.detail}</p>
          {project.link && <a className="case-link" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel ?? "Visit the site"} <Icon name="arrow-up-right" /><span className="visually-hidden"> (opens in a new tab)</span></a>}
          <details className="project-details"><summary>Behind the project <Icon name="plus" /></summary><p>{project.behind}</p></details>
          <span className="case-footnote">{project.footnote}</span>
        </div>
        <div className="case-art"><Study /></div>
      </article>;
    })}</div>
  </section>;
}
