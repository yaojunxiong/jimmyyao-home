"use client";

import { aiWorldCopy, aiWorldLanguages, type AiWorldLanguage } from "./i18n";
import styles from "./ai-world.module.css";

type AiWorldOverlayProps = {
  statusMessage: string;
  userInitial: string;
  userEmail: string | null;
  language: AiWorldLanguage;
  soundEnabled: boolean;
  soundLabels: {
    on: string;
    off: string;
  };
  onLanguageChange: (language: AiWorldLanguage) => void;
  onSoundToggle: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AiWorldOverlay({
  statusMessage,
  userInitial,
  userEmail,
  language,
  soundEnabled,
  soundLabels,
  onLanguageChange,
  onSoundToggle,
  onSignIn,
  onSignOut
}: AiWorldOverlayProps) {
  const copy = aiWorldCopy[language];

  return (
    <section className={styles.overlayRoot}>
      <div className={styles.brandPill}>
        <span className={styles.brandAvatar}>JY</span>
        <span>
          <strong>JY</strong>
          <small>AI Learning World</small>
        </span>
      </div>

      <div className={styles.topControls}>
        <button
          className={`${styles.controlPill} ${styles.soundPill}`}
          type="button"
          aria-pressed={soundEnabled}
          onClick={onSoundToggle}
        >
          {soundEnabled ? soundLabels.on : soundLabels.off}
        </button>

        <button
          className={`${styles.controlPill} ${styles.authPill}`}
          type="button"
          onClick={userEmail ? onSignOut : onSignIn}
        >
          <span>{userEmail ? userInitial : "?"}</span>
          <strong>{userEmail ? copy.authSignOut : copy.authSignIn}</strong>
        </button>

        <div className={styles.languagePill} aria-label={copy.languageLabel}>
          {aiWorldLanguages.map((item) => (
            <button
              key={item.code}
              type="button"
              aria-pressed={language === item.code}
              title={item.label}
              onClick={() => onLanguageChange(item.code)}
            >
              {item.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.bottomPrompt} aria-live="polite">
        {statusMessage}
      </div>

      <div className={styles.seoLinks} aria-label="Public site links">
        <a href="/entry/study">{copy.seoStudy}</a>
        <a href="/entry/forum">{copy.seoForum}</a>
        <a href="/entry/knowledge">{copy.seoKnowledge}</a>
        <a href="/entry/admin">{copy.seoAdmin}</a>
      </div>
    </section>
  );
}
