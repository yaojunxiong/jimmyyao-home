"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";
import { getWorldPortal, type WorldPortalKey } from "@/lib/world-portals";
import { sceneConfig } from "@/lib/sceneConfig";
import { BlockyDancer, type BlockyDancerHandle } from "./BlockyDancer";
import { IslandWorld, type IslandWorldHandle } from "./IslandWorld";
import styles from "./anime-gate.module.css";

export type ThreeGateSceneHandle = {
  travelToPortal: (options: {
    key: WorldPortalKey;
    reducedMotion: boolean;
    onArrive?: () => void;
    onComplete?: () => void;
  }) => void;
};

type ThreeGateSceneProps = {
  activePortal?: WorldPortalKey | null;
  onPortalSelect: (key: WorldPortalKey) => void;
  transitionOverlayRef: RefObject<HTMLDivElement | null>;
};

type SceneRefs = {
  camera: THREE.PerspectiveCamera | null;
  lookAt: THREE.Vector3;
  dancer: BlockyDancerHandle | null;
  island: IslandWorldHandle | null;
  isDesktop: boolean;
};

function hasWebGL() {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
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
    const narrowScreen = window.matchMedia("(max-width: 430px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLowPerformance(reducedMotion || (narrowScreen && (smallCpu || smallMemory)));
  }, []);

  return lowPerformance;
}

function getCameraPreset(isDesktop: boolean) {
  return isDesktop
    ? {
        position: new THREE.Vector3(0, 5.25, 6.9),
        lookAt: new THREE.Vector3(0, 0.48, -0.22),
        scenePosition: [-0.85, -0.54, 0] as const,
        sceneScale: 0.94
      }
    : {
        position: new THREE.Vector3(0, 5.55, 7.45),
        lookAt: new THREE.Vector3(0, 0.42, -0.2),
        scenePosition: [0, -0.72, 0] as const,
        sceneScale: 0.82
      };
}

function SceneContent({
  activePortal,
  lowPerformance,
  onPortalSelect,
  sceneRefs
}: {
  activePortal?: WorldPortalKey | null;
  lowPerformance: boolean;
  onPortalSelect: (key: WorldPortalKey) => void;
  sceneRefs: MutableRefObject<SceneRefs>;
}) {
  const dancerRef = useRef<BlockyDancerHandle | null>(null);
  const islandRef = useRef<IslandWorldHandle | null>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();
  const isDesktop = sceneRefs.current.isDesktop;
  const preset = getCameraPreset(isDesktop);

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    perspectiveCamera.position.copy(preset.position);
    sceneRefs.current.lookAt.copy(preset.lookAt);
    sceneRefs.current.camera = perspectiveCamera;
    sceneRefs.current.dancer = dancerRef.current;
    sceneRefs.current.island = islandRef.current;
  }, [camera, preset.lookAt, preset.position, sceneRefs]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.y = pointer.x * 0.08;
      sceneGroupRef.current.rotation.x = -pointer.y * 0.025;
    }

    if (sceneRefs.current.camera) {
      sceneRefs.current.camera.lookAt(sceneRefs.current.lookAt);
    }

    if (islandRef.current?.root) {
      islandRef.current.root.position.y = Math.sin(time * 0.8) * 0.04;
    }
  });

  return (
    <>
      <color attach="background" args={["#73c9ff"]} />
      <fog attach="fog" args={["#bdeeff", 9, 20]} />
      <ambientLight intensity={0.86} color="#fff6df" />
      <hemisphereLight args={["#dff7ff", "#8bcf74", 1.05]} />
      <directionalLight position={[4, 7, 4]} intensity={1.55} color="#fff5d6" />
      <pointLight position={[0, 2.4, 0]} color="#ffe6a6" intensity={1.4} distance={7} />
      <group ref={sceneGroupRef} position={preset.scenePosition} scale={preset.sceneScale}>
        <IslandWorld ref={islandRef} activePortal={activePortal} lowPerformance={lowPerformance} onPortalSelect={onPortalSelect} />
        <BlockyDancer ref={dancerRef} position={[0, 0.18, 0.18]} scale={0.44} />
      </group>
    </>
  );
}

