import gsap from "gsap";
import type * as THREE from "three";
import { sceneConfig } from "./sceneConfig";

export type DancerRig = {
  root: THREE.Group | null;
  torso: THREE.Group | null;
  head: THREE.Group | null;
  leftArm: THREE.Group | null;
  rightArm: THREE.Group | null;
  leftLeg: THREE.Group | null;
  rightLeg: THREE.Group | null;
  scarf: THREE.Group | null;
  chestLight: THREE.Mesh | null;
  leftEye: THREE.Mesh | null;
  rightEye: THREE.Mesh | null;
  setDancing: (active: boolean) => void;
};

export type WorldRig = {
  root: THREE.Group | null;
  stage: THREE.Group | null;
  stagePulse: THREE.Group | null;
  portal: THREE.Group | null;
  worldMapPortal: THREE.Group | null;
  moon: THREE.Group | null;
  particles: THREE.Points | null;
  cubeParticles: THREE.InstancedMesh | null;
  slash: THREE.Group | null;
  stageLight: THREE.PointLight | null;
  portalLight: THREE.PointLight | null;
};

export type CameraPreset = {
  initialPosition: readonly [number, number, number];
  enteredPosition: readonly [number, number, number];
  worldMapPosition: readonly [number, number, number];
  lookAt: readonly [number, number, number];
  enteredLookAt: readonly [number, number, number];
};

type MotionTargets = {
  camera: THREE.PerspectiveCamera;
  cameraLookAt: THREE.Vector3;
  dancer?: DancerRig | null;
  world?: WorldRig | null;
  transitionOverlay?: HTMLDivElement | null;
  cameraPreset?: CameraPreset;
};

type MotionOptions = MotionTargets & {
  reducedMotion?: boolean;
  onComplete?: () => void;
};

function vectorTo(target: THREE.Vector3, value: readonly [number, number, number], duration: number, position = 0) {
  return { target, value, duration, position };
}

function applyVector3(target: THREE.Vector3, value: readonly [number, number, number]) {
  target.set(value[0], value[1], value[2]);
}

function flashOverlay(timeline: gsap.core.Timeline, overlay?: HTMLDivElement | null, at = 0) {
  if (!overlay) {
    return;
  }

  timeline
    .set(overlay, { autoAlpha: 0 }, at)
    .to(overlay, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, at)
    .to(overlay, { autoAlpha: 0, duration: 0.24, ease: "power2.in" }, at + 0.14);
}

function setDancing(dancer: DancerRig | null | undefined, active: boolean) {
  dancer?.setDancing(active);
}

export function openingMotion({ camera, cameraLookAt, dancer, world, cameraPreset = sceneConfig.camera.mobile }: MotionTargets) {
  const timeline = gsap.timeline();

  applyVector3(camera.position, cameraPreset.initialPosition);
  applyVector3(cameraLookAt, cameraPreset.lookAt);

  if (world?.root) {
    gsap.set(world.root.scale, { x: 0.92, y: 0.92, z: 0.92 });
    timeline.to(world.root.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "power3.out" }, 0);
  }

  if (world?.moon) {
    gsap.set(world.moon.scale, { x: 0.72, y: 0.72, z: 0.72 });
    timeline.to(world.moon.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: "back.out(1.6)" }, 0.12);
  }

  if (dancer?.root) {
    gsap.set(dancer.root.position, { y: -0.16 });
    gsap.set(dancer.root.scale, { x: 0.86, y: 0.86, z: 0.86 });
    timeline.to(dancer.root.position, { y: 0, duration: 0.9, ease: "power2.out" }, 0.36);
    timeline.to(dancer.root.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "back.out(1.8)" }, 0.36);
  }

  if (world?.stageLight) {
    gsap.set(world.stageLight, { intensity: 0.6 });
    timeline.to(world.stageLight, { intensity: 1.55, duration: 1.1, ease: "sine.inOut" }, 0.2);
  }

  if (world?.stagePulse) {
    gsap.set(world.stagePulse.scale, { x: 0.82, y: 0.82, z: 0.82 });
    timeline.to(world.stagePulse.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 1.1, ease: "power2.out" }, 0.34);
  }

  return timeline;
}

