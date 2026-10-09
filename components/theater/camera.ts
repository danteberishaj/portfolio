/** Pure camera maths: the DOM lays out a 16:10 slot per scene and the camera is solved to land the 3D screen on it. */
export const SCREEN = { width: 16, height: 10, bottom: 1 } as const;
export const FOV = 42;
export const EYE = 1.6;

export type Rect = { left: number; top: number; width: number; height: number };
export type Slot = { id: string; rect: Rect; eye: number; house: number };
export type Target = { rect: Rect; eye: number; house: number; active: string | null; presence: number };
export type CameraPose = { x: number; y: number; z: number; shiftY: number };
export type Viewport = { width: number; height: number };

const tanHalf = (fov: number) => Math.tan(((fov / 2) * Math.PI) / 180);

/** 1 when a slot's centre sits on the focus line (45% down the viewport), easing to 0 at 70% of the viewport height away. */
export function presence(centreY: number, viewportHeight: number): number {
  const u = Math.min(1, Math.abs(centreY - viewportHeight * 0.45) / (viewportHeight * 0.7));
  return 1 - u * u * (3 - 2 * u);
}

/** Presence-weighted blend of every slot near the focus; holds the fallback when none is near. */
export function blendSlots(slots: Slot[], viewportHeight: number, fallback: Target): Target {
  let total = 0, best = 0, active: string | null = null;
  const rect = { left: 0, top: 0, width: 0, height: 0 };
  let eye = 0, house = 0;
  for (const slot of slots) {
    const p = presence(slot.rect.top + slot.rect.height / 2, viewportHeight);
    if (p <= 0) continue;
    total += p;
    rect.left += slot.rect.left * p; rect.top += slot.rect.top * p;
    rect.width += slot.rect.width * p; rect.height += slot.rect.height * p;
    eye += slot.eye * p; house += slot.house * p;
    if (p > best) { best = p; active = slot.id; }
  }
  if (total < 0.02) return { ...fallback, presence: 0 };
  return {
    rect: { left: rect.left / total, top: rect.top / total, width: rect.width / total, height: rect.height / total },
    eye: eye / total, house: house / total, active, presence: total,
  };
}

/** A straight-ahead camera (looking down -z at the screen on z = 0) whose frame is shifted vertically so the screen lands on `rect`. */
export function solveCamera(rect: Rect, viewport: Viewport, eye: number, fov = FOV): CameraPose {
  const t = tanHalf(fov);
  const aspect = viewport.width / viewport.height;
  const fraction = Math.max(0.05, rect.width / viewport.width);
  const z = SCREEN.width / (fraction * 2 * t * aspect);
  const worldWidth = SCREEN.width / fraction;
  const cx = (rect.left + rect.width / 2) / viewport.width;
  const cy = (rect.top + rect.height / 2) / viewport.height;
  const elevation = (SCREEN.bottom + SCREEN.height / 2 - eye) / (z * t);
  return { x: -(cx - 0.5) * worldWidth, y: eye, z, shiftY: elevation - (1 - 2 * cy) };
}

/** Where the screen lands for a pose; the inverse of solveCamera, used by the tests and by the DOM parallax. */
export function projectScreen(pose: CameraPose, viewport: Viewport, fov = FOV): Rect {
  const t = tanHalf(fov);
  const halfH = pose.z * t;
  const halfW = halfH * (viewport.width / viewport.height);
  const nx = (x: number) => (x - pose.x) / halfW;
  const ny = (y: number) => (y - pose.y) / halfH - pose.shiftY;
  const left = ((nx(-SCREEN.width / 2) + 1) / 2) * viewport.width;
  const right = ((nx(SCREEN.width / 2) + 1) / 2) * viewport.width;
  const top = ((1 - ny(SCREEN.bottom + SCREEN.height)) / 2) * viewport.height;
  const bottom = ((1 - ny(SCREEN.bottom)) / 2) * viewport.height;
  return { left, top, width: right - left, height: bottom - top };
}

/** Linear interpolation between poses, for damping. */
export function lerpPose(a: CameraPose, b: CameraPose, k: number): CameraPose {
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k, shiftY: a.shiftY + (b.shiftY - a.shiftY) * k };
}
