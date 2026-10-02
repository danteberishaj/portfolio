"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
function Sculpture({ expanded, paused }: { expanded: boolean; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const spread = useRef(0);
  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused) elapsed.current += Math.min(delta, 0.05);
    spread.current = THREE.MathUtils.damp(spread.current, expanded ? 1 : 0, 4, delta);
    const t = elapsed.current;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, paused ? -0.2 : state.pointer.x * 0.32 + Math.sin(t * 0.2) * 0.2, 3, delta);
    group.current.rotation.z = -0.42;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, paused ? 0.3 : 0.3 + state.pointer.y * 0.16, 3, delta);
    group.current.children.forEach((child, i) => {
      child.position.y = (i - 11) * (0.145 + spread.current * 0.07);
      child.rotation.y = (i - 11) * 0.125 + Math.sin(t * 0.5 + i * 0.16) * 0.3;
      child.rotation.z = Math.sin(t * 0.42 + i * 0.14) * 0.07 * (1 + spread.current);
    });
  });
  return <group ref={group}>{Array.from({ length: 23 }, (_, i) => {
    const width = 0.9 + Math.sin((i / 22) * Math.PI) * 0.36;
    return <mesh key={i} scale={[width, 1, 0.84]} rotation={[Math.PI / 2, 0, 0]} position={[0, (i - 11) * 0.145, 0]}><torusGeometry args={[1.08, 0.074, 12, 96]} /><meshStandardMaterial color={i === 11 ? "#ff5b22" : "#d3d4d5"} metalness={0.95} roughness={0.19} /></mesh>;
  })}</group>;
}
function Fallback() { return <div className="sculpture-fallback" aria-hidden>{Array.from({length: 12}, (_, i) => <span key={i} style={{transform: `translateY(${(i-6)*12}px) rotate(${i*6-32}deg)`}} />)}</div>; }
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Fallback /> : this.props.children; }
}
export default function Scene({ expanded, paused }: { expanded: boolean; paused: boolean }) {
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="scene"><CanvasBoundary><Canvas camera={{ position: [0, 0, 7.3], fov: 39 }} dpr={[1, 1.5]} frameloop={visible ? "always" : "never"} gl={{ antialias: true, alpha: true }} fallback={<Fallback />}>
    <ambientLight intensity={0.8} /><directionalLight position={[3, 5, 4]} intensity={3} />
    <Environment resolution={128}><Lightformer form="rect" intensity={4} position={[0, 5, -3]} scale={[10, 4, 1]} /><Lightformer form="rect" intensity={3} position={[-5, 0, 3]} rotation={[0, Math.PI / 2, 0]} scale={[4, 8, 1]} /><Lightformer form="rect" intensity={2} position={[4, -2, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 7, 1]} /></Environment>
    <Sculpture expanded={expanded} paused={paused} />
  </Canvas></CanvasBoundary></div>;
}
