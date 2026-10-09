import * as THREE from "three";

export type Rgb = [number, number, number];
export type Loaded = { texture: THREE.Texture; colour: Rgb };

/** Mean rgb (0..1) of an RGBA byte buffer; alpha is ignored. */
export function averageOfPixels(data: ArrayLike<number>): Rgb {
  let r = 0, g = 0, b = 0;
  const count = Math.floor(data.length / 4);
  for (let i = 0; i < count; i++) { r += data[i * 4]; g += data[i * 4 + 1]; b += data[i * 4 + 2]; }
  if (!count) return [0, 0, 0];
  return [r / count / 255, g / count / 255, b / count / 255];
}

/** Average colour of an image, sampled through a tiny canvas. Falls back to a neutral grey without a 2D context. */
export function sampleAverage(image: CanvasImageSource, width = 16, height = 10): Rgb {
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [0.5, 0.5, 0.5];
  context.drawImage(image, 0, 0, width, height);
  return averageOfPixels(context.getImageData(0, 0, width, height).data);
}

/** Raw file on wide screens; the Next image optimizer at 1080px on narrow ones. */
export function textureSrc(src: string, narrow: boolean): string {
  return narrow ? `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=80` : src;
}

const loader = new THREE.TextureLoader();
export async function loadImageTexture(src: string): Promise<Loaded> {
  const texture = await loader.loadAsync(src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return { texture, colour: sampleAverage(texture.image as CanvasImageSource) };
}

/** A small least-recently-used cache so at most `max` slides stay on the GPU. */
export function createTextureCache(load: (src: string) => Promise<Loaded>, max = 8) {
  const entries = new Map<string, { promise: Promise<Loaded>; last: number }>();
  let tick = 0;
  function evict() {
    while (entries.size > max) {
      let oldestKey: string | null = null, oldest = Infinity;
      entries.forEach((entry, key) => { if (entry.last < oldest) { oldest = entry.last; oldestKey = key; } });
      if (oldestKey === null) return;
      const entry = entries.get(oldestKey)!;
      entries.delete(oldestKey);
      entry.promise.then((loaded) => loaded.texture.dispose()).catch(() => undefined);
    }
  }
  return {
    get(src: string): Promise<Loaded> {
      let entry = entries.get(src);
      if (!entry) { entry = { promise: load(src), last: 0 }; entries.set(src, entry); }
      entry.last = ++tick;
      evict();
      return entry.promise;
    },
    touch(src: string) { const entry = entries.get(src); if (entry) entry.last = ++tick; },
    get size() { return entries.size; },
    dispose() { entries.forEach((entry) => entry.promise.then((loaded) => loaded.texture.dispose()).catch(() => undefined)); entries.clear(); },
  };
}
export type TextureCache = ReturnType<typeof createTextureCache>;
