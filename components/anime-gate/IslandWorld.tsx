"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { type WorldPortal, type WorldPortalKey, worldPortals } from "@/lib/world-portals";

export type IslandWorldHandle = {
  root: THREE.Group | null;
  getPortalGroup: (key: WorldPortalKey) => THREE.Group | null;
  activatePortal: (key: WorldPortalKey) => void;
};

type IslandWorldProps = {
  activePortal?: WorldPortalKey | null;
  lowPerformance: boolean;
  onPortalSelect: (key: WorldPortalKey) => void;
};

const portalKeys = worldPortals.map((portal) => portal.key);

function makeSignTexture(portal: WorldPortal) {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f9efd5";
  context.strokeStyle = "#8b5b2b";
  context.lineWidth = 16;
  context.beginPath();
  context.roundRect(24, 28, 464, 200, 22);
  context.fill();
  context.stroke();

  context.fillStyle = portal.accent;
  context.globalAlpha = 0.16;
  context.fillRect(48, 148, 416, 48);
  context.globalAlpha = 1;

  context.fillStyle = "#3b2616";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "bold 48px system-ui, -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic', sans-serif";
  context.fillText(portal.titleJa, 256, 86);

  context.fillStyle = "#315f9b";
  context.font = "bold 31px system-ui, -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic', sans-serif";
  context.fillText(portal.subtitleJa, 256, 150);

  context.fillStyle = "#5d4630";
  context.font = "24px system-ui, -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic', sans-serif";
  context.fillText(portal.description, 256, 190);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
}

