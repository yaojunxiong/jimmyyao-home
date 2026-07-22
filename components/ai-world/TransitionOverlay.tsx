"use client";

import styles from "./ai-world.module.css";

type TransitionOverlayProps = {
  active: boolean;
  reducedMotion?: boolean;
};

export function TransitionOverlay({ active, reducedMotion = false }: TransitionOverlayProps) {
  return (
    <div
      className={styles.transitionOverlay}
      data-active={active ? "true" : "false"}
      data-reduced={reducedMotion ? "true" : "false"}
      aria-hidden="true"
    >
      <span className={styles.transitionGlow} />
    </div>
  );
}
