# Projector Room Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio page as a cinema: one fixed WebGL auditorium behind native scroll, where every scene is a 16:10 DOM slot the camera is solved to frame, projects play as reel changes on the screen, and a still version carries the same content without WebGL.

**Architecture:** The DOM is the script and the canvas is the camera. Each section renders a `[data-slot]` box with a 16:10 aspect; every frame the rig reads the slot rects, blends them by how close they are to the viewport's focus, and solves a straight-ahead camera (distance, lateral offset, vertical view shift) that lands the 3D screen exactly on the blended rect. Sticky slots park the camera; scrolling moves it. A tiny external store carries the active scene, the slide per project and the pause flag between the DOM controls and the screen material.

**Tech Stack:** Next.js 14 (app router), React 18, @react-three/fiber 8, @react-three/drei 9, three 0.170, @react-three/postprocessing 2.19 (bloom on the desktop tier), custom GLSL for the screen, beam and dust, vitest for the pure modules, handwritten CSS in `app/globals.css`.

Spec: `docs/superpowers/specs/2026-10-09-projector-room-redesign-design.md`.

## Global Constraints

- Keep every project's title, category, detail, tags, link, `behind` copy and footnote verbatim from `components/ProjectGallery.tsx`; keep the section ids `home`, `work`, `about`, `confidential`, `contact`.
- Dark only. Tokens: ground `#0b0d0b`, surface `#141714`, ink `#edf0e7`, muted `#a4afa2`, line `rgba(255,255,255,.13)`, accent `#d2e8ab`, accent ink `#172112`, lamp `#e9f3d6`.
- Display face Barlow Condensed 600 uppercase (hero, intertitles, closing); Archivo for everything else; tracking between -0.02em and -0.04em.
- Motion: `--ease-out: cubic-bezier(.23,1,.32,1)`, `--ease-in-out: cubic-bezier(.77,0,.175,1)`; press scale .97 / 160ms; hover only under `(hover:hover) and (pointer:fine)`; DOM animates transform, opacity and clip-path only; never `scale(0)`; no `window` scroll listeners feeding React state.
- No em-dashes or en-dashes in visible text. No eyebrows, scroll cues or decoration strips. One CTA label per intent.
- Essential information and every control stay in HTML; the canvas is `aria-hidden`.
- Reduced motion (live), missing WebGL, a lost context or `/?still` render the still version.
- Commit after each task with a conventional message ending in `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Do not push.

---

### Task 1: Dependencies and test runner

**Files:**
- Modify: `package.json` (add `"test": "vitest run"` script; dependencies already installed: `@react-three/postprocessing@^2.19.1`, `postprocessing@^6.39.5`, dev `vitest@^4`)
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`

- [ ] **Step 1: Add the test script and config**

```json
"scripts": { "dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint", "test": "vitest run" }
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/**/*.test.ts"], environment: "node" } });
```

- [ ] **Step 2: Write a smoke test and run it**

```ts
// tests/smoke.test.ts
import { expect, test } from "vitest";
test("vitest runs", () => { expect(1 + 1).toBe(2); });
```

Run: `npm test` Expected: 1 passed.

- [ ] **Step 3: Commit** `chore: add postprocessing and vitest`

---

### Task 2: Theater store

**Files:**
- Create: `components/theater/store.ts`
- Test: `tests/store.test.ts`

