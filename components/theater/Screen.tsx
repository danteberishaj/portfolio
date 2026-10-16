"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { projects, shotsOf } from "../projects";
import type { RoomState } from "./CameraRig";
import { screenFragment, screenVertex } from "./shaders";
import { projectOf, theater, useTheater } from "./store";
import { createTextureCache, loadImageTexture, textureSrc, type Loaded } from "./textures";

const LAMP = new THREE.Color("#e9f3d6");
/** Seconds: fade to black, hold in the black (the camera cuts here in stacked layouts), the light bar, fade in, a slide crossfade, and the longest wait for a texture. */
const OUT = 0.16, HOLD = 0.12, SWEEP = 0.28, IN = 0.4, CUT = 0.25, WAIT_LIMIT = 3;
type Heading = { src: string | null; project: number };
type Pending = { src: string; loaded: Loaded | null; failed: boolean; waited: number };
const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, x), 3);
const smooth = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };

/**
 * The screen: two slide samplers, a reel change between projects, a cut between slides, and the room light it casts.
 * The reel is interruptible: the light level moves toward dark whenever the screen is heading somewhere else and
 * toward lit once the wanted slide is on it, so scrolling through ten chapters is one blackout, not ten reels.
 */
export default function Screen({ room }: { room: MutableRefObject<RoomState> }) {
  const gl = useThree((state) => state.gl);
  // Uploading as soon as a texture lands keeps the first frame that shows it from paying for the upload.
  const cache = useMemo(() => createTextureCache((src) => loadImageTexture(src).then((loaded) => { gl.initTexture(loaded.texture); return loaded; }), 8), [gl]);
  useEffect(() => () => cache.dispose(), [cache]);
  const material = useRef<THREE.ShaderMaterial>(null);
  const light = useRef<THREE.RectAreaLight>(null);
  const invalidate = useThree((state) => state.invalidate);
  const width = useThree((state) => state.size.width);
  const narrow = width < 768;
  const active = useTheater((state) => state.active);
  const slides = useTheater((state) => state.slides);
  const uniforms = useMemo(() => ({
    uA: { value: null as THREE.Texture | null }, uB: { value: null as THREE.Texture | null },
    uHasA: { value: 0 }, uHasB: { value: 0 }, uMix: { value: 0 }, uBrightness: { value: 1 }, uSweep: { value: -1 },
    uTime: { value: 0 }, uFlicker: { value: 1 }, uLamp: { value: LAMP.clone() },
  }), []);
  const state = useRef({
    shown: { src: null, project: -1 } as Heading, want: { src: null, project: -1 } as Heading,
    pending: null as Pending | null,
    level: 1, hold: 0, sweep: -1, cut: -1, hasImage: 0,
    colour: LAMP.clone(), targetColour: LAMP.clone(), reported: "", reels: 0,
  });

  useLayoutEffect(() => { light.current?.lookAt(0, 6, 30); }, []);

  useEffect(() => {
    const s = state.current;
    const project = projectOf(active);
    if (project < 0) s.want = { src: null, project: -1 };
    else {
      const shots = shotsOf(projects[project]);
      const index = slides[project] ?? 0;
      s.want = { src: textureSrc(shots[index].src, narrow), project };
      const n = shots.length;
      const warm = (src: string) => cache.get(src).catch(() => undefined);
      warm(textureSrc(shots[(index + 1) % n].src, narrow));
      warm(textureSrc(shots[(index - 1 + n) % n].src, narrow));
      for (const neighbour of [project + 1, project - 1]) {
        if (!projects[neighbour]) continue;
        const theirs = shotsOf(projects[neighbour]);
        warm(textureSrc(theirs[slides[neighbour] ?? 0].src, narrow));
      }
    }
    if (s.shown.src) cache.touch(s.shown.src);
    invalidate();
  }, [active, slides, narrow, cache, invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.25); // a long frame advances the reel by up to a quarter second, so slow renderers still settle
    const s = state.current, u = uniforms;
    if (!theater.get().paused) u.uTime.value += dt;

    const apply = (loaded: Loaded | null) => {
      u.uA.value = loaded?.texture ?? null; u.uHasA.value = loaded ? 1 : 0;
      u.uB.value = null; u.uHasB.value = 0; u.uMix.value = 0;
      s.hasImage = loaded ? 1 : 0;
      if (loaded) s.targetColour.setRGB(loaded.colour[0], loaded.colour[1], loaded.colour[2], THREE.SRGBColorSpace); else s.targetColour.copy(LAMP);
    };
    const request = (src: string): Pending => {
      if (s.pending?.src === src) return s.pending;
      const pending: Pending = { src, loaded: null, failed: false, waited: 0 };
      s.pending = pending;
      cache.get(src).then((loaded) => { pending.loaded = loaded; }).catch(() => { pending.failed = true; });
      return pending;
    };

    let dark = false;
    if (s.cut >= 0) {
      // A slide crossfade: short, with a dip in the middle, never interrupted.
      s.cut += dt;
      const k = easeOut(s.cut / CUT);
      u.uMix.value = k; u.uBrightness.value = 1 - 0.18 * Math.sin(k * Math.PI);
      if (s.cut >= CUT) { u.uA.value = u.uB.value; u.uHasA.value = 1; u.uB.value = null; u.uHasB.value = 0; u.uMix.value = 0; u.uBrightness.value = 1; s.cut = -1; }
      invalidate();
    } else {
      if (s.want.src !== s.shown.src) {
        const pending = s.want.src ? request(s.want.src) : null;
        if (pending) pending.waited += dt;
        const usable = pending?.loaded && !pending.failed;
        const gaveUp = !!pending && (pending.failed || pending.waited > WAIT_LIMIT);
        const sameReel = s.want.src !== null && s.shown.src !== null && s.want.project === s.shown.project && s.level >= 1 && s.sweep < 0 && !gaveUp;
        if (sameReel) {
          // A slide change inside a project holds the current slide until the next one is ready, then crossfades.
          if (usable && pending) {
            const loaded = pending.loaded!;
            u.uB.value = loaded.texture; u.uHasB.value = 1; u.uMix.value = 0;
            s.targetColour.setRGB(loaded.colour[0], loaded.colour[1], loaded.colour[2], THREE.SRGBColorSpace);
            s.cut = 0; s.shown = s.want; s.pending = null;
          }
        } else {
          dark = true;
          if (s.level <= 0 && s.hold <= 0 && (!pending || usable || gaveUp)) {
            apply(usable && pending ? pending.loaded : null);
            s.shown = s.want; s.pending = null; s.reels += 1; s.hold = HOLD;
            if (s.hasImage) s.sweep = 0;
          }
        }
      }
      if (s.hold > 0) { s.hold -= dt; dark = true; }
      s.level = dark ? Math.max(0, s.level - dt / OUT) : Math.min(1, s.level + dt / IN);
      if (s.sweep >= 0 && s.hold <= 0) {
        s.sweep += dt;
        u.uSweep.value = Math.min(1, s.sweep / SWEEP);
        if (s.sweep >= SWEEP) { s.sweep = -1; u.uSweep.value = -1; }
      }
      u.uBrightness.value = smooth(s.level);
      if (dark || s.level < 1 || s.sweep >= 0) invalidate();
    }

    const phase = s.cut >= 0 ? "cut" : s.sweep >= 0 && s.hold <= 0 ? "sweep" : dark ? (s.level <= 0 ? "wait" : "out") : s.level < 1 ? "in" : "idle";
    if (s.reported !== phase) { s.reported = phase; document.documentElement.dataset.reel = phase; document.documentElement.dataset.reels = String(s.reels); }
    s.colour.lerp(s.targetColour, 1 - Math.exp(-4 * dt));
    if (light.current) {
      light.current.color.copy(s.colour);
      light.current.intensity = 4.2 * u.uBrightness.value * (0.3 + 0.7 * s.hasImage) * (1 - room.current.house * 0.5);
    }
  });

  return <group>
    <mesh position={[0, 6, 0]}>
      <planeGeometry args={[16, 10]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={screenVertex} fragmentShader={screenFragment} toneMapped={false} />
    </mesh>
    <rectAreaLight ref={light} args={[LAMP, 1.5, 16, 10]} position={[0, 6, 0.04]} />
  </group>;
}
