---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/Experience.tsx","components/theater/Theater.tsx","components/Chapters.tsx","app/globals.css","app/layout.tsx"]
---

# Portfolio home

Mode: Experience.
Audience: hiring managers, founders and agency leads evaluating a creative developer's craft.
Success: watch the work play, understand the developer, write to Dante.

Dante asked on 2026-10-09 for a cinematic, deliberately over-the-top 3D redesign of the whole page using the installed design skills. The identity (ink, celadon, Barlow Condensed, Archivo) and all content are kept; the structure is replaced. Surface roll 1e805dc4 dealt the Projector Room as lead; Dante chose it and locked dark only. Spec: docs/superpowers/specs/2026-10-09-projector-room-redesign-design.md.

## Direction contract

- **THESIS:** The portfolio is a cinema at 2 a.m. and the visitor is the only one in the room; scroll is the only camera move. It refuses the category default of a hero object over a card grid, and it refuses scroll-jacking.
- **OWN-WORLD:** Green-black auditorium, one projector beam through haze and dust, one 16:10 screen, seat backs lit by whatever plays, celadon house lights; Barlow Condensed title cards, Archivo captions and controls. Dark only.
- **STORY:** Arrive at the back of the room, walk the aisle while eleven reels play (a reel change per project, button-driven slides), read the intertitles about approach and private work, then the house lights come up and the closing card invites a message.
- **FIRST VIEWPORT:** Fixed 72px nav. The 3D screen spans 58% of the width, centred, in the top two thirds of the viewport; "NOT JUST SEEN. / FELT." projected on it; the beam and dust above, seat backs below; one line of description and the "See the work" action bottom-left.
- **FORM:** Projector Room, candidate 5 of the ranked structural list, dealt lead of seed 1e805dc4; code-led. The DOM lays out a 16:10 slot per scene and the camera is solved each frame to land the 3D screen on the blended active slot, so sticky slots park the camera and native scroll drives every move.
- **MOTION:** Exact slot tracking, pointer parallax, handheld sway, gate flicker; reel change 180/300/400ms, slide cut 250ms; pause control; still version for reduced motion, no WebGL or `/?still`.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