**Interfaces:**
- Produces: `type SceneId = "hero" | "work-title" | \`p${number}\` | "about" | "private" | "contact"`, `createTheaterStore(projectCount)` returning `{ get, subscribe, setActive, setSlide, setPaused, setReady }`, the singleton `theater`, and `useTheater(selector)`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, test, vi } from "vitest";
import { createTheaterStore } from "../components/theater/store";
describe("theater store", () => {
  test("starts on the hero with every project on slide 0", () => {
    const s = createTheaterStore(3);
    expect(s.get()).toEqual({ active: "hero", slides: [0, 0, 0], paused: false, ready: false });
  });
  test("notifies on change and not on no-op", () => {
    const s = createTheaterStore(2); const spy = vi.fn(); s.subscribe(spy);
    s.setActive("p1"); s.setActive("p1"); s.setSlide(1, 2); s.setSlide(1, 2); s.setPaused(true);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(s.get().slides).toEqual([0, 2]);
  });
  test("keeps the slides array reference when nothing changed", () => {
    const s = createTheaterStore(1); const before = s.get().slides; s.setActive("about");
    expect(s.get().slides).toBe(before);
  });
});
```

- [ ] **Step 2: Run** `npm test` Expected: FAIL, module not found.

- [ ] **Step 3: Implement**

```ts
"use client";
import { useSyncExternalStore } from "react";
export type SceneId = "hero" | "work-title" | `p${number}` | "about" | "private" | "contact";
export type TheaterState = { active: SceneId; slides: number[]; paused: boolean; ready: boolean };
export function createTheaterStore(projectCount: number) {
  let state: TheaterState = { active: "hero", slides: Array.from({ length: projectCount }, () => 0), paused: false, ready: false };
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());
  return {
    get: () => state,
    subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
    setActive(active: SceneId) { if (state.active !== active) { state = { ...state, active }; emit(); } },
    setSlide(project: number, index: number) {
      if (state.slides[project] === index) return;
      const slides = state.slides.slice(); slides[project] = index; state = { ...state, slides }; emit();
    },
    setPaused(paused: boolean) { if (state.paused !== paused) { state = { ...state, paused }; emit(); } },
    setReady(ready: boolean) { if (state.ready !== ready) { state = { ...state, ready }; emit(); } },
  };
}
export type TheaterStore = ReturnType<typeof createTheaterStore>;
export const theater = createTheaterStore(11);
export function useTheater<T>(select: (s: TheaterState) => T): T {
  return useSyncExternalStore(theater.subscribe, () => select(theater.get()), () => select(theater.get()));
}
```

- [ ] **Step 4: Run** `npm test` Expected: PASS. **Step 5: Commit** `feat: add the theater store`

---

### Task 3: Camera solver

**Files:**
- Create: `components/theater/camera.ts`
- Test: `tests/camera.test.ts`

**Interfaces:**
- Produces: `SCREEN = { width: 16, height: 10, bottom: 1 }`, `FOV = 42`, `EYE = 1.6`, `type Rect`, `type Slot = { id; rect; eye; house }`, `type Target = { rect; eye; house; active: string | null; presence: number }`, `type CameraPose = { x; y; z; shiftY }`, `presence(centreY, viewportHeight)`, `blendSlots(slots, viewportHeight, fallback)`, `solveCamera(rect, viewport, eye, fov?)`, `projectScreen(pose, viewport, fov?)`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, test } from "vitest";
import { blendSlots, presence, projectScreen, solveCamera, EYE } from "../components/theater/camera";
const vp = { width: 1440, height: 900 };
describe("presence", () => {
  test("is 1 at the focus line and 0 far away", () => {
    expect(presence(900 * 0.45, 900)).toBe(1);
    expect(presence(-900, 900)).toBe(0);
    expect(presence(900 * 0.45 + 300, 900)).toBeGreaterThan(0.3);
  });
});
describe("solveCamera", () => {
  test("lands the screen on the requested rect", () => {
    const rect = { left: 300, top: 90, width: 835, height: 522 };
    const pose = solveCamera(rect, vp, EYE);
    const back = projectScreen(pose, vp);
    expect(back.left).toBeCloseTo(rect.left, 3); expect(back.top).toBeCloseTo(rect.top, 3);
    expect(back.width).toBeCloseTo(rect.width, 3); expect(back.height).toBeCloseTo(rect.height, 3);
  });
  test("a wider rect means a closer camera", () => {
    const near = solveCamera({ left: 0, top: 0, width: 1382, height: 864 }, vp, EYE);
    const far = solveCamera({ left: 300, top: 0, width: 835, height: 522 }, vp, EYE);
    expect(near.z).toBeLessThan(far.z);
  });
});
describe("blendSlots", () => {
  const fallback = { rect: { left: 1, top: 1, width: 1, height: 1 }, eye: EYE, house: 0, active: "hero" as const, presence: 0 };
  test("picks the slot at the focus and tracks it exactly", () => {
    const a = { id: "p0", rect: { left: 100, top: 300, width: 800, height: 500 }, eye: EYE, house: 0 };
    const b = { id: "p1", rect: { left: 100, top: 1900, width: 800, height: 500 }, eye: EYE, house: 1 };
    const t = blendSlots([a, b], 900, fallback);
    expect(t.active).toBe("p0"); expect(t.rect).toEqual(a.rect); expect(t.house).toBe(0);
  });
  test("holds the fallback when nothing is present", () => {
    const far = { id: "p0", rect: { left: 0, top: 5000, width: 10, height: 6 }, eye: EYE, house: 0 };
    expect(blendSlots([far], 900, fallback).rect).toEqual(fallback.rect);
  });
});
```

