"use client";
import { useEffect, useRef } from "react";

/** Film grain: a 256px noise tile painted once at runtime (no shipped raster) and stepped across a fixed overlay. */
export default function Grain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return;
    const image = context.createImageData(256, 256);
    for (let i = 0; i < image.data.length; i += 4) {
      const value = 128 + (Math.random() - 0.5) * 150;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    ref.current?.style.setProperty("--grain", `url(${canvas.toDataURL("image/png")})`);
  }, []);
  return <div ref={ref} className="grain" aria-hidden />;
}
