"use client";

import type { RefObject } from "react";
import { GateAudioToggle } from "./GateAudioToggle";

type AudioControllerProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  soundEnabled: boolean;
  onToggle: () => void;
  labels?: {
    on: string;
    off: string;
  };
};

export function AudioController({ audioRef, soundEnabled, onToggle, labels }: AudioControllerProps) {
  return (
    <>
      <GateAudioToggle enabled={soundEnabled} onToggle={onToggle} labels={labels} />
      <audio ref={audioRef} src="/audio/opening-theme.mp3" loop preload="auto" playsInline />
    </>
  );
}