function SignBoard({ portal, scale = 1 }: { portal: WorldPortal; scale?: number }) {
  const texture = useMemo(() => makeSignTexture(portal), [portal]);

  return (
    <group scale={scale}>
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[1.38, 0.56, 0.05]} />
        <meshStandardMaterial color="#8b5b2b" roughness={0.72} />
      </mesh>
      {texture && (
        <mesh position={[0, 0, 0.068]}>
          <planeGeometry args={[1.28, 0.48]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function CurvedRoof({ color, position, scale = [1, 1, 1] }: { color: string; position: [number, number, number]; scale?: [number, number, number] }) {
  return (
    <group position={position} scale={scale}>
      <mesh scale={[1.18, 0.14, 0.72]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.76} />
      </mesh>
      <mesh position={[-0.62, 0.05, 0]} rotation={[0, 0, -0.32]} scale={[0.24, 0.08, 0.76]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.76} />
      </mesh>
      <mesh position={[0.62, 0.05, 0]} rotation={[0, 0, 0.32]} scale={[0.24, 0.08, 0.76]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.76} />
      </mesh>
    </group>
  );
}

function SchoolBuilding({ portal }: { portal: WorldPortal }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} scale={[1.05, 0.64, 0.72]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={portal.buildingColor} roughness={0.68} />
      </mesh>
      <CurvedRoof color={portal.roofColor} position={[0, 0.86, 0]} scale={[1.02, 1, 1]} />
      <SignBoard portal={portal} scale={0.58} />
      <mesh position={[0, 0.2, 0.39]} scale={[0.24, 0.36, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6b442d" roughness={0.8} />
      </mesh>
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.54, 0.39]} scale={[0.18, 0.16, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#9bd8ff" emissive="#7cc7ff" emissiveIntensity={0.18} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function ForumBuilding({ portal }: { portal: WorldPortal }) {
  return (
    <group>
      <mesh position={[0, 0.36, 0]} scale={[1.02, 0.52, 0.62]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={portal.buildingColor} roughness={0.7} />
      </mesh>
      <CurvedRoof color={portal.roofColor} position={[0, 0.73, 0]} />
      <mesh position={[0, 0.22, 0.39]} scale={[1.02, 0.36, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#fff3df" emissive={portal.accent} emissiveIntensity={0.08} roughness={0.45} />
      </mesh>
      <SignBoard portal={portal} scale={0.54} />
      <mesh position={[0, 0.98, 0.02]} scale={[0.24, 0.24, 0.07]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshBasicMaterial color={portal.accent} transparent opacity={0.82} />
      </mesh>
    </group>
  );
}

function LibraryBuilding({ portal }: { portal: WorldPortal }) {
  return (
    <group>
      {[0, 1, 2].map((level) => (
        <group key={level} position={[0, level * 0.34, 0]} scale={[1 - level * 0.14, 1, 1 - level * 0.14]}>
          <mesh position={[0, 0.3, 0]} scale={[0.86, 0.32, 0.66]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={portal.buildingColor} roughness={0.7} />
          </mesh>
          <CurvedRoof color={portal.roofColor} position={[0, 0.52, 0]} scale={[0.86, 0.82, 0.82]} />
        </group>
      ))}
      <mesh position={[0, 1.46, 0]} scale={[0.08, 0.28, 0.08]}>
        <coneGeometry args={[1, 1, 5]} />
        <meshStandardMaterial color="#d7a441" emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
      <SignBoard portal={portal} scale={0.5} />
    </group>
  );
}

function LabBuilding({ portal }: { portal: WorldPortal }) {
  return (
    <group>
      <mesh position={[0, 0.46, 0]} scale={[0.98, 0.72, 0.76]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={portal.buildingColor} emissive={portal.accent} emissiveIntensity={0.08} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.92, 0]} scale={[1.04, 0.16, 0.82]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={portal.roofColor} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.12, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.035, 8, 32]} />
        <meshBasicMaterial color={portal.accent} transparent opacity={0.86} />
      </mesh>
      <SignBoard portal={portal} scale={0.54} />
    </group>
  );
}

function AdminBuilding({ portal }: { portal: WorldPortal }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} scale={[0.8, 0.5, 0.62]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={portal.buildingColor} roughness={0.72} />
      </mesh>
      <CurvedRoof color={portal.roofColor} position={[0, 0.68, 0]} scale={[0.78, 0.9, 0.82]} />
      <mesh position={[0, 0.95, 0.04]} scale={[0.28, 0.28, 0.08]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color={portal.accent} emissive={portal.accent} emissiveIntensity={0.22} roughness={0.42} />
      </mesh>
      <SignBoard portal={portal} scale={0.46} />
    </group>
  );
}

function PortalBuilding({ portal }: { portal: WorldPortal }) {
  const building =
    portal.key === "study" ? <SchoolBuilding portal={portal} /> :
    portal.key === "forum" ? <ForumBuilding portal={portal} /> :
    portal.key === "knowledge" ? <LibraryBuilding portal={portal} /> :
    portal.key === "tools" ? <LabBuilding portal={portal} /> :
    <AdminBuilding portal={portal} />;

  return (
    <group>
      <mesh position={[0, -0.03, 0]} scale={[0.72, 0.08, 0.72]}>
        <cylinderGeometry args={[1, 1.08, 1, 18]} />
        <meshStandardMaterial color="#d8cba9" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.58, 0.018, 8, 36]} />
        <meshBasicMaterial color={portal.accent} transparent opacity={0.42} />
      </mesh>
      <group position={[0, 0.08, 0]}>{building}</group>
    </group>
  );
}

function FujiMountain() {
  return (
    <group position={[0, -0.42, -6.4]}>
      <mesh position={[0, 1.46, 0]} scale={[1.9, 2.5, 1.9]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#80b6db" roughness={0.88} />
      </mesh>
      <mesh position={[0, 2.45, 0]} scale={[0.78, 0.66, 0.78]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#fff7ee" roughness={0.8} />
      </mesh>
      <mesh position={[-2.15, 0.92, 0.26]} scale={[1.4, 1.55, 1.4]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#9cc8e3" roughness={0.9} />
      </mesh>
      <mesh position={[2.0, 0.82, 0.38]} scale={[1.35, 1.35, 1.35]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#93c0df" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[
        [-0.34, 0, 0, 0.34],
        [0, 0.08, 0.02, 0.44],
        [0.36, 0.01, 0, 0.32],
        [0.14, -0.06, 0.08, 0.3]
      ].map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]} scale={radius}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.86} />
        </mesh>
      ))}
    </group>
  );
}

function SakuraTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.26, 0]} scale={[0.08, 0.5, 0.08]}>
        <cylinderGeometry args={[1, 0.85, 1, 6]} />
        <meshStandardMaterial color="#7b4b2b" roughness={0.8} />
      </mesh>
      {[
        [0, 0.66, 0],
        [-0.16, 0.58, 0.06],
        [0.16, 0.6, 0.04],
        [0.02, 0.76, -0.08]
      ].map((p, index) => (
        <mesh key={index} position={p as [number, number, number]} scale={0.22}>
          <sphereGeometry args={[1, 8, 7]} />
          <meshStandardMaterial color={index % 2 ? "#ffb7cf" : "#ffd2df"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function ToriiGate() {
  return (
    <group position={[0, 0.34, -2.8]} scale={0.58}>
      <mesh position={[-0.62, 0.48, 0]} scale={[0.1, 0.96, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d7472f" roughness={0.62} />
      </mesh>
      <mesh position={[0.62, 0.48, 0]} scale={[0.1, 0.96, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d7472f" roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.0, 0]} scale={[1.55, 0.12, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2d1e1b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.84, 0]} scale={[1.25, 0.1, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d7472f" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.58, 0.04]} scale={[0.26, 0.3, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2d1e1b" emissive="#fbbf24" emissiveIntensity={0.1} roughness={0.7} />
      </mesh>
    </group>
  );
}

export const IslandWorld = forwardRef<IslandWorldHandle, IslandWorldProps>(function IslandWorld(
  { activePortal, lowPerformance, onPortalSelect },
  ref
) {
  const rootRef = useRef<THREE.Group>(null);
  const portalRefs = useRef<Record<WorldPortalKey, THREE.Group | null>>({
    study: null,
    forum: null,
    knowledge: null,
    tools: null,
    admin: null
  });
  const glowRefs = useRef<Record<WorldPortalKey, THREE.Mesh | null>>({
    study: null,
    forum: null,
    knowledge: null,
    tools: null,
    admin: null
  });

  const petals = useMemo(() => {
    const count = lowPerformance ? 30 : 72;
    return Array.from({ length: count }, (_, index) => ({
      key: `petal-${index}`,
      position: [
        (Math.random() - 0.5) * 8.2,
        1.2 + Math.random() * 4.2,
        -3.4 + Math.random() * 6.8
      ] as [number, number, number],
      scale: 0.035 + Math.random() * 0.035,
      rotation: Math.random() * Math.PI,
      phase: Math.random() * Math.PI * 2
    }));
  }, [lowPerformance]);

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    getPortalGroup(key) {
      return portalRefs.current[key];
    },
    activatePortal(key) {
      portalRefs.current[key]?.scale.setScalar(1.08);
    }
  }), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(time * 0.16) * 0.026;
    }

    portalKeys.forEach((key, index) => {
      const portal = portalRefs.current[key];
      const glow = glowRefs.current[key];
      const isActive = activePortal === key;

      if (portal) {
        const pulse = isActive ? 1.08 + Math.sin(time * 5.2) * 0.035 : 1 + Math.sin(time * 1.2 + index) * 0.012;
        portal.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), 0.08);
      }

      if (glow) {
        glow.rotation.z += isActive ? 0.03 : 0.008;
        const material = glow.material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = isActive ? 0.78 : 0.24;
        }
      }
    });
  });

  return (
    <group ref={rootRef}>
      <FujiMountain />
      <Cloud position={[-3.3, 2.8, -5.1]} scale={0.9} />
      <Cloud position={[3.2, 3.0, -4.8]} scale={0.82} />
      <Cloud position={[0.4, 3.35, -5.6]} scale={0.62} />

      <group position={[0, -0.28, 0]}>
        <mesh scale={[3.72, 0.4, 3.1]}>
          <cylinderGeometry args={[1, 1.12, 1, 30]} />
          <meshStandardMaterial color="#6f8f63" roughness={0.86} />
        </mesh>
        <mesh position={[0, -0.36, 0]} scale={[3.54, 0.64, 2.95]}>
          <cylinderGeometry args={[0.78, 1.02, 1, 30]} />
          <meshStandardMaterial color="#7a6a55" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.23, 0]} scale={[3.56, 0.08, 2.94]}>
          <cylinderGeometry args={[1, 1.03, 1, 30]} />
          <meshStandardMaterial color="#7ac66a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.52, 1.34, 64]} />
          <meshStandardMaterial color="#d8caa8" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.37, 1.49, 64]} />
          <meshStandardMaterial color="#b8ad91" roughness={0.78} />
        </mesh>
      </group>

      <ToriiGate />

      <group>
        {worldPortals.map((portal) => (
          <group
            key={portal.key}
            ref={(node) => {
              portalRefs.current[portal.key] = node;
            }}
            position={portal.position}
            rotation={[0, Math.atan2(-portal.position[0], -portal.position[2]), 0]}
            onClick={(event) => {
              event.stopPropagation();
              onPortalSelect(portal.key);
            }}
          >
            <mesh
              ref={(node) => {
                glowRefs.current[portal.key] = node;
              }}
              position={[0, -0.05, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.72, 0.025, 8, 42]} />
              <meshBasicMaterial color={portal.accent} transparent opacity={0.24} />
            </mesh>
            <PortalBuilding portal={portal} />
          </group>
        ))}
      </group>

      <SakuraTree position={[-2.85, 0.14, -0.55]} scale={0.86} />
      <SakuraTree position={[2.82, 0.14, -0.52]} scale={0.78} />
      <SakuraTree position={[-1.72, 0.14, 2.18]} scale={0.62} />

      <group>
        {[
          [-2.9, 0.0, 1.65],
          [-2.62, 0.02, 1.94],
          [2.92, 0.0, 1.42],
          [2.52, 0.02, 1.86],
          [0.2, 0.02, 2.75]
        ].map((position, index) => (
          <mesh key={`rock-${index}`} position={position as [number, number, number]} scale={[0.18, 0.12, 0.16]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#8f9583" roughness={0.9} />
          </mesh>
        ))}
      </group>

      <group>
        {petals.map((petal) => (
          <mesh key={petal.key} position={petal.position} rotation={[petal.rotation, petal.rotation * 0.4, petal.rotation]} scale={[petal.scale * 1.6, petal.scale, petal.scale * 0.18]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ffd0dc" transparent opacity={0.72} />
          </mesh>
        ))}
      </group>
    </group>
  );
});
