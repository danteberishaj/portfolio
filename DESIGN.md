---
name: "Live Generative Performance"
description: "A creative developer portfolio whose interactive scenes demonstrate its craft."
colors:
  primary: "#d2e8ab"
  bg: "#101310"
  surface: "#191e19"
  surface-raised: "#222922"
  ink: "#edf0e7"
  muted: "#a4afa2"
  line: "#ffffff21"
  accent-ink: "#172112"
  light-bg: "#edf0e7"
  light-surface: "#e3e8dc"
  light-surface-raised: "#d5ddce"
  light-ink: "#182017"
  light-muted: "#53634d"
  light-line: "#18201735"
  light-primary: "#446328"
  light-accent-ink: "#f4f7ef"
  commerce: "#bec7b0"
  data: "#ced8c9"
  pulse: "#d7e7a9"
  lumen: "#505d45"
  lumen-ink: "#f1f0e4"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(80px, 10.6vw, 162px)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(38px, 5vw, 72px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Archivo, sans-serif"
    fontSize: "66px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
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
  scene: "16px"
  scene-mobile: "12px"
  control: "25px"
  group: "30px"
  tag: "24px"
  circle: "50%"
spacing:
  compact: "8px"
  mobile-gutter: "22px"
  desktop-gutter: "6vw"
  scene-copy: "47px 40px 36px"
  scene-copy-mobile: "28px 25px"
components:
  button-mode:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
  button-mode-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
  button-theme:
    backgroundColor: "transparent"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  button-theme-hover:
    backgroundColor: "{colors.surface-raised}"
  capability-tag:
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "9px 13px"
  project-scene:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.scene}"
  project-copy:
    padding: "{spacing.scene-copy}"
---

# Design System: Live Generative Performance

## Overview

**Creative North Star: "Live Generative Performance"**

A cinematic digital performance where the interface itself is the portfolio proof. Organic line fields, condensed lettering, and tangible controls make technical ability visible through use. Quiet text passages give the interactive scenes room.

The user authorized a wholly new direction and delegated its choice. This code-led world replaces the silver/orange sculpture design and the older cyan cockpit identity; no image comp was approved. The default is dark, with a persistent light-theme alternative.

**Key Characteristics:**
- Ink and celadon with related botanical scene surfaces.
- Large condensed display type paired with measured sans-serif text.
- Live demonstrations with direct controls and honest concept labels.
- Spacious scenes, restrained borders, and responsive motion fallbacks.

## Colors

### Primary

Pale celadon carries the dark-theme selected state, headline emphasis, live field, and closing contact field. The light theme uses deep leaf green for UI emphasis; the closing field retains celadon and dark text in either theme.

### Secondary

Commerce sage, data mist, pulse lime, and Lumen olive distinguish the four demonstrations within the same green family. Lumen uses cream text and its explanatory note stays fully opaque.

### Neutral

Ink-black ground, stepped green-black surfaces, pale text, and sage-muted text establish the default hierarchy. The light theme reverses this to pale mineral surfaces and dark botanical text. Thin translucent rules separate navigation, disclosures, and controls.

**The Theme Pair Rule.** Switch foreground, surface, muted, border, and accent tokens together; preserve each demonstration's local foreground/background pairing.

## Typography

Local Barlow Condensed (600) supplies uppercase display statements. Local Archivo supplies headings, body, controls, and labels. JetBrains Mono is loaded by the layout but has no active visual role and is not a normative face for this system.

The opening's second display line scales to 1.34em on desktop and 1.6em on mobile. Project titles reduce to 52px at the intermediate breakpoint and 45px on mobile. Body copy typically ranges from 13–16px; project descriptions use a 36ch measure on desktop. Compact labels support controls and metadata, not a separate eyebrow hierarchy. Numbers that change use tabular figures.

## Layout

The content width caps at 1480px with the documented desktop gutter. Navigation and the opening share a continuous full-width stage. Desktop navigation is 106px tall; mobile is 82px. At 1600px the opening and navigation align to a 1400px inner span and content gutters become 60px.

Project scenes use a .8fr / 1.2fr copy/demo split, a 590px minimum height, and sticky positioning 26px from the top. Below 768px they become ordinary single-column cards with 430px demonstration areas. Mobile gutters and scene radii use the frontmatter values. The 1024px breakpoint tightens copy; the 370px breakpoint simplifies the smallest layouts. Reduced motion also removes sticky layering.

## Elevation & Depth

Depth comes chiefly from tonal surfaces, live geometry, and overlapping sticky scenes. Desktop scenes use a soft upper shadow (`0 -20px 50px -40px #0009`); mobile removes it. Native 3D lighting belongs inside the product demonstration. The surrounding interface stays flat and quiet.

## Shapes

Scenes use softly rounded rectangles. Circular icon controls, round material swatches, and pill-shaped mode selectors provide a consistent tactile vocabulary. Single-pixel rules organize content; the line field supplies the expressive organic geometry.

## Components

- **Navigation:** brand, role text, anchor links, and circular theme control. Mobile exposes a labelled Menu/Close button and an expanded link row. Theme choice persists locally.
- **Mode controls:** Flow, Orbit, and Terrain are real pressed-state buttons in a bordered pill. A separate pause control stops the field; reduced motion disables continuous playback.
- **Project scenes:** description, expandable context, and one interactive demonstration. Aurora changes a native 3D headphone material; Nebula changes illustrative periods and selected bars; Pulse changes a repeated stroke's timing at 70–145 BPM; Lumen shifts alternating text lines.
- **Disclosures and tags:** native details/summary rows reveal capabilities and private-work context. Capability tags are compact bordered pills.
- **Range input:** a labelled native slider with a visible BPM value and a 44px interaction height. Preserve the browser's keyboard behavior.
- **Contact:** a large celadon invitation, email link, copy button, and live status feedback. There is no separate contact prelude.

**The Motion Contract Rule.** Motion must respond to input, respect live reduced-motion changes, and suspend continuous work when its scene is outside view.

Button press feedback scales to .97 over 160ms; colors transition over 200ms. The shared exit ease is cubic-bezier(.23, 1, .32, 1). The opening reveal takes 900ms with a 70ms second-line delay; Lumen shifts over 500ms. Pulse's stroke cycle is 60/BPM seconds and becomes a static path for reduced motion. The procedural field pauses when offscreen or the document is hidden; the product canvas uses demand rendering for reduced motion or offscreen scenes. Focus is a visible 2px outline with 5px offset, using the accent or each demonstration's local dark/cream foreground.

## Do's and Don'ts

### Do:
- Do pair large expressive scenes with concise, legible supporting copy.
- Do preserve real control behavior, keyboard focus, and reduced-motion states.
- Do label concept imagery and illustrative data honestly.
- Do derive future theme styling from the active CSS variables.

### Don't:
- Don't restore the rejected silver/orange sculpture or cyan cockpit identity.
- Don't promote legacy Tailwind tokens or unmounted components into this system.
- Don't present supplied metrics or demo interfaces as independently verified production evidence.
- Don't hide essential information exclusively in animated canvas or WebGL output.
