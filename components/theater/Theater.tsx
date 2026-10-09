"use client";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import Auditorium from "./Auditorium";
import Beam from "./Beam";
import CameraRig, { type RoomState } from "./CameraRig";
import { EYE, FOV, roomLayout } from "./camera";
import Screen from "./Screen";
import { theater, useTheater } from "./store";

RectAreaLightUniformsLib.init();

const CELADON = new THREE.Color("#d2e8ab");

/** Ambient and hemisphere light follow the house-light ramp from the contact scene. */
function HouseLights({ room }: { room: MutableRefObject<RoomState> }) {
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const down = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    const house = room.current.house;
    if (ambient.current) ambient.current.intensity = 0.05 + house * 1.2;
    if (hemi.current) hemi.current.intensity = 0.04 + house * 1.6;
    if (down.current) down.current.intensity = house * 2.6;
  });
  return <>
    <ambientLight ref={ambient} color={CELADON} intensity={0.05} />
    <hemisphereLight ref={hemi} color={CELADON} groundColor={new THREE.Color("#0b0d0b")} intensity={0.04} />
    <directionalLight ref={down} color={CELADON} intensity={0} position={[4, 14, 20]} />
  </>;
}

/** Stops rendering while the tab is hidden; on demand while paused (scroll and pointer still invalidate). */
function FrameloopControl() {
  const setFrameloop = useThree((state) => state.setFrameloop);
  const invalidate = useThree((state) => state.invalidate);
  const paused = useTheater((state) => state.paused);
  useEffect(() => {
    const apply = () => setFrameloop(document.hidden ? "never" : paused ? "demand" : "always");
    apply();
    document.addEventListener("visibilitychange", apply);
    const wake = () => invalidate();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => { document.removeEventListener("visibilitychange", apply); window.removeEventListener("scroll", wake); window.removeEventListener("pointermove", wake); window.removeEventListener("resize", wake); };
  }, [paused, setFrameloop, invalidate]);
  return null;
}

function Room({ tier, room }: { tier: "high" | "low"; room: MutableRefObject<RoomState> }) {
  const size = useThree((state) => state.size);
  const layout = roomLayout(size.width < size.height);
  return <>
    <Auditorium tier={tier} layout={layout} />
    <Screen room={room} />
    <Beam room={room} tier={tier} lensZ={layout.lensZ} />
  </>;
}

export default function Theater() {
  const [tier, setTier] = useState<"high" | "low">(() => (typeof window !== "undefined" && window.innerWidth < 900 ? "low" : "high"));
  const room = useRef<RoomState>({ house: 0, time: 0 });
  return <div className="theater" aria-hidden>
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: FOV, near: 0.1, far: 120, position: [0, EYE, 22] }}
      gl={{ antialias: tier === "low", powerPreference: "high-performance", toneMapping: THREE.NoToneMapping }}
      onCreated={({ gl, scene }) => {
        scene.fog = new THREE.FogExp2("#0b0d0b", 0.026);
        gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); theater.setReady(false); window.dispatchEvent(new Event("theater:lost")); });
      }}
    >
      <color attach="background" args={["#0b0d0b"]} />
      <PerformanceMonitor onDecline={() => setTier("low")} flipflops={2} />
      <FrameloopControl />
      <HouseLights room={room} />
      <Room tier={tier} room={room} />
      <CameraRig room={room} />
      {tier === "high" && <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.2} intensity={0.35} mipmapBlur radius={0.45} />
      </EffectComposer>}
    </Canvas>
  </div>;
}
