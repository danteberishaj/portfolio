/** Pure camera maths: the DOM lays out a 16:10 slot per scene and the camera is solved to land the 3D screen on it. */
export const SCREEN = { width: 16, height: 10, bottom: 1 } as const;
export const FOV = 42;
export const EYE = 1.6;
/** The focus line: where the screen holds on the viewport, as a fraction of its height from the top. */
export const FOCUS = 0.5;

/** Portrait viewports need a wider lens and a deeper room, or the camera ends up behind the projector. */
export function roomLayout(portrait: boolean) {
  return portrait ? { fov: 62, lensZ: 44, backZ: 52, rows: 18 } : { fov: FOV, lensZ: 27.4, backZ: 32, rows: 12 };
}

export type Rect = { left: number; top: number; width: number; height: number };
export type Slot = { id: string; rect: Rect; eye: number; house: number };
export type Presence = { id: string; presence: number };
export type Target = { rect: Rect; eye: number; house: number; presences: Presence[] };
export type Pair = { a: Slot; b: Slot; t: number };
export type CameraPose = { x: number; y: number; z: number; shiftY: number };
export type Viewport = { width: number; height: number };

const tanHalf = (fov: number) => Math.tan(((fov / 2) * Math.PI) / 180);
const centreOf = (slot: Slot) => slot.rect.top + slot.rect.height / 2;

/**
 * The two slots either side of the focus line and how far the line sits between their centres: 0 at `a`, 1 at `b`.
 * Before the first slot or after the last, both are that slot and the camera simply tracks it.
 * `t` only grows as the page scrolls down, so nothing derived from it can move against the scroll.
 */
export function focusPair(slots: Slot[], viewportHeight: number, focus = FOCUS): Pair | null {
  if (!slots.length) return null;
  const sorted = [...slots].sort((p, q) => centreOf(p) - centreOf(q));
  const line = viewportHeight * focus;
  if (line <= centreOf(sorted[0])) return { a: sorted[0], b: sorted[0], t: 0 };
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i], b = sorted[i + 1];
    const ca = centreOf(a), cb = centreOf(b);
    if (line < cb) { const span = cb - ca; return { a, b, t: span > 0 ? (line - ca) / span : 1 }; }
  }
  const last = sorted[sorted.length - 1];
  return { a: last, b: last, t: 0 };
}

/** How much of the screen each slot of the pair owns; they sum to 1. */
export function presencesOf({ a, b, t }: Pair): Presence[] {
  if (a.id === b.id) return [{ id: a.id, presence: 1 }];
  return [{ id: a.id, presence: 1 - t }, { id: b.id, presence: t }];
}

export function lerpRect(a: Rect, b: Rect, k: number): Rect {
  return { left: a.left + (b.left - a.left) * k, top: a.top + (b.top - a.top) * k, width: a.width + (b.width - a.width) * k, height: a.height + (b.height - a.height) * k };
}

/**
 * The pinned framing: a linear blend of the pair. Two slots that scroll together blend to a centre that sits
 * exactly on the focus line, so the screen holds its place while the page moves past it and only its size,
 * the eye height and the house lights tween from one scene to the next.
 */
export function pinnedTarget(pair: Pair): Target {
  const { a, b, t } = pair;
  return { rect: lerpRect(a.rect, b.rect, t), eye: a.eye + (b.eye - a.eye) * t, house: a.house + (b.house - a.house) * t, presences: presencesOf(pair) };
}

/** The tracked framing: the active slot's own rectangle, for layouts where the copy sits under the screen. */
export function trackedTarget(pair: Pair, active: string | null): Target {
  const slot = active === pair.b.id ? pair.b : pair.a;
  return { rect: slot.rect, eye: slot.eye, house: slot.house, presences: presencesOf(pair) };
}

/** Which scene owns the screen. Title cards win ties and take over early; a project needs a clear majority, so a slide never plays under a title. */
export function chooseActive(presences: Presence[], current: string | null): string | null {
  if (!presences.length) return current;
  const isProject = (id: string) => /^p\d+$/.test(id);
  const sorted = [...presences].sort((a, b) => b.presence - a.presence);
  const best = sorted[0];
  if (best.presence <= 0) return current;
  const incumbentPresence = presences.find((p) => p.id === current)?.presence ?? 0;
  const bestTitle = sorted.find((p) => !isProject(p.id));
  // A title card claims the screen as soon as it is nearly level with whatever leads.
  if (bestTitle && bestTitle.id !== current && bestTitle.presence >= best.presence - 0.15 && bestTitle.presence > incumbentPresence - 0.15) return bestTitle.id;
  if (best.id === current) return current;
  // A project needs a clear majority over the incumbent.
  return best.presence - incumbentPresence > 0.25 ? best.id : current;
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
