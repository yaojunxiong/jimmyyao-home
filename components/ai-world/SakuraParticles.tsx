"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Petal = {
  position: THREE.Vector3;
  speed: number;
  sway: number;
  phase: number;
  scale: number;
};

export function SakuraParticles({ lowPerformance }: { lowPerformance: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const petals = useMemo<Petal[]>(() => {
    const count = lowPerformance ? 48 : 138;
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 10.5, 0.9 + Math.random() * 5.0, -4.9 + Math.random() * 8.8),
      speed: 0.18 + Math.random() * 0.22,
      sway: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      scale: 0.035 + Math.random() * 0.035
    }));
  }, [lowPerformance]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const petal = petals[index];
      child.position.y -= petal.speed * delta;
      child.position.x = petal.position.x + Math.sin(time * 0.8 + petal.phase) * petal.sway;
      child.rotation.x += delta * 1.3;
      child.rotation.z += delta * 0.9;

      if (child.position.y < 0.25) {
        child.position.y = 5.4;
        petal.position.x = (Math.random() - 0.5) * 10.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {petals.map((petal, index) => (
        <mesh
          key={index}
          position={petal.position}
          rotation={[petal.phase, petal.phase * 0.2, petal.phase * 0.7]}
          scale={[petal.scale * 1.7, petal.scale, petal.scale * 0.12]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={index % 2 ? "#ffd3df" : "#ffb8cf"} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}
