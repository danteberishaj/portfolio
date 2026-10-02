"use client";
import useMotionPreference from "./useMotionPreference";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef, useState, useEffect, Component, type ReactNode } from "react";

import * as THREE from "three";
function Headphones({ color, reduced }: { color: string; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, reduced ? -0.35 : -0.35 + state.pointer.x * 0.5, 4, delta);
    ref.current.rotation.z = -0.18;
  });
  return <group ref={ref} rotation={[0.1, -0.35, -0.18]}>
    <mesh position={[0, 0.03, 0]}><torusGeometry args={[1.04, 0.13, 16, 64, Math.PI]} /><meshStandardMaterial color={color} roughness={0.5} metalness={0.25} /></mesh>
    <mesh position={[0, 0.03, 0.02]}><torusGeometry args={[0.91, 0.06, 12, 64, Math.PI]} /><meshStandardMaterial color="#232522" roughness={0.95} /></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 0.97, -0.34, 0]} rotation={[0, 0, side * 0.12]}>
      <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.1, 0.75, 0.1]} /><meshStandardMaterial color="#acb0ac" metalness={0.95} roughness={0.25} /></mesh>
      <mesh scale={[0.42, 0.7, 0.32]}><sphereGeometry args={[1, 40, 32]} /><meshStandardMaterial color={color} metalness={0.32} roughness={0.38} /></mesh>
      <mesh position={[0, 0, 0.24]} scale={[0.31, 0.53, 0.12]}><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color="#252722" roughness={0.88} /></mesh>
      <mesh position={[0, 0, -0.22]} scale={[0.29, 0.5, 0.06]}><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color={color} metalness={0.45} roughness={0.3} /></mesh>
    </group>)}
  </group>;
}
function FlatHeadphones({ color }: { color: string }) {
  return <svg viewBox="0 0 300 300" width="100%" height="100%" aria-hidden><path d="M70 180V130a80 80 0 0 1 160 0v50" fill="none" stroke={color} strokeWidth="18" /><rect x="48" y="155" width="50" height="90" rx="20" fill={color} /><rect x="202" y="155" width="50" height="90" rx="20" fill={color} /></svg>;
}
class Boundary extends Component<{children: ReactNode; color: string}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() { return this.state.failed ? <FlatHeadphones color={this.props.color} /> : this.props.children; }
}
export default function ProductObject({ color }: { color: string }) {
  const reduced = useMotionPreference();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {rootMargin:"150px"});
    if(ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="product-object" aria-hidden><Boundary color={color}><Canvas camera={{position:[0, 0.2, 5.2], fov:37}} dpr={[1, 1.5]} frameloop={visible && !reduced ? "always" : "demand"} fallback={<FlatHeadphones color={color} />}>
    <ambientLight intensity={1.2} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, 0, 2]} intensity={1.2} />
    <Environment resolution={64}><Lightformer intensity={3} position={[-3, 3, 3]} scale={[4, 4, 1]} /><Lightformer intensity={2} position={[4, 1, 0]} rotation={[0,-Math.PI / 2,0]} scale={[4,5,1]} /></Environment>
    <Headphones color={color} reduced={!!reduced} />
  </Canvas></Boundary></div>;
}
