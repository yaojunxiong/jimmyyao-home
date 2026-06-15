"use client";

import { forwardRef } from "react";
import styles from "./anime-gate.module.css";

export const TransitionOverlay = forwardRef<HTMLDivElement>(function TransitionOverlay(_props, ref) {
  return (
    <div ref={ref} className={styles.transitionOverlay} aria-hidden="true">
      <span />
    </div>
  );
});
