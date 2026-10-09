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
const OUT = 0.18, SWEEP = 0.3, IN = 0.4, CUT = 0.25, WAIT_LIMIT = 4;
type Heading = { src: string | null; project: number };
type Phase = "idle" | "out" | "wait" | "sweep" | "in" | "cut";
const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, x), 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** The screen: two slide samplers, a reel change between projects, a cut between slides, and the room light it casts. */
export default function Screen({ room }: { room: MutableRefObject<RoomState> }) {
  const cache = useMemo(() => createTextureCache(loadImageTexture, 8), []);
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
    phase: "idle" as Phase, t: 0,
    shown: { src: null, project: -1 } as Heading, heading: null as Heading | null, want: { src: null, project: -1 } as Heading,
    loaded: null as Loaded | null, cutStarted: false, hasImage: 0,
    colour: LAMP.clone(), targetColour: LAMP.clone(),
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
      cache.get(textureSrc(shots[(index + 1) % n].src, narrow)).catch(() => undefined);
      cache.get(textureSrc(shots[(index - 1 + n) % n].src, narrow)).catch(() => undefined);
      if (projects[project + 1]) cache.get(textureSrc(shotsOf(projects[project + 1])[0].src, narrow)).catch(() => undefined);
    }
    if (s.shown.src) cache.touch(s.shown.src);
    invalidate();
  }, [active, slides, narrow, cache, invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = state.current, u = uniforms;
    if (!theater.get().paused) u.uTime.value += dt;

    const apply = (loaded: Loaded | null) => {
      u.uA.value = loaded?.texture ?? null; u.uHasA.value = loaded ? 1 : 0;
      s.hasImage = loaded ? 1 : 0;
      if (loaded) s.targetColour.setRGB(loaded.colour[0], loaded.colour[1], loaded.colour[2], THREE.SRGBColorSpace); else s.targetColour.copy(LAMP);
    };
    const begin = (heading: Heading) => {
      s.heading = heading; s.loaded = null; s.t = 0; s.cutStarted = false;
      if (heading.src) {
        const src = heading.src;
        cache.get(src).then((loaded) => { if (s.heading?.src === src) s.loaded = loaded; }).catch(() => { if (s.heading?.src === src) s.heading = { src: null, project: heading.project }; });
      }
      const cut = heading.src !== null && s.shown.src !== null && heading.project === s.shown.project;
      s.phase = cut ? "cut" : "out";
    };

    if (s.phase === "idle" && s.want.src !== s.shown.src) begin(s.want);
    // While holding for a texture, follow the latest wish instead of finishing a reel nobody asked for.
    const holding = s.phase === "wait" || (s.phase === "cut" && !s.cutStarted);
    if (holding && s.heading && s.want.src !== s.heading.src) {
      const next = s.want;
      s.heading = next; s.loaded = null; s.t = 0;
      if (next.src) { const src = next.src; cache.get(src).then((loaded) => { if (s.heading?.src === src) s.loaded = loaded; }).catch(() => { if (s.heading?.src === src) s.heading = { src: null, project: next.project }; }); }
      if (s.phase === "cut") s.phase = "out";
    }

    if (s.phase !== "idle") {
      s.t += dt;
      const heading = s.heading!;
      if (s.phase === "out") {
        u.uBrightness.value = 1 - easeInOut(Math.min(1, s.t / OUT));
        if (s.t >= OUT) { s.t = 0; if (!heading.src) { apply(null); s.phase = "in"; } else if (s.loaded) { apply(s.loaded); s.phase = "sweep"; } else s.phase = "wait"; }
      } else if (s.phase === "wait") {
        u.uBrightness.value = 0;
        if (s.loaded) { apply(s.loaded); s.phase = "sweep"; s.t = 0; }
        else if (s.t > WAIT_LIMIT) { apply(null); s.phase = "in"; s.t = 0; }
      } else if (s.phase === "sweep") {
        u.uSweep.value = Math.min(1, s.t / SWEEP); u.uBrightness.value = 0.15;
        if (s.t >= SWEEP) { u.uSweep.value = -1; s.phase = "in"; s.t = 0; }
      } else if (s.phase === "in") {
        u.uBrightness.value = easeOut(s.t / IN);
        if (s.t >= IN) { u.uBrightness.value = 1; s.phase = "idle"; s.shown = heading; s.heading = null; }
      } else if (s.phase === "cut") {
        if (!s.cutStarted) {
          if (!s.loaded) { if (!heading.src || s.t > WAIT_LIMIT) { s.phase = "out"; s.t = 0; } }
          else { s.cutStarted = true; u.uB.value = s.loaded.texture; u.uHasB.value = 1; u.uMix.value = 0; s.t = 0; s.targetColour.setRGB(s.loaded.colour[0], s.loaded.colour[1], s.loaded.colour[2], THREE.SRGBColorSpace); }
        } else {
          const k = easeOut(s.t / CUT);
          u.uMix.value = k; u.uBrightness.value = 1 - 0.18 * Math.sin(k * Math.PI);
          if (s.t >= CUT) { u.uA.value = u.uB.value; u.uHasA.value = 1; u.uB.value = null; u.uHasB.value = 0; u.uMix.value = 0; u.uBrightness.value = 1; s.phase = "idle"; s.shown = heading; s.heading = null; }
        }
      }
      invalidate();
    }

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
