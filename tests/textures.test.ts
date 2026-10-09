import { describe, expect, test } from "vitest";
import { averageOfPixels, createTextureCache, textureSrc } from "../components/theater/textures";

describe("averageOfPixels", () => {
  test("averages rgb and ignores alpha", () => {
    const px = new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, 0]);
    const [r, g, b] = averageOfPixels(px);
    expect(r).toBeCloseTo(0.5); expect(g).toBe(0); expect(b).toBeCloseTo(0.5);
  });
  test("returns black for an empty buffer", () => {
    expect(averageOfPixels([])).toEqual([0, 0, 0]);
  });
});

describe("createTextureCache", () => {
  function fake() {
    const disposed: string[] = [];
    const load = async (src: string) => ({ texture: { dispose: () => disposed.push(src) } as never, colour: [0, 0, 0] as [number, number, number] });
    return { load, disposed };
  }
  test("dedupes requests", () => {
    const { load } = fake();
    const cache = createTextureCache(load, 2);
    const a = cache.get("a.jpg");
    expect(cache.get("a.jpg")).toBe(a);
    expect(cache.size).toBe(1);
  });
  test("evicts the least recently used entry and disposes it", async () => {
    const { load, disposed } = fake();
    const cache = createTextureCache(load, 2);
    cache.get("a"); cache.get("b"); cache.touch("a"); cache.get("c");
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(cache.size).toBe(2);
    expect(disposed).toEqual(["b"]);
  });
});

test("textureSrc uses the image optimizer on narrow screens", () => {
  expect(textureSrc("/projects/a.jpg", false)).toBe("/projects/a.jpg");
  expect(textureSrc("/projects/a.jpg", true)).toBe("/_next/image?url=%2Fprojects%2Fa.jpg&w=1080&q=80");
});
