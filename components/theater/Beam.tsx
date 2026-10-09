"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { RoomState } from "./CameraRig";
import { beamFragment, beamVertex, dustFragment, dustVertex } from "./shaders";

const LAMP = new THREE.Color("#e9f3d6");
const LENS = new THREE.Vector3(0, 5.2, 27.4);
const lensAt = (z: number) => new THREE.Vector3(LENS.x, LENS.y, z);
const LENS_HALF = { x: 0.16, y: 0.1 };
const SCREEN_HALF = { x: 7.9, y: 4.9 };
const SCREEN_CENTRE = new THREE.Vector3(0, 6, 0);

const corners = (centre: THREE.Vector3, half: { x: number; y: number }) =>
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => new THREE.Vector3(centre.x + sx * half.x, centre.y + sy * half.y, centre.z));

/** Three quads (left, right, top) joining the lens rectangle to the screen rectangle, with an `aAlong` attribute from 0 at the lens to 1 at the screen. The underside is left open: the camera sits beneath the beam, and a face there would haze the screen. */
function frustumGeometry(lensZ: number) {
  const near = corners(lensAt(lensZ), LENS_HALF), far = corners(SCREEN_CENTRE, SCREEN_HALF);
  const positions: number[] = [], normals: number[] = [], alongs: number[] = [], indices: number[] = [];
  for (let i = 1; i < 4; i++) {
    const j = (i + 1) % 4;
    const quad: [THREE.Vector3, number][] = [[near[i], 0], [near[j], 0], [far[j], 1], [far[i], 1]];
    const normal = new THREE.Vector3().subVectors(near[j], near[i]).cross(new THREE.Vector3().subVectors(far[i], near[i])).normalize();
    const base = positions.length / 3;
    for (const [v, along] of quad) { positions.push(v.x, v.y, v.z); normals.push(normal.x, normal.y, normal.z); alongs.push(along); }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("aAlong", new THREE.Float32BufferAttribute(alongs, 1));
  geometry.setIndex(indices);
  return geometry;
}

/** Dust sampled inside the beam's volume. */
function dustGeometry(count: number, lensZ: number) {
  const LENS = lensAt(lensZ);
  const positions = new Float32Array(count * 3), alongs = new Float32Array(count), seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const along = Math.random();
    const hx = LENS_HALF.x + (SCREEN_HALF.x - LENS_HALF.x) * along, hy = LENS_HALF.y + (SCREEN_HALF.y - LENS_HALF.y) * along;
    const radius = Math.pow(Math.random(), 1.45), angle = Math.random() * Math.PI * 2;
    positions[i * 3] = LENS.x + (SCREEN_CENTRE.x - LENS.x) * along + Math.cos(angle) * radius * hx;
    positions[i * 3 + 1] = LENS.y + (SCREEN_CENTRE.y - LENS.y) * along + Math.sin(angle) * radius * hy;
    positions[i * 3 + 2] = LENS.z + (SCREEN_CENTRE.z - LENS.z) * along;
    alongs[i] = along; seeds[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aAlong", new THREE.BufferAttribute(alongs, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

export default function Beam({ room, tier, lensZ }: { room: React.MutableRefObject<RoomState>; tier: "high" | "low"; lensZ: number }) {
  const dpr = useThree((state) => state.viewport.dpr);
  const beam = useMemo(() => frustumGeometry(lensZ), [lensZ]);
  const dust = useMemo(() => dustGeometry(tier === "high" ? 1400 : 600, lensZ), [tier, lensZ]);
  useEffect(() => () => { beam.dispose(); }, [beam]);
  useEffect(() => () => { dust.dispose(); }, [dust]);
  const beamUniforms = useMemo(() => ({ uTime: { value: 0 }, uHouse: { value: 0 }, uFlicker: { value: 1 }, uLamp: { value: LAMP.clone().multiplyScalar(0.55) } }), []);
  const dustUniforms = useMemo(() => ({ uTime: { value: 0 }, uHouse: { value: 0 }, uPixelRatio: { value: 1 }, uLamp: { value: LAMP.clone() }, uLens: { value: lensAt(lensZ) }, uScreen: { value: SCREEN_CENTRE.clone() }, uLensHalf: { value: new THREE.Vector2(LENS_HALF.x, LENS_HALF.y) }, uScreenHalf: { value: new THREE.Vector2(SCREEN_HALF.x, SCREEN_HALF.y) } }), [lensZ]);
  useFrame(() => {
    beamUniforms.uTime.value = room.current.time; beamUniforms.uHouse.value = room.current.house;
    dustUniforms.uTime.value = room.current.time; dustUniforms.uHouse.value = room.current.house; dustUniforms.uPixelRatio.value = dpr;
  });
  return <group>
    <mesh geometry={beam} frustumCulled={false}>
      <shaderMaterial uniforms={beamUniforms} vertexShader={beamVertex} fragmentShader={beamFragment} transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
    <points geometry={dust} frustumCulled={false}>
      <shaderMaterial uniforms={dustUniforms} vertexShader={dustVertex} fragmentShader={dustFragment} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </points>
  </group>;
}
