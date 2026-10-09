# Projector Room: cinematic 3D redesign of the portfolio

Date: 2026-10-09. Status: approved direction (Dante chose "Projector Room", dark only).

## Brief

Redesign the whole portfolio page as a cinematic, deliberately over-the-top 3D experience, using the installed design skills (Impeccable, Taste, UI UX Pro Max, Emil Kowalski's animation skills, Superpowers). Design read: creative-developer portfolio for hiring managers, founders and agency leads, Experience mode, variance 9 / motion 9 / density 3. Redesign mode is "overhaul": a new structure and experience on top of preserved content, identity and information architecture.

What stays: the ink + celadon + Barlow Condensed / Archivo identity, the DB. mark, all eleven projects with their real screenshots, links, "Behind the project" copy and evidence footnotes, the capability and private-work disclosures, the contact section, the supplied (unverified) claims, the section ids (`home`, `work`, `about`, `confidential`, `contact`), and the accessibility floor (keyboard, focus, reduced motion, essential information in HTML).

What goes: the procedural line field and its Flow/Orbit/Terrain controls, the light theme and its toggle, the practice strip under the hero, the sticky card stack, the shipped design-direction JSON in the layout, and every unmounted legacy component.

## Concept

The page is a cinema at 2 a.m. One WebGL scene sits fixed behind the document: a dark auditorium, a projector at the back whose beam cuts through haze and dust to a colossal 16:10 screen, rows of seat backs catching the screen's light, a faintly reflective floor. The visitor is the only one in the room.

Scrolling is the only camera move. The document scrolls natively (no scroll-jacking, no pinning library); the camera reads scroll position and walks down the aisle toward the screen. Each project is a reel change: the screen cuts to black, a light sweep passes, and the project's slides play on the screen. Text sections are intertitles projected on the screen. At the end the house lights come up celadon while the camera cranes back to the entrance.

The DOM is the script, the canvas is the camera. Every word, control and image description lives in accessible HTML in reading order. The 3D screen is a decorative rendering of the current slide; the slide's alt text is in the DOM.

## Page structure (DOM order)

1. **Navigation** (fixed, 72px): DB. mark, links Work / Approach / Let's talk, a "Pause motion" button. Mobile: Menu/Close. No theme toggle.
2. **Hero** (`#home`, 100svh): h1 "Not just seen. / Felt." positioned over the projected screen rectangle (desktop) or in flow above it (narrow screens); one line of description; one CTA "See the work" (`#work`).
3. **Work** (`#work`): an intertitle chapter with h2 "Selected perspectives." then eleven project chapters in the existing order. Each chapter is 130svh tall with a 100svh sticky inner block: title (Barlow Condensed, uppercase) and category line, tags, description, live link when one exists, "Behind the project" disclosure, evidence footnote, and the slide controls (caption "01 / 09 Start a game", dots, previous/next) placed under the screen area. Slide changes are button-driven only; scroll never changes a slide.
4. **Approach** (`#about`): intertitle h2 "Good design is good development." with its paragraph, the three capability disclosures (first open), footnote and the supplied facts.
5. **Private work** (`#confidential`): h2 "Some work stays between us." and the three NDA disclosures.
6. **Contact** (`#contact`): closing title card "Let's make an impression." as a mailto link, the email, the copy button with live status, and the footer (copyright, stack line, back to top, "Still version" link).

## The 3D scene

- **Units**: metres. Screen 16 x 10 at z = 0, bottom edge at y = 1. Camera eye height 1.5. Projector at the back (z = 28, y = 5). Twelve seat rows between z = 4 and z = 26 with a free centre aisle; seats are an instanced mesh.
- **Light**: scene fog in green-black; a RectAreaLight at the screen whose colour follows the average colour of the current slide (sampled from the image on a 16 x 10 canvas), so the room is lit by the movie; a faint celadon rim on the seat tops. The beam is a custom frustum from the lens to the screen rectangle with an additive shader (falloff from the axis, animated noise for haze, a gate-flicker uniform). Dust is a point cloud inside the frustum, drifting slowly, brighter near the axis.
- **Screen material**: two slide samplers with a crossfade mix, a brightness uniform (fade to black), a sweep uniform (bright bar for the reel change), subtle flicker, and a soft projector vignette so the beam lands on something in the hero and intertitles.
- **Camera path**: a function of page scroll. Hero: z = 26, framing the screen at about 72% of viewport width. Work: one parking spot per chapter (z from 24 down to 10), the camera parks while the chapter's copy is sticky and travels between spots during the hand-over. Approach and private: z = 8 and 6. Contact: a crane back to z = 26 and up to y = 4 as the house lights ramp up. Scroll feeds a spring so the move has a one-second cinematic lag. Pointer parallax rotates the camera a few degrees through a spring; a tiny sine sway stands in for a handheld camera.
- **Reel change** (project change): brightness to 0 over 180ms, sweep 300ms, brightness up with the new texture 400ms. **Slide change** (same project): 250ms crossfade with a small brightness dip.
- **Textures**: raw JPEGs on desktop, `/_next/image` at 1080px on narrow screens; sRGB, mipmaps, anisotropy; a cache of at most eight textures with least-recently-used disposal; the active project loads its current slide and neighbours, the next project its first slide.
- **Quality tiers**: desktop with a capable GPU gets MeshReflectorMaterial on the floor, 2,400 dust points and a bloom pass (`@react-three/postprocessing`); narrow or weak devices get a plain floor, 800 points and no post-processing. Vignette and film grain are fixed CSS overlays for everyone. Device pixel ratio is capped at 1.5 and adapts under load.
- **Pause**: the nav button stops drift, flicker, dust and sway; the camera still follows scroll. Rendering also stops when the tab is hidden.

## Still version (fallback)

Used when WebGL is unavailable, the context is lost, `prefers-reduced-motion` is on (including live changes), or the visitor opens `/?still`. The canvas is not mounted. The hero shows the title on a dark screen-shaped surface; each chapter shows its real images in a 16:10 frame with the same controls and a 350ms crossfade (instant under reduced motion); chapters stack normally without sticky positioning. The footer always links to the still version so anyone can opt out of the 3D.

## Visual system

- Colours: ground `#0b0d0b`, surface `#141714`, ink `#edf0e7`, muted `#a4afa2`, line `rgba(255,255,255,.13)`, accent celadon `#d2e8ab` with accent ink `#172112`, beam light `#e9f3d6`. One theme, dark.
- Type: Barlow Condensed 600 uppercase for the hero, intertitles, project titles and the closing; Archivo for everything else. Tracking stays between -0.02em and -0.04em. Display caps at 6rem on body text pages; the hero and closing may exceed that as the one authored moment.
- Motion tokens: `--ease-out: cubic-bezier(.23,1,.32,1)`, `--ease-in-out: cubic-bezier(.77,0,.175,1)`; press feedback scale .97 over 160ms; colour 200ms; hover gated behind `(hover:hover) and (pointer:fine)`.
- Shapes: one radius system, 14px for frames and surfaces, pills for small controls, circles for icon buttons.
- Browser surfaces: themed selection, caret, focus ring (2px celadon, 5px offset), scrollbar, tabular figures in the slide counter.

## Rules kept from the skills

- No eyebrows, no scroll cues, no decoration strip under the hero, no em-dashes in visible text, no duplicate CTA intent, no fake screenshots, one marquee at most (none used), motion only on transform / opacity / clip-path in the DOM, no `window` scroll listeners in React state, reduced motion honoured live, hover gated, exit faster than enter, never `scale(0)`.
- Essential information never lives only in WebGL. Every claim stays as supplied and labelled.

## Testing

- `npm run build` and `npx tsc --noEmit` pass.
- Browser checks at 1440, 768 and 390: hero framing, every project chapter reachable by scroll with the right slide on the screen, slide controls, disclosures, links, mobile menu, pause button, keyboard focus, `/?still`, reduced motion.
- Impeccable detector over the changed files, then the finish review (fresh agent) and the DESIGN.md documenter.

## Out of scope

New project content, verifying the supplied claims, replacing the placeholder email, a light theme, sound.
