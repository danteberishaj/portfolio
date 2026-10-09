# Portfolio

A creative-developer portfolio built with Next.js 14, React Three Fiber, Three.js
and custom GLSL. The page is a cinema at night: one WebGL auditorium sits behind
the document, the projector beam cuts through haze and dust to a 16:10 screen,
and each project plays on that screen as a reel change. Scrolling is the only
camera move.

## Getting started

Run `npm install` and `npm run dev`, then open http://localhost:3000.
Run `npm run build` followed by `npm start` for a production preview.
`npm test` runs the unit tests for the camera solver, texture cache and store.

## How it works

- The DOM is the script. Every scene renders a 16:10 slot (`[data-slot]`);
  every frame the camera rig reads the slot rectangles, blends them by how
  close they sit to the viewport's focus, and solves a straight-ahead camera
  (distance, lateral dolly, vertical lens shift) that lands the 3D screen
  exactly on the blended slot. Sticky slots park the camera; native scroll
  drives every move. There is no scroll-jacking.
- Project chapters show the real screenshots as textures on the screen; the
  room's light takes each slide's average colour. Previous/next and dots are
  real buttons. A project change is a reel change (fade, light sweep, fade
  in); a slide change is a short cut.
- A still version carries the same content without WebGL: it is used for
  `prefers-reduced-motion`, missing WebGL, a lost context, or `/?still`, and
  is linked from the footer.
- The Pause button in the navigation stops the room's ambient motion (dust,
  flicker, sway); the camera still follows scroll.

## Personalize before publishing

The site belongs to Dante Berishaj. The email and experience counts are retained as supplied. Replace or verify these before using the
page publicly.

- Name and metadata: `app/layout.tsx`.
- Contact address: `components/Sections.tsx` (`EMAIL`).
- Projects and slides: `components/projects.ts`; images in `public/projects`
  (see the README there).
- Capabilities: `components/Sections.tsx`.
- Layout, type and colour: `app/globals.css`. The scene: `components/theater`.
- Visual system and motion conventions: `DESIGN.md`.

Geo Guesser links to https://geo-guesser-rouge.vercel.app/, vocisXultra to
https://vocis-xultra.vercel.app/, and FJALË to https://www.xn--fjal-opa.com/
(fjalë.com). Offday, Bayyinah TV, the Vianova Design System and Vianova
Connect are shown without links by the owner's request.

## Validation

Production build, TypeScript and unit tests pass. Browser checks cover 1440px
desktop, 768px tablet and 390px mobile layouts, the still version, the pause
control, context loss, and reduced motion. Research and installed skill
sources are in `DESIGN-RESEARCH.md`; the design spec and plan are under
`docs/superpowers`.