- [ ] **Step 2: Run** `npm test` Expected: FAIL. **Step 3: Implement**

```ts
export const SCREEN = { width: 16, height: 10, bottom: 1 } as const;
export const FOV = 42;
export const EYE = 1.6;
export type Rect = { left: number; top: number; width: number; height: number };
export type Slot = { id: string; rect: Rect; eye: number; house: number };
export type Target = { rect: Rect; eye: number; house: number; active: string | null; presence: number };
export type CameraPose = { x: number; y: number; z: number; shiftY: number };
const tanHalf = (fov: number) => Math.tan(((fov / 2) * Math.PI) / 180);
/** 1 when a slot's centre sits on the focus line (45% down the viewport), easing to 0 at 70% of the viewport height away. */
export function presence(centreY: number, viewportHeight: number): number {
  const u = Math.min(1, Math.abs(centreY - viewportHeight * 0.45) / (viewportHeight * 0.7));
  return 1 - u * u * (3 - 2 * u);
}
export function blendSlots(slots: Slot[], viewportHeight: number, fallback: Target): Target {
  let total = 0, best = 0, active: string | null = null;
  const r = { left: 0, top: 0, width: 0, height: 0 }; let eye = 0, house = 0;
  for (const s of slots) {
    const p = presence(s.rect.top + s.rect.height / 2, viewportHeight);
    if (p <= 0) continue;
    total += p; r.left += s.rect.left * p; r.top += s.rect.top * p; r.width += s.rect.width * p; r.height += s.rect.height * p;
    eye += s.eye * p; house += s.house * p;
    if (p > best) { best = p; active = s.id; }
  }
  if (total < 0.02) return { ...fallback, presence: 0 };
  return { rect: { left: r.left / total, top: r.top / total, width: r.width / total, height: r.height / total }, eye: eye / total, house: house / total, active, presence: total };
}
/** A straight-ahead camera (looking down -z at the screen on z = 0) whose frame is shifted vertically so the screen lands on `rect`. */
export function solveCamera(rect: Rect, viewport: { width: number; height: number }, eye: number, fov = FOV): CameraPose {
  const t = tanHalf(fov), aspect = viewport.width / viewport.height;
  const fraction = Math.max(0.05, rect.width / viewport.width);
  const z = SCREEN.width / (fraction * 2 * t * aspect);
  const worldWidth = SCREEN.width / fraction;
  const cx = (rect.left + rect.width / 2) / viewport.width;
  const cy = (rect.top + rect.height / 2) / viewport.height;
  const elevation = (SCREEN.bottom + SCREEN.height / 2 - eye) / (z * t);
  return { x: -(cx - 0.5) * worldWidth, y: eye, z, shiftY: elevation - (1 - 2 * cy) };
}
/** Where the screen lands for a pose; the inverse of solveCamera, used by tests and by the DOM parallax. */
export function projectScreen(pose: CameraPose, viewport: { width: number; height: number }, fov = FOV): Rect {
  const t = tanHalf(fov), halfH = pose.z * t, halfW = halfH * (viewport.width / viewport.height);
  const nx = (x: number) => (x - pose.x) / halfW, ny = (y: number) => (y - pose.y) / halfH - pose.shiftY;
  const left = ((nx(-SCREEN.width / 2) + 1) / 2) * viewport.width, right = ((nx(SCREEN.width / 2) + 1) / 2) * viewport.width;
  const top = ((1 - ny(SCREEN.bottom + SCREEN.height)) / 2) * viewport.height, bottom = ((1 - ny(SCREEN.bottom)) / 2) * viewport.height;
  return { left, top, width: right - left, height: bottom - top };
}
```

- [ ] **Step 4: Run** `npm test` Expected: PASS. **Step 5: Commit** `feat: add the slot-tracking camera solver`

---

### Task 4: Texture cache and average colour

**Files:**
- Create: `components/theater/textures.ts`
- Test: `tests/textures.test.ts`

