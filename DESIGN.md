---
name: "Projector Room"
description: "A creative developer portfolio played as a cinema at 2 a.m.: one dark auditorium, one projector beam, one 16:10 screen the work plays on."
colors:
  accent: "#d2e8ab"
  accent-ink: "#172112"
  lamp: "#e9f3d6"
  bg: "#0b0d0b"
  surface: "#141714"
  surface-raised: "#1c211c"
  ink: "#edf0e7"
  muted: "#a4afa2"
  line: "rgba(255,255,255,.13)"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(52px, 6.4vw, 118px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(44px, 7vw, 132px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(44px, 4.6vw, 72px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  frame: "14px"
  pill-control: "20px"
  pill-action: "22px"
  pill-tag: "24px"
  circle: "50%"
spacing:
  gutter: "6vw"
  gutter-wide: "60px"
  gutter-mobile: "22px"
  nav: "72px"
  nav-mobile: "64px"
  nav-gap: "34px"
  copy-gap: "40px"
  touch: "44px"
components:
  nav-link:
    textColor: "{colors.ink}"
    padding: "14px 0"
  nav-link-hover:
    textColor: "{colors.accent}"
  nav-link-contact:
    textColor: "{colors.accent}"
  motion-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill-control}"
    padding: "0 15px 0 12px"
    height: "40px"
  motion-toggle-hover:
    backgroundColor: "{colors.surface-raised}"
  hero-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "56px"
    height: "56px"
  hero-action-hover:
    backgroundColor: "{colors.surface-raised}"
  slide-arrow:
    backgroundColor: "rgba(11,13,11,.5)"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  slide-arrow-hover:
    backgroundColor: "{colors.surface-raised}"
  slide-dot:
    backgroundColor: "transparent"
    width: "32px"
    height: "44px"
  case-link:
    textColor: "{colors.accent}"
    height: "44px"
  project-disclosure:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "44px"
  project-disclosure-hover:
    textColor: "{colors.accent}"
  capability-disclosure:
    textColor: "{colors.ink}"
    padding: "27px 0"
  capability-disclosure-open:
    textColor: "{colors.accent}"
  capability-tag:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill-tag}"
    padding: "9px 13px"
  private-disclosure:
    textColor: "{colors.ink}"
    padding: "28px 0"
  private-disclosure-hover:
    textColor: "{colors.accent}"
  copy-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill-action}"
    padding: "11px 15px"
    height: "44px"
  copy-button-hover:
    backgroundColor: "{colors.surface-raised}"
  closing-arrow:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.circle}"
    width: "min(9vw, 150px)"
    height: "min(9vw, 150px)"
  still-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.frame}"
  skip-link:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    padding: "14px 20px"
---

# Design System: Projector Room

## Overview

**Creative North Star: "The Projector Room"**

The portfolio is a cinema at 2 a.m. and the visitor is the only one in the room. One WebGL auditorium sits fixed behind the document: green-black walls and seat backs, a projector at the back whose beam cuts through haze and dust, and a single 16:10 screen that the work plays on. The DOM is the script and the canvas is the camera: every word, control and image description lives in accessible HTML in reading order, each scene lays out a 16:10 slot, and the camera is solved every frame to land the 3D screen on whichever slot is nearest the focus line. Scroll is the only camera move; nothing hijacks it.

Theme: single, dark. There is no light theme and no toggle, by the owner's decision on 2026-10-09; `color-scheme` is dark and the viewport theme colour is the ground. Chroma is rationed to one hue: celadon house light marks the second line of every title card, the active control, the live link and the focus ring, while the rest of the interface is ink on a green-black ground with hairline rules. Barlow Condensed appears only as uppercase title cards on the screen; Archivo carries everything that is read rather than watched. Density is low: one idea per viewport, copy measured at 44 to 46 characters, and sections separated by whole screens of room.

This world replaces the silver/orange kinetic sculpture and the cyan cockpit identity, and retires the "Live Generative Performance" line field, its Flow/Orbit/Terrain controls and the light theme. The still version (reduced motion, no WebGL, a lost context, or `/?still`) is the same script with the same tokens: the real images in a surface-coloured 16:10 frame and no sticky layering.

**Key Characteristics:**
- One dark theme: green-black ground, screen-white ink, celadon as light rather than paint.
- Condensed uppercase title cards on a 16:10 screen; Archivo captions, rows and controls.
- Depth is literal: a fogged 3D room, a beam, a reflective floor and film grain, while the DOM stays flat.
- Native scroll drives a slot-tracking camera; slides change only by button.
- Hairline rules, 14px frames, pill controls and circular icon buttons; nothing thicker than a pixel.

