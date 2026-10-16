import { describe, expect, test } from "vitest";
import { chooseActive, EYE, focusPair, pinnedTarget, presencesOf, projectScreen, solveCamera, trackedTarget, type Slot } from "../components/theater/camera";

const vp = { width: 1440, height: 900 };
const slot = (id: string, top: number, extra: Partial<Slot> = {}): Slot => ({ id, rect: { left: 320, top, width: 800, height: 500 }, eye: EYE, house: 0, ...extra });
/** The page's slots as they sit on the viewport after scrolling `y` pixels. */
const page = (y: number) => [slot("hero", 200 - y), slot("p0", 1100 - y), slot("p1", 2000 - y), slot("contact", 2900 - y, { eye: 4, house: 1 })];

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

describe("focusPair", () => {
  test("returns null without slots", () => {
    expect(focusPair([], 900)).toBeNull();
  });
  test("tracks the first slot before the focus line reaches it", () => {
    const pair = focusPair(page(0), 900)!;
    expect(pair.a.id).toBe("hero"); expect(pair.b.id).toBe("hero"); expect(pair.t).toBe(0);
  });
  test("tracks the last slot once the focus line is past it", () => {
    const pair = focusPair(page(4000), 900)!;
    expect(pair.a.id).toBe("contact"); expect(pair.b.id).toBe("contact"); expect(pair.t).toBe(0);
  });
  test("finds the pair around the focus line and a share that only grows with the scroll", () => {
    let previous = -1;
    for (let y = 50; y < 900; y += 50) {
      const pair = focusPair(page(y), 900)!;
      expect(pair.a.id).toBe("hero"); expect(pair.b.id).toBe("p0");
      expect(pair.t).toBeGreaterThan(previous);
      previous = pair.t;
    }
    expect(previous).toBeGreaterThan(0.9);
    expect(focusPair(page(900), 900)!.a.id).toBe("p0");
  });
  test("does not care about the order the slots arrive in", () => {
    const pair = focusPair([...page(1200)].reverse(), 900)!;
    expect(pair.a.id).toBe("p0"); expect(pair.b.id).toBe("p1");
  });
});

describe("pinnedTarget", () => {
  test("keeps the centre on the focus line between two slots that scroll together, whatever the scroll", () => {
    for (let y = 0; y <= 1500; y += 100) {
      const target = pinnedTarget(focusPair(page(y), 900)!);
      expect(target.rect.top + target.rect.height / 2).toBeCloseTo(450, 6);
      expect(target.rect.left).toBe(320);
    }
  });
  test("tweens the eye and the house lights toward the contact slot", () => {
    const before = pinnedTarget(focusPair(page(1500), 900)!);
    const midway = pinnedTarget(focusPair(page(2450), 900)!);
    expect(before.eye).toBeCloseTo(EYE, 6); expect(before.house).toBeCloseTo(0, 6);
    expect(midway.eye).toBeGreaterThan(EYE); expect(midway.eye).toBeLessThan(4);
    expect(midway.house).toBeGreaterThan(0); expect(midway.house).toBeLessThan(1);
  });
  test("lands exactly on a slot whose centre sits on the focus line", () => {
    const target = pinnedTarget(focusPair(page(900), 900)!);
    expect(target.rect).toEqual({ left: 320, top: 200, width: 800, height: 500 });
  });
});

describe("trackedTarget", () => {
  test("frames the active slot of the pair and nothing in between", () => {
    const pair = focusPair(page(1500), 900)!;
    expect(trackedTarget(pair, "p0").rect).toEqual(pair.a.rect);
    expect(trackedTarget(pair, "p1").rect).toEqual(pair.b.rect);
    expect(trackedTarget(pair, "hero").rect).toEqual(pair.a.rect);
  });
});

describe("presencesOf", () => {
  test("shares the screen between the pair and sums to one", () => {
    const presences = presencesOf(focusPair(page(1400), 900)!);
    expect(presences.map((p) => p.id)).toEqual(["p0", "p1"]);
    expect(presences[0].presence + presences[1].presence).toBeCloseTo(1, 6);
  });
  test("gives a lone slot the whole screen", () => {
    expect(presencesOf(focusPair(page(0), 900)!)).toEqual([{ id: "hero", presence: 1 }]);
  });
});

describe("chooseActive", () => {
  test("keeps the incumbent on an empty hand", () => {
    expect(chooseActive([], "p3")).toBe("p3");
  });
  test("a title card takes the screen as soon as it is nearly level", () => {
    expect(chooseActive([{ id: "p10", presence: 0.55 }, { id: "about", presence: 0.45 }], "p10")).toBe("about");
  });
  test("a project needs a clear majority over a title card", () => {
    expect(chooseActive([{ id: "p10", presence: 0.6 }, { id: "about", presence: 0.45 }], "about")).toBe("about");
    expect(chooseActive([{ id: "p10", presence: 0.8 }, { id: "about", presence: 0.4 }], "about")).toBe("p10");
  });
  test("projects hand over to each other with a margin", () => {
    expect(chooseActive([{ id: "p1", presence: 0.6 }, { id: "p2", presence: 0.5 }], "p1")).toBe("p1");
    expect(chooseActive([{ id: "p1", presence: 0.3 }, { id: "p2", presence: 0.7 }], "p1")).toBe("p2");
  });
  test("a scroll through the page hands the screen over once per scene and never back", () => {
    let active: string | null = "hero";
    const seen: string[] = ["hero"];
    for (let y = 0; y <= 3000; y += 25) {
      active = chooseActive(presencesOf(focusPair(page(y), 900)!), active);
      if (active !== seen[seen.length - 1]) seen.push(active!);
    }
    expect(seen).toEqual(["hero", "p0", "p1", "contact"]);
  });
});
