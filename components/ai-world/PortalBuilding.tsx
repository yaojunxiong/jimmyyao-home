"use client";

import { Billboard, Text } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { aiWorldCopy, portalTitle, type AiWorldLanguage } from "./i18n";
import type { AiWorldPortal, AiWorldPortalId } from "./portals";

type PortalBuildingProps = {
  portal: AiWorldPortal;
  active: boolean;
  hovered: boolean;
  disabled: boolean;
  language: AiWorldLanguage;
  onHover: (id: AiWorldPortalId | null) => void;
  onSelect: (id: AiWorldPortalId) => void;
};

function ToonBox({
  color,
  emissive,
  emissiveIntensity = 0.02
}: {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <meshToonMaterial color={color} emissive={emissive ?? color} emissiveIntensity={emissiveIntensity} />
  );
}

function Roof({ color = "#365f86", y = 1.18, wide = 1 }: { color?: string; y?: number; wide?: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh scale={[1.25 * wide, 0.16, 0.72]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonBox color={color} />
      </mesh>
      <mesh position={[-0.72 * wide, 0.07, 0]} rotation={[0, 0, -0.35]} scale={[0.28, 0.1, 0.76]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonBox color={color} />
      </mesh>
      <mesh position={[0.72 * wide, 0.07, 0]} rotation={[0, 0, 0.35]} scale={[0.28, 0.1, 0.76]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonBox color={color} />
      </mesh>
      <mesh position={[0, 0.13, 0]} scale={[1.4 * wide, 0.035, 0.8]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonBox color="#172033" />
      </mesh>
      {[-0.36, 0, 0.36].map((z) => (
        <mesh key={z} position={[0, 0.165, z]} scale={[1.28 * wide, 0.018, 0.018]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#d8ecff" transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function Lantern({ x, color }: { x: number; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.6 + x) * 0.08;
  });

  return (
    <group ref={ref} position={[x, 0.76, 0.48]}>
      <mesh scale={[0.025, 0.32, 0.025]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <ToonBox color="#3f2d20" />
      </mesh>
      <mesh position={[0, -0.23, 0]} scale={[0.12, 0.16, 0.12]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshToonMaterial color="#fff1c7" emissive={color} emissiveIntensity={0.65} />
      </mesh>
    </group>
  );
}

function WindowPair({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0.49]}>
      {[-0.32, 0.32].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh scale={[0.2, 0.24, 0.025]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color="#fef3c7" emissive={color} emissiveIntensity={0.18} />
          </mesh>
          <mesh scale={[0.018, 0.24, 0.03]}>
            <boxGeometry args={[1, 1, 1]} />
            <ToonBox color="#8a5a34" />
          </mesh>
          <mesh scale={[0.2, 0.018, 0.03]}>
            <boxGeometry args={[1, 1, 1]} />
            <ToonBox color="#8a5a34" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WoodenFrame({ wide = 1, color = "#8a5a34" }: { wide?: number; color?: string }) {
  return (
    <group position={[0, 0.58, 0.52]}>
      {[-0.54 * wide, 0.54 * wide].map((x) => (
        <mesh key={x} position={[x, -0.04, 0]} scale={[0.055, 0.78, 0.045]}>
          <boxGeometry args={[1, 1, 1]} />
          <ToonBox color={color} />
        </mesh>
      ))}
      <mesh position={[0, 0.32, 0]} scale={[1.18 * wide, 0.055, 0.045]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonBox color={color} />
      </mesh>
    </group>
  );
}

function HangingBanner({ label, color }: { label: string; color: string }) {
  return (
    <group position={[-0.72, 0.62, 0.56]}>
      <mesh scale={[0.18, 0.54, 0.025]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#fff7df" emissive={color} emissiveIntensity={0.05} />
      </mesh>
      <Text position={[0, 0, 0.03]} fontSize={0.11} anchorX="center" anchorY="middle" color="#334155">
        {label}
      </Text>
    </group>
  );
}

function BookIcon({ color }: { color: string }) {
  return (
    <group position={[0, 1.36, 0.54]}>
      <mesh rotation={[0, 0, 0.16]} position={[-0.12, 0, 0]} scale={[0.18, 0.24, 0.035]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#fff7df" emissive={color} emissiveIntensity={0.12} />
      </mesh>
      <mesh rotation={[0, 0, -0.16]} position={[0.12, 0, 0]} scale={[0.18, 0.24, 0.035]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#fff7df" emissive={color} emissiveIntensity={0.12} />
      </mesh>
    </group>
  );
}

function ForumIcon({ color }: { color: string }) {
  return (
    <group position={[0, 0.72, 0.585]}>
      <mesh position={[-0.1, 0.04, 0]} scale={[0.17, 0.13, 0.035]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0.14, -0.02, 0]} scale={[0.19, 0.14, 0.035]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.76} />
      </mesh>
    </group>
  );
}

function GearIcon({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 1.1, 0.55]} rotation={[Math.PI / 2, 0, 0]} scale={0.18}>
        <torusGeometry args={[1, 0.14, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.82} />
      </mesh>
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.2, Math.sin(angle) * 0.2 + 1.1, 0.55]} rotation={[0, 0, angle]} scale={[0.035, 0.095, 0.03]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={color} transparent opacity={0.75} />
          </mesh>
        );
      })}
    </group>
  );
}

function BuildingBody({ portal }: { portal: AiWorldPortal }) {
  if (portal.buildingType === "library") {
    return (
      <group>
        {[0, 1, 2].map((level) => (
          <group key={level} position={[0, level * 0.42, 0]} scale={[1 - level * 0.14, 1, 1 - level * 0.12]}>
            <mesh position={[0, 0.35, 0]} scale={[0.94, 0.42, 0.68]}>
              <boxGeometry args={[1, 1, 1]} />
              <ToonBox color="#ead8ad" />
            </mesh>
            <Roof color="#345d82" y={0.62} wide={0.92} />
          </group>
        ))}
        <WindowPair color={portal.color} />
        <BookIcon color={portal.color} />
        <Lantern x={-0.42} color="#f59e0b" />
        <Lantern x={0.42} color="#f59e0b" />
        <mesh position={[0, 1.8, 0]} scale={[0.08, 0.32, 0.08]}>
          <coneGeometry args={[1, 1, 6]} />
          <meshToonMaterial color="#f5b83d" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
      </group>
    );
  }

  if (portal.buildingType === "lab") {
    return (
      <group>
        <mesh position={[0, 0.58, 0]} scale={[1.04, 0.86, 0.78]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshToonMaterial color="#dff8ff" emissive={portal.color} emissiveIntensity={0.08} />
        </mesh>
        <Roof color="#2f3d7b" y={1.08} wide={1.05} />
        <mesh position={[0, 0.7, 0.5]} scale={[0.78, 0.26, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={portal.color} transparent opacity={0.82} />
        </mesh>
        <WindowPair color={portal.color} />
        <mesh position={[0, 0.36, 0.55]} scale={[0.32, 0.28, 0.025]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#a5f3fc" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.52, 1.26, 0.08]} scale={[0.035, 0.42, 0.035]}>
          <cylinderGeometry args={[1, 1, 1, 6]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.52, 1.52, 0.08]} scale={0.08}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.88} />
        </mesh>
        <Text position={[0, 0.7, 0.55]} fontSize={0.2} anchorX="center" anchorY="middle" color="#ffffff">
          AI
        </Text>
      </group>
    );
  }

  if (portal.buildingType === "admin") {
    return (
      <group>
        <mesh position={[0, 0.48, 0]} scale={[0.9, 0.66, 0.68]}>
          <boxGeometry args={[1, 1, 1]} />
          <ToonBox color="#dfcfb6" />
        </mesh>
        <Roof color="#4b5563" y={0.9} wide={0.85} />
        <WindowPair color="#f59e0b" />
        <Lantern x={-0.42} color="#f97316" />
        <Lantern x={0.42} color="#f97316" />
        <GearIcon color={portal.color} />
        <mesh position={[0, 0.3, 0.56]} scale={[0.5, 0.16, 0.03]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#fed7aa" transparent opacity={0.72} />
        </mesh>
        <mesh position={[0, 1.2, 0.04]} rotation={[Math.PI / 2, 0, 0]} scale={0.22}>
          <torusGeometry args={[1, 0.12, 8, 24]} />
          <meshBasicMaterial color={portal.color} transparent opacity={0.78} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, 0.5, 0]} scale={[portal.buildingType === "forum" ? 1.15 : 1.08, 0.68, 0.74]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonBox color={portal.buildingType === "forum" ? "#ead7bd" : "#f0dfbc"} />
      </mesh>
      <Roof color={portal.buildingType === "forum" ? "#4b6a94" : "#2e5f91"} y={0.94} wide={portal.buildingType === "forum" ? 1.12 : 1} />
      <WoodenFrame wide={portal.buildingType === "forum" ? 1.12 : 1} />
      <WindowPair color={portal.color} />
      <mesh position={[0, 0.24, 0.42]} scale={[0.22, 0.36, 0.045]}>
        <boxGeometry args={[1, 1, 1]} />
        <ToonBox color="#7a4a2c" />
      </mesh>
      {portal.buildingType === "forum" ? (
        <group>
          <mesh position={[0, 0.62, 0.56]} scale={[0.58, 0.32, 0.035]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color="#ede9fe" emissive={portal.color} emissiveIntensity={0.12} />
          </mesh>
          <ForumIcon color={portal.color} />
          {[-0.56, -0.28, 0.28, 0.56].map((x) => (
            <mesh key={x} position={[x, 0.28, 0.58]} scale={[0.035, 0.34, 0.035]}>
              <boxGeometry args={[1, 1, 1]} />
              <ToonBox color="#8a5a34" />
            </mesh>
          ))}
        </group>
      ) : (
        <HangingBanner label="日本語" color={portal.color} />
      )}
      <Lantern x={-0.5} color={portal.color} />
      <Lantern x={0.5} color={portal.color} />
    </group>
  );
}

export function PortalBuilding({
  portal,
  active,
  hovered,
  disabled,
  language,
  onHover,
  onSelect
}: PortalBuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const entranceRingRef = useRef<THREE.Mesh>(null);
  const doorGlowRef = useRef<THREE.Mesh>(null);
  const signRef = useRef<THREE.Group>(null);
  const portalGlowRef = useRef<THREE.Mesh>(null);
  const isLit = active || hovered;
  const signLabel = portalTitle(portal, language);
  const signFontSize = language === "zh"
    ? signLabel.length > 6 ? 0.118 : 0.132
    : language === "en"
      ? signLabel.length > 12 ? 0.092 : 0.108
      : signLabel.length > 7 ? 0.135 : 0.19;
  const signWidth = language === "en" ? 1.72 : language === "zh" ? 1.48 : 1.52;
  const signMaxWidth = language === "en" ? 1.56 : language === "zh" ? 1.34 : 1.42;
  const copy = aiWorldCopy[language];

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;

    if (groupRef.current) {
      const target = isLit ? 1.045 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
      groupRef.current.position.y = portal.position[1] + Math.sin(time * 1.4 + portal.position[0]) * 0.025;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isLit ? 1.4 : 0.45);
      const material = ringRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = isLit ? 0.78 : 0.2;
      }
    }

    if (entranceRingRef.current) {
      entranceRingRef.current.rotation.z -= delta * (isLit ? 2.1 : 0.55);
      entranceRingRef.current.scale.setScalar(isLit ? 1.08 + Math.sin(time * 5) * 0.05 : 1);
      const material = entranceRingRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = isLit ? 0.86 : 0.28;
      }
    }

    if (doorGlowRef.current) {
      const material = doorGlowRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = isLit ? 0.82 + Math.sin(time * 6) * 0.12 : 0.18;
      }
    }

    if (portalGlowRef.current) {
      portalGlowRef.current.scale.setScalar(active && portal.enabled ? 1.2 + Math.sin(time * 7) * 0.12 : isLit ? 1.08 : 1);
      const material = portalGlowRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = active && portal.enabled ? 0.58 + Math.sin(time * 8) * 0.16 : isLit ? 0.34 : 0.08;
      }
    }

    if (signRef.current) {
      signRef.current.position.y = Math.sin(time * 2.1 + portal.position[2]) * 0.025;
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!disabled) {
      onHover(portal.id);
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(null);
    document.body.style.cursor = "";
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!disabled) {
      onSelect(portal.id);
    }
  };

  return (
    <group
      ref={groupRef}
      position={portal.position}
      rotation={[0, Math.atan2(-portal.position[0], -portal.position[2]), 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <mesh position={[0, 0.68, 0.1]} scale={[1.95, 1.7, 1.55]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.06, 0]} scale={[0.92, 0.1, 0.92]}>
        <cylinderGeometry args={[1, 1.08, 1, 32]} />
        <ToonBox color="#d6c9a8" />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.025, 8, 48]} />
        <meshBasicMaterial color={portal.color} transparent opacity={0.2} />
      </mesh>
      <BuildingBody portal={portal} />
      <mesh ref={doorGlowRef} position={[0, 0.28, 0.54]} scale={[0.46, 0.48, 0.035]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={portal.color} transparent opacity={0.18} />
      </mesh>
      <mesh ref={entranceRingRef} position={[0, 0.08, 0.88]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.018, 8, 36]} />
        <meshBasicMaterial color={portal.color} transparent opacity={0.28} />
      </mesh>
      <mesh ref={portalGlowRef} position={[0, 0.5, 0.62]} scale={[0.62, 0.72, 0.03]}>
        <circleGeometry args={[1, 40]} />
        <meshBasicMaterial color={portal.color} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <Billboard position={[0, 1.47, 0.58]}>
        <group ref={signRef}>
          <mesh position={[0, 0, -0.035]} scale={[signWidth * 1.08, 0.42, 0.025]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={portal.color} transparent opacity={isLit ? 0.26 : 0.14} />
          </mesh>
          <mesh scale={[signWidth, 0.34, 0.045]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color="#141a38" emissive={portal.color} emissiveIntensity={isLit ? 0.34 : 0.14} />
          </mesh>
          <mesh position={[0, -0.23, 0.005]} scale={[signWidth * 0.86, 0.045, 0.035]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={portal.color} transparent opacity={isLit ? 0.82 : 0.45} />
          </mesh>
          <Text position={[0, 0.018, 0.052]} fontSize={signFontSize} anchorX="center" anchorY="middle" color="#f8fafc" maxWidth={signMaxWidth}>
            {signLabel}
          </Text>
        </group>
      </Billboard>
      <Text position={[0, -0.03, 0.92]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.13} anchorX="center" anchorY="middle" color={portal.enabled ? portal.color : "#7d6f60"}>
        {portal.enabled ? copy.enter : copy.soon}
      </Text>
    </group>
  );
}
