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

Projector Room (2026-10-09). Dante asked for a cinematic, over-the-top 3D
redesign of the whole page using the installed skills. The brainstorm kept the
ink, celadon and Barlow Condensed identity and all content; Impeccable's
surface roll (seed 1e805dc4) dealt three structures and Dante chose the cinema
and locked dark only. Spec: `docs/superpowers/specs/2026-10-09-projector-room-redesign-design.md`;
plan: `docs/superpowers/plans/2026-10-09-projector-room-redesign.md`.

One fixed WebGL auditorium sits behind native scroll. Each scene lays out a
16:10 slot and the camera is solved every frame to land the 3D screen on the
blended slot (`components/theater/camera.ts`), so sticky slots park the camera
and no scroll is hijacked. Projects play as reel changes with their real
screenshots as textures; the room's light takes each slide's colour. The beam,
dust and screen are custom GLSL; bloom runs on the desktop tier only. A still
version carries the same content for reduced motion, missing WebGL, a lost
context or `/?still`.

## Evidence

Production build, TypeScript and vitest pass. Playwright captures (software
WebGL) at 1440, 768 and 390 and in-app browser checks cover the hero, project
chapters, intertitles, the contact crane, the pause control, context loss and
the still version. The Impeccable detector reports no non-advisory findings on
the changed files. The Impeccable finish review (a fresh agent, code-led, no comp) ran two
fix rounds and returned ship for the scored fixes; the documenter pass was run inline after
the documenter agent hit a rate limit.
