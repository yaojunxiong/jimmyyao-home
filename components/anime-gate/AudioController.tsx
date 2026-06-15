"use client";

import type { RefObject } from "react";
import { GateAudioToggle } from "./GateAudioToggle";

type AudioControllerProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  soundEnabled: boolean;
  onToggle: () => void;
};

export function AudioController({ audioRef, soundEnabled, onToggle }: AudioControllerProps) {
  return (
    <>
      <GateAudioToggle enabled={soundEnabled} onToggle={onToggle} />
      <audio ref={audioRef} src="/audio/opening-theme.mp3" loop preload="auto" playsInline />
    </>
  );
}