**Interfaces:**
- Produces: `type Loaded = { texture: THREE.Texture; colour: [number, number, number] }`, `averageOfPixels(data)`, `sampleAverage(image)`, `createTextureCache(load, max = 8)` with `get(src): Promise<Loaded>`, `touch(src)`, `size`, `dispose()`, and `loadImageTexture(src)`. `textureSrc(src, narrow)` returns the raw path on wide screens and `/_next/image?url=…&w=1080&q=80` on narrow ones.

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, test } from "vitest";
import { averageOfPixels, createTextureCache, textureSrc } from "../components/theater/textures";
describe("averageOfPixels", () => {
  test("averages rgb and ignores alpha", () => {
    const px = new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, 0]);
    const [r, g, b] = averageOfPixels(px);
    expect(r).toBeCloseTo(0.5); expect(g).toBe(0); expect(b).toBeCloseTo(0.5);
  });
});
describe("createTextureCache", () => {
  const fake = () => { const disposed: string[] = []; const load = async (src: string) => ({ texture: { dispose: () => disposed.push(src) } as never, colour: [0, 0, 0] as [number, number, number] }); return { load, disposed }; };
  test("dedupes requests", async () => {
    const { load } = fake(); const cache = createTextureCache(load, 2);
    const a = cache.get("a.jpg"); expect(cache.get("a.jpg")).toBe(a); expect(cache.size).toBe(1);
  });
  test("evicts the least recently used entry and disposes it", async () => {
    const { load, disposed } = fake(); const cache = createTextureCache(load, 2);
    cache.get("a"); cache.get("b"); cache.touch("a"); cache.get("c");
    await Promise.resolve(); await Promise.resolve();
    expect(cache.size).toBe(2); expect(disposed).toEqual(["b"]);
  });
});
test("textureSrc uses the image optimizer on narrow screens", () => {
  expect(textureSrc("/projects/a.jpg", false)).toBe("/projects/a.jpg");
  expect(textureSrc("/projects/a.jpg", true)).toBe("/_next/image?url=%2Fprojects%2Fa.jpg&w=1080&q=80");
});
```

- [ ] **Step 2: Run, expect FAIL. Step 3: Implement** (`loadImageTexture` sets `colorSpace = SRGBColorSpace`, `anisotropy = 4`, `minFilter = LinearMipmapLinearFilter`, and samples the average on a 16x10 canvas; the cache keeps a `Map<string, { promise; last }>` with a tick counter and evicts the oldest while `size > max`, disposing after the promise resolves.)

- [ ] **Step 4: Run, expect PASS. Step 5: Commit** `feat: add the texture cache`

---

### Task 5: Project data module and legacy cleanup

**Files:**
- Create: `components/projects.ts` (move `Project`, `Shot`, `projects`, every `*Shots` array from `ProjectGallery.tsx`; drop `ShotTheme`; export `shotsFor: Record<Project["kind"], Shot[]>` and `projects`)
- Delete: `components/ProjectGallery.tsx`, `About.tsx`, `ConfidentialWork.tsx`, `Contact.tsx`, `Hero.tsx`, `Navbar.tsx`, `ProjectSlideshow.tsx`, `Reveal.tsx`, `Scene.tsx`, `ScrollProgress.tsx`, `ParticleField.tsx`, `Icons.tsx`
- Modify: `components/Experience.tsx` so it imports nothing deleted (temporary: render the project titles from `projects` so the type check passes)

- [ ] **Step 1: Move the data, delete the files, run** `npx tsc --noEmit` Expected: no errors.
- [ ] **Step 2: Commit** `refactor: extract project data and drop unmounted components`

---

### Task 6: Layout, tokens, page shell and the still version

**Files:**
- Modify: `app/layout.tsx` (load only Barlow Condensed and Archivo; metadata unchanged; `themeColor: "#0b0d0b"`; remove the design-direction JSON script)
- Rewrite: `app/globals.css` (tokens from Global Constraints, reset, nav, hero, intertitles, chapters, disclosures, contact, overlays, still version, breakpoints 1024 / 767 / 370, reduced motion, hover gating, focus, selection, scrollbar)
- Rewrite: `components/Experience.tsx` (mode decision, overlays, sections in DOM order)
- Create: `components/Nav.tsx`, `components/Chapters.tsx`, `components/StillFrame.tsx`, `components/Sections.tsx`, `components/useStillMode.ts`

**Interfaces:**
- `useStillMode(): "pending" | "theater" | "still"` reads `useMotionPreference()`, probes `webgl2`/`webgl`, checks `location.search` for `still`, and listens for a `theater:lost` window event (dispatched by the canvas on context loss).
- Every scene section renders `<div className="slot" data-slot="<SceneId>" data-eye="1.6" data-house="0">` with `aspect-ratio: 16 / 10`; hero and intertitle slots contain their display text; project slots are empty in theater mode and contain `<StillFrame>` in still mode. The contact slot carries `data-eye="4" data-house="1"`.
- `Chapters` renders the work intertitle (`work-title`) and one `ProjectChapter` per project in the existing order; slide state lives in the store (`useTheater(s => s.slides[i])`, `theater.setSlide(i, next)`); the caption is `aria-live="polite"`; in theater mode a visually hidden paragraph carries the current slide's alt text.
- Slot widths: hero `min(58vw, 80svh * 1.6)`; intertitles `min(96vw, 1.44 * 88svh)`; projects `min(62vw, 1.6 * 56svh)`; contact `min(50vw, 1.6 * 46svh)`; below 768px all are `92vw` except intertitles at `96vw`.
- Project chapter (desktop): `section.chapter { min-height: 130svh }` containing `div.stage { position: sticky; top: 0; min-height: 100svh; display: grid; grid-template-rows: auto auto; align-content: center }`: the slot, then a copy row `grid-template-columns: 1.1fr 1.3fr .8fr` with title + category, description + link + "Behind the project" disclosure + footnote, and the controls (caption, dots, arrows). Below 768px the stage is not sticky and the chapter is `min-height: auto`.
- Intertitle sections (`work-title`, `about`, `private`): the slot is `position: sticky; top: 0` inside a section; `about` and `private` place their disclosure rows after the slot so they scroll over the screen.
- Overlays: `.curtain` (fixed black, fades out on `ready` or immediately in still mode), `.vignette` (fixed radial gradient), `.grain` (fixed, `Grain` component paints a 256px noise canvas once and uses its data URL as a stepped-animation background, desktop only).

- [ ] **Step 1: Write the shell in still mode first.** Build every section with real content, the nav (72px, fixed, `backdrop-filter: blur(14px)`, DB. mark, Work / Approach / Let's talk, Pause motion button, mobile Menu/Close), hero copy and CTA "See the work", chapters with `StillFrame` (the existing `ScreenshotStudy` logic: `next/image` fill, 350ms crossfade, instant under reduced motion), approach, private work, contact (title card mailto, email, copy button with status, footer with "Still version" link to `/?still`).
- [ ] **Step 2: Verify in the browser** at 1440 and 390 with `/?still`: every section present, controls work, disclosures open, mobile menu toggles, focus visible, no horizontal overflow. `npx tsc --noEmit` passes.
- [ ] **Step 3: Commit** `feat: rebuild the page shell and the still version`

---

### Task 7: Theater canvas, camera rig and auditorium

**Files:**
- Create: `components/theater/Theater.tsx`, `components/theater/CameraRig.tsx`, `components/theater/Auditorium.tsx`, `components/theater/useSlots.ts`
- Modify: `components/Experience.tsx` (mount `Theater` through `next/dynamic` with `ssr: false` when mode is `theater`)

**Interfaces:**
- `Theater` renders `<Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping }} frameloop={paused ? "demand" : "always"} onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", () => window.dispatchEvent(new Event("theater:lost")))}>` fixed full-viewport with `aria-hidden`, fog `#0b0d0b` density 0.028, and a `tier` state (`"high" | "low"`) from `PerformanceMonitor onDecline`.
- `useSlots()` returns a ref to the live `[data-slot]` elements (queried on mount and on a `MutationObserver` of the content root).
- `CameraRig` per frame: read every slot's `getBoundingClientRect()`, `blendSlots`, `theater.setActive` when it changes, `solveCamera`, add pointer parallax (window `pointermove` into a ref, damped, `x ±0.35`, `y ±0.15` world units) and sway (`sin(t*0.37)*0.05`, `cos(t*0.29)*0.03`, frozen when paused), set `camera.position`, `camera.rotation.set(0,0,0)`, `camera.setViewOffset(W, H, 0, -shiftY * H / 2, W, H)`, `camera.updateProjectionMatrix()`, write `house` to a shared ref, and set `--px`/`--py` on the content root to the screen's projected parallax offset (`-(dx / worldWidth) * W`, `(dy / worldHeight) * H`) so slot content rides with the screen (`.slot > * { transform: translate(var(--px), var(--py)) }`).
- `Auditorium`: floor plane 60 x 80 at y = 0 (`MeshReflectorMaterial` on high tier: `blur [400,100] resolution 512 mixBlur 1 mixStrength 12 roughness 1 depthScale 1.1 color #0b0d0b metalness .15 mirror .35`; plain `meshStandardMaterial color #0b0d0b roughness .95` on low), 12 rows x 2 blocks x 7 seats as two `instancedMesh` (backs `0.55 x 1.05 x 0.12`, cushions `0.55 x 0.42 x 0.5`, `color #1b201b roughness .9`) between z = 4 and z = 26 leaving `|x| < 1.4` free, black masking box `16.6 x 10.6 x 0.3` behind the screen at z = -0.2, side walls at x = ±14, ceiling at y = 14, back wall at z = 32, a projector body (`0.5 x 0.4 x 0.7`, `#0f120f`) at `(0, 5.2, 27.8)` with an emissive lens disc (`#fff7d6`, intensity 6) and a `pointLight` (`#e9f3d6`, 1.2, distance 6).
- Lights: `ambientLight` celadon `0.06 + house * 0.5`, `hemisphereLight` (`#d2e8ab`, `#0b0d0b`, `0.05 + house * 0.7`), `RectAreaLight` at the screen (Task 8 sets its colour). Call `RectAreaLightUniformsLib.init()` once.

