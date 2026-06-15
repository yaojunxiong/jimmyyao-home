"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";
import {
  type CameraPreset,
  enterWorldMotion,
  openingMotion,
  startLearningDance,
  worldMapPortalMotion
} from "@/lib/dancerAnimations";
import { sceneConfig } from "@/lib/sceneConfig";
import { BlockyDancer, type BlockyDancerHandle } from "./BlockyDancer";
import { GeneratedWorld, type GeneratedWorldHandle } from "./GeneratedWorld";
import styles from "./anime-gate.module.css";

export type ThreeGateSceneHandle = {
  enterWorld: (onComplete?: () => void) => void;
  startDance: (options: { onComplete: () => void; reducedMotion: boolean }) => void;
  openWorldMap: (options: { onComplete: () => void; reducedMotion: boolean }) => void;
};

type SceneRefs = {
  camera: THREE.PerspectiveCamera | null;
  lookAt: THREE.Vector3;
  dancer: BlockyDancerHandle | null;
  world: GeneratedWorldHandle | null;
  cameraPreset: CameraPreset;
};

function applyVector3(target: THREE.Vector3, value: readonly [number, number, number]) {
  target.set(value[0], value[1], value[2]);
}

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

function SceneContent({ isDesktop, sceneRefs }: { isDesktop: boolean; sceneRefs: MutableRefObject<SceneRefs> }) {
  const dancerRef = useRef<BlockyDancerHandle | null>(null);
  const worldRef = useRef<GeneratedWorldHandle | null>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const openingPlayedRef = useRef(false);
  const { camera } = useThree();
  const cameraPreset = isDesktop ? sceneConfig.camera.desktop : sceneConfig.camera.mobile;
  const layoutPreset = isDesktop ? sceneConfig.layout.desktop : sceneConfig.layout.mobile;

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    applyVector3(perspectiveCamera.position, cameraPreset.initialPosition);
    perspectiveCamera.lookAt(sceneRefs.current.lookAt);
    sceneRefs.current.camera = perspectiveCamera;
    sceneRefs.current.cameraPreset = cameraPreset;
  }, [camera, cameraPreset, sceneRefs]);

  useEffect(() => {
    sceneRefs.current.dancer = dancerRef.current;
    sceneRefs.current.world = worldRef.current;
    sceneRefs.current.cameraPreset = cameraPreset;

    if (!openingPlayedRef.current && sceneRefs.current.camera && dancerRef.current && worldRef.current) {
      openingPlayedRef.current = true;
      openingMotion({
        camera: sceneRefs.current.camera,
        cameraLookAt: sceneRefs.current.lookAt,
        dancer: dancerRef.current,
        world: worldRef.current,
        cameraPreset
      });
    }
  }, [cameraPreset, sceneRefs]);

  useEffect(() => {
    const cameraObject = sceneRefs.current.camera;
    if (!cameraObject || !openingPlayedRef.current) {
      applyVector3(sceneRefs.current.lookAt, cameraPreset.lookAt);
      return;
    }

    applyVector3(cameraObject.position, cameraPreset.initialPosition);
    applyVector3(sceneRefs.current.lookAt, cameraPreset.lookAt);
  }, [cameraPreset, sceneRefs]);

  useFrame(() => {
    if (sceneRefs.current.camera) {
      sceneRefs.current.camera.lookAt(sceneRefs.current.lookAt);
    }
  });

  return (
    <>
      <color attach="background" args={[sceneConfig.colors.night]} />
      <fog attach="fog" args={[sceneConfig.colors.night, 7.5, 15]} />
      <ambientLight intensity={0.42} color="#9ba8ff" />
      <hemisphereLight args={["#5f7dff", "#1b0710", 0.86]} />
      <directionalLight position={[2, 5, 4]} intensity={0.9} color="#fff3d2" />
      <group ref={sceneGroupRef} position={layoutPreset.scenePosition} scale={layoutPreset.sceneScale}>
        <GeneratedWorld ref={worldRef} />
        <BlockyDancer ref={dancerRef} position={layoutPreset.dancerPosition} scale={layoutPreset.dancerScale} />
      </group>
    </>
  );
}

export const ThreeGateScene = forwardRef<ThreeGateSceneHandle, { transitionOverlayRef: RefObject<HTMLDivElement | null> }>(
  function ThreeGateScene({ transitionOverlayRef }, ref) {
    const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
    const isDesktop = useDesktopLayout();
    const sceneRefs = useRef<SceneRefs>({
      camera: null,
      lookAt: new THREE.Vector3(
        sceneConfig.camera.mobile.lookAt[0],
        sceneConfig.camera.mobile.lookAt[1],
        sceneConfig.camera.mobile.lookAt[2]
      ),
      dancer: null,
      world: null,
      cameraPreset: sceneConfig.camera.mobile
    });

    useEffect(() => {
      setWebglSupported(hasWebGL());
    }, []);

    useImperativeHandle(ref, () => ({
      enterWorld(onComplete) {
        const { camera, lookAt, dancer, world } = sceneRefs.current;
        if (!camera) {
          onComplete?.();
          return;
        }

        enterWorldMotion({
          camera,
          cameraLookAt: lookAt,
          dancer,
          world,
          cameraPreset: sceneRefs.current.cameraPreset,
          onComplete
        });
      },
      startDance({ onComplete, reducedMotion }) {
        const { camera, lookAt, dancer, world } = sceneRefs.current;
        if (!camera) {
          onComplete();
          return;
        }

        startLearningDance({
          camera,
          cameraLookAt: lookAt,
          dancer,
          world,
          reducedMotion,
          transitionOverlay: transitionOverlayRef.current,
          cameraPreset: sceneRefs.current.cameraPreset,
          onComplete
        });
      },
      openWorldMap({ onComplete, reducedMotion }) {
        const { camera, lookAt, world } = sceneRefs.current;
        if (!camera) {
          onComplete();
          return;
        }

        worldMapPortalMotion({
          camera,
          cameraLookAt: lookAt,
          world,
          reducedMotion,
          transitionOverlay: transitionOverlayRef.current,
          cameraPreset: sceneRefs.current.cameraPreset,
          onComplete
        });
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
            dpr={[1, sceneConfig.performance.maxDpr]}
            camera={{ position: sceneConfig.camera.mobile.initialPosition, fov: isDesktop ? 40 : 42, near: 0.1, far: 40 }}
            gl={{
              alpha: false,
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <SceneContent isDesktop={isDesktop} sceneRefs={sceneRefs} />
          </Canvas>
        )}
      </div>
    );
  }
);