export function enterWorldMotion({
  camera,
  cameraLookAt,
  dancer,
  world,
  reducedMotion,
  onComplete,
  cameraPreset = sceneConfig.camera.mobile
}: MotionOptions) {
  const timeline = gsap.timeline({
    onComplete
  });

  if (reducedMotion) {
    timeline.to({}, { duration: 0.25 });
    return timeline;
  }

  const cameraMove = vectorTo(camera.position, cameraPreset.enteredPosition, 0.8);
  timeline.to(cameraMove.target, {
    x: cameraMove.value[0],
    y: cameraMove.value[1],
    z: cameraMove.value[2],
    duration: cameraMove.duration,
    ease: "power3.out"
  }, cameraMove.position);
  timeline.to(cameraLookAt, {
    x: cameraPreset.enteredLookAt[0],
    y: cameraPreset.enteredLookAt[1],
    z: cameraPreset.enteredLookAt[2],
    duration: 0.8,
    ease: "power3.out"
  }, 0);

  if (dancer?.root && dancer.rightArm && dancer.leftArm && dancer.head) {
    setDancing(dancer, true);
    timeline.to(dancer.root.rotation, { y: -0.2, duration: 0.22, ease: "sine.out" }, 0.05);
    timeline.to(dancer.rightArm.rotation, { x: -1.35, z: -0.5, duration: 0.32, ease: "back.out(2)" }, 0.1);
    timeline.to(dancer.leftArm.rotation, { x: -0.45, z: 0.28, duration: 0.32, ease: "back.out(2)" }, 0.12);
    timeline.to(dancer.head.rotation, { y: 0.18, duration: 0.3, ease: "sine.inOut" }, 0.18);
    timeline.to(dancer.root.rotation, { y: 0, duration: 0.38, ease: "sine.inOut" }, 0.48);
    timeline.add(() => setDancing(dancer, false), 0.82);
  }

  if (dancer?.chestLight) {
    timeline.to(dancer.chestLight.scale, { x: 0.34, y: 0.34, z: 0.12, duration: 0.24, ease: "power2.out" }, 0.12);
    timeline.to(dancer.chestLight.scale, { x: 0.2, y: 0.2, z: 0.09, duration: 0.38, ease: "sine.inOut" }, 0.48);
  }

  if (world?.stageLight) {
    timeline.to(world.stageLight, { intensity: 2.4, duration: 0.45, ease: "power2.out" }, 0.08);
    timeline.to(world.stageLight, { intensity: 1.65, duration: 0.45, ease: "sine.inOut" }, 0.5);
  }

  if (world?.stagePulse) {
    timeline.to(world.stagePulse.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.46, ease: "power2.out" }, 0.08);
    timeline.to(world.stagePulse.scale, { x: 1, y: 1, z: 1, duration: 0.42, ease: "sine.inOut" }, 0.48);
  }

  if (world?.portal) {
    gsap.set(world.portal.scale, { x: 0.55, y: 0.55, z: 0.55 });
    timeline.to(world.portal.scale, { x: 1, y: 1, z: 1, duration: 0.72, ease: "back.out(1.7)" }, 0.16);
  }

  if (world?.portalLight) {
    timeline.to(world.portalLight, { intensity: 3.1, duration: 0.34, ease: "power2.out" }, 0.18);
    timeline.to(world.portalLight, { intensity: 1.75, duration: 0.4, ease: "sine.inOut" }, 0.52);
  }

  return timeline;
}

