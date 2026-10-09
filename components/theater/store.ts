"use client";
import { useSyncExternalStore } from "react";

export type SceneId = "hero" | "work-title" | `p${number}` | "about" | "contact";
export type TheaterState = { active: SceneId; slides: number[]; paused: boolean; ready: boolean };

/** The one piece of state the DOM controls and the 3D screen share. No React state, no re-renders on scroll. */
export function createTheaterStore(projectCount: number) {
  let state: TheaterState = { active: "hero", slides: Array.from({ length: projectCount }, () => 0), paused: false, ready: false };
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  return {
    get: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setActive(active: SceneId) { if (state.active !== active) { state = { ...state, active }; emit(); } },
    setSlide(project: number, index: number) {
      if (state.slides[project] === index) return;
      const slides = state.slides.slice();
      slides[project] = index;
      state = { ...state, slides };
      emit();
    },
    setPaused(paused: boolean) { if (state.paused !== paused) { state = { ...state, paused }; emit(); } },
    setReady(ready: boolean) { if (state.ready !== ready) { state = { ...state, ready }; emit(); } },
  };
}
export type TheaterStore = ReturnType<typeof createTheaterStore>;

export const theater = createTheaterStore(11);

export function useTheater<T>(select: (state: TheaterState) => T): T {
  return useSyncExternalStore(theater.subscribe, () => select(theater.get()), () => select(theater.get()));
}

/** Project index for a scene id, or -1 for scenes without a project. */
export function projectOf(id: SceneId): number {
  const match = /^p(\d+)$/.exec(id);
  return match ? Number(match[1]) : -1;
}