## Colors

A green-black room lit by one lamp: the whole palette is a single hue family between 120° and 145° in OKLCH, from auditorium black to celadon, so every surface reads as the same material under different amounts of light.

### Primary
- **Celadon** (`accent`): the house light. The brand period and the three-bar mark, the last nav link ("Let's talk"), the second line of every title card, the open disclosure title, the active slide dot, the live case link, the private-work result, selection and the focus ring. It fills a surface only twice: the closing arrow disc and the skip link. In the room it is the colour of the ambient, hemisphere and house lights.
- **Deep Pine** (`accent-ink`): the text colour set on celadon: the skip link and selected text. The closing arrow's glyph is the unfiltered icon, which reads near-black on the disc.

### Secondary
- **Projector Lamp** (`lamp`): the beam, the dust, the lens point light and the pool on an empty screen. In the DOM it appears only as the projected title cards' text glow (`0 0 46px` at 22% alpha). It is light, never a fill.

### Neutral
- **Auditorium Black** (`bg`): the ground, the canvas clear colour, the fog, the floor, the curtain, the scrollbar track and the scrim under anything that floats over the canvas (nav at .62, mobile menu at .96, slide arrows at .5).
- **Dark Velvet** (`surface`): the still version's screen surface, with a #262b25 highlight at its centre.
- **Raised Velvet** (`surface-raised`): the hover fill of every outlined control.
- **Screen White** (`ink`): body text, titles, controls and the tint every icon is filtered to.
- **Sage Caption** (`muted`): secondary copy (descriptions, categories, tags, footnotes, captions, roles, the footer) and the hover state of an inactive dot. On the ground it holds roughly 8.6:1.
- **Hairline** (`line`): every border: the mobile menu's edge, control outlines, disclosure rows, the case link and e-mail underlines, the footer rule. The scrollbar thumb is a solid cut of the same family (#4e5a48).

The room's own materials are darker cuts of the same hue and never appear in the DOM: seat backs #1b201b and cushions #171c17, screen masking #060706, walls #0a0c0a and #0c0e0c, ceiling #090b09, projector body #0f120f with a #fff7d6 lens. The screen's area light takes the average colour of the current slide, so the only coloured light in the room is the movie.

### Named Rules
**The House Light Rule.** Celadon is light, not paint. It marks a line, an edge, an active state or a focus ring; it fills a surface only on the closing arrow and the skip link. Everything else in the interface is ink, muted or hairline on the ground.

**The Ground Scrim Rule.** Anything that floats over the live canvas is the ground colour at alpha (nav .62, menu .96, slide arrows .5), never a grey and never a white glass.

**The Lit by the Movie Rule.** Colour outside the palette enters only as the slide on the screen and the light it throws on the room; no accent, badge or tint is introduced for a project.

## Typography

**Display Font:** Barlow Condensed 600 (self-hosted `barlow-condensed-600.woff2` through `next/font/local` as `--font-display`; fallback sans-serif)
**Body Font:** Archivo, variable 100–900 (self-hosted `archivo-latin.woff2` as `--font-sans`; fallback sans-serif), used at 400, at 500 for the slide number and at 700 for the brand

**Character:** A title card and its caption. The condensed face is loud, uppercase and tightly tracked, and it is only ever projected: hero, intertitles, project titles, the closing. Archivo is the quiet, slightly tight voice of everything read off the screen, from a 45px disclosure row down to an 11px footnote.