- [ ] **Step 1: Build the canvas, rig and auditorium; temporarily give the screen a plain dark material.**
- [ ] **Step 2: Verify in the browser:** the dark screen lands exactly on the hero slot (overlay the slot with a 1px outline in dev to compare), stays under the title while the pointer moves, parks on sticky slots, glides between chapters, the seats and floor are visible, no console errors, the frame rate stays smooth while scrolling.
- [ ] **Step 3: Commit** `feat: add the theater canvas, camera rig and auditorium`

---

### Task 8: Screen material and reel changes

**Files:**
- Create: `components/theater/Screen.tsx`, `components/theater/shaders.ts`

**Interfaces:**
- `Screen` renders the 16 x 10 plane at `(0, 6, 0)` with a `ShaderMaterial` (`toneMapped: false`) whose uniforms are `uA`, `uB`, `uHasA`, `uHasB`, `uMix`, `uBrightness`, `uSweep`, `uTime`, `uFlicker`, `uLamp`, plus the `RectAreaLight` (`16 x 10`, facing +z via `lookAt(0, 6, 30)`) whose colour damps toward the shown slide's average (or the lamp colour when blank) and whose intensity is `3.5 * uBrightness * (0.35 + 0.65 * hasImage)`.
- Content for the store state: `active = p<i>` shows `shotsFor[projects[i].kind][slides[i]]` through `textureSrc`; every other scene shows the blank lamp.
- Transition machine in a ref, advanced in `useFrame` with `delta`: project change or blank-to-image runs **reel** (fade out 180ms ease-in-out to brightness 0, wait for the texture, swap `uA`, sweep 300ms with `uSweep` 0 to 1 at brightness .15, fade in 400ms ease-out); slide change within a project runs **cut** (set `uB`, animate `uMix` 0 to 1 over 250ms ease-out with brightness dipping to .82 at the midpoint, then swap A = B and reset `uMix`). While a transition runs, call `invalidate()` each frame so paused mode still completes it. Prefetch the previous and next slide of the active project and the first slide of the next project through the cache, and `touch` the two textures on screen.
- Fragment shader: sample A and B, mix, `hasImg = mix(uHasA, uHasB, uMix)`; blank lamp `uLamp * (0.22 - 0.14 * smoothstep(0.15, 0.75, d))` with `d = distance(vUv, vec2(.5, .52))`; images get a lens vignette `1.0 - 0.18 * smoothstep(0.45, 0.85, d)`; flicker `1.0 + uFlicker * (hash(floor(uTime * 24.0)) - 0.5) * 0.06`; sweep bar `exp(-pow((vUv.x - uSweep) * 9.0, 2.0)) * uLamp * 0.9` when `uSweep >= 0`; multiply by `uBrightness`; end with `#include <tonemapping_fragment>` and `#include <colorspace_fragment>`.

