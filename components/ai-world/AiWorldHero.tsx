"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AiWorldCanvas, type AiWorldCanvasHandle } from "./AiWorldCanvas";
import { TransitionOverlay } from "./TransitionOverlay";
import { aiWorldCopy, type AiWorldLanguage } from "./i18n";
import { aiWorldPortals, getAiWorldPortal, type AiWorldPortalId } from "./portals";
import { guestCharacterProfile } from "./user-character-profile";
import { homeContent } from "@/lib/home-content";
import styles from "./ai-world.module.css";

type AiWorldHeroProps = {
  language: AiWorldLanguage;
  onLanguageChange: (next: AiWorldLanguage) => void;
};

const SOCIAL_LINKS = [
  { href: "https://study.jimmyyao.com", labelKey: "seoStudy" as const },
  { href: "https://forum.jimmyyao.com", labelKey: "seoForum" as const },
  { href: "https://knowledge.jimmyyao.com", labelKey: "seoKnowledge" as const },
  { href: "https://admin.jimmyyao.com", labelKey: "seoAdmin" as const }
];

export function AiWorldHero({ language, onLanguageChange }: AiWorldHeroProps) {
  const router = useRouter();
  const canvasRef = useRef<AiWorldCanvasHandle>(null);

  const [activePortal, setActivePortal] = useState<AiWorldPortalId | null>(null);
  const [hoveredPortal, setHoveredPortal] = useState<AiWorldPortalId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const copy = aiWorldCopy[language];
  const heroCopy = homeContent[language];
  const user = null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const searchParams = new URLSearchParams(window.location.search);
    const isRecoverySession =
      hashParams.get("type") === "recovery" &&
      Boolean(hashParams.get("access_token")) &&
      Boolean(hashParams.get("refresh_token"));

    if (isRecoverySession) {
      window.location.replace(`/reset-password${window.location.hash}`);
      return;
    }

    if (searchParams.get("error_code") === "otp_expired") {
      window.location.replace(`/reset-password${window.location.search}`);
      return;
    }

    const cleanup = enterPortalFromUrl({
      router,
      setActivePortal,
      setHoveredPortal,
      setIsTransitioning,
      setStatusMessage,
      canvasRef,
      language
    });
    return cleanup;
  }, [router, language]);

  const startTransition = useCallback(
    (id: AiWorldPortalId) => {
      const portal = getAiWorldPortal(id);
      if (!portal) return;
      setIsTransitioning(true);
      setActivePortal(id);
      setHoveredPortal(null);
      setStatusMessage(copy.entering(portal));
      canvasRef.current?.travelToPortal({
        id,
        reducedMotion,
        onArrive: () => setStatusMessage(copy.movingTo(portal)),
        onComplete: () => {
          if (reducedMotion || !portal.enabled || !portal.url) {
            if (!portal.enabled || !portal.url) {
              setStatusMessage(copy.comingSoon);
              window.setTimeout(() => {
                setIsTransitioning(false);
                setActivePortal(null);
              }, 1100);
            } else {
              setIsTransitioning(false);
              setActivePortal(null);
            }
            return;
          }
          window.location.href = portal.url;
        }
      });
    },
    [copy, reducedMotion]
  );

  const handlePortalSelect = useCallback(
    (id: AiWorldPortalId) => {
      if (isTransitioning) return;
      startTransition(id);
    },
    [isTransitioning, startTransition]
  );

  const handleLanguageChange = useCallback(
    (next: AiWorldLanguage) => {
      onLanguageChange(next);
    },
    [onLanguageChange]
  );

  return (
    <section className={styles.heroRoot} aria-label={heroCopy.heroName}>
      <AiWorldCanvas
        ref={canvasRef}
        activePortal={activePortal}
        hoveredPortal={hoveredPortal}
        isTransitioning={isTransitioning}
        characterProfile={guestCharacterProfile}
        language={language}
        onPortalHover={setHoveredPortal}
        onPortalSelect={handlePortalSelect}
      />

      <div className={styles.heroScrim} aria-hidden="true" />

      <div className={styles.overlayRoot}>
        <div className={styles.brandPill}>
          <span className={styles.brandAvatar} aria-hidden="true">
            JY
          </span>
          <strong>{heroCopy.heroName}</strong>
          <small>jimmyyao.com</small>
        </div>

        <div className={styles.topControls}>
          <SoundToggle
            enabled={soundEnabled}
            onToggle={() => setSoundEnabled((value) => !value)}
            copy={copy}
          />
          {user ? (
            <span className={`${styles.controlPill} ${styles.authPill}`}>
              <span aria-hidden="true">JY</span>
              <strong>JY</strong>
            </span>
          ) : (
            <a className={styles.controlPill} href="/login">
              {copy.authSignIn}
            </a>
          )}
          <div className={styles.languagePill} role="group" aria-label={copy.languageLabel}>
            {(["ja", "zh", "en"] as AiWorldLanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={language === code}
                onClick={() => handleLanguageChange(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <p className={styles.statusLine} role="status" aria-live="polite">
          {statusMessage || copy.defaultStatus}
        </p>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{heroCopy.heroName}</h1>
          <p className={styles.heroSubtitle}>{heroCopy.heroSubtitle}</p>
          <p className={styles.heroIntro}>{heroCopy.heroIntro}</p>

          <div className={styles.heroCtas}>
            <a
              className={`${styles.ctaButton} ${styles.ctaPrimary}`}
              href="https://study.jimmyyao.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroCopy.ctaStudy}
            </a>
            <a
              className={`${styles.ctaButton} ${styles.ctaPrimary}`}
              href="https://ai.jimmyyao.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroCopy.ctaAi}
            </a>
            <a className={`${styles.ctaButton} ${styles.ctaGhost}`} href="#growth">
              {heroCopy.ctaGrowth}
            </a>
          </div>

          <a className={styles.scrollCue} href="#spaces" aria-label={heroCopy.scrollCue}>
            <span>{heroCopy.scrollCue}</span>
            <span className={styles.scrollCueArrow} aria-hidden="true">
              ↓
            </span>
          </a>
        </div>

        <nav className={styles.seoLinks} aria-label="Systems">
          {SOCIAL_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {copy[link.labelKey]}
            </a>
          ))}
        </nav>
      </div>

      <TransitionOverlay active={isTransitioning} reducedMotion={reducedMotion} />
    </section>
  );
}

const characterProfile = {
  skinTone: "#f4c9a3",
  hairColor: "#2b2230",
  shirtColor: "#6fd0ff",
  pantsColor: "#27406b",
  accentColor: "#ffd58a"
};

type SoundToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  copy: (typeof aiWorldCopy)[AiWorldLanguage];
};

