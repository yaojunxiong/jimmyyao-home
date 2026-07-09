"use client";

import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ToonMaterial({ color }: { color: string }) {
  return <meshToonMaterial color={color} />;
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = position[0] + Math.sin(clock.elapsedTime * 0.18 + position[2]) * 0.18;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {[
        [-0.45, 0, 0, 0.38],
        [-0.1, 0.1, 0.02, 0.5],
        [0.32, 0.02, 0, 0.36],
        [0.05, -0.08, 0.06, 0.35]
      ].map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]} scale={radius}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function SakuraTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.42, 0]} scale={[0.1, 0.78, 0.1]}>
        <cylinderGeometry args={[1, 0.75, 1, 7]} />
        <ToonMaterial color="#815230" />
      </mesh>
      {[
        [0, 0.92, 0, 0.35],
        [-0.24, 0.8, 0.06, 0.28],
        [0.23, 0.82, 0.06, 0.28],
        [0.05, 1.07, -0.08, 0.27],
        [0.02, 0.75, -0.18, 0.24]
      ].map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]} scale={radius}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshToonMaterial color={index % 2 ? "#ffb8cf" : "#ffd4df"} />
        </mesh>
      ))}
    </group>
  );
}

function GrassTuft({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[-0.12, 0, 0.12].map((x, index) => (
        <mesh key={x} position={[x, 0.08, 0]} rotation={[0, 0, (index - 1) * 0.25]} scale={[0.035, 0.18, 0.035]}>
          <coneGeometry args={[1, 1, 5]} />
          <meshToonMaterial color={index % 2 ? "#60a84d" : "#71bd58"} />
        </mesh>
      ))}
    </group>
  );
}

function LearningLantern({ position, color = "#38bdf8" }: { position: [number, number, number]; color?: string }) {
  const lightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const material = lightRef.current.material;
    const pulse = 0.42 + Math.sin(clock.elapsedTime * 2.2 + position[0]) * 0.16;
    if (material instanceof THREE.MeshBasicMaterial) {
      material.opacity = pulse;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]} scale={[0.035, 0.84, 0.035]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <ToonMaterial color="#71513a" />
      </mesh>
      <mesh position={[0, 0.86, 0]} scale={[0.12, 0.09, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#fff7df" emissive={color} emissiveIntensity={0.34} />
      </mesh>
      <mesh ref={lightRef} position={[0, 0.86, 0]} scale={0.22}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}

function JyMonument() {
  const orbitRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.elapsedTime * 0.34;
      orbitRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.08;
    }

    if (coreRef.current) {
      coreRef.current.position.y = 0.25 + Math.sin(clock.elapsedTime * 1.35) * 0.02;
    }
  });

  return (
    <group position={[0, 0.46, 0]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.38, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.1, 0]} scale={[0.22, 0.12, 0.22]}>
        <cylinderGeometry args={[1, 1.15, 1, 16]} />
        <meshToonMaterial color="#f8fafc" emissive="#38bdf8" emissiveIntensity={0.14} />
      </mesh>
      <group ref={orbitRef}>
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.52}>
          <torusGeometry args={[1, 0.025, 8, 48]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.58} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0.75]} scale={0.34}>
          <torusGeometry args={[1, 0.022, 8, 40]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.6} />
        </mesh>
      </group>
      <mesh ref={coreRef} position={[0, 0.25, 0]} scale={[0.13, 0.13, 0.13]}>
        <sphereGeometry args={[1, 18, 12]} />
        <meshToonMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function DirectionSign({
  position,
  rotation,
  label,
  color
}: {
  position: [number, number, number];
  rotation: number;
  label: string;
  color: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.38, 0]} scale={[0.035, 0.76, 0.035]}>
        <cylinderGeometry args={[1, 1, 1, 5]} />
        <ToonMaterial color="#7c4d2f" />
      </mesh>
      <mesh position={[0.28, 0.72, 0]} scale={[0.58, 0.16, 0.035]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#fff7df" emissive={color} emissiveIntensity={0.07} />
      </mesh>
      <mesh position={[-0.06, 0.72, 0.022]} rotation={[0, 0, Math.PI / 4]} scale={[0.08, 0.08, 0.018]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.86} />
      </mesh>
      <mesh position={[0.48, 0.72, 0.025]} rotation={[0, 0, -Math.PI / 4]} scale={[0.08, 0.08, 0.018]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
      </mesh>
      <Text position={[0.28, 0.72, 0.05]} fontSize={0.09} anchorX="center" anchorY="middle" color="#334155">
        {label}
      </Text>
    </group>
  );
}

