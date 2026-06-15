export const sceneConfig = {
  camera: {
    initialPosition: [0, 3.55, 7.25] as const,
    enteredPosition: [0, 2.95, 5.65] as const,
    worldMapPosition: [2.9, 2.55, 1.5] as const,
    lookAt: [0, 1.04, 0.18] as const
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
