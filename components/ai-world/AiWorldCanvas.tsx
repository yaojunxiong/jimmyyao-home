"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { forwardRef, Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { FloatingIsland } from "./FloatingIsland";
import { JyCharacter, type JyCharacterHandle, type UserCharacterProfile } from "./JyCharacter";
import { PortalBuilding } from "./PortalBuilding";
import { SakuraParticles } from "./SakuraParticles";
import { aiWorldPortals, getAiWorldPortal, type AiWorldPortalId } from "./portals";
import styles from "./ai-world.module.css";

export type AiWorldCanvasHandle = {
  travelToPortal: (options: {
    id: AiWorldPortalId;
    reducedMotion: boolean;
    onArrive?: () => void;
    onComplete?: () => void;
  }) => void;
};

type AiWorldCanvasProps = {
  activePortal: AiWorldPortalId | null;
  hoveredPortal: AiWorldPortalId | null;
  isTransitioning: boolean;
  characterProfile: UserCharacterProfile;
  onPortalHover: (id: AiWorldPortalId | null) => void;
  onPortalSelect: (id: AiWorldPortalId) => void;
};

type SceneRefs = {
  camera: THREE.PerspectiveCamera | null;
  lookAt: THREE.Vector3;
  character: JyCharacterHandle | null;
  running: boolean;
  isDesktop: boolean;
};

const movementKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]);

function clampToIsland(point: THREE.Vector3) {
  const maxX = 3.45;
  const maxZ = 2.65;
  const normalized = (point.x * point.x) / (maxX * maxX) + (point.z * point.z) / (maxZ * maxZ);

  if (normalized > 1) {
    const scale = 1 / Math.sqrt(normalized);
    point.x *= scale;
    point.z *= scale;
  }

  point.y = 0.42;
  return point;
}

function hasWebGL() {
  if (typeof window === "undefined") return true;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function useLowPerformanceMode() {
  const [lowPerformance, setLowPerformance] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const smallCpu = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
    const smallMemory = nav.deviceMemory ? nav.deviceMemory <= 4 : false;
    const narrow = window.matchMedia("(max-width: 430px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLowPerformance(reduced || (narrow && (smallCpu || smallMemory)));
  }, []);

  return lowPerformance;
}

function cameraPreset(isDesktop: boolean) {
  return isDesktop
    ? {
        position: new THREE.Vector3(0, 5.65, 7.25),
        lookAt: new THREE.Vector3(0, 0.72, -0.18),
        fov: 40
      }
    : {
        position: new THREE.Vector3(0, 7.05, 9.35),
        lookAt: new THREE.Vector3(0, 0.58, -0.06),
        fov: 53
      };
}