function Waterfall() {
  const mistRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!mistRef.current) return;
    mistRef.current.position.y = -0.38 + Math.sin(clock.elapsedTime * 1.4) * 0.035;
  });

  return (
    <group position={[-3.62, -0.12, 1.88]} rotation={[0, 0.34, 0]}>
      <mesh position={[0, -0.42, 0]} scale={[0.24, 0.95, 0.035]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.72} />
      </mesh>
      <mesh position={[0.1, -0.42, 0.02]} scale={[0.08, 0.92, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#e0f7ff" transparent opacity={0.62} />
      </mesh>
      <group ref={mistRef}>
        {[-0.16, 0.02, 0.18].map((x, index) => (
          <mesh key={x} position={[x, -0.94, 0.05]} scale={0.13 + index * 0.025}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.46} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function StonePath() {
  const stones = useMemo(() => {
    const list: Array<[number, number, number, number, number]> = [];
    const targets = [
      [-2.72, 0.96],
      [-1.62, -2.12],
      [1.28, -2.16],
      [2.62, 0.62],
      [1.86, 2.02]
    ];

    targets.forEach(([tx, tz]) => {
      for (let i = 1; i <= 9; i += 1) {
        const t = i / 10;
        const wiggle = Math.sin(i * 1.7 + tx) * 0.08;
        list.push([tx * t + wiggle, 0.33, tz * t - wiggle * 0.35, 0.16 + (i % 2) * 0.045, (i * 0.7 + tx) % Math.PI]);
      }
    });

    return list;
  }, []);

  return (
    <group>
      {stones.map(([x, y, z, scale, rotation], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, rotation, 0]} scale={[scale * 1.4, 0.035, scale]}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <ToonMaterial color={index % 2 ? "#d7ccb0" : "#c9bea5"} />
        </mesh>
      ))}
      {Array.from({ length: 18 }).map((_, index) => {
        const angle = index * 1.73;
        const radius = 1.05 + (index % 5) * 0.22;
        return (
          <mesh key={`plaza-${index}`} position={[Math.cos(angle) * radius, 0.43, Math.sin(angle) * radius * 0.78]} rotation={[0, angle, 0]} scale={[0.1 + (index % 3) * 0.025, 0.02, 0.075]}>
            <cylinderGeometry args={[1, 1, 1, 7]} />
            <ToonMaterial color={index % 2 ? "#e5dac0" : "#cfc3aa"} />
          </mesh>
        );
      })}
    </group>
  );
}

function ToriiGate() {
  return (
    <group position={[0, 0.45, -3.85]} scale={0.72}>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} scale={[0.11, 1.1, 0.11]}>
          <boxGeometry args={[1, 1, 1]} />
          <ToonMaterial color="#d7472f" />
        </mesh>
      ))}
      <mesh position={[0, 1.16, 0]} scale={[1.85, 0.14, 0.16]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonMaterial color="#2c1c18" />
      </mesh>
      <mesh position={[0, 0.96, 0]} scale={[1.48, 0.12, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonMaterial color="#d7472f" />
      </mesh>
      <mesh position={[0, 0.66, 0.04]} scale={[0.3, 0.34, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#2c1c18" emissive="#fbbf24" emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

function FujiMountain() {
  return (
    <group position={[0, -0.45, -8.2]}>
      <mesh position={[0, 1.86, 0]} rotation={[0, Math.PI / 4, 0]} scale={[2.45, 3.25, 2.45]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshToonMaterial color="#82bee2" />
      </mesh>
      <mesh position={[0, 3.12, 0]} rotation={[0, Math.PI / 4, 0]} scale={[0.92, 0.78, 0.92]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshToonMaterial color="#fff7ee" />
      </mesh>
      <mesh position={[-2.5, 1.1, 0.35]} rotation={[0, Math.PI / 4, 0]} scale={[1.4, 1.65, 1.4]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshToonMaterial color="#a7d4ef" />
      </mesh>
      <mesh position={[2.35, 1.0, 0.4]} rotation={[0, Math.PI / 4, 0]} scale={[1.35, 1.5, 1.35]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshToonMaterial color="#9bcced" />
      </mesh>
    </group>
  );
}

export function FloatingIsland() {
  return (
    <group>
      <FujiMountain />
      <Cloud position={[-4.4, 3.1, -6.4]} scale={1.1} />
      <Cloud position={[4.1, 3.25, -6.0]} scale={1.0} />
      <Cloud position={[0.2, 3.8, -7.1]} scale={0.72} />

      <group position={[0, -0.3, 0]}>
        <mesh scale={[4.5, 0.52, 3.75]}>
          <cylinderGeometry args={[1, 1.12, 1, 48]} />
          <ToonMaterial color="#7fcf6b" />
        </mesh>
        <mesh position={[0, -0.62, 0]} scale={[4.28, 0.95, 3.55]}>
          <cylinderGeometry args={[0.72, 1.0, 1, 48]} />
          <ToonMaterial color="#8a745d" />
        </mesh>
        <mesh position={[0, -1.14, 0]} scale={[2.1, 0.82, 1.7]}>
          <coneGeometry args={[1, 1, 8]} />
          <ToonMaterial color="#6e5d4d" />
        </mesh>
        <mesh position={[0, 0.3, 0]} scale={[4.22, 0.08, 3.48]}>
          <cylinderGeometry args={[1, 1.03, 1, 48]} />
          <ToonMaterial color="#91df75" />
        </mesh>
        <mesh position={[-1.4, 0.43, 1.35]} rotation={[-Math.PI / 2, 0, 0.35]} scale={[1.15, 0.54, 1]}>
          <circleGeometry args={[1, 32]} />
          <meshToonMaterial color="#a7e77c" />
        </mesh>
        <mesh position={[1.7, 0.44, -0.88]} rotation={[-Math.PI / 2, 0, -0.2]} scale={[0.9, 0.42, 1]}>
          <circleGeometry args={[1, 32]} />
          <meshToonMaterial color="#78c95f" />
        </mesh>
        <mesh position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 1.42, 72]} />
          <meshToonMaterial color="#d9ceb2" />
        </mesh>
        <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.46, 1.58, 72]} />
          <meshToonMaterial color="#bfb49d" />
        </mesh>
      </group>

      <StonePath />
      <ToriiGate />
      <Waterfall />
      <JyMonument />
      <SakuraTree position={[-3.1, 0.25, -0.85]} scale={0.85} />
      <SakuraTree position={[3.15, 0.25, -0.75]} scale={0.78} />
      <SakuraTree position={[-2.1, 0.25, 2.68]} scale={0.66} />
      <SakuraTree position={[0.9, 0.25, 3.2]} scale={0.56} />
      <LearningLantern position={[-1.72, 0.38, 1.08]} color="#38bdf8" />
      <LearningLantern position={[1.72, 0.38, 1.08]} color="#facc15" />
      <LearningLantern position={[-1.32, 0.38, -1.42]} color="#a78bfa" />
      <LearningLantern position={[1.32, 0.38, -1.42]} color="#22d3ee" />
      <DirectionSign position={[-0.68, 0.42, 1.88]} rotation={-0.58} label="学ぶ" color="#38bdf8" />
      <DirectionSign position={[0.72, 0.42, -1.82]} rotation={2.58} label="AI" color="#22d3ee" />
      {[
        [-3.35, 0.35, 0.25],
        [-2.75, 0.35, 1.72],
        [-1.15, 0.35, -2.1],
        [1.15, 0.35, -2.0],
        [2.85, 0.35, -0.15],
        [2.2, 0.35, 1.6],
        [0.22, 0.35, 2.62],
        [-1.8, 0.35, 2.2]
      ].map((position, index) => (
        <GrassTuft key={index} position={position as [number, number, number]} scale={0.75 + (index % 3) * 0.12} />
      ))}

      {[
        [-3.65, 0.42, 2.35],
        [3.78, 0.42, 2.0],
        [-0.35, 0.43, 3.42],
        [3.9, 0.42, -1.1],
        [-4.05, 0.37, -0.1],
        [4.08, 0.36, 0.42]
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} scale={[0.16, 0.22, 0.16]}>
          <dodecahedronGeometry args={[1, 0]} />
          <ToonMaterial color={index % 2 ? "#9aa08b" : "#828878"} />
        </mesh>
      ))}
    </group>
  );
}
