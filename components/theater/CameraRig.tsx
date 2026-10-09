"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { blendSlots, EYE, roomLayout, solveCamera, type Target } from "./camera";
import { theater, type SceneId } from "./store";
import useSlots from "./useSlots";

export type RoomState = { house: number; time: number };

/**
 * Reads every scene slot each frame, blends them by presence, and lands the screen on the result.
 * Straight-ahead camera, vertical view shift (no keystone), lateral dolly for the horizontal position.
 */
export default function CameraRig({ room }: { room: MutableRefObject<RoomState> }) {
  const slots = useSlots();
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const last = useRef<Target>({ rect: { left: 0, top: 0, width: 1, height: 0.625 }, eye: EYE, house: 0, active: "hero", presence: 0 });
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
    const target = blendSlots(measured, size.height, last.current);
    last.current = target;
    if (target.active && target.active !== theater.get().active) theater.setActive(target.active as SceneId);
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

    // The screen shifts opposite to the camera's parallax; projected DOM text rides with it.
    const worldWidth = 16 / Math.max(0.05, target.rect.width / size.width);
    const worldHeight = worldWidth / (size.width / size.height);
    const root = document.documentElement;
    root.style.setProperty("--px", `${(-dx / worldWidth) * size.width}px`);
    root.style.setProperty("--py", `${(dy / worldHeight) * size.height}px`);

    if (first.current) { first.current = false; theater.setReady(true); }
  });
  return null;
}
