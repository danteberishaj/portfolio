"use client";

import { useEffect, useRef } from "react";

export type FieldMode = "Flow" | "Orbit" | "Terrain";

/** An original, procedural line-field. No video, image, or per-frame React state. */
export default function ParticleField({
  mode, paused, light,
}: { mode: FieldMode; paused: boolean; light: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 1, height = 1, frame = 0, phase = 0, previous = 0;
    let visible = true, disposed = false;
    const pointer = { x: -1000, y: -1000, tx: -1000, ty: -1000 };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");

    function draw(now: number) {
      if (disposed || !ctx || !canvas) return;
      const delta = previous ? Math.min((now - previous) / 1000, 0.04) : 0;
      previous = now;
      if (!paused && !reduced.matches) phase += delta;
      pointer.x += (pointer.tx - pointer.x) * 0.065;
      pointer.y += (pointer.ty - pointer.y) * 0.065;
      ctx.clearRect(0, 0, width, height);
      const mobile = width < 680;
      const rows = mobile ? 45 : 70;
      const points = mobile ? 105 : 150;
      const cx = width * (mobile ? 0.58 : 0.66);
      const cy = height * (mobile ? 0.62 : 0.53);

      for (let row = 0; row < rows; row++) {
        const v = row / (rows - 1);
        const brightness = Math.sin(v * Math.PI);
        ctx.beginPath();
        for (let col = 0; col <= points; col++) {
          const u = (col / points - 0.5) * 2;
          let x: number, y: number;
          if (mode === "Orbit") {
            const angle = u * Math.PI * 1.27 + v * 0.8 + phase * 0.09;
            const radius = Math.min(width * 0.29, height * 0.43) * (0.65 + v * 0.6);
            x = cx + Math.cos(angle) * radius * 1.25;
            y = cy + Math.sin(angle) * radius * 0.65 + Math.sin(angle * 2 + phase * 0.4) * 55;
          } else if (mode === "Terrain") {
            x = cx + u * width * 0.57;
            y = cy + (v - 0.5) * height * 0.52
              - Math.exp(-Math.pow(u * 2 + Math.sin(v * 5 + phase * 0.25), 2)) * height * 0.28
              + Math.sin(u * 7 + phase * 0.3 + v * 2) * 22;
          } else {
            x = cx + u * width * (mobile ? 0.82 : 0.54);
            const twist = u * 3.1 + v * 1.8 + phase * 0.22;
            y = cy + Math.sin(twist) * height * 0.22
              + (v - 0.5) * height * 0.2 * Math.cos(u * 2 + phase * 0.2)
              + Math.sin(u * 5 + phase * 0.4) * height * 0.045;
            x += Math.cos(twist) * v * 60;
          }
          if (fine.matches && !reduced.matches && !paused) {
            const dx = x - pointer.x, dy = y - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = Math.exp(-distance * distance / 27000) * 42;
            x += dx / (distance + 1) * force;
            y += dy / (distance + 1) * force;
          }
          if (col === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const alpha = 0.08 + brightness * (light ? 0.48 : 0.62);
        ctx.strokeStyle = light ? `rgba(52,84,26,${alpha})` : `rgba(${165 + Math.round(v * 45)},${182 + Math.round(v * 42)},${129 + Math.round(v * 35)},${alpha})`;
        ctx.lineWidth = row % 9 === 0 ? 1.3 : 0.65;
        ctx.stroke();
      }
      if (visible && !document.hidden && !paused && !reduced.matches) frame = requestAnimationFrame(draw);
    }
    function redraw() {
      cancelAnimationFrame(frame);
      previous = 0;
      frame = requestAnimationFrame(draw);
    }
    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    }
    function move(event: PointerEvent) {
      if (!canvas || !fine.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left; pointer.ty = event.clientY - rect.top;
    }
    function leave() { pointer.tx = -1000; pointer.ty = -1000; }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) redraw(); else cancelAnimationFrame(frame);
    });
    observer.observe(canvas);
    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", move);
    parent?.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", redraw);
    reduced.addEventListener("change", redraw);
    resize();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      observer.disconnect(); resizeObserver.disconnect();
      parent?.removeEventListener("pointermove", move);
      parent?.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", redraw);
      reduced.removeEventListener("change", redraw);
    };
  }, [mode, paused, light]);

  return <canvas ref={canvasRef} className="flow-canvas" aria-hidden="true" />;
}
