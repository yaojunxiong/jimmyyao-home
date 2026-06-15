"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneConfig } from "@/lib/sceneConfig";

export type GeneratedWorldHandle = {
  root: THREE.Group | null;
  stage: THREE.Group | null;
  portal: THREE.Group | null;
  worldMapPortal: THREE.Group | null;
  moon: THREE.Group | null;
  particles: THREE.Points | null;
  slash: THREE.Group | null;
  stageLight: THREE.PointLight | null;
  portalLight: THREE.PointLight | null;
};

type Tile = {
  key: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
};

type Building = {
  key: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  light: [number, number, number];
};

function LowPolyCloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[-0.38, 0, 0]}>
        <boxGeometry args={[0.72, 0.28, 0.28]} />
        <meshStandardMaterial color="#1b1630" emissive="#44215d" emissiveIntensity={0.05} roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.1, 0.04]}>
        <boxGeometry args={[0.88, 0.36, 0.34]} />
        <meshStandardMaterial color="#24183c" emissive="#60254d" emissiveIntensity={0.06} roughness={0.9} />
      </mesh>
      <mesh position={[0.7, -0.02, 0.02]}>
        <boxGeometry args={[0.52, 0.24, 0.26]} />
        <meshStandardMaterial color="#171226" emissive="#3b173b" emissiveIntensity={0.04} roughness={0.9} />
      </mesh>
    </group>
  );
}

