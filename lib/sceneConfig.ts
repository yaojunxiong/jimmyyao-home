export const sceneConfig = {
  camera: {
    mobile: {
      initialPosition: [0, 3.55, 7.25] as const,
      enteredPosition: [0, 2.95, 5.65] as const,
      worldMapPosition: [2.9, 2.55, 1.5] as const,
      lookAt: [0, 1.04, 0.18] as const,
      enteredLookAt: [0, 1.2, 0.12] as const
    },
    desktop: {
      initialPosition: [0.6, 3.35, 8.8] as const,
      enteredPosition: [0.55, 3.05, 7.45] as const,
      worldMapPosition: [1.9, 2.55, 2.25] as const,
      lookAt: [-1.3, 1.12, 0.12] as const,
      enteredLookAt: [-1.32, 1.22, 0.08] as const
    }
  },
  layout: {
    mobile: {
      scenePosition: [0, 0, 0] as const,
      sceneScale: 1,
      dancerPosition: [0, -0.04, 0.42] as const,
      dancerScale: 1.04
    },
    desktop: {
      scenePosition: [-1.45, -0.08, 0] as const,
      sceneScale: 0.96,
      dancerPosition: [0, -0.08, 0.42] as const,
      dancerScale: 0.84
    }
  },
  colors: {
    night: "#05040a",
    ground: "#171022",
    groundAlt: "#231229",
    red: "#ff3752",
    orange: "#ff9b38",
    gold: "#ffd37a",
    cyan: "#42f2ff",
    violet: "#7c4dff",
    warmWhite: "#fff3d2"
  },
  particles: {
    count: 220,
    spread: 9,
    height: 5.35
  },
  performance: {
    maxDpr: 1.5
  }
} as const;

export type SceneConfig = typeof sceneConfig;