function SoundToggle({ enabled, onToggle, copy }: SoundToggleProps) {
  return (
    <button
      type="button"
      className={`${styles.controlPill} ${styles.soundPill}`}
      aria-pressed={enabled}
      onClick={onToggle}
    >
      {enabled ? copy.soundOn : copy.soundOff}
    </button>
  );
}

function enterPortalFromUrl({
  router,
  setActivePortal,
  setHoveredPortal,
  setIsTransitioning,
  setStatusMessage,
  canvasRef,
  language
}: {
  router: ReturnType<typeof useRouter>;
  setActivePortal: (id: AiWorldPortalId | null) => void;
  setHoveredPortal: (id: AiWorldPortalId | null) => void;
  setIsTransitioning: (value: boolean) => void;
  setStatusMessage: (message: string) => void;
  canvasRef: React.RefObject<AiWorldCanvasHandle | null>;
  language: AiWorldLanguage;
}) {
  if (typeof window === "undefined") return () => {};

  const params = new URLSearchParams(window.location.search);
  const portalId = params.get("entry");
  const status = params.get("status");

  if (portalId && aiWorldPortals.some((portal) => portal.id === portalId)) {
    const portal = getAiWorldPortal(portalId as AiWorldPortalId);
    if (portal && status === "coming-soon") {
      setActivePortal(portal.id);
      setHoveredPortal(null);
      setIsTransitioning(true);
      setStatusMessage(aiWorldCopy[language].comingSoon);
      canvasRef.current?.travelToPortal({
        id: portal.id,
        reducedMotion: false,
        onComplete: () => {
          window.setTimeout(() => {
            setIsTransitioning(false);
            setActivePortal(null);
            router.replace("/");
          }, 1200);
        }
      });
    }
  }

  return () => {};
}