- [ ] **Step 1: Build the screen; wire the area light colour.**
- [ ] **Step 2: Verify:** scrolling into each project shows the right slide with a reel change, the dots and arrows cut between slides, the room's light takes the slide's colour, the hero and intertitles show the lamp, loading never leaves a white frame.
- [ ] **Step 3: Commit** `feat: project the slides on the screen with reel changes`

---

### Task 9: Beam and dust

**Files:**
- Create: `components/theater/Beam.tsx`; add the beam and dust shaders to `components/theater/shaders.ts`

**Interfaces:**
- Beam geometry: a four-sided frustum from the lens rectangle (`0.32 x 0.2` at `(0, 5.2, 27.4)`) to the screen rectangle inset by 0.1 at z = 0, with an `aAlong` attribute (0 at the lens, 1 at the screen). Material: `ShaderMaterial` with `transparent`, `AdditiveBlending`, `depthWrite: false`, `side: DoubleSide`; intensity `pow(1.0 - vAlong, 1.4) * 0.55 + 0.06`, haze `0.6 + 0.4 * noise(vWorld.xz * 0.35 + uTime * 0.05)`, edge `pow(1.0 - abs(dot(normalize(vNormal), normalize(cameraPosition - vWorld))), 1.3)`, colour `uLamp * (1.0 - uHouse * 0.8)`, flicker shared with the screen. Dust: `Points` with 2400 (high) or 800 (low) positions sampled inside the frustum, size attenuation, soft disc from `gl_PointCoord`, drift `vec3(sin(uTime*0.3+seed), cos(uTime*0.2+seed)*0.5, 0.0) * 0.12`, brightness `pow(1.0 - along, 1.2)`.
- Pause: `uTime` only advances when `!theater.get().paused`; the document `visibilitychange` sets `frameloop` to `never` while hidden.

