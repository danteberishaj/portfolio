"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { chooseActive, EYE, focusPair, pinnedTarget, presencesOf, roomLayout, solveCamera, trackedTarget, type Rect, type Target } from "./camera";
import { theater, type SceneId } from "./store";
import useSlots from "./useSlots";

export type RoomState = { house: number; time: number };

/** From this width up the copy sits beside the screen, so the screen can hold its place while the page scrolls past. */
const PINNED_MIN_WIDTH = 1025;
/** In stacked layouts a scene change is a cut: the camera keeps the old framing while the reel goes dark, then glides to the new one in the black. */
const CUT_DELAY = 0.16, GLIDE = 35;

const projectedCache = new WeakMap<HTMLElement, HTMLElement | null>();
function projectedOf(slot: HTMLElement): HTMLElement | null {
  if (!projectedCache.has(slot)) projectedCache.set(slot, slot.parentElement?.querySelector<HTMLElement>(".projected") ?? null);
  return projectedCache.get(slot) ?? null;
}

type Cut = { id: string; since: number; rect: Rect; eye: number; house: number };
const settled = (cut: Cut) => Math.max(Math.abs(cut.rect.left), Math.abs(cut.rect.top), Math.abs(cut.rect.width), Math.abs(cut.rect.height)) < 0.5 && Math.abs(cut.eye) < 0.005 && Math.abs(cut.house) < 0.005;

/**
 * Reads every scene slot each frame and lands the screen where the page says it should be.
 * Straight-ahead camera, vertical view shift (no keystone), lateral dolly for the horizontal position.
 */
export default function CameraRig({ room }: { room: MutableRefObject<RoomState> }) {
  const slots = useSlots();
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const last = useRef<Target>({ rect: { left: 0, top: 0, width: 1, height: 0.625 }, eye: EYE, house: 0, presences: [] });
  const cut = useRef<Cut>({ id: "", since: -1, rect: { left: 0, top: 0, width: 0, height: 0 }, eye: 0, house: 0 });
  const first = useRef(true);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!matchMedia("(pointer: fine)").matches) return;
      pointer.current.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const leave = () => { pointer.current.tx = 0; pointer.current.ty = 0; };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave); };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const paused = theater.get().paused;
    if (!paused) room.current.time += dt;
    const measured = slots.current.map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.dataset.slot ?? "", rect: { left: r.left, top: r.top, width: r.width, height: r.height }, eye: Number(el.dataset.eye ?? EYE), house: Number(el.dataset.house ?? 0) };
    });
    const pair = focusPair(measured, size.height);
    const pinned = size.width >= PINNED_MIN_WIDTH;
    let active: string = theater.get().active;
    let target = last.current;
    if (pair) {
      active = chooseActive(presencesOf(pair), active) ?? pair.a.id;
      if (active !== theater.get().active) theater.setActive(active as SceneId);
      const c = cut.current;
      if (pinned) {
        target = pinnedTarget(pair);
        c.id = active; c.since = -1;
      } else {
        target = trackedTarget(pair, active);
        if (c.id !== active) {
          if (!first.current) {
            const prev = last.current;
            c.rect = { left: prev.rect.left - target.rect.left, top: prev.rect.top - target.rect.top, width: prev.rect.width - target.rect.width, height: prev.rect.height - target.rect.height };
            c.eye = prev.eye - target.eye; c.house = prev.house - target.house; c.since = 0;
          }
          c.id = active;
        }
        if (c.since >= 0) {
          c.since += dt;
          if (c.since > CUT_DELAY) {
            const keep = Math.exp(-GLIDE * dt);
            c.rect = { left: c.rect.left * keep, top: c.rect.top * keep, width: c.rect.width * keep, height: c.rect.height * keep };
            c.eye *= keep; c.house *= keep;
            if (settled(c)) c.since = -1;
          }
          if (c.since >= 0) {
            const r = target.rect;
            target = { ...target, rect: { left: r.left + c.rect.left, top: r.top + c.rect.top, width: r.width + c.rect.width, height: r.height + c.rect.height }, eye: target.eye + c.eye, house: target.house + c.house };
          }
        }
      }
    }
    last.current = target;
    room.current.house = target.house;

    const layout = roomLayout(size.width < size.height);
    camera.fov = layout.fov;
    const pose = solveCamera(target.rect, size, target.eye, layout.fov);
    const p = pointer.current;
    p.x = THREE.MathUtils.damp(p.x, p.tx, 4, dt);
    p.y = THREE.MathUtils.damp(p.y, p.ty, 4, dt);
    const t = room.current.time;
    const swayX = paused ? 0 : Math.sin(t * 0.37) * 0.05;
    const swayY = paused ? 0 : Math.cos(t * 0.29) * 0.03;
    const dx = p.x * 0.35 + swayX;
    const dy = -p.y * 0.15 + swayY;

    camera.position.set(pose.x + dx, pose.y + dy, pose.z);
    camera.rotation.set(0, 0, 0);
    camera.setViewOffset(size.width, size.height, 0, -pose.shiftY * size.height / 2, size.width, size.height);
    camera.updateProjectionMatrix();

    // Projected titles show for the active scene only and ride wherever the screen is, including its parallax.
    const worldWidth = 16 / Math.max(0.05, target.rect.width / size.width);
    const worldHeight = worldWidth / (size.width / size.height);
    const px = (-dx / worldWidth) * size.width, py = (dy / worldHeight) * size.height;
    const cx = target.rect.left + target.rect.width / 2, cy = target.rect.top + target.rect.height / 2;
    slots.current.forEach((el, i) => {
      const projected = projectedOf(el);
      const m = measured[i];
      if (!projected || !m) return;
      const on = m.id === active;
      if (on !== ("active" in projected.dataset)) { if (on) projected.dataset.active = ""; else delete projected.dataset.active; }
      if (!on && !(pair && (m.id === pair.a.id || m.id === pair.b.id))) return;
      const tx = cx - (m.rect.left + m.rect.width / 2) + px, ty = cy - (m.rect.top + m.rect.height / 2) + py;
      projected.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
    });

    if (first.current) { first.current = false; theater.setReady(true); }
  });
  return null;
}