function SceneContent({
  activePortal,
  hoveredPortal,
  isTransitioning,
  characterProfile,
  lowPerformance,
  onPortalHover,
  onPortalSelect,
  sceneRefs
}: AiWorldCanvasProps & {
  lowPerformance: boolean;
  sceneRefs: MutableRefObject<SceneRefs>;
}) {
  const characterRef = useRef<JyCharacterHandle | null>(null);
  const worldRef = useRef<THREE.Group>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const moveTargetRef = useRef<THREE.Vector3 | null>(null);
  const { camera, pointer } = useThree();

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const preset = cameraPreset(sceneRefs.current.isDesktop);
    perspective.position.copy(preset.position);
    perspective.fov = preset.fov;
    perspective.updateProjectionMatrix();
    sceneRefs.current.lookAt.copy(preset.lookAt);
    sceneRefs.current.camera = perspective;
    sceneRefs.current.character = characterRef.current;
  }, [camera, sceneRefs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!movementKeys.has(event.code)) return;
      event.preventDefault();
      pressedKeysRef.current.add(event.code);
      moveTargetRef.current = null;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (!movementKeys.has(event.code)) return;
      event.preventDefault();
      pressedKeysRef.current.delete(event.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const handleGroundPointerDown = (event: { stopPropagation: () => void; point: THREE.Vector3 }) => {
    if (isTransitioning || sceneRefs.current.running || !worldRef.current) return;
    event.stopPropagation();
    const localPoint = worldRef.current.worldToLocal(event.point.clone());
    moveTargetRef.current = clampToIsland(new THREE.Vector3(localPoint.x, 0.42, localPoint.z));
  };

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const character = characterRef.current;

    if (worldRef.current && !isTransitioning) {
      const targetScale = sceneRefs.current.isDesktop ? 1.02 : 0.84;
      worldRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
      worldRef.current.rotation.y = pointer.x * 0.055;
      worldRef.current.rotation.x = -pointer.y * 0.018;
    }

    if (character?.root) {
      const root = character.root;

      if (!sceneRefs.current.running) {
        const keys = pressedKeysRef.current;
        const keyboardDirection = new THREE.Vector3(
          (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0),
          0,
          (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) - (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0)
        );
        const hasKeyboardInput = keyboardDirection.lengthSq() > 0.01;
        let isFreeMoving = false;
        let facing = root.rotation.y;

        if (hasKeyboardInput) {
          keyboardDirection.normalize();
          const nextPosition = root.position.clone().addScaledVector(keyboardDirection, delta * (sceneRefs.current.isDesktop ? 2.05 : 1.75));
          clampToIsland(nextPosition);
          root.position.x = nextPosition.x;
          root.position.z = nextPosition.z;
          facing = Math.atan2(keyboardDirection.x, keyboardDirection.z);
          isFreeMoving = true;
        } else if (moveTargetRef.current) {
          const toTarget = moveTargetRef.current.clone().sub(root.position);
          toTarget.y = 0;
          const distance = toTarget.length();

          if (distance > 0.08) {
            const direction = toTarget.normalize();
            const step = Math.min(distance, delta * (sceneRefs.current.isDesktop ? 1.95 : 1.68));
            root.position.x += direction.x * step;
            root.position.z += direction.z * step;
            facing = Math.atan2(direction.x, direction.z);
            isFreeMoving = true;
          } else {
            moveTargetRef.current = null;
          }
        }

        const stride = Math.sin(time * 10.8);
        character.setRunning(isFreeMoving);
        root.position.y = isFreeMoving ? 0.42 + Math.abs(stride) * 0.06 : 0.42 + Math.sin(time * 2.2) * 0.045;
        root.scale.setScalar(root.scale.x + ((sceneRefs.current.isDesktop ? 0.68 : 0.62) - root.scale.x) * 0.08);
        root.rotation.y += (facing - root.rotation.y) * (isFreeMoving ? 0.16 : 0.05);
        root.rotation.x += ((isFreeMoving ? -0.13 : 0) - root.rotation.x) * 0.12;
        root.rotation.z = isFreeMoving ? Math.sin(time * 10.8) * 0.04 : Math.sin(time * 1.8) * 0.018;

        if (character.leftArm && character.rightArm && character.leftLeg && character.rightLeg) {
          character.leftArm.rotation.x = stride * (isFreeMoving ? 0.9 : 0.2);
          character.rightArm.rotation.x = -stride * (isFreeMoving ? 0.9 : 0.2);
          character.leftLeg.rotation.x = -stride * (isFreeMoving ? 0.72 : 0.08);
          character.rightLeg.rotation.x = stride * (isFreeMoving ? 0.72 : 0.08);
        }
      } else if (character.leftArm && character.rightArm && character.leftLeg && character.rightLeg) {
        character.setRunning(true);
        const stride = Math.sin(time * 12);
        root.rotation.x += (-0.2 - root.rotation.x) * 0.2;
        root.rotation.z = Math.sin(time * 12) * 0.055;
        character.leftArm.rotation.x = stride * 1.18;
        character.rightArm.rotation.x = -stride * 1.18;
        character.leftLeg.rotation.x = -stride * 0.96;
        character.rightLeg.rotation.x = stride * 0.96;
      }
    }

    const active = activePortal ? getAiWorldPortal(activePortal) : null;
    if (active && isTransitioning) {
      sceneRefs.current.lookAt.lerp(new THREE.Vector3(active.position[0] * 0.45, 0.82, active.position[2] * 0.45), 0.04);
    }

    if (sceneRefs.current.camera) {
      sceneRefs.current.camera.lookAt(sceneRefs.current.lookAt);
    }
  });

  return (
    <>
      <color attach="background" args={["#7bd3ff"]} />
      <fog attach="fog" args={["#d9f6ff", 10, 21]} />
      <ambientLight intensity={1.05} color="#fff8e6" />
      <hemisphereLight args={["#e3f9ff", "#8bd675", 1.45]} />
      <directionalLight position={[4.6, 7.2, 5]} intensity={1.95} color="#fff1c7" />
      <pointLight position={[0, 2.4, 0]} color="#ffe7a3" intensity={1.75} distance={8} />
      <pointLight position={[0, 1.5, -2.9]} color="#fbbf24" intensity={0.65} distance={6} />

      <group ref={worldRef}>
        <FloatingIsland />
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} onPointerDown={handleGroundPointerDown}>
          <circleGeometry args={[3.92, 96]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {aiWorldPortals.map((portal) => (
          <PortalBuilding
            key={portal.id}
            portal={portal}
            active={activePortal === portal.id}
            hovered={hoveredPortal === portal.id}
            disabled={isTransitioning}
            onHover={onPortalHover}
            onSelect={onPortalSelect}
          />
        ))}
        <JyCharacter ref={characterRef} profile={characterProfile} />
        <SakuraParticles lowPerformance={lowPerformance} />
      </group>
    </>
  );
}

