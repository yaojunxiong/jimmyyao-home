"use client";

import gsap from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TransitionOverlay } from "@/components/anime-gate/TransitionOverlay";
import { AiWorldCanvas, type AiWorldCanvasHandle } from "./AiWorldCanvas";
import { AiWorldOverlay } from "./AiWorldOverlay";
import { aiWorldCopy, detectAiWorldLanguage, portalStatus, type AiWorldLanguage } from "./i18n";
import { getAiWorldPortal, type AiWorldPortalId } from "./portals";
import { createUserCharacterProfile, guestCharacterProfile } from "./user-character-profile";
import styles from "./ai-world.module.css";

export function AiWorldHero() {
  const canvasRef = useRef<AiWorldCanvasHandle | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transitionOverlayRef = useRef<HTMLDivElement | null>(null);
  const redirectTimerRef = useRef<number | null>(null);
  const [activePortal, setActivePortal] = useState<AiWorldPortalId | null>(null);
  const [hoveredPortal, setHoveredPortal] = useState<AiWorldPortalId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState<AiWorldLanguage>("ja");
  const copy = aiWorldCopy[language];
  const [statusMessage, setStatusMessage] = useState(copy.defaultStatus);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const characterProfile = useMemo(() => createUserCharacterProfile(userEmail), [userEmail]);

  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const playAudio = useCallback(async () => {
    if (!audioRef.current || !soundEnabled) return;

    try {
      audioRef.current.volume = 0.3;
      if (audioRef.current.readyState === 0) {
        audioRef.current.load();
      }
      await audioRef.current.play();
    } catch {
      // iPhone Safari audio rules must not block the 3D interaction.
    }
  }, [soundEnabled]);

  const handlePortalHover = useCallback((id: AiWorldPortalId | null) => {
    if (isTransitioning) return;
    setHoveredPortal(id);

    if (!id) {
      setStatusMessage(copy.defaultStatus);
      return;
    }

    const portal = getAiWorldPortal(id);
    if (portal) {
      setStatusMessage(portalStatus(portal, language));
    }
  }, [copy.defaultStatus, isTransitioning, language]);

  const handlePortalSelect = useCallback((id: AiWorldPortalId) => {
    if (isTransitioning) return;

    const portal = getAiWorldPortal(id);
    if (!portal) return;

    setActivePortal(id);
    setHoveredPortal(id);
    void playAudio();

    if (!portal.enabled || !portal.url) {
      setStatusMessage(copy.comingSoon);
      canvasRef.current?.travelToPortal({
        id,
        reducedMotion: prefersReducedMotion(),
        onArrive: () => setStatusMessage(copy.comingSoon)
      });
      return;
    }

    setIsTransitioning(true);
    setStatusMessage(copy.movingTo(portal));

    canvasRef.current?.travelToPortal({
      id,
      reducedMotion: prefersReducedMotion(),
      onArrive: () => {
        setStatusMessage(copy.entering(portal));
        gsap.fromTo(
          transitionOverlayRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 0.74, duration: 0.42, ease: "power2.out" }
        );
      },
      onComplete: () => {
        redirectTimerRef.current = window.setTimeout(() => {
          window.location.href = `/entry/${portal.id}`;
        }, 780);
      }
    });
  }, [copy, isTransitioning, playAudio, prefersReducedMotion]);

  const handleLanguageChange = useCallback((nextLanguage: AiWorldLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("jimmyyao:language", nextLanguage);
    setStatusMessage(aiWorldCopy[nextLanguage].defaultStatus);
  }, []);

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled((current) => {
      const next = !current;

      if (!next) {
        audioRef.current?.pause();
        return next;
      }

      window.setTimeout(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = 0.3;
        void audioRef.current.play().catch(() => undefined);
      }, 0);

      return next;
    });
  }, []);

  const handleSignIn = useCallback(() => {
    window.location.href = `/login?next=${encodeURIComponent(window.location.href)}`;
  }, []);

  const handleSignOut = useCallback(() => {
    window.localStorage.removeItem("jimmyyao:userEmail");
    window.location.href = `/logout?next=${encodeURIComponent(window.location.origin)}`;
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

    gsap.set(transitionOverlayRef.current, { autoAlpha: 0 });
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }

    const detectedLanguage = detectAiWorldLanguage();
    setLanguage(detectedLanguage);
    setStatusMessage(aiWorldCopy[detectedLanguage].defaultStatus);

    const params = new URLSearchParams(window.location.search);
    const previewEmail = params.get("email");
    const storedEmail = window.localStorage.getItem("jimmyyao:userEmail");

    const loadSessionProfile = async () => {
      try {
        const response = await fetch("/api/auth/session", { credentials: "include" });
        const session = await response.json() as { user?: { email?: string | null } };

        if (session.user?.email) {
          setUserEmail(session.user.email);
          return;
        }
      } catch {
        // Auth is optional on the public gateway. Fallbacks keep the 3D world usable.
      }

      if (previewEmail) {
        window.localStorage.setItem("jimmyyao:userEmail", previewEmail);
        setUserEmail(previewEmail);
      } else if (storedEmail) {
        setUserEmail(storedEmail);
      } else {
        setUserEmail(guestCharacterProfile.email);
      }
    };

    void loadSessionProfile();

    return () => {
      audioRef.current?.pause();
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <main className={styles.heroRoot}>
      <AiWorldCanvas
        ref={canvasRef}
        activePortal={activePortal}
        hoveredPortal={hoveredPortal}
        isTransitioning={isTransitioning}
        characterProfile={characterProfile}
        language={language}
        onPortalHover={handlePortalHover}
        onPortalSelect={handlePortalSelect}
      />
      <AiWorldOverlay
        statusMessage={statusMessage}
        userInitial={characterProfile.initial}
        userEmail={characterProfile.email}
        language={language}
        soundEnabled={soundEnabled}
        soundLabels={{ on: copy.soundOn, off: copy.soundOff }}
        onLanguageChange={handleLanguageChange}
        onSoundToggle={handleSoundToggle}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
      <audio ref={audioRef} src="/audio/opening-theme.mp3" loop preload="auto" playsInline />
      <TransitionOverlay ref={transitionOverlayRef} />
    </main>
  );
}
