# Redesign research

The user rejected the entire silver/orange direction and delegated a new visual
direction, with interactions and frontend craft as the primary takeaway.

## Project-local skills

Installed from the official repositories into `.agents/skills/`:

- [Impeccable](https://github.com/pbakaus/impeccable): replacement visual world,
  craft floor, bounded visual verification, independent finish review, and design documentation.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): local
  design-system and UX searches for creative portfolios, scroll behavior, and reduced motion.
- [Taste](https://github.com/Leonxlnx/taste-skill): brief-led composition,
  distinctive typography, real interactive artifacts, and explicit concept labels.
- [Emil Kowalski's skills](https://github.com/emilkowalski/skills): `animate` and
  `emil-design-eng`, used for purposeful motion, state feedback, interruption,
  reduced motion, and restrained dependencies.

## Implemented direction

Code-led generative performance: ink black, pale celadon, Barlow Condensed display
type, and Archivo body text. A procedural line field provides the opening
interaction, with three forms and a pause control. Large project scenes let
visitors change a real 3D material, explore sample chart data, adjust a motion
pace, and shift typography. The examples are labeled as concepts or illustrative
data. Existing project claims and identity placeholders remain supplied content.

Canvas work pauses offscreen and responds to reduced-motion preferences. The
page keeps native links, buttons, disclosures, range input, keyboard focus,
mobile navigation, and light/dark themes. Existing Next.js, React Three Fiber,
and Framer Motion dependencies are reused.

## Evidence

Production build and TypeScript validation pass. Browser checks cover desktop
(1440px), tablet (768px), mobile (390px), all project controls, theme switching,
mobile navigation, overflow, and reduced motion. Captures and verification
scripts are under `.impeccable/review-v2/`.
