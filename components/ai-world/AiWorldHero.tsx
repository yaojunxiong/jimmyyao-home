"use client";

import gsap from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioController } from "@/components/anime-gate/AudioController";
import { TransitionOverlay } from "@/components/anime-gate/TransitionOverlay";
import { AiWorldCanvas, type AiWorldCanvasHandle } from "./AiWorldCanvas";
import { AiWorldOverlay } from "./AiWorldOverlay";
import { getAiWorldPortal, type AiWorldPortalId } from "./portals";
import { createUserCharacterProfile, guestCharacterProfile } from "./user-character-profile";
import styles from "./ai-world.module.css";

const defaultStatus = "WASD / 方向キー / 地面タップでJYを走らせよう";

export function AiWorldHero() {
  const canvasRef = useRef<AiWorldCanvasHandle | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transitionOverlayRef = useRef<HTMLDivElement | null>(null);
  const redirectTimerRef = useRef<number | null>(null);
  const [activePortal, setActivePortal] = useState<AiWorldPortalId | null>(null);
  const [hoveredPortal, setHoveredPortal] = useState<AiWorldPortalId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState(defaultStatus);
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
      setStatusMessage(defaultStatus);
      return;
    }

    const portal = getAiWorldPortal(id);
    if (portal) {
      setStatusMessage(`${portal.titleJa} / ${portal.subtitle} / ${portal.description}`);
    }
  }, [isTransitioning]);

  const handlePortalSelect = useCallback((id: AiWorldPortalId) => {
    if (isTransitioning) return;

    const portal = getAiWorldPortal(id);
    if (!portal) return;

    setActivePortal(id);
    setHoveredPortal(id);
    void playAudio();

    if (!portal.enabled || !portal.url) {
      setStatusMessage("この入口はまもなく公開されます");
      canvasRef.current?.travelToPortal({
        id,
        reducedMotion: prefersReducedMotion(),
        onArrive: () => setStatusMessage("この入口はまもなく公開されます")
      });
      return;
    }

    setIsTransitioning(true);
    setStatusMessage(`JYが${portal.titleJa}へ向かっています...`);

    canvasRef.current?.travelToPortal({
      id,
      reducedMotion: prefersReducedMotion(),
      onArrive: () => {
        setStatusMessage(`${portal.subtitle}に入ります`);
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
  }, [isTransitioning, playAudio, prefersReducedMotion]);

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
    gsap.set(transitionOverlayRef.current, { autoAlpha: 0 });
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }

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
        onPortalHover={handlePortalHover}
        onPortalSelect={handlePortalSelect}
      />
      <AiWorldOverlay
        statusMessage={statusMessage}
        userInitial={characterProfile.initial}
        userEmail={characterProfile.email}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
      <AudioController audioRef={audioRef} soundEnabled={soundEnabled} onToggle={handleSoundToggle} />
      <TransitionOverlay ref={transitionOverlayRef} />
    </main>
  );
}
