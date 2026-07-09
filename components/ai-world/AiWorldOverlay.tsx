"use client";

import styles from "./ai-world.module.css";

type AiWorldOverlayProps = {
  statusMessage: string;
  userInitial: string;
  userEmail: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AiWorldOverlay({
  statusMessage,
  userInitial,
  userEmail,
  onSignIn,
  onSignOut
}: AiWorldOverlayProps) {
  return (
    <section className={styles.overlayRoot}>
      <div className={styles.brandPill}>
        <span className={styles.brandAvatar}>JY</span>
        <span>
          <strong>JY</strong>
          <small>AI Learning World</small>
        </span>
      </div>

      <div className={styles.bottomPrompt} aria-live="polite">
        {statusMessage}
      </div>

      <button
        className={styles.authPill}
        type="button"
        onClick={userEmail ? onSignOut : onSignIn}
      >
        <span>{userEmail ? userInitial : "?"}</span>
        <strong>{userEmail ? "SIGN OUT" : "SIGN IN"}</strong>
      </button>

      <div className={styles.seoLinks} aria-label="Public site links">
        <a href="/entry/study">日本語学校 / 日语学习系统</a>
        <a href="/entry/forum">フォーラム広場 / 论坛系统</a>
      </div>
    </section>
  );
}
