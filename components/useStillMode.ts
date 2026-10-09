"use client";
import { useEffect, useState } from "react";
import useMotionPreference from "./useMotionPreference";

export type Mode = "pending" | "theater" | "still";

/**
 * Decides whether the page runs the WebGL theater or the still version.
 * Still wins for reduced motion (live), missing WebGL, a lost context, or `/?still`.
 */
export default function useStillMode(): Mode {
  const reduced = useMotionPreference();
  const [support, setSupport] = useState<"unknown" | "yes" | "no">("unknown");
  const [lost, setLost] = useState(false);
  const [forced, setForced] = useState(false);
  useEffect(() => {
    setForced(new URLSearchParams(window.location.search).has("still"));
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      supported = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch { supported = false; }
    setSupport(supported ? "yes" : "no");
    const onLost = () => setLost(true);
    window.addEventListener("theater:lost", onLost);
    return () => window.removeEventListener("theater:lost", onLost);
  }, []);
  if (support === "unknown") return "pending";
  return reduced || support === "no" || lost || forced ? "still" : "theater";
}
