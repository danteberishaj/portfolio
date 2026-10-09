import { describe, expect, test, vi } from "vitest";
import { createTheaterStore, projectOf } from "../components/theater/store";

describe("theater store", () => {
  test("starts on the hero with every project on slide 0", () => {
    const store = createTheaterStore(3);
    expect(store.get()).toEqual({ active: "hero", slides: [0, 0, 0], paused: false, ready: false });
  });
  test("notifies on change and not on no-op", () => {
    const store = createTheaterStore(2);
    const spy = vi.fn();
    store.subscribe(spy);
    store.setActive("p1"); store.setActive("p1");
    store.setSlide(1, 2); store.setSlide(1, 2);
    store.setPaused(true);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(store.get().slides).toEqual([0, 2]);
  });
  test("keeps the slides array reference when nothing changed", () => {
    const store = createTheaterStore(1);
    const before = store.get().slides;
    store.setActive("about");
    expect(store.get().slides).toBe(before);
  });
  test("maps scene ids to project indices", () => {
    expect(projectOf("p4")).toBe(4);
    expect(projectOf("hero")).toBe(-1);
    expect(projectOf("private")).toBe(-1);
  });
});
