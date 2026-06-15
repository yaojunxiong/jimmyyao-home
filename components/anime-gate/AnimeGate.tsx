"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { portalLinks } from "@/lib/portal-links";
import { AudioController } from "./AudioController";
import { HtmlOverlayMenu } from "./HtmlOverlayMenu";
import { ThreeGateScene, type ThreeGateSceneHandle } from "./ThreeGateScene";
import { TransitionOverlay } from "./TransitionOverlay";
import styles from "./anime-gate.module.css";

export function AnimeGate() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sceneRef = useRef<ThreeGateSceneHandle | null>(null);
  const transitionOverlayRef = useRef<HTMLDivElement | null>(null);

  const [hasEntered, setHasEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const playAudio = useCallback(async () => {
    if (!audioRef.current || !soundEnabled) {
      return;
    }

    try {
      audioRef.current.volume = 0.3;
      if (audioRef.current.readyState === 0) {
        audioRef.current.load();
      }
      await audioRef.current.play();
    } catch {
      // iPhone Safari and browser automation can reject play(). Visual flow must continue.
    }
  }, [soundEnabled]);

  const flashAndRedirect = useCallback((href: string, duration = 0.3) => {
    gsap
      .timeline({
        onComplete: () => {
          window.location.href = href;
        }
      })
      .set(transitionOverlayRef.current, { autoAlpha: 1 })
      .fromTo(
        transitionOverlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: duration * 0.45, ease: "power2.out" }
      )
      .to(transitionOverlayRef.current, { autoAlpha: 0, duration: duration * 0.55, ease: "power2.in" });
  }, []);

  const handleEnter = useCallback(() => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    void playAudio();

    sceneRef.current?.enterWorld(() => {
      setHasEntered(true);
      setIsTransitioning(false);
    });

    if (!sceneRef.current) {
      setHasEntered(true);
      setIsTransitioning(false);
    }
  }, [isTransitioning, playAudio]);

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled((current) => {
      const next = !current;

      if (!next) {
        audioRef.current?.pause();
        return next;
      }

      window.setTimeout(() => {
        if (!audioRef.current) {
          return;
        }

        audioRef.current.volume = 0.3;
        void audioRef.current.play().catch(() => {
          // Keep the control state stable even when a browser blocks sound.
        });
      }, 0);

      return next;
    });
  }, []);

  const handleStart = useCallback(() => {
    if (isTransitioning) {
      return;
    }

    setHasEntered(true);
    setIsTransitioning(true);
    void playAudio();

    sceneRef.current?.startDance({
      reducedMotion: prefersReducedMotion(),
      onComplete: () => {
        window.location.href = portalLinks.start;
      }
    });

    if (!sceneRef.current) {
      flashAndRedirect(portalLinks.start);
    }
  }, [flashAndRedirect, isTransitioning, playAudio, prefersReducedMotion]);

  const handleWorldMap = useCallback(() => {
    if (isTransitioning) {
      return;
    }

    setHasEntered(true);
    setIsTransitioning(true);
    void playAudio();

    sceneRef.current?.openWorldMap({
      reducedMotion: prefersReducedMotion(),
      onComplete: () => {
        window.location.href = portalLinks.worldMap;
      }
    });

    if (!sceneRef.current) {
      flashAndRedirect(portalLinks.worldMap);
    }
  }, [flashAndRedirect, isTransitioning, playAudio, prefersReducedMotion]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }

    gsap.set(transitionOverlayRef.current, { autoAlpha: 0 });

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <main className={`${styles.gateRoot} relative isolate min-h-[100dvh] w-full overflow-hidden bg-night text-white`}>
      <ThreeGateScene ref={sceneRef} transitionOverlayRef={transitionOverlayRef} />
      <HtmlOverlayMenu
        contactHref={portalLinks.contact}
        hasEntered={hasEntered}
        isTransitioning={isTransitioning}
        onContact={() => {
          void playAudio();
        }}
        onEnter={handleEnter}
        onStart={handleStart}
        onWorldMap={handleWorldMap}
      />
      <AudioController audioRef={audioRef} soundEnabled={soundEnabled} onToggle={handleSoundToggle} />
      <TransitionOverlay ref={transitionOverlayRef} />
    </main>
  );
}
