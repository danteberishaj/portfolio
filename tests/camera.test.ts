import { describe, expect, test } from "vitest";
import { blendSlots, EYE, presence, projectScreen, solveCamera } from "../components/theater/camera";

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
    const rect = { left: 300, top: 90, width: 832, height: 520 };
    const back = projectScreen(solveCamera(rect, vp, EYE), vp);
    expect(back.left).toBeCloseTo(rect.left, 3);
    expect(back.top).toBeCloseTo(rect.top, 3);
    expect(back.width).toBeCloseTo(rect.width, 3);
    expect(back.height).toBeCloseTo(rect.height, 3);
  });
  test("works with a raised eye and an off-centre rect on a phone", () => {
    const phone = { width: 390, height: 844 };
    const rect = { left: 16, top: 400, width: 352, height: 220 };
    const back = projectScreen(solveCamera(rect, phone, 4), phone);
    expect(back.left).toBeCloseTo(rect.left, 3);
    expect(back.top).toBeCloseTo(rect.top, 3);
    expect(back.width).toBeCloseTo(rect.width, 3);
  });
  test("a wider rect means a closer camera", () => {
    const near = solveCamera({ left: 0, top: 0, width: 1382, height: 864 }, vp, EYE);
    const far = solveCamera({ left: 300, top: 0, width: 832, height: 520 }, vp, EYE);
    expect(near.z).toBeLessThan(far.z);
  });
});

describe("blendSlots", () => {
  const fallback = { rect: { left: 1, top: 1, width: 1, height: 1 }, eye: EYE, house: 0, active: "hero", presence: 0 };
  test("picks the slot at the focus and tracks it exactly", () => {
    const a = { id: "p0", rect: { left: 100, top: 300, width: 800, height: 500 }, eye: EYE, house: 0 };
    const b = { id: "p1", rect: { left: 100, top: 1900, width: 800, height: 500 }, eye: EYE, house: 1 };
    const target = blendSlots([a, b], 900, fallback);
    expect(target.active).toBe("p0");
    expect(target.rect.left).toBeCloseTo(a.rect.left, 6);
    expect(target.rect.top).toBeCloseTo(a.rect.top, 6);
    expect(target.rect.width).toBeCloseTo(a.rect.width, 6);
    expect(target.house).toBe(0);
  });
  test("blends two slots that are both near the focus", () => {
    const a = { id: "p0", rect: { left: 0, top: -200, width: 800, height: 500 }, eye: EYE, house: 0 };
    const b = { id: "p1", rect: { left: 0, top: 700, width: 800, height: 500 }, eye: EYE, house: 1 };
    const target = blendSlots([a, b], 900, fallback);
    expect(target.rect.top).toBeGreaterThan(-200);
    expect(target.rect.top).toBeLessThan(700);
    expect(target.house).toBeGreaterThan(0);
    expect(target.house).toBeLessThan(1);
  });
  test("holds the fallback when nothing is present", () => {
    const far = { id: "p0", rect: { left: 0, top: 5000, width: 10, height: 6 }, eye: EYE, house: 0 };
    expect(blendSlots([far], 900, fallback).rect).toEqual(fallback.rect);
  });
});