export function startLearningDance({
  camera,
  cameraLookAt,
  dancer,
  world,
  transitionOverlay,
  reducedMotion,
  onComplete
}: MotionOptions) {
  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete
  });

  if (reducedMotion) {
    flashOverlay(timeline, transitionOverlay, 0);
    timeline.to({}, { duration: 0.3 }, 0);
    return timeline;
  }

  setDancing(dancer, true);

  if (world?.stageLight) {
    timeline.to(world.stageLight, { intensity: 3.4, duration: 0.18, ease: "power2.out" }, 0);
    timeline.to(world.stageLight, { intensity: 1.9, duration: 0.3, ease: "sine.inOut" }, 0.18);
  }

  if (world?.particles) {
    timeline.to(world.particles.scale, { x: 1.22, y: 1.22, z: 1.22, duration: 0.36, ease: "power2.out" }, 0);
    timeline.to(world.particles.rotation, { y: "+=0.7", duration: 1.6, ease: "none" }, 0.12);
  }

  if (world?.cubeParticles) {
    timeline.to(world.cubeParticles.scale, { x: 1.28, y: 1.28, z: 1.28, duration: 0.28, ease: "power2.out" }, 0.05);
    timeline.to(world.cubeParticles.rotation, { y: "+=0.85", z: "+=0.18", duration: 1.55, ease: "none" }, 0.16);
  }

  if (world?.stagePulse) {
    timeline.to(world.stagePulse.scale, { x: 1.72, y: 1.72, z: 1.72, duration: 0.32, ease: "power3.out" }, 0.04);
    timeline.to(world.stagePulse.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.36, ease: "sine.inOut" }, 0.42);
    timeline.to(world.stagePulse.scale, { x: 2.1, y: 2.1, z: 2.1, duration: 0.38, ease: "power3.out" }, 1.26);
  }

  if (world?.slash) {
    gsap.set(world.slash.scale, { x: 0.35, y: 0.35, z: 0.35 });
    gsap.set(world.slash.rotation, { z: -0.35 });
    gsap.set(world.slash, { visible: true });
    timeline.to(world.slash.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.18, ease: "power3.out" }, 0.5);
    timeline.to(world.slash.rotation, { z: 0.72, duration: 0.22, ease: "power3.inOut" }, 0.5);
    timeline.to(world.slash.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 0.2, ease: "power2.in" }, 0.72);
    timeline.set(world.slash, { visible: false }, 0.95);
  }

  if (dancer?.root && dancer.torso && dancer.head && dancer.leftArm && dancer.rightArm && dancer.leftLeg && dancer.rightLeg) {
    timeline.to(dancer.root.position, { x: -0.13, duration: 0.16, ease: "power2.out" }, 0.18);
    timeline.to(dancer.rightArm.rotation, { x: -1.65, z: -0.42, duration: 0.26, ease: "back.out(2.2)" }, 0.18);
    timeline.to(dancer.leftLeg.rotation, { x: -0.52, z: 0.08, duration: 0.22, ease: "power2.out" }, 0.18);

    timeline.to(dancer.root.position, { x: 0.16, duration: 0.22, ease: "sine.inOut" }, 0.48);
    timeline.to(dancer.leftArm.rotation, { x: -0.86, z: 0.82, duration: 0.24, ease: "sine.inOut" }, 0.5);
    timeline.to(dancer.rightArm.rotation, { x: -0.62, z: -0.8, duration: 0.24, ease: "sine.inOut" }, 0.5);
    timeline.to(dancer.torso.rotation, { y: 0.35, z: -0.07, duration: 0.24, ease: "sine.inOut" }, 0.5);
    timeline.to(dancer.root.position, { x: -0.08, duration: 0.22, ease: "sine.inOut" }, 0.72);
    timeline.to(dancer.leftArm.rotation, { x: -0.7, z: -0.72, duration: 0.24, ease: "sine.inOut" }, 0.72);
    timeline.to(dancer.rightArm.rotation, { x: -0.92, z: 0.78, duration: 0.24, ease: "sine.inOut" }, 0.72);
    timeline.to(dancer.torso.rotation, { y: -0.35, z: 0.07, duration: 0.24, ease: "sine.inOut" }, 0.72);

    timeline.to(dancer.root.position, { y: 0.48, duration: 0.2, ease: "power2.out" }, 0.9);
    timeline.to(dancer.root.position, { y: 0, duration: 0.26, ease: "bounce.out" }, 1.1);
    timeline.to(dancer.leftLeg.rotation, { x: 0.38, duration: 0.2, ease: "power2.out" }, 0.9);
    timeline.to(dancer.rightLeg.rotation, { x: -0.42, duration: 0.2, ease: "power2.out" }, 0.9);

    timeline.to(dancer.root.rotation, { y: Math.PI * 2, duration: 0.34, ease: "power3.inOut" }, 1.18);
    timeline.to(dancer.head.rotation, { x: -0.2, duration: 0.14, ease: "power2.out" }, 1.46);
    timeline.to(dancer.head.rotation, { x: 0.08, duration: 0.14, ease: "power2.inOut" }, 1.6);

    timeline.to(dancer.rightArm.rotation, { x: -1.25, y: -0.2, z: -1.05, duration: 0.22, ease: "back.out(2)" }, 1.56);
    timeline.to(dancer.leftArm.rotation, { x: -0.22, z: 0.28, duration: 0.22, ease: "sine.out" }, 1.56);
    timeline.to(dancer.head.rotation, { y: -0.32, duration: 0.22, ease: "sine.out" }, 1.56);
    timeline.to(dancer.root.position, { x: 0, duration: 0.22, ease: "sine.out" }, 1.62);
  }

  if (dancer?.chestLight) {
    timeline.to(dancer.chestLight.scale, { x: 0.38, y: 0.38, z: 0.14, duration: 0.18, ease: "power2.out" }, 0);
    timeline.to(dancer.chestLight.scale, { x: 0.22, y: 0.22, z: 0.1, duration: 0.22, ease: "sine.inOut" }, 0.25);
    timeline.to(dancer.chestLight.scale, { x: 0.44, y: 0.44, z: 0.16, duration: 0.22, ease: "power2.out" }, 1.2);
  }

  if (world?.portal) {
    timeline.to(world.portal.rotation, { z: "+=1.8", duration: 0.76, ease: "power2.inOut" }, 1.18);
    timeline.to(world.portal.scale, { x: 1.65, y: 1.65, z: 1.65, duration: 0.42, ease: "back.out(1.7)" }, 1.22);
  }

  if (world?.portalLight) {
    timeline.to(world.portalLight, { intensity: 4.6, duration: 0.32, ease: "power2.out" }, 1.22);
  }

  timeline.to(camera.position, { x: 0, y: 2.45, z: 4.25, duration: 0.62, ease: "power3.inOut" }, 1.25);
  timeline.to(cameraLookAt, { x: 0, y: 1.65, z: -0.55, duration: 0.62, ease: "power3.inOut" }, 1.25);

  flashOverlay(timeline, transitionOverlay, 1.72);
  timeline.add(() => setDancing(dancer, false), 1.95);

  return timeline;
}

