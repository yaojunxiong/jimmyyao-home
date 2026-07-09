"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type JyCharacterHandle = {
  root: THREE.Group | null;
  leftArm: THREE.Group | null;
  rightArm: THREE.Group | null;
  leftLeg: THREE.Group | null;
  rightLeg: THREE.Group | null;
  leftFootGlow: THREE.Mesh | null;
  rightFootGlow: THREE.Mesh | null;
  setRunning: (running: boolean) => void;
};

export type UserCharacterProfile = {
  email: string | null;
  initial: string;
  primaryColor: string;
  accentColor: string;
  label: string;
};

function Part({
  color,
  emissive,
  position,
  scale
}: {
  color: string;
  emissive?: string;
  position?: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshToonMaterial color={color} emissive={emissive ?? color} emissiveIntensity={emissive ? 0.12 : 0.01} />
    </mesh>
  );
}

export const JyCharacter = forwardRef<
  JyCharacterHandle,
  { position?: [number, number, number]; scale?: number; profile: UserCharacterProfile }
>(
  function JyCharacter({ position = [0, 0.42, 0], scale = 0.64, profile }, ref) {
    const rootRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const leftLegRef = useRef<THREE.Group>(null);
    const rightLegRef = useRef<THREE.Group>(null);
    const leftFootGlowRef = useRef<THREE.Mesh>(null);
    const rightFootGlowRef = useRef<THREE.Mesh>(null);
    const scarfRef = useRef<THREE.Group>(null);
    const antennaGlowRef = useRef<THREE.Mesh>(null);
    const runningRef = useRef(false);

    useFrame(({ clock }) => {
      const time = clock.elapsedTime;
      const glows = [
        { mesh: leftFootGlowRef.current, phase: 0 },
        { mesh: rightFootGlowRef.current, phase: Math.PI }
      ];

      glows.forEach(({ mesh, phase }) => {
        if (!mesh) return;
        const material = mesh.material;
        const pulse = runningRef.current ? Math.max(0, Math.sin(time * 12 + phase)) : 0;
        mesh.scale.setScalar(0.65 + pulse * 0.55);
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = runningRef.current ? 0.1 + pulse * 0.42 : 0;
        }
      });

      if (scarfRef.current) {
        scarfRef.current.rotation.z = Math.sin(time * (runningRef.current ? 8.5 : 2.1)) * (runningRef.current ? 0.18 : 0.07);
        scarfRef.current.position.y = 1.54 + Math.sin(time * 2.2) * 0.018;
      }

      if (antennaGlowRef.current) {
        const material = antennaGlowRef.current.material;
        antennaGlowRef.current.scale.setScalar(0.08 + Math.sin(time * 2.8) * 0.016);
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = 0.55 + Math.sin(time * 2.8) * 0.18;
        }
      }
    });

    useImperativeHandle(ref, () => ({
      get root() {
        return rootRef.current;
      },
      get leftArm() {
        return leftArmRef.current;
      },
      get rightArm() {
        return rightArmRef.current;
      },
      get leftLeg() {
        return leftLegRef.current;
      },
      get rightLeg() {
        return rightLegRef.current;
      },
      get leftFootGlow() {
        return leftFootGlowRef.current;
      },
      get rightFootGlow() {
        return rightFootGlowRef.current;
      },
      setRunning(running: boolean) {
        runningRef.current = running;
      }
    }), []);

    return (
      <group ref={rootRef} position={position} scale={scale}>
        <group position={[0, 1.12, 0]}>
          <Part color="#ffffff" emissive="#38bdf8" scale={[0.76, 0.9, 0.45]} />
          <Part color={profile.primaryColor} emissive={profile.accentColor} position={[0, 0.33, 0.02]} scale={[0.82, 0.16, 0.49]} />
          <mesh position={[0, -0.03, -0.255]} scale={[0.34, 0.2, 0.025]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text position={[0, -0.035, -0.285]} rotation={[0, Math.PI, 0]} fontSize={profile.initial.length > 1 ? 0.12 : 0.16} anchorX="center" anchorY="middle" color={profile.primaryColor}>
            {profile.initial}
          </Text>
          <mesh position={[0, 0.05, 0.25]} scale={[0.18, 0.18, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color={profile.accentColor} emissive={profile.accentColor} emissiveIntensity={0.75} />
          </mesh>
          <TextBadge />
        </group>

        <group position={[0, 1.82, 0]}>
          <Part color="#ffe2c4" scale={[0.55, 0.52, 0.48]} />
          <Part color="#172033" position={[0, 0.25, -0.02]} scale={[0.62, 0.18, 0.52]} />
          <Part color="#172033" position={[-0.22, 0.16, 0.08]} scale={[0.16, 0.16, 0.16]} />
          <Part color="#172033" position={[0.22, 0.16, 0.08]} scale={[0.16, 0.16, 0.16]} />
          <mesh position={[0.14, 0.44, 0]} rotation={[0, 0, -0.35]} scale={[0.035, 0.32, 0.035]}>
            <cylinderGeometry args={[1, 1, 1, 6]} />
            <meshBasicMaterial color={profile.accentColor} transparent opacity={0.78} />
          </mesh>
          <mesh ref={antennaGlowRef} position={[0.22, 0.62, 0]} scale={0.08}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshBasicMaterial color="#facc15" transparent opacity={0.65} depthWrite={false} />
          </mesh>
          {[-0.12, 0.12].map((x) => (
            <mesh key={x} position={[x, 0.02, 0.27]} scale={[0.045, 0.045, 0.025]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#172033" />
            </mesh>
          ))}
        </group>

        <group ref={scarfRef} position={[0.2, 1.54, 0.14]}>
          <mesh position={[-0.18, 0, 0.15]} rotation={[0.08, 0, -0.16]} scale={[0.58, 0.1, 0.05]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color={profile.accentColor} emissive={profile.accentColor} emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[0.28, -0.06, 0.05]} rotation={[0.35, 0.18, -0.62]} scale={[0.44, 0.09, 0.045]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color={profile.primaryColor} emissive={profile.accentColor} emissiveIntensity={0.22} />
          </mesh>
        </group>

        <group ref={leftArmRef} position={[-0.53, 1.45, 0]} rotation={[0.08, 0, 0.24]}>
          <Part color="#f7fbff" emissive="#38bdf8" position={[0, -0.34, 0]} scale={[0.2, 0.66, 0.22]} />
          <Part color="#ffe2c4" position={[0, -0.72, 0.02]} scale={[0.22, 0.18, 0.22]} />
        </group>

        <group ref={rightArmRef} position={[0.53, 1.45, 0]} rotation={[0.08, 0, -0.24]}>
          <Part color="#f7fbff" emissive="#38bdf8" position={[0, -0.34, 0]} scale={[0.2, 0.66, 0.22]} />
          <Part color="#ffe2c4" position={[0, -0.72, 0.02]} scale={[0.22, 0.18, 0.22]} />
        </group>

        <group ref={leftLegRef} position={[-0.22, 0.78, 0]}>
          <Part color={profile.primaryColor} emissive={profile.accentColor} position={[0, -0.35, 0]} scale={[0.25, 0.68, 0.26]} />
          <Part color="#172033" position={[0.02, -0.74, 0.08]} scale={[0.34, 0.14, 0.42]} />
          <mesh ref={leftFootGlowRef} position={[0.03, -0.88, 0.12]} rotation={[-Math.PI / 2, 0, 0]} scale={0.72}>
            <circleGeometry args={[0.16, 24]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.22, 0.78, 0]}>
          <Part color={profile.primaryColor} emissive={profile.accentColor} position={[0, -0.35, 0]} scale={[0.25, 0.68, 0.26]} />
          <Part color="#172033" position={[-0.02, -0.74, 0.08]} scale={[0.34, 0.14, 0.42]} />
          <mesh ref={rightFootGlowRef} position={[-0.03, -0.88, 0.12]} rotation={[-Math.PI / 2, 0, 0]} scale={0.72}>
            <circleGeometry args={[0.16, 24]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    );
  }
);

function TextBadge() {
  return (
    <mesh position={[0, -0.1, 0.265]} scale={[0.32, 0.18, 0.025]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}