export const AiWorldCanvas = forwardRef<AiWorldCanvasHandle, AiWorldCanvasProps>(function AiWorldCanvas(
  props,
  ref
) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const isDesktop = useDesktopLayout();
  const lowPerformance = useLowPerformanceMode();
  const sceneRefs = useRef<SceneRefs>({
    camera: null,
    lookAt: new THREE.Vector3(0, 0.52, -0.25),
    character: null,
    running: false,
    isDesktop: false
  });

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  useEffect(() => {
    sceneRefs.current.isDesktop = isDesktop;
    const preset = cameraPreset(isDesktop);
    sceneRefs.current.lookAt.copy(preset.lookAt);
    if (sceneRefs.current.camera) {
      sceneRefs.current.camera.position.copy(preset.position);
      sceneRefs.current.camera.fov = preset.fov;
      sceneRefs.current.camera.updateProjectionMatrix();
    }
  }, [isDesktop]);

  useImperativeHandle(ref, () => ({
    travelToPortal({ id, reducedMotion, onArrive, onComplete }) {
      const portal = getAiWorldPortal(id);
      const { camera, character, lookAt } = sceneRefs.current;

      if (!portal || !character?.root || !camera) {
        onArrive?.();
        onComplete?.();
        return;
      }

      const root = character.root;
      const destination = new THREE.Vector3(
        portal.entrancePosition[0],
        portal.entrancePosition[1],
        portal.entrancePosition[2]
      );
      const dx = destination.x - root.position.x;
      const dz = destination.z - root.position.z;
      const facing = Math.atan2(dx, dz);
      const preset = cameraPreset(sceneRefs.current.isDesktop);
      const cameraFollowX = sceneRefs.current.isDesktop ? 0.14 : 0.08;
      const cameraFollowZ = sceneRefs.current.isDesktop ? 0.1 : 0.06;
      const cameraLift = sceneRefs.current.isDesktop ? -0.34 : -0.18;
      const enterPoint = new THREE.Vector3(
        portal.position[0] * 0.9,
        portal.entrancePosition[1] - 0.03,
        portal.position[2] * 0.9
      );

      if (reducedMotion) {
        root.position.copy(destination);
        root.rotation.y = facing;
        onArrive?.();
        onComplete?.();
        return;
      }

      sceneRefs.current.running = true;
      character.setRunning(true);

      const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            sceneRefs.current.running = false;
            character.setRunning(false);
            gsap.to(root.rotation, { x: 0, z: 0, duration: 0.2, overwrite: true });
            onComplete?.();
          }
        });

      timeline
        .to(root.rotation, { y: facing, duration: 0.24, ease: "power2.out" }, 0)
        .to(root.position, { x: destination.x, z: destination.z, duration: 1.18 }, 0.14)
        .to(root.position, { y: destination.y + 0.095, duration: 0.12, repeat: 7, yoyo: true, ease: "sine.inOut" }, 0.14)
        .to(root.position, { y: destination.y, duration: 0.16, ease: "power2.out" }, 1.18)
        .to(camera.position, {
          x: preset.position.x + destination.x * cameraFollowX,
          y: preset.position.y + cameraLift,
          z: preset.position.z + destination.z * cameraFollowZ,
          duration: 1.16
        }, 0.14)
        .to(lookAt, { x: destination.x * 0.3, y: 0.82, z: destination.z * 0.3, duration: 1.16 }, 0.14)
        .add(() => onArrive?.(), 1.26);

      if (portal.enabled) {
        timeline
          .to(root.rotation, { x: -0.05, z: 0, duration: 0.16, ease: "power2.out" }, 1.28)
          .to(root.position, { x: enterPoint.x, y: enterPoint.y, z: enterPoint.z, duration: 0.44, ease: "power2.in" }, 1.32)
          .to(root.scale, { x: 0.36, y: 0.36, z: 0.36, duration: 0.44, ease: "power2.in" }, 1.32)
          .to(camera.position, {
            x: preset.position.x + destination.x * (cameraFollowX + 0.04),
            y: preset.position.y + cameraLift - 0.16,
            z: preset.position.z + destination.z * (cameraFollowZ + 0.03),
            duration: 0.42
          }, 1.36);
      } else {
        timeline.to(root.rotation, { x: 0, z: 0, duration: 0.18, ease: "power2.out" }, 1.24);
      }
    }
  }), []);

  if (webglSupported === false) {
    return (
      <div className={styles.webglFallback}>
        <div>
          <strong>AI Learning World</strong>
          <span>WebGL が利用できません。下のリンクから各システムへ移動できます。</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.canvasStage} aria-hidden="true">
      {webglSupported && (
        <Canvas
          dpr={[1, lowPerformance ? 1.25 : 1.8]}
          camera={{ position: cameraPreset(isDesktop).position, fov: cameraPreset(isDesktop).fov, near: 0.1, far: 42 }}
          gl={{ antialias: !lowPerformance, alpha: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <SceneContent {...props} lowPerformance={lowPerformance} sceneRefs={sceneRefs} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
});