- [ ] **Step 1: Build the beam and dust.** **Step 2: Verify:** the beam reads as light in haze above the camera in every scene, dust drifts, pausing freezes drift and flicker but scrolling still moves the camera, nothing z-fights with the screen. **Step 3: Commit** `feat: add the projector beam and dust`

---

### Task 10: House lights, bloom tier, curtain and loading

**Files:**
- Modify: `components/theater/Theater.tsx` (`EffectComposer` with `Bloom luminanceThreshold .8 intensity .5 mipmapBlur radius .55` on the high tier only; set `theater.setReady(true)` after the first rendered frame), `components/Experience.tsx` (curtain), `app/globals.css`

- [ ] **Step 1: House lights:** the contact slot's `house` ramps the ambient and hemisphere lights and dims the beam; the closing card sits in the contact slot. **Step 2: Curtain:** `.curtain` fades over 900ms `--ease-out` when `ready`; the hero title keeps its 900ms clip-path reveal. **Step 3: Verify** both tiers (force `tier = "low"` once) and the context-loss path (`gl.getExtension("WEBGL_lose_context")?.loseContext()` from the console switches to the still version). **Step 4: Commit** `feat: house lights, bloom tier and curtain`

---

### Task 11: Responsive pass, polish and detector

- [ ] **Step 1: 768 and 390:** slots at 92vw, non-sticky stages, copy below the slot, nav menu, controls at 44px targets, no overflow, the hero title in flow above the slot, type sizes from `clamp()`.
- [ ] **Step 2: Browser surfaces and states:** selection, caret, focus ring (2px celadon, 5px offset), scrollbar, tabular numerals in the caption, hover states gated, disabled copy button state, keyboard pass through every control in order.
- [ ] **Step 3: Run** `sh .agents/skills/impeccable/scripts/impeccable detect --json app/globals.css components/Experience.tsx components/Chapters.tsx components/Sections.tsx components/Nav.tsx` and fix the mechanical findings.
- [ ] **Step 4:** `npm run build`, `npx tsc --noEmit`, `npm test` all pass. **Commit** `fix: responsive and polish pass`

---

### Task 12: Docs, finish review and documenter

- [ ] **Step 1:** Update `README.md` (experiences list, still version, no light theme), `PRODUCT.md` (brand personality and accessibility lines that mention the line field, theme and sticky layering), `DESIGN-RESEARCH.md` (implemented direction).
- [ ] **Step 2:** Capture `.impeccable/review/desktop.png` (1440 full page) and `mobile.png` (390) with entrance motion settled; spawn a fresh finish-review agent with the request, the spec, the direction contract (`.impeccable/surfaces/app-page-tsx.md`), the craft floor, the screenshots and the detector output; apply one fix batch; recapture; get the verdict.
- [ ] **Step 3:** Spawn the documenter (or follow `degraded/documenter.md` + `document.md`) to rewrite `DESIGN.md` and `.impeccable/design.json` from the built world. **Commit** `docs: document the projector room`
