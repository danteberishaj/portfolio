"use client";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PER_SIDE = 7, ROW_GAP = 1.9, SEAT_GAP = 0.72, AISLE = 1.5, Z_FIRST = 4.5;

function seatTransforms(rows: number) {
  const list: { x: number; z: number }[] = [];
  for (let row = 0; row < rows; row++) {
    const z = Z_FIRST + row * ROW_GAP;
    for (let i = 0; i < PER_SIDE; i++) {
      const offset = AISLE + SEAT_GAP / 2 + i * SEAT_GAP;
      list.push({ x: offset, z }, { x: -offset, z });
    }
  }
  return list;
}

function Seats({ rows }: { rows: number }) {
  const backs = useRef<THREE.InstancedMesh>(null);
  const cushions = useRef<THREE.InstancedMesh>(null);
  const seats = useMemo(() => seatTransforms(rows), [rows]);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    seats.forEach((seat, i) => {
      m.makeTranslation(seat.x, 0.78, seat.z + 0.19);
      backs.current?.setMatrixAt(i, m);
      m.makeTranslation(seat.x, 0.42, seat.z - 0.12);
      cushions.current?.setMatrixAt(i, m);
    });
    if (backs.current) backs.current.instanceMatrix.needsUpdate = true;
    if (cushions.current) cushions.current.instanceMatrix.needsUpdate = true;
  }, [seats]);
  return <group>
    <instancedMesh key={`b${seats.length}`} ref={backs} args={[undefined, undefined, seats.length]}>
      <boxGeometry args={[0.58, 1.0, 0.12]} />
      <meshStandardMaterial color="#1b201b" roughness={0.88} metalness={0} />
    </instancedMesh>
    <instancedMesh key={`c${seats.length}`} ref={cushions} args={[undefined, undefined, seats.length]}>
      <boxGeometry args={[0.58, 0.4, 0.5]} />
      <meshStandardMaterial color="#171c17" roughness={0.92} metalness={0} />
    </instancedMesh>
  </group>;
}

/** Floor, seats, masking, walls and the projector body. Everything but the screen and the beam. */
export default function Auditorium({ tier, layout }: { tier: "high" | "low"; layout: { lensZ: number; backZ: number; rows: number } }) {
  const depth = layout.backZ;
  return <group>
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, depth / 2]}>
      <planeGeometry args={[60, depth * 2 + 20]} />
      {tier === "high"
        ? <MeshReflectorMaterial blur={[400, 120]} resolution={512} mixBlur={1} mixStrength={11} roughness={1} depthScale={1.1} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#0b0d0b" metalness={0.15} mirror={0.32} />
        : <meshStandardMaterial color="#0b0d0b" roughness={0.95} metalness={0} />}
    </mesh>
    <Seats rows={layout.rows} />
    {/* black masking around the screen and the wall behind it */}
    <mesh position={[0, 6, -0.25]}><boxGeometry args={[16.8, 10.8, 0.3]} /><meshStandardMaterial color="#060706" roughness={1} /></mesh>
    <mesh position={[0, 7, -1]}><planeGeometry args={[40, 20]} /><meshStandardMaterial color="#0a0c0a" roughness={1} /></mesh>
    <mesh position={[-15, 7, depth / 2]} rotation-y={Math.PI / 2}><planeGeometry args={[depth + 10, 20]} /><meshStandardMaterial color="#0c0e0c" roughness={1} /></mesh>
    <mesh position={[15, 7, depth / 2]} rotation-y={-Math.PI / 2}><planeGeometry args={[depth + 10, 20]} /><meshStandardMaterial color="#0c0e0c" roughness={1} /></mesh>
    <mesh position={[0, 14, depth / 2]} rotation-x={Math.PI / 2}><planeGeometry args={[40, depth + 10]} /><meshStandardMaterial color="#090b09" roughness={1} /></mesh>
    <mesh position={[0, 7, depth]} rotation-y={Math.PI}><planeGeometry args={[40, 20]} /><meshStandardMaterial color="#0a0c0a" roughness={1} /></mesh>
    {/* projector */}
    <group position={[0, 5.2, layout.lensZ + 0.4]}>
      <mesh><boxGeometry args={[0.5, 0.42, 0.7]} /><meshStandardMaterial color="#0f120f" roughness={0.6} metalness={0.3} /></mesh>
      <mesh position={[0, 0, -0.36]}><circleGeometry args={[0.1, 24]} /><meshBasicMaterial color="#fff7d6" /></mesh>
      <pointLight color="#e9f3d6" intensity={1.2} distance={6} decay={2} position={[0, 0, -0.5]} />
    </group>
  </group>;
}
