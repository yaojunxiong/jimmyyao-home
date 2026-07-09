type GateAudioToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  labels?: {
    on: string;
    off: string;
  };
};

export function GateAudioToggle({ enabled, onToggle, labels }: GateAudioToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      className="fixed right-4 z-30 min-h-[44px] rounded-full border border-white/70 bg-sky-950/70 px-4 text-[12px] font-semibold uppercase text-white shadow-[0_12px_28px_rgba(14,83,132,0.24)] backdrop-blur-md"
      style={{ top: "max(1rem, env(safe-area-inset-top))" }}
    >
      {enabled ? labels?.on ?? "Sound On" : labels?.off ?? "Sound Off"}
    </button>
  );
}
