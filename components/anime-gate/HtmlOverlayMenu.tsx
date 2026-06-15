"use client";

import styles from "./anime-gate.module.css";

type HtmlOverlayMenuProps = {
  contactHref: string;
  hasEntered: boolean;
  isTransitioning: boolean;
  onContact?: () => void;
  onEnter: () => void;
  onStart: () => void;
  onWorldMap: () => void;
};

export function HtmlOverlayMenu({
  contactHref,
  hasEntered,
  isTransitioning,
  onContact,
  onEnter,
  onStart,
  onWorldMap
}: HtmlOverlayMenuProps) {
  return (
    <section className={`${styles.uiLayer} pointer-events-none fixed inset-0 z-20 flex min-h-[100dvh] w-full flex-col items-center px-5 text-center`}>
      <div className={styles.learningGlyphs} aria-hidden="true">
        <span>あ</span>
        <span>AI</span>
        <span>にほんご</span>
        <span>50 LESSONS</span>
        <span>え</span>
      </div>
      <div className={styles.openingPanel} data-entered={hasEntered ? "true" : "false"}>
        <div className={styles.topMark}>
          <span className={styles.crest} aria-hidden="true" />
          <span>JIMMY YAO</span>
        </div>

        <div className={styles.systemPrompt} data-entered={hasEntered ? "true" : "false"} aria-hidden="true">
          <span>SYSTEM READY</span>
          <span>AI Learning World Online</span>
        </div>

        <h1 className={styles.posterTitle} aria-label="AI Learning World">
          <span data-title-line>AI</span>
          <span data-title-line>LEARNING</span>
          <span data-title-line>WORLD</span>
        </h1>

        <div className={styles.taglineBlock}>
          <p data-intro-copy>日本語を学び、AIで未来をつくる。</p>
          <p data-intro-copy>学习日语，用 AI 打造自己的成长系统。</p>
        </div>

        {!hasEntered ? (
          <button
            type="button"
            disabled={isTransitioning}
            onClick={onEnter}
            className={`${styles.enterButton} pointer-events-auto disabled:cursor-wait disabled:opacity-70`}
          >
            <span>ENTER THE WORLD</span>
          </button>
        ) : (
          <div className={`${styles.menuPanel} pointer-events-auto`}>
            <div className={styles.menuStack}>
              <button
                type="button"
                disabled={isTransitioning}
                onClick={onStart}
                data-menu-button
                className={`${styles.menuButton} ${styles.menuButtonPrimary} disabled:cursor-wait disabled:opacity-70`}
              >
                <span className={styles.menuIcon} aria-hidden="true">▶</span>
                <span className={styles.menuCopy}>
                  <span className={styles.menuTitle}>START</span>
                  <span className={styles.menuSubtitle}>学习系统を始める</span>
                </span>
                <span className={styles.menuArrow} aria-hidden="true">›</span>
              </button>

              <button
                type="button"
                disabled={isTransitioning}
                onClick={onWorldMap}
                data-menu-button
                className={`${styles.menuButton} ${styles.menuButtonMap} disabled:cursor-wait disabled:opacity-70`}
              >
                <span className={styles.menuIcon} aria-hidden="true">◇</span>
                <span className={styles.menuCopy}>
                  <span className={styles.menuTitle}>WORLD MAP</span>
                  <span className={styles.menuSubtitle}>探索内容世界</span>
                </span>
                <span className={styles.menuArrow} aria-hidden="true">›</span>
              </button>

              <a href={contactHref} onClick={onContact} data-menu-button className={`${styles.menuButton} ${styles.menuButtonContact}`}>
                <span className={styles.menuIcon} aria-hidden="true">@</span>
                <span className={styles.menuCopy}>
                  <span className={styles.menuTitle}>CONTACT</span>
                  <span className={styles.menuSubtitle}>联系我</span>
                </span>
                <span className={styles.menuArrow} aria-hidden="true">›</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
