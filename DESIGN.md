---
name: "The Projector Room"
description: "A creative developer portfolio played as a film in a cinema at night: one screen, one beam, native scroll as the only camera move."
colors:
  ground: "#0b0d0b"
  surface: "#141714"
  surface-raised: "#1c211c"
  ink: "#edf0e7"
  muted: "#a4afa2"
  line: "rgba(255,255,255,.13)"
  celadon: "#d2e8ab"
  celadon-ink: "#172112"
  lamp: "#e9f3d6"
  nav-scrim: "rgba(11,13,11,.62)"
  seat: "#1b201b"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(52px, 6.4vw, 118px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.025em"
  intertitle:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(44px, 7vw, 132px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(40px, 3.6vw, 60px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(25px, 3.2vw, 45px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  frame: "14px"
  pill: "20px"
  tag: "24px"
  circle: "50%"
  dash: "2px"
spacing:
  nav: "72px"
  nav-mobile: "64px"
  gutter: "6vw"
  gutter-wide: "60px"
  gutter-mobile: "22px"
  stage-gutter: "4vw"
  copy-gap: "22px"
components:
  button-motion:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 15px 0 12px"
    height: "40px"
  button-icon:
    backgroundColor: "rgba(11,13,11,.5)"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "44px"
  button-copy:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "22px"
    padding: "11px 15px"
    height: "44px"
  capability-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "9px 13px"
  cta-circle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "56px"
  closing-arrow:
    backgroundColor: "{colors.celadon}"
    textColor: "{colors.celadon-ink}"
    rounded: "{rounded.circle}"
    size: "150px"
  still-slot:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.frame}"
---

# Design System: The Projector Room

## Overview

**Creative North Star: "The Projector Room"**

The portfolio is a cinema at two in the morning and the visitor is the only one in the room. One WebGL auditorium sits fixed behind the document: a projector at the back, its beam through haze and dust, a 16:10 screen, rows of seats, a faintly reflective floor. Every scene of the page lays out a 16:10 slot, and the camera is solved each frame to land the 3D screen exactly on that slot, so the document's own layout is the camera path. Scrolling is the only camera move; nothing hijacks it.

The work plays on the screen. Each project is a reel: the screen cuts to black, a light bar sweeps, and the project's real screenshots play, lighting the room with their own colour. Text sections are intertitles projected on the same screen. At the close the house lights come up celadon and the camera cranes back over the seats. The interface around the room is quiet, dark and typographic, so the screen leads.

The world replaces the earlier "Live Generative Performance" (a procedural line field with a light theme). Ink, celadon, Barlow Condensed and Archivo were kept; everything else is new. There is one theme, dark, chosen on 2026-10-09; a still version serves the same content without WebGL.

**Key Characteristics:**
- One screen, one beam, one green-black room; the slides are the only full-colour material.
- Condensed uppercase title cards for every display moment; Archivo for everything read or operated.
- Celadon used as light: accent words, the pressed state, the house lights, the closing card.
- Native scroll, sticky stages that park the camera, and a still version that keeps every token.

## Colors

A green-black room lit by one pale lamp, with celadon as the only colour the interface itself owns.

### Primary
- **Celadon** (#d2e8ab): the accent word in every title card, the pressed dot, the "Let's talk" link, the focus ring, text selection, the closing card's arrow disc and the house lights. It is a light source, never a fill behind body text.
- **Celadon Ink** (#172112): text and the arrow on celadon surfaces.

### Secondary
- **Lamp** (#e9f3d6): the projector's light. The blank screen's lamp vignette, the beam, the dust and the title glow (`text-shadow: 0 0 46px rgba(233,243,214,.22)`) are all this colour; the screen's area light takes each slide's average colour instead while a reel plays.

### Neutral
- **Ground** (#0b0d0b): page background, fog colour, floor and canvas clear colour.
- **Surface** (#141714) and **Surface Raised** (#1c211c): the still version's screen slot, hover fills on controls.
- **Ink** (#edf0e7): all primary text, the first line of every title card, control glyphs (icons are inverted to ink with a filter).
- **Muted** (#a4afa2): descriptions, categories, captions, footnotes, footer.
- **Line** (rgba(255,255,255,.13)): every border, divider and outlined control.
- **Nav Scrim** (rgba(11,13,11,.62)): the navigation's blurred backdrop, masked to fade out over its lower 28%.
- **Seat** (#1b201b): seat backs in the room, with cushions one step darker (#171c17).

### Named Rules
**The Light, Not Paint Rule.** Celadon and the lamp appear only where light would fall: an accent word, a pressed state, a focus ring, the house lights, the closing disc. No celadon panels, bars or backgrounds behind reading text.

**The Slide Colour Rule.** Project screenshots are shown at their own colour: decoded to linear in the screen shader, no tone mapping, a lens vignette of at most 18% at the corners. The room borrows the slide's average colour for its light; the slide never borrows the room's.

## Typography

**Display Font:** Barlow Condensed 600 (self-hosted, with sans-serif fallback)
**Body Font:** Archivo (self-hosted variable, 100–900)

**Character:** Condensed uppercase title cards against a quiet, slightly tight grotesque. The display face shouts once per scene; Archivo does everything that is read, labelled or pressed.

### Hierarchy
- **Display** (600, clamp(52px, 6.4vw, 118px), line-height .9, tracking -.025em, uppercase): the hero title card, two lines, the second line celadon at 1.34em. Mobile: clamp(34px, 11.5vw, 60px) with the second line at 1.4em.
- **Intertitle** (600, clamp(44px, 7vw, 132px), line-height .9, uppercase): "Selected perspectives.", "Good design is good development.", "Some work stays between us.", two lines with the accent inline; mobile clamp(40px, 12.5vw, 72px). The closing card uses clamp(40px, 4.6vw, 88px) and stays on two lines at desktop.
- **Title** (600, clamp(40px, 3.6vw, 60px), line-height .9, tracking -.02em, uppercase): project names, balanced wrapping; 48px at 1024, 44px on mobile.
- **Headline** (Archivo 500, clamp(25px, 3.2vw, 45px), tracking -.03em): capability disclosure summaries; private-work summaries at 21px (18px at 1024, 17px mobile).
- **Body** (400, 14px, 1.6): project descriptions (46ch measure), disclosure bodies (16px in capabilities, 14px in private work), contact lines. Projected paragraphs under intertitles: clamp(13px, 1.05vw, 16px) in ink with a 24px dark text shadow.
- **Label** (400, 12px): slide captions with tabular figures, "Behind the project", nav links at 13px, the motion toggle, footer at 12px (11px mobile). Categories 15px muted, tags and footnotes 11px.

### Named Rules
**The Title Card Rule.** Barlow Condensed appears only as a title card: hero, intertitles, project names and the closing. Always uppercase, never more than two lines, the accent word inline.

**The Two Voices Rule.** No third face. Monospace, serif and system faces have no role; numbers that change use Archivo's tabular figures.

## Layout

The document is the script and its slots are the camera path. Every scene renders a 16:10 `slot`; its width sets how close the camera parks:

- Hero: `min(58vw, 124svh)`, centred, the title projected inside it; one line of description and the "See the work" action sit bottom-left.
- Work intertitle, approach and private work: `min(78vw, 131svh)`, so the screen edges and the first seat row stay in frame.
- Project chapters (desktop, over 1024px): the copy column (`minmax(240px, 1fr)`) beside the screen, which grows from 58vw by 0.8vw per chapter, capped at `1.6 * (100svh - 170px)` so the walk down the aisle is visible on 900px and 768px tall viewports. Each chapter is 130svh tall with a sticky 100svh stage padded `nav + 1svh` on top and 4vw at the sides; the stage parks the camera for 30svh while the copy is read.
- Project chapters (768 to 1024px): stacked, slot `min(62vw + 0.4vw per chapter, 1.6 * (100svh - 390px))`, copy in two columns below.
- Project chapters (under 768px): stacked and not sticky, slot 92vw, copy in one column.
- Contact: `min(50vw, 72svh)` with the eye raised to 4m and the house lights up, so the camera cranes back over the seats.

Containers: content caps at 1480px with a 6vw gutter (60px over 1600px, 22px under 768px). Navigation is fixed at 72px (64px mobile). Section bodies breathe with svh units (approach 4svh/14svh, private 4svh/16svh). Breakpoints: 1600, 1024, 767, 370.

## Elevation & Depth

Depth is the room. The DOM is flat: no card shadows, no borders beyond 1px lines. The three-dimensional cues come from the scene itself (exponential fog at 0.026, the beam, seat rows receding, a floor reflection on the desktop tier) and from two fixed lens overlays: a radial vignette to rgba(4,6,4,.62) at the corners and a 7% overlay film grain painted at runtime. The navigation floats on a 12px blur of the room. The still version gives its screen slot one soft fall (`box-shadow: 0 40px 90px -50px #000`) because there is no room behind it.

### Named Rules
**The Flat Script Rule.** Nothing in the DOM is elevated. If something needs to feel in front of something else, it is the screen, the beam or the house lights doing it.

## Shapes

The 16:10 rectangle is the only large shape; it is the screen in every scene and the still frame in the still version (14px radius there, square in the room because the screen is a surface, not a card). Small controls are pills (20px to 24px) or circles (44px, 56px, the 150px closing disc). Slide dots are 3px dashes with 2px ends, growing to 1.86x when pressed. Rules are single pixels at 13% white; no boxes around text.

## Components

### Navigation
- **Style:** fixed, 72px, DB. brand at 28px/700 with the celadon period and the three-bar mark; links at 13px, "Let's talk" in celadon with an arrow icon; hover turns a link celadon. Mobile: 64px, a text "Menu/Close" button and a full-width link row on a 96% ground scrim.
- **Motion toggle:** an outlined 40px pill with a pause/play icon and the word "Pause"/"Play"; `aria-pressed`; hover fills surface-raised; icon only on mobile.

### Slide controls
- **Caption:** 12px, "01 / 09" in ink with tabular figures, the slide's caption after it; `aria-live="polite"`.
- **Dots:** one 32x44px button per slide, a 14px dash that scales to 26px and turns celadon when pressed; compact 20px buttons with 8px dashes over eight slides.
- **Arrows:** 44px circles with a line border on a half-transparent ground; the previous arrow is the next icon flipped.

### Disclosures
- **Behind the project:** 12px summary row between two 1px lines, max 280px, plus icon rotating 45° when open, body 12px muted.
- **Capabilities:** `headline` summaries between 1px lines, celadon when open; the body is a two-column grid of a 16px paragraph and outlined tags (`capability-tag`).
- **Private work:** 21px summaries in a title / role / icon grid; the detail shows the paragraph and the celadon result line.

### Title cards (projected text)
- **Style:** centred inside the slot, uppercase display face, the first line ink and the accent inline in celadon, a 46px lamp glow behind; in the theater they flicker on a 5.3s stepped cycle and fade in with the camera (opacity follows the slot's presence), and they ride the screen's pointer parallax through `--px` / `--py`.
- **Hero:** two block lines with a 900ms clip-path reveal (70ms delay on the second line) that ends fully open so the glow is never clipped.

### Actions
- **See the work:** a 56px outlined circle with a down arrow beside a 13px label; hover fills the circle and drops it 5px.
- **Closing card:** the title beside a celadon 150px disc carrying a dark arrow; hover rotates the disc 45°.
- **Contact row:** the address at clamp(19px, 2.4vw, 35px) with a 1px line underline, a "Copy email" outlined pill (44px tall) and a status line below; footer at 12px with a "Still version" link.

### Still frame
The still version mounts no canvas. Each project slot becomes a surface-coloured 14px frame with the real images filling it (350ms crossfade, instant under reduced motion); hero and intertitle slots show a radial lamp from #262b25 to surface. Everything else is identical.

### Motion grammar
Press feedback scales to .97 over 160ms; colours and fills transition over 200ms; hover transforms over 300ms; all hover rules sit behind `(hover: hover) and (pointer: fine)`. The shared curves are `--ease-out` cubic-bezier(.23, 1, .32, 1) and `--ease-in-out` cubic-bezier(.77, 0, .175, 1). In the room: a reel change fades out over 180ms, sweeps for 300ms and fades in over 400ms; a slide cut crossfades over 250ms with an 18% dip; the curtain lifts over 900ms once the first frame renders; pointer parallax and sway are damped, and the Pause control freezes drift, flicker and dust while the camera keeps following scroll. Reduced motion, missing WebGL, a lost context or `/?still` switch to the still version.

## Do's and Don'ts

### Do:
- **Do** lay out every new scene as a 16:10 slot; the camera will frame it. Set its width to decide how close the camera parks.
- **Do** set every display moment in Barlow Condensed 600 uppercase, on at most two lines, with the accent word inline in celadon.
- **Do** keep text off a playing slide: title cards own the screen only while the screen is blank.
- **Do** keep hover behind the fine-pointer query, press feedback at .97 / 160ms, and every control at 44px or larger.
- **Do** make every token work in the still version before adding it to the room.

### Don't:
- **Don't** add a light theme or a theme toggle; the world is one dark room.
- **Don't** put celadon or the lamp behind reading text, or use gradient text, eyebrows, kickers, offset shadows or glyph icons.
- **Don't** animate layout properties in the DOM; transform, opacity and clip-path only.
- **Don't** hijack scroll, pin with a library, or let any essential information live only in the canvas.
- **Don't** tone-map or tint the slides; the screenshots are the only full-colour material and stay faithful.
