"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type BlockyDancerHandle = {
  root: THREE.Group | null;
  torso: THREE.Group | null;
  head: THREE.Group | null;
  leftArm: THREE.Group | null;
  rightArm: THREE.Group | null;
  leftLeg: THREE.Group | null;
  rightLeg: THREE.Group | null;
  scarf: THREE.Group | null;
  setDancing: (active: boolean) => void;
};

type BlockyDancerProps = {
  position?: [number, number, number];
  scale?: number;
};

function BlockMesh({
  color,
  emissive,
  opacity = 1,
  scale,
  position
}: {
  color: string;
  emissive?: string;
  opacity?: number;
  scale: [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? color}
        emissiveIntensity={emissive ? 0.25 : 0.03}
        roughness={0.64}
        metalness={0.08}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

export const BlockyDancer = forwardRef<BlockyDancerHandle, BlockyDancerProps>(function BlockyDancer(
  { position = [0, 0, 0], scale = 1 },
  ref
) {
  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const scarfRef = useRef<THREE.Group>(null);
  const dancingRef = useRef(false);
  const elapsedRef = useRef(0);

  const outlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#42f2ff",
        transparent: true,
        opacity: 0.17,
        wireframe: true
      }),
    []
  );

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    get torso() {
      return torsoRef.current;
    },
    get head() {
      return headRef.current;
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
    get scarf() {
      return scarfRef.current;
    },
    setDancing(active: boolean) {
      dancingRef.current = active;
    }
  }), []);

  useFrame((_state, delta) => {
    if (dancingRef.current) {
      return;
    }

    elapsedRef.current += delta;
    const time = elapsedRef.current;
    const bounce = Math.sin(time * 2.25) * 0.075;

    if (rootRef.current) {
      rootRef.current.position.y = position[1] + bounce;
      rootRef.current.rotation.y = Math.sin(time * 0.9) * 0.08;
    }

    if (torsoRef.current) {
      torsoRef.current.rotation.z = Math.sin(time * 1.7) * 0.035;
    }

    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.86) * 0.17;
      headRef.current.rotation.x = Math.sin(time * 1.15) * 0.045;
    }

    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(time * 2.15) * 0.24 - 0.08;
      rightArmRef.current.rotation.x = -Math.sin(time * 2.15) * 0.24 - 0.08;
      leftArmRef.current.rotation.z = 0.2 + Math.sin(time * 1.7) * 0.075;
      rightArmRef.current.rotation.z = -0.2 - Math.sin(time * 1.7) * 0.075;
    }

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = -Math.sin(time * 2.15) * 0.08;
      rightLegRef.current.rotation.x = Math.sin(time * 2.15) * 0.08;
    }

    if (scarfRef.current) {
      scarfRef.current.rotation.y = Math.sin(time * 1.9) * 0.12;
      scarfRef.current.rotation.z = Math.sin(time * 2.6) * 0.08;
    }
  });

  return (
    <group ref={rootRef} position={position} scale={scale}>
      <group ref={torsoRef}>
        <BlockMesh color="#16111f" emissive="#5f3cff" scale={[0.82, 1.04, 0.48]} position={[0, 1.28, 0]} />
        <mesh material={outlineMaterial} position={[0, 1.28, 0]} scale={[0.9, 1.12, 0.54]}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
        <BlockMesh color="#241438" emissive="#ff3752" scale={[0.9, 0.18, 0.54]} position={[0, 1.74, 0.01]} />
        <BlockMesh color="#ff9b38" emissive="#ff9b38" scale={[0.18, 0.18, 0.08]} position={[-0.24, 1.52, 0.28]} />
        <BlockMesh color="#42f2ff" emissive="#42f2ff" scale={[0.18, 0.18, 0.08]} position={[0.24, 1.52, 0.28]} />
      </group>

      <group ref={headRef} position={[0, 2.05, 0]}>
        <BlockMesh color="#20162d" emissive="#7c4dff" scale={[0.62, 0.58, 0.58]} />
        <BlockMesh color="#07060b" scale={[0.68, 0.18, 0.62]} position={[0, 0.36, -0.02]} />
        <BlockMesh color="#07060b" scale={[0.18, 0.18, 0.18]} position={[-0.26, 0.22, 0.16]} />
        <BlockMesh color="#42f2ff" emissive="#42f2ff" scale={[0.08, 0.055, 0.035]} position={[-0.15, 0.04, 0.31]} />
        <BlockMesh color="#42f2ff" emissive="#42f2ff" scale={[0.08, 0.055, 0.035]} position={[0.15, 0.04, 0.31]} />
      </group>

      <group ref={scarfRef} position={[0.1, 1.77, 0.03]}>
        <BlockMesh color="#ff3752" emissive="#ff3752" scale={[0.76, 0.11, 0.16]} />
        <BlockMesh color="#ff3752" emissive="#ff3752" scale={[0.54, 0.1, 0.12]} position={[0.48, -0.08, -0.08]} />
      </group>

      <group ref={leftArmRef} position={[-0.62, 1.68, 0]} rotation={[0.08, 0, 0.2]}>
        <BlockMesh color="#1b1430" emissive="#42f2ff" scale={[0.26, 0.86, 0.26]} position={[0, -0.44, 0]} />
        <BlockMesh color="#231839" scale={[0.28, 0.24, 0.28]} position={[0, -0.96, 0]} />
      </group>

      <group ref={rightArmRef} position={[0.62, 1.68, 0]} rotation={[0.08, 0, -0.2]}>
        <BlockMesh color="#1b1430" emissive="#42f2ff" scale={[0.26, 0.86, 0.26]} position={[0, -0.44, 0]} />
        <BlockMesh color="#231839" scale={[0.28, 0.24, 0.28]} position={[0, -0.96, 0]} />
      </group>

      <group ref={leftLegRef} position={[-0.26, 0.78, 0]}>
        <BlockMesh color="#120e1e" emissive="#7c4dff" scale={[0.3, 0.88, 0.32]} position={[0, -0.45, 0]} />
        <BlockMesh color="#09070f" scale={[0.38, 0.16, 0.5]} position={[0.03, -0.95, 0.1]} />
      </group>

      <group ref={rightLegRef} position={[0.26, 0.78, 0]}>
        <BlockMesh color="#120e1e" emissive="#7c4dff" scale={[0.3, 0.88, 0.32]} position={[0, -0.45, 0]} />
        <BlockMesh color="#09070f" scale={[0.38, 0.16, 0.5]} position={[-0.03, -0.95, 0.1]} />
      </group>
    </group>
  );
});
