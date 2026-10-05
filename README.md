# Portfolio

A kinetic creative-developer portfolio built with Next.js 14, React Three Fiber,
Three.js, and Framer Motion. Ink-black and celadon surfaces, oversized condensed
typography, a live procedural line field, and interactive project scenes.

## Getting started

Run `npm install` and `npm run dev`, then open http://localhost:3000.
Run `npm run build` followed by `npm start` for a production preview.

## Experiences

- Pointer-responsive line field with Flow, Orbit, Terrain, and pause controls.
- Screenshot slideshows for every project, with keyboard-reachable controls.
- Sticky project scenes, capability disclosures, mobile navigation, and a light theme.
- Reduced-motion support, keyboard focus, skip navigation, and offscreen canvas suspension.
- Locally hosted open-source fonts; license files live in public/fonts.

## Personalize before publishing

The site belongs to Dante Berishaj. The email, experience counts, and NDA
claims are retained as supplied. Replace or verify these before
using the page publicly.

- Name and metadata: app/layout.tsx and components/Experience.tsx (already set to Dante Berishaj).
- Contact address: both the email link and clipboard value in components/Experience.tsx.
- Public projects: components/ProjectGallery.tsx. Geo Guesser, vocisXultra, FJALË, the Geo Guesser World 3D! Android app, the GoodCannaNow and CannaHealRx booking flows, the Incentiv Portal, and the Bayyinah TV site (a local build, no public link) are shown
  with live links and production screenshots in public/projects (see the README there). Offday is
  an in-development SaaS product shown through screenshots only, with no link by the owner's request.
  The Vianova Design System is a private package, shown through seven boards rendered from its real
  components, also with no link by the owner's request. Vianova Connect is a dashboard behind sign-in,
  shown through six boards made from its development environment (test data, names replaced), with no link.
- Experience, capabilities, and private work: components/Experience.tsx.
- Colors, layouts, and responsive behavior: app/globals.css.
- Visual system and motion conventions: DESIGN.md.

Geo Guesser links to https://geo-guesser-rouge.vercel.app/, vocisXultra to
https://vocis-xultra.vercel.app/, and FJALË to https://www.xn--fjal-opa.com/ (fjalë.com).
No other live project or social URLs were supplied.

## Validation

Production build and TypeScript checks pass. Browser checks cover 1440px desktop,
768px tablet, and 390px mobile layouts, overflow, interactive previews, the mobile
menu, light theme, and reduced-motion behavior. Review captures are in
.impeccable/review-v2. Research and installed skill sources are in DESIGN-RESEARCH.md.