export const ThreeGateScene = forwardRef<ThreeGateSceneHandle, ThreeGateSceneProps>(function ThreeGateScene(
  { activePortal, onPortalSelect, transitionOverlayRef },
  ref
) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const isDesktop = useDesktopLayout();
  const lowPerformance = useLowPerformanceMode();
  const sceneRefs = useRef<SceneRefs>({
    camera: null,
    lookAt: new THREE.Vector3(0, 0.42, 0),
    dancer: null,
    island: null,
    isDesktop: false
  });

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  useEffect(() => {
    sceneRefs.current.isDesktop = isDesktop;
    const camera = sceneRefs.current.camera;
    if (camera) {
      const preset = getCameraPreset(isDesktop);
      camera.position.copy(preset.position);
      sceneRefs.current.lookAt.copy(preset.lookAt);
    }
  }, [isDesktop]);

  useImperativeHandle(ref, () => ({
    travelToPortal({ key, reducedMotion, onArrive, onComplete }) {
      const portal = getWorldPortal(key);
      const { camera, dancer, island, lookAt, isDesktop: desktop } = sceneRefs.current;

      if (!portal || !camera || !dancer?.root) {
        onArrive?.();
        onComplete?.();
        return;
      }

      island?.activatePortal(key);

      const destination = new THREE.Vector3(portal.position[0] * 0.78, 0.18, portal.position[2] * 0.78);
      const current = dancer.root.position.clone();
      const dx = destination.x - current.x;
      const dz = destination.z - current.z;
      const facing = Math.atan2(dx, dz);

      if (reducedMotion) {
        dancer.root.position.copy(destination);
        dancer.root.rotation.y = facing;
        onArrive?.();
        onComplete?.();
        return;
      }

      dancer.setDancing(true);

      const cameraTarget = desktop
        ? new THREE.Vector3(destination.x * 0.18, 4.8, 6.25)
        : new THREE.Vector3(destination.x * 0.12, 5.15, 6.85);

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          dancer.setDancing(false);
          onComplete?.();
        }
      });

      timeline.to(dancer.root.rotation, { y: facing, duration: 0.22, ease: "power2.out" }, 0);
      timeline.to(dancer.root.position, { x: destination.x, z: destination.z, duration: 1.12, ease: "power2.inOut" }, 0.16);
      timeline.to(camera.position, { x: cameraTarget.x, y: cameraTarget.y, z: cameraTarget.z, duration: 1.08, ease: "power2.inOut" }, 0.16);
      timeline.to(lookAt, { x: destination.x * 0.35, y: 0.62, z: destination.z * 0.35 - 0.12, duration: 1.08, ease: "power2.inOut" }, 0.16);

      if (dancer.leftArm && dancer.rightArm && dancer.leftLeg && dancer.rightLeg) {
        timeline.to(dancer.leftArm.rotation, { x: -0.95, z: 0.65, duration: 0.18, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.2);
        timeline.to(dancer.rightArm.rotation, { x: -0.2, z: -0.65, duration: 0.18, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.2);
        timeline.to(dancer.leftLeg.rotation, { x: 0.36, duration: 0.18, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.2);
        timeline.to(dancer.rightLeg.rotation, { x: -0.36, duration: 0.18, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.2);
      }

      timeline.add(() => {
        onArrive?.();
        if (transitionOverlayRef.current && portal.status === "live") {
          gsap.fromTo(transitionOverlayRef.current, { autoAlpha: 0 }, { autoAlpha: 0.34, duration: 0.2, yoyo: true, repeat: 1 });
        }
      }, 1.25);
    }
  }), [transitionOverlayRef]);

  if (webglSupported === false) {
    return (
      <div className={styles.webglFallback} aria-hidden="true">
        <div className={styles.fallbackGrid} />
        <div className={styles.fallbackPortal} />
      </div>
    );
  }

  return (
    <div className={styles.threeStage} aria-hidden="true">
      {webglSupported && (
        <Canvas
          className={styles.threeCanvas}
          dpr={[1, lowPerformance ? 1.25 : sceneConfig.performance.maxDpr]}
          camera={{ position: getCameraPreset(isDesktop).position, fov: isDesktop ? 42 : 47, near: 0.1, far: 40 }}
          gl={{
            alpha: false,
            antialias: !lowPerformance,
            powerPreference: "high-performance"
          }}
        >
          <SceneContent
            activePortal={activePortal}
            lowPerformance={lowPerformance}
            onPortalSelect={onPortalSelect}
            sceneRefs={sceneRefs}
          />
        </Canvas>
      )}
    </div>
  );
});