### Hierarchy
- **Display** (600, `clamp(52px, 6.4vw, 118px)`, line-height .9, tracking -0.025em, uppercase): the hero title card, two lines; the second line is 1.34em of the first and celadon. Mobile `clamp(34px, 11.5vw, 60px)` with the second line at 1.4em; 48px at 370px.
- **Headline** (600, `clamp(44px, 7vw, 132px)`, .9, -0.025em, uppercase): intertitles on the near-full screen ("Selected perspectives.", "Good design is good development.", "Some work stays between us."). Mobile `clamp(40px, 12.5vw, 72px)`.
- **Closing line** (600, `clamp(40px, 4.6vw, 88px)`, .9, -0.025em, uppercase, unwrapped): the closing card, set beside the celadon arrow. Mobile `clamp(34px, 9.6vw, 60px)`; 40px at 370px.
- **Title** (600, `clamp(44px, 4.6vw, 72px)`, .9, -0.02em, uppercase): project titles under the screen. 48px at 1024px, 44px on mobile.
- **Row** (Archivo 400, `clamp(25px, 3.2vw, 45px)`, -0.03em): capability disclosure titles. The same voice sets the e-mail address at `clamp(19px, 2.4vw, 35px)`, the experience facts at 25px (tabular), the private-work titles at 21px (18px at 1024px, 17px on mobile) and the brand at 28px, 700, -0.04em.
- **Caption** (Archivo 400, `clamp(13px, 1.05vw, 16px)`, 1.6, ink, 44ch): the one centred paragraph under an intertitle.
- **Body** (Archivo 400, 14px, 1.6, muted): descriptions at 46ch, the hero line at 1.55 and 290px, private detail at 450px, capability copy at 16px and 390px, the footnote paragraph at 13px and 370px. The category line is 15px at -0.02em.
- **Label** (Archivo 400, 12px, normal tracking, sentence case): the motion toggle, "Behind the project" and its text, the slide counter (number at 500, tabular), roles, facts, the footer, the mobile menu button. 13px for nav links, the hero action, the case link and the private result; 11px for tags, footnotes, capability tags, the copy button and its status.

### Named Rules
**The Title Card Rule.** Barlow Condensed is only ever uppercase, only ever 600, and only ever on what the projector shows: the hero, the intertitles, the project titles and the closing. Nothing read rather than watched is set in it.

**The Second Line Rule.** Every title card is two lines and the second line is celadon. Only the hero scales its lines apart (1.34em); every other card keeps both lines one size.

**The Tight Tracking Rule.** Display and large Archivo lines are tracked between -0.02em and -0.04em. Labels keep normal tracking and sentence case; nothing is letter-spaced open, and nothing outside the title cards is uppercase.

**The Tabular Count Rule.** Numbers that change (the slide counter) or line up (the experience facts) use tabular figures.

## Layout

The page is fixed layers over a native scroll: the theater canvas (z 0, fixed, `aria-hidden`), the script (z 1, the whole document), the vignette (z 2, a radial darkening from 52% of an ellipse centred at 50% / 45% to 62% black at the edges), the film grain (z 3, 7% overlay, theater mode only), the navigation (z 10) and the curtain (z 20, ground-coloured, fading out over 900ms once the first frame has rendered or the still version is chosen). The skip link sits above all of them.

Every scene is a screen stage: one grid cell that stacks the projected text and a 16:10 slot. The camera reads every slot's rectangle each frame, weights them by presence (1 on the focus line 45% down the viewport, easing to 0 at 70% of the viewport height away) and lands the 3D screen on the blend, so slot widths are the camera's path:

- Hero `min(54vw, 112svh)` (the contract's 58% landed at 54vw).
- Chapters `min(54vw + step × 0.4vw, 1.6 × (100svh − 390px))`, step being the project index, with a lateral shift of ±1.2vw alternating per chapter: each reel parks the camera a step closer and a little to one side, so the walk down the aisle is visible. The eleventh chapter reaches 58vw.
- Intertitles, approach and private work `min(82vw, 128svh)`.
- Contact `min(50vw, 72svh)`, with the camera eye raised from 1.6 to 4 metres and the house lights at 1.
- Below 768px: hero and chapters 92vw with no shift, intertitles 96vw, contact 86vw.

Projected text sits in the slot's cell, centred, padded 4%, pointer-events off (its children on), and rides the camera's parallax through `--px` / `--py`. Its opacity follows the slot's presence (fading in between .3 and .7) so a title never pops onto a screen that is still playing a slide.

The hero is 100svh: a `1fr auto` grid with a 3svh gap, padded `nav + 1svh` on top, the gutter at the sides and 4.5svh at the bottom; the foot row (one 14px line, 290px wide, and the "See the work" action) sits bottom-left inside a 1480px span with a `clamp(40px, 8vw, 140px)` gap. Intertitles are 100svh, centred, with the nav height on top. Each chapter is 130svh with a 100svh sticky stage (`1fr auto`, 2.5svh gap, `nav + 1svh` top, 3svh bottom) so the screen holds while the copy below is read, then the camera walks to the next reel; the copy is a `1fr 1.25fr .9fr` grid (title, body, controls) with a 40px gap, two columns at 1024px with the controls spanning both, one column on mobile where the chapter stops being sticky and pads 7svh. Approach, private work and contact give the screen `100svh − nav` and then a page-width body (1480px max, gutter padding) padded 4svh above and 14 to 16svh below; the closing body pads 2svh above and ends in a footer rule 80px down (50px on mobile).

Rhythm: nav 72px (64px mobile), gutter 6vw (60px from 1600px, 22px to 767px), 34px between nav items (15px mobile), 40px between chapter columns (28px at 1024px, 20px mobile), 50px between a disclosure's copy and its tags, rows padded 27 to 28px (22 to 24px mobile), 44px minimum height on every control. Breakpoints: 1600px, 1024px, 767px, 370px; the theater additionally drops to its low tier below 900px (or when the performance monitor declines), serves 1080px textures below 768px, and in portrait switches to a 62° lens, a 44m projector throw and 18 seat rows. Anchors scroll smoothly with `scroll-padding-top` at the nav height; under reduced motion scrolling is instant.

The still version keeps the script and the tokens: slots become surface-coloured 16:10 frames with the 14px radius, chapters lose their sticky stage and pad 5svh, intertitles drop to 70svh, and the real images crossfade in the frame over 350ms (instantly under reduced motion).

## Elevation & Depth

Depth is the room's, not the interface's. The DOM is flat: no surface carries a box-shadow, no card is lifted, no panel is glass. What reads as depth is literal: exponential fog in the ground colour (density .026) swallowing the back rows, a reflective floor on the high tier (blur 400 / 120, mirror .32, mix strength 11) and a matte one on the low tier, a bloom pass on the high tier (threshold .8, intensity .35, radius .45) that lets the screen and the lens flare, the additive beam with 1,400 dust points (600 on the low tier), a fixed CSS vignette and runtime film grain over everything. The screen's area light (16 × 10, intensity 4.2 × brightness × image presence, halved when the house lights are up) throws the slide's average colour onto the seats; at the close, celadon ambient (.05 to 1.25), hemisphere (.04 to 1.64) and a 2.6 directional come up while the beam dims 85% and the dust 80%.

### Shadow Vocabulary
- **Still frame drop** (`box-shadow: 0 40px 90px -50px #000`): the still version's 16:10 frame, the only box-shadow in the system; it stands in for the room when there is no room.
- **Projected glow** (`text-shadow: 0 0 46px rgba(233,243,214,.22)`): the title cards' lamp bleed on the screen.
- **Caption shadow** (`text-shadow: 0 1px 24px rgba(0,0,0,.5)`): keeps the intertitle paragraph legible over a lit screen.
- **Vignette** (`radial-gradient(ellipse at 50% 45%, transparent 52%, rgba(4,6,4,.62) 100%)`): a fixed overlay centred on the camera's focus line.
- **Nav scrim** (`rgba(11,13,11,.62)` with `backdrop-filter: blur(12px) saturate(140%)`, masked to fade over its bottom 28%): legibility for 13px links over a moving canvas.

### Named Rules
**The Flat Script Rule.** The DOM never casts a shadow and never lifts on hover; hover is a fill (raised velvet) or a colour (celadon). Depth belongs to the room, and the still frame's drop is the one stand-in allowed when the room is absent.

**The Legibility Blur Rule.** The nav blurs because 13px links must stay readable over a live canvas, and it is masked so it fades rather than ends. No other surface blurs, and nothing blurs for decoration.

## Shapes

16:10 is the shape of the system: the screen (16 × 10 metres), every slot, the still frame, even the 16 × 10 canvas the slide's average colour is sampled from. Everything else is quiet geometry around it. Frames (the still slot) take a 14px radius and clip their contents. Small text controls are pills: 20px for the motion toggle, 22px for the copy button, 24px for capability tags. Icon buttons are circles: 56px for the hero action (46px mobile), 44px for the slide arrows, and the closing arrow at 9vw capped at 150px (52px mobile). The slide dots are 14 × 3px bars with a 2px radius that stretch to 1.86× when active (8px bars at 2× in the compact form used past eight slides). The brand mark is three 5 × 22px bars (the middle 31px) with a 1px radius, rotated −24°.

Borders are a single pixel of hairline, always: control outlines, disclosure rows separated by top rules (the last row closes with a bottom rule), the case link and the e-mail address underlined, the footer rule. Nothing is thicker, nothing is dashed outside the debug outline, nothing is doubled. Icons are Phosphor SVGs at 13 to 23px, filtered to ink; the plus rotates 45° when its disclosure opens, and the arrows point where they go (up-right for an external link or the contact, down for "See the work", mirrored for "previous"). In the room, seat backs and cushions are rounded boxes with a 5cm bevel, the beam is a three-sided frustum from a 32 × 20cm lens to the screen with its underside open, and the screen is masked by a black box 0.8 metres larger than itself.

## Components

Everything here is tactile but understated: outlined, pixel-thin, filled only on hover, pressed to .97 for 160ms, colours over 200ms, and every hover gated behind `(hover:hover) and (pointer:fine)` so touch never sees a stuck state. Focus is a 2px celadon ring 5px out; selection is celadon on deep pine; the scrollbar is 7px with a 5px-radius thumb. Controls are at least 44px tall. Under `prefers-reduced-motion` every animation and transition is off.

### Buttons
- **Shape:** circles for icon buttons (50%), pills for text controls (20 to 24px).
- **Hero action** ("See the work"): a 56px hairline circle with the down arrow and a 13px label 17px beside it; on hover the circle fills raised velvet and drops 5px over 300ms.
- **Motion toggle** (nav): a 40px hairline pill, 12px label with the pause or play icon, `aria-pressed` while paused; hover fills raised velvet. On mobile it is a 40px icon-only disc.
- **Slide arrows:** 44px circles in ground at .5 with a hairline, the previous arrow mirrored; hover fills raised velvet.
- **Copy button** ("Copy email"): a 44px hairline pill with an 11px label and a live 11px status 8px below it; hover fills raised velvet.
- **Closing arrow:** the one filled button, a celadon disc (9vw, max 150px) carrying the up-right arrow dark on celadon; the whole title card is the link and the disc rotates 45° over 400ms on hover.
- **Skip link** and **menu button:** a celadon block with deep pine text, fixed top-left when focused; a text-only "Menu / Close" at 12px on mobile.
- **Hover / Focus:** fill raised velvet or turn celadon; never lift, never shadow. Disabled is 50% opacity.

### Chips
- **Capability tag:** a 24px hairline pill, 9px 13px padding, 11px ink text; non-interactive, right-aligned in the open disclosure (left on mobile), 8px apart (6px mobile).

### Cards / Containers
- **The slot** is the only container. In theater mode it is invisible geometry the camera lands the screen on. In the still version it is the frame: 16:10, 14px corners, a radial velvet surface (#262b25 at the centre to surface at 72%), clipped, with the still-frame drop; the real images cover it, pinned to the top, and crossfade over 350ms.
- No other card, panel or box exists; copy sits directly on the room.

### Inputs / Fields
- None. The only form control is the native `details` / `summary` disclosure; the e-mail is a link and a copy button, not a field.

### Navigation
- A fixed 72px bar (64px mobile) in ground scrim at .62 with the legibility blur, masked to fade at the bottom. The brand "DB." at 28px, 700, −0.04em with a celadon period and the three-bar mark (24px and smaller bars on mobile); links at 13px, 34px apart, 14px vertical padding, the last ("Let's talk", with the up-right arrow) in celadon; hover turns a link celadon. The motion toggle sits last. On mobile the links collapse behind "Menu / Close" into a full-width row under the bar (ground at .96, hairline bottom, 22px gutter padding).

### Screen stage and projected text
The signature component. A grid cell stacks a 16:10 slot and a projected block: centred display type with the lamp glow, the second line celadon, an optional 44ch caption, pointer-events off so the room receives the pointer. In theater mode the projected block flickers (a 5.3s stepped cycle with three brief dips to 94 to 97% opacity), fades with its slot's presence and rides the parallax; the camera lands the 3D screen exactly on the slot. The hero's two lines rise 35px through a clip-path reveal over 900ms, the second 70ms after the first.

The screen holds two slide samplers. A **reel change** (a new project) fades to black in 180ms, then, with the next slide loaded, holds it at 15% brightness while a lamp-coloured bar sweeps left to right in 300ms, and fades up over 400ms; if the texture is not ready it holds black for up to 4s and then fades up on the empty lamp screen. Leaving a project for a title card fades to black and back up with no sweep. A **slide cut** (same project) crossfades in 250ms with an 18% brightness dip at the midpoint. The screen flickers at 24Hz by ±3% (the beam by ±4%); an empty screen shows a soft lamp pool; a slide carries an 18% edge vignette. Pointer parallax moves the camera ±0.35m across and ±0.15m up through a damped spring (λ 4), and a slow sine sway (0.05m at 0.37 rad/s, 0.03m at 0.29 rad/s) stands in for a handheld camera; both stop under the pause control, which keeps the camera following scroll and stops rendering while the tab is hidden.

### Slide controls
- Right-aligned under the screen (left on mobile, spanning the copy row at 1024px): a 12px tabular caption ("03 / 09" with the number at 500 and the shot's caption in ink 10px after), a row of dots (32 × 44px hit areas, 14 × 3px bars at 22% white, the active one stretched 1.86× in celadon over 300ms, hover muted; 20px hit areas and 8px bars past eight slides), and the two arrows 6px apart. The counter is `aria-live`; the dots are a labelled group of `aria-pressed` buttons. Slides change only here, never on scroll.

### Disclosures
- **Project** ("Behind the project"): native `details`, a 12px summary 44px tall with a hairline above and below, 280px wide, the plus at 17px rotating 45° when open; the body is 12px muted at 46ch, 15px below. It follows the 13px celadon case link (44px tall, hairline underline, arrow nudging 2px up-right on hover) and precedes the 11px muted evidence footnote.
- **Capability:** rows separated by hairlines, 27px padding (22px mobile), the row title at `clamp(25px, 3.2vw, 45px)`, the plus at 23px; the open row's title turns celadon; the body is a `1fr 1fr` grid (copy at 16px and 390px, tags right-aligned) with a 50px gap, padded 5px above and 33px below; the first row ships open.
- **Private work:** rows separated by hairlines, 28px padding (24px mobile), a `1.5fr 1fr 24px` summary grid of 21px title, 12px muted role and the plus at 21px; the detail is `1.5fr 1fr` of 14px muted copy at 450px and a 13px celadon result.
- Hover on any summary turns it celadon.

### Closing title card and contact row
- The card is a mailto link: the closing line beside the celadon arrow disc, 3vw apart (stacked on mobile), projected on the contact slot while the house lights come up.
- Under it the contact row: a 14px muted line at left and, at right, the e-mail at `clamp(19px, 2.4vw, 35px)` with a hairline underline 5px below the baseline, the copy button and its status; then the footer rule with the 12px muted copyright, the stack line, "Still version" and "Back to top" (44px tall, ink).

### Still frame
- The still version's screen: a 16:10 frame in dark velvet with the 14px radius, holding the project's real images (each covering the frame, top-pinned, 350ms opacity crossfade, none under reduced motion) and sharing the slide controls with the theater; the hero and intertitles project their title cards on the empty frame. Chapters stack without sticky layering and the footer always links to it.

### Curtain, vignette and grain
- The curtain is the ground colour over everything until the first frame renders, then fades over 900ms. The vignette is always on. The grain is a 256px noise tile painted once at runtime (no raster is shipped), stepped across a doubled fixed overlay through six positions every 1.1s at 7% overlay, theater mode only.

## Do's and Don'ts

### Do:
- **Do** lay every new scene out as a 16:10 slot inside a screen stage and let the camera land the screen on it; the slot's width is the camera move.
- **Do** keep every control at least 44px tall, outlined with the hairline, filled raised velvet or turned celadon on hover, and gate hover behind `(hover:hover) and (pointer:fine)`.
- **Do** set anything that floats over the canvas in the ground colour at alpha, and keep the nav's blur the only blur.
- **Do** change slides only from the controls; scroll is the only camera move and never a slide change.
- **Do** keep every word, control and image description in the DOM in reading order; the canvas is decorative and `aria-hidden`.
- **Do** ship the still version with the same tokens: a dark velvet 16:10 frame with the 14px radius, a 350ms crossfade, no sticky layering, and `prefers-reduced-motion` honoured live.
- **Do** set title cards in two lines with the second in celadon, and keep Barlow Condensed uppercase at 600.

### Don't:
- **Don't** add a light theme, a theme toggle or a second palette; the room is dark by decision (2026-10-09).
- **Don't** scroll-jack, pin with a library, or drive the camera from anything but the slots' measured rectangles.
- **Don't** put a box-shadow, a gradient fill, gradient text or a glass panel on a DOM surface; the only shadow is the still frame's drop and the only glow is projected text.
- **Don't** set Barlow Condensed in mixed case, below 600, or on anything that is read rather than projected; labels and body are Archivo.
- **Don't** add eyebrows or kickers over a title card, letter-space anything open, or uppercase anything outside the title cards.
- **Don't** introduce a colour for a project, a badge or a status; colour outside the palette enters only as the slide and the light it throws.
- **Don't** ship a noise raster or a decorative scanline; the grain is painted at runtime and the vignette is the only other overlay.
- **Don't** hide essential information in WebGL; the canvas is a decorative rendering of what the DOM already says.
