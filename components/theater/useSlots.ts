"use client";
import { useEffect, useRef } from "react";

/** Live list of the page's scene slots, refreshed whenever the script's DOM changes. */
export default function useSlots() {
  const slots = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const collect = () => { slots.current = Array.from(document.querySelectorAll<HTMLElement>("[data-slot]")); };
    collect();
    const root = document.querySelector(".script");
    const observer = new MutationObserver(collect);
    if (root) observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return slots;
}
