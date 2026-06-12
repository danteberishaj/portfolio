"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Stars,
  Environment,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle idle rotation
    mesh.current.rotation.y = t * 0.15;
    mesh.current.rotation.z = t * 0.05;
    // Ease the blob toward the pointer for an interactive feel
    const { x, y } = state.pointer;
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      y * 0.4,
      0.05
    );
    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      x * 0.3,
      0.05
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere ref={mesh} args={[1.4, 128, 128]}>
        <MeshDistortMaterial
          color="#7c5cff"
          attach="material"
          distort={0.45}
          speed={1.8}
          roughness={0.15}
          metalness={0.6}
        />
      </Sphere>
    </Float>
  );
}

function FloatingShards() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.getElapsedTime() * 0.08;
  });

  const shards = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 3.2;
    return (
      <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
        <mesh
          position={[
            Math.cos(angle) * radius,
            Math.sin(angle * 1.3) * 1.5,
            Math.sin(angle) * radius,
          ]}
          rotation={[angle, angle, 0]}
        >
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#22d3ee" : "#7c5cff"}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
    );
  });

  return <group ref={group}>{shards}</group>;
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={1.5} color="#22d3ee" />
        <Stars
          radius={50}
          depth={50}
          count={2500}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <Blob />
        <FloatingShards />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