export function worldMapPortalMotion({
  camera,
  cameraLookAt,
  world,
  transitionOverlay,
  reducedMotion,
  onComplete,
  cameraPreset = sceneConfig.camera.mobile
}: MotionOptions) {
  const timeline = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onComplete
  });

  if (reducedMotion) {
    flashOverlay(timeline, transitionOverlay, 0);
    timeline.to({}, { duration: 0.3 }, 0);
    return timeline;
  }
  timeline.to(camera.position, {
    x: cameraPreset.worldMapPosition[0],
    y: cameraPreset.worldMapPosition[1],
    z: cameraPreset.worldMapPosition[2],
    duration: 0.95
  }, 0);
  timeline.to(cameraLookAt, { x: 3.05, y: 1.45, z: -4.4, duration: 0.95 }, 0);

  if (world?.worldMapPortal) {
    timeline.to(world.worldMapPortal.scale, { x: 1.75, y: 1.75, z: 1.75, duration: 0.7, ease: "back.out(1.5)" }, 0.15);
    timeline.to(world.worldMapPortal.rotation, { z: "+=2.4", duration: 0.9, ease: "power2.inOut" }, 0.18);
  }

  if (world?.root) {
    timeline.to(world.root.rotation, { y: -0.13, duration: 0.8, ease: "sine.inOut" }, 0.08);
  }

  flashOverlay(timeline, transitionOverlay, 0.82);
  return timeline;
}
