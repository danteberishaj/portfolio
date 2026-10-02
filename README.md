# Portfolio

A kinetic creative-developer portfolio built with Next.js 14, React Three Fiber,
Three.js, and Framer Motion. Ink-black and celadon surfaces, oversized condensed
typography, a live procedural line field, and interactive project scenes.

## Getting started

Run `npm install` and `npm run dev`, then open http://localhost:3000.
Run `npm run build` followed by `npm start` for a production preview.

## Experiences

- Pointer-responsive line field with Flow, Orbit, Terrain, and pause controls.
- Native 3D headphone preview with three selectable materials.
- Interactive sample chart, pace slider, and studio typography previews.
- Sticky project scenes, capability disclosures, mobile navigation, and a light theme.
- Reduced-motion support, keyboard focus, skip navigation, and offscreen canvas suspension.
- Locally hosted open-source fonts; license files live in public/fonts.

## Personalize before publishing

The original name, email, experience counts, project descriptions, and NDA claims
are retained as supplied. Replace or verify these before using the page publicly.

- Name and metadata: app/layout.tsx and components/Experience.tsx.
- Contact address: both the email link and clipboard value in components/Experience.tsx.
- Public projects: components/ProjectGallery.tsx. The previews are authored demonstrations,
  explicitly labeled as concept previews, not screenshots of shipped products.
- Experience, capabilities, and private work: components/Experience.tsx.
- Colors, layouts, and responsive behavior: app/globals.css.
- Visual system and motion conventions: DESIGN.md.

No live project or social URLs were supplied; the design does not pretend that
placeholder links lead to external projects. Add real destinations when available.

## Validation

Production build and TypeScript checks pass. Browser checks cover 1440px desktop,
768px tablet, and 390px mobile layouts, overflow, interactive previews, the mobile
menu, light theme, and reduced-motion behavior. Review captures are in
.impeccable/review-v2. Research and installed skill sources are in DESIGN-RESEARCH.md.