function PortalRing({
  accent,
  position,
  name
}: {
  accent: string;
  position: [number, number, number];
  name: "start" | "map";
}) {
  return (
    <group position={position} name={name}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.045, 8, 36]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.72}>
        <torusGeometry args={[1.05, 0.025, 8, 30]} />
        <meshBasicMaterial color="#fff3d2" transparent opacity={0.68} />
      </mesh>
      <mesh scale={[1.62, 0.08, 0.12]} position={[0, -1.1, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={accent} transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

export const GeneratedWorld = forwardRef<GeneratedWorldHandle>(function GeneratedWorld(_props, ref) {
  const rootRef = useRef<THREE.Group>(null);
  const stageRef = useRef<THREE.Group>(null);
  const portalRef = useRef<THREE.Group>(null);
  const worldMapPortalRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const slashRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const symbolsRef = useRef<THREE.Group>(null);
  const stageLightRef = useRef<THREE.PointLight>(null);
  const portalLightRef = useRef<THREE.PointLight>(null);
  const elapsedRef = useRef(0);

  const tiles = useMemo<Tile[]>(() => {
    const result: Tile[] = [];
    for (let x = -5; x <= 5; x += 1) {
      for (let z = -7; z <= 7; z += 1) {
        const distance = Math.abs(x) + Math.abs(z) * 0.55;
        result.push({
          key: `${x}:${z}`,
          position: [x * 0.82, -0.08 - distance * 0.006, z * 0.82],
          scale: [0.74, 0.09 + ((x + z + 20) % 3) * 0.025, 0.74],
          color: (x + z) % 2 === 0 ? sceneConfig.colors.ground : sceneConfig.colors.groundAlt
        });
      }
    }
    return result;
  }, []);

  const buildings = useMemo<Building[]>(() => {
    const result: Building[] = [];
    for (let index = 0; index < 26; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const lane = Math.floor(index / 2);
      const height = 0.58 + ((index * 7) % 9) * 0.15;
      result.push({
        key: `building-${index}`,
        position: [side * (3.35 + (index % 5) * 0.24), height * 0.5 - 0.05, -3.1 - lane * 0.48],
        scale: [0.36 + (index % 3) * 0.09, height, 0.36],
        color: index % 3 === 0 ? "#171127" : "#0f0b18",
        light: [0, height * 0.25, 0.19]
      });
    }
    return result;
  }, []);

  const skyline = useMemo<Building[]>(() => {
    const result: Building[] = [];
    for (let index = 0; index < 34; index += 1) {
      const x = -5.15 + index * 0.31;
      const height = 0.44 + ((index * 5) % 8) * 0.12;
      result.push({
        key: `skyline-${index}`,
        position: [x, 1 + height * 0.5, -6.75 - (index % 3) * 0.1],
        scale: [0.18 + (index % 4) * 0.03, height, 0.18],
        color: index % 3 === 0 ? "#151126" : "#0d0a18",
        light: [0, 0, 0.09]
      });
    }
    return result;
  }, []);

  const learningSymbols = useMemo(
    () => [
      { key: "ai", position: [-2.35, 3.25, -2.1] as [number, number, number], color: sceneConfig.colors.cyan, scale: 0.42 },
      { key: "jp", position: [2.25, 3.18, -2.2] as [number, number, number], color: sceneConfig.colors.gold, scale: 0.38 },
      { key: "plus", position: [-1.45, 4.02, -3.1] as [number, number, number], color: sceneConfig.colors.orange, scale: 0.34 },
      { key: "code", position: [1.6, 4.08, -3] as [number, number, number], color: sceneConfig.colors.violet, scale: 0.36 },
      { key: "book", position: [0, 4.36, -3.4] as [number, number, number], color: sceneConfig.colors.warmWhite, scale: 0.3 }
    ],
    []
  );

  const particleData = useMemo(() => {
    const positions = new Float32Array(sceneConfig.particles.count * 3);
    const baseX = new Float32Array(sceneConfig.particles.count);
    const speeds = new Float32Array(sceneConfig.particles.count);
    const phases = new Float32Array(sceneConfig.particles.count);

    for (let index = 0; index < sceneConfig.particles.count; index += 1) {
      const x = (Math.random() - 0.5) * sceneConfig.particles.spread;
      const y = Math.random() * sceneConfig.particles.height + 0.3;
      const z = (Math.random() - 0.5) * sceneConfig.particles.spread - 1.4;
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
      baseX[index] = x;
      speeds[index] = 0.25 + Math.random() * 0.55;
      phases[index] = Math.random() * Math.PI * 2;
    }

    return { positions, baseX, speeds, phases };
  }, []);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(particleData.positions, 3));
    return geometry;
  }, [particleData.positions]);

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    get stage() {
      return stageRef.current;
    },
    get portal() {
      return portalRef.current;
    },
    get worldMapPortal() {
      return worldMapPortalRef.current;
    },
    get moon() {
      return moonRef.current;
    },
    get particles() {
      return particlesRef.current;
    },
    get slash() {
      return slashRef.current;
    },
    get stageLight() {
      return stageLightRef.current;
    },
    get portalLight() {
      return portalLightRef.current;
    }
  }), []);

  useFrame(({ pointer }, delta) => {
    elapsedRef.current += delta;
    const time = elapsedRef.current;

    if (rootRef.current) {
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, pointer.x * 0.035, 0.04);
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, -pointer.y * 0.012, 0.04);
    }

    if (stageRef.current) {
      stageRef.current.rotation.y += 0.003;
    }

    if (portalRef.current) {
      portalRef.current.rotation.z += 0.01;
      portalRef.current.position.y = 1.58 + Math.sin(time * 1.8) * 0.045;
    }

    if (worldMapPortalRef.current) {
      worldMapPortalRef.current.rotation.z -= 0.006;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += 0.004;
      haloRef.current.position.y = 2.45 + Math.sin(time * 1.25) * 0.035;
    }

    if (symbolsRef.current) {
      symbolsRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time * 0.85 + index) * 0.08;
        child.position.y = learningSymbols[index].position[1] + Math.sin(time * 1.1 + index * 0.7) * 0.06;
      });
    }

    if (moonRef.current) {
      moonRef.current.position.x = pointer.x * 0.15;
      moonRef.current.position.y = 5.18 + Math.sin(time * 0.55) * 0.04;
    }

    const particles = particlesRef.current;
    const attribute = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
    if (particles && attribute) {
      for (let index = 0; index < sceneConfig.particles.count; index += 1) {
        const base = index * 3;
        const y = attribute.getY(index);
        const nextY = y > sceneConfig.particles.height + 0.8 ? 0.25 : y + particleData.speeds[index] * 0.006;
        attribute.setY(index, nextY);
        attribute.setX(index, particleData.baseX[index] + Math.sin(time * 0.7 + particleData.phases[index]) * 0.08);
      }
      attribute.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef}>
      <group position={[0, -0.05, 0]}>
        {tiles.map((tile) => (
          <mesh key={tile.key} position={tile.position} scale={tile.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={tile.color} emissive="#4a1028" emissiveIntensity={0.05} roughness={0.82} />
          </mesh>
        ))}
      </group>

      <group ref={stageRef} position={[0, 0.02, 0]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[1.52, 1.72, 0.18, 12]} />
          <meshStandardMaterial color="#151225" emissive="#7c4dff" emissiveIntensity={0.16} roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.92, 1.42, 16]} />
          <meshBasicMaterial color="#42f2ff" transparent opacity={0.34} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.48, 10]} />
          <meshBasicMaterial color="#ff9b38" transparent opacity={0.55} />
        </mesh>
      </group>

      <pointLight ref={stageLightRef} position={[0, 2.35, 1.1]} color={sceneConfig.colors.cyan} intensity={1.5} distance={7} />
      <pointLight ref={portalLightRef} position={[0, 2.1, -2.3]} color={sceneConfig.colors.orange} intensity={1.7} distance={7} />

      <group ref={moonRef} position={[0, 5.18, -8.4]}>
        <mesh>
          <sphereGeometry args={[1.16, 18, 10]} />
          <meshBasicMaterial color="#d81f2c" />
        </mesh>
        <mesh scale={1.24}>
          <sphereGeometry args={[1.16, 12, 8]} />
          <meshBasicMaterial color="#ff5638" transparent opacity={0.14} wireframe />
        </mesh>
      </group>

      <group position={[0, 2.62, -5.7]}>
        <mesh position={[0, 0.95, 0]} scale={[2.9, 0.18, 0.22]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#08050d" emissive="#ff3752" emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[-1.05, 0.35, 0]} scale={[0.22, 1.25, 0.22]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#08050d" emissive="#ff3752" emissiveIntensity={0.06} />
        </mesh>
        <mesh position={[1.05, 0.35, 0]} scale={[0.22, 1.25, 0.22]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#08050d" emissive="#ff3752" emissiveIntensity={0.06} />
        </mesh>
        <mesh position={[0, 0.58, 0]} scale={[2.24, 0.11, 0.18]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#100913" emissive="#ff9b38" emissiveIntensity={0.04} />
        </mesh>
      </group>

      <group>
        {[-4.1, -2.6, 2.4, 4].map((x, index) => (
          <mesh key={`mountain-${x}`} position={[x, 0.68 + index * 0.08, -8.7 - index * 0.36]} scale={[1.5, 1.35 + index * 0.18, 1.5]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1, 1.8, 4]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#110b19" : "#1b0d1e"} emissive="#451029" emissiveIntensity={0.05} roughness={0.92} />
          </mesh>
        ))}
      </group>

      <group>
        {buildings.map((building) => (
          <group key={building.key}>
            <mesh position={building.position} scale={building.scale}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={building.color} emissive="#35184c" emissiveIntensity={0.06} roughness={0.8} />
            </mesh>
            <mesh position={[building.position[0], building.light[1], building.position[2] + building.light[2]]} scale={[0.08, 0.06, 0.02]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={building.key.endsWith("3") ? sceneConfig.colors.cyan : sceneConfig.colors.gold} transparent opacity={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      <group>
        {skyline.map((building) => (
          <group key={building.key}>
            <mesh position={building.position} scale={building.scale}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={building.color} emissive="#2c174b" emissiveIntensity={0.08} roughness={0.86} />
            </mesh>
            <mesh position={[building.position[0], building.position[1] + building.scale[1] * 0.16, building.position[2] + building.light[2]]} scale={[0.035, 0.035, 0.012]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={building.key.endsWith("4") ? sceneConfig.colors.cyan : sceneConfig.colors.gold} transparent opacity={0.58} />
            </mesh>
          </group>
        ))}
      </group>

      <LowPolyCloud position={[-2.8, 4.45, -6.8]} scale={1.2} />
      <LowPolyCloud position={[2.5, 4.08, -6.2]} scale={0.95} />
      <LowPolyCloud position={[0.1, 4.65, -7.4]} scale={0.72} />

      <group ref={haloRef} position={[0, 2.45, -1.05]}>
        <mesh rotation={[0.18, 0, 0]}>
          <torusGeometry args={[1.55, 0.025, 8, 42]} />
          <meshBasicMaterial color={sceneConfig.colors.cyan} transparent opacity={0.34} />
        </mesh>
        <mesh rotation={[0.18, 0, 0.72]} scale={0.78}>
          <torusGeometry args={[1.55, 0.018, 8, 36]} />
          <meshBasicMaterial color={sceneConfig.colors.orange} transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[0.18, 0, -0.64]} scale={1.22}>
          <torusGeometry args={[1.55, 0.014, 8, 42]} />
          <meshBasicMaterial color={sceneConfig.colors.violet} transparent opacity={0.24} />
        </mesh>
      </group>

      <group ref={symbolsRef}>
        {learningSymbols.map((symbol) => (
          <group key={symbol.key} position={symbol.position} scale={symbol.scale}>
            {symbol.key === "ai" && (
              <>
                <mesh position={[-0.22, 0, 0]} scale={[0.08, 0.46, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.76} />
                </mesh>
                <mesh position={[0.22, 0, 0]} scale={[0.08, 0.46, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.76} />
                </mesh>
                <mesh position={[0, 0.02, 0]} scale={[0.46, 0.07, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.76} />
                </mesh>
              </>
            )}
            {symbol.key === "jp" && (
              <>
                <mesh position={[0, 0.08, 0]} scale={[0.44, 0.08, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.72} />
                </mesh>
                <mesh position={[0, -0.1, 0]} scale={[0.08, 0.42, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.72} />
                </mesh>
              </>
            )}
            {symbol.key === "plus" && (
              <>
                <mesh scale={[0.56, 0.08, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.74} />
                </mesh>
                <mesh scale={[0.08, 0.56, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.74} />
                </mesh>
              </>
            )}
            {symbol.key === "code" && (
              <>
                <mesh position={[-0.17, 0, 0]} rotation={[0, 0, 0.58]} scale={[0.08, 0.44, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.72} />
                </mesh>
                <mesh position={[0.17, 0, 0]} rotation={[0, 0, -0.58]} scale={[0.08, 0.44, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.72} />
                </mesh>
              </>
            )}
            {symbol.key === "book" && (
              <>
                <mesh position={[-0.13, 0, 0]} rotation={[0, 0, -0.14]} scale={[0.22, 0.34, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.55} />
                </mesh>
                <mesh position={[0.13, 0, 0]} rotation={[0, 0, 0.14]} scale={[0.22, 0.34, 0.035]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color={symbol.color} transparent opacity={0.55} />
                </mesh>
              </>
            )}
          </group>
        ))}
      </group>

      <group ref={portalRef} position={[0, 1.58, -2.55]} scale={[0.88, 0.88, 0.88]}>
        <PortalRing accent={sceneConfig.colors.orange} position={[0, 0, 0]} name="start" />
      </group>

      <group ref={worldMapPortalRef} position={[3.1, 1.45, -4.65]} scale={[0.78, 0.78, 0.78]}>
        <PortalRing accent={sceneConfig.colors.cyan} position={[0, 0, 0]} name="map" />
      </group>

      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial color={sceneConfig.colors.gold} size={0.035} sizeAttenuation transparent opacity={0.78} />
      </points>

      <group ref={slashRef} visible={false} position={[0, 1.86, 0.28]} rotation={[0, 0, -0.35]}>
        <mesh scale={[2.8, 0.035, 0.035]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#fff3d2" />
        </mesh>
        <mesh scale={[3.1, 0.016, 0.016]} position={[0, -0.05, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff3752" transparent opacity={0.76} />
        </mesh>
      </group>
    </group>
  );
});
