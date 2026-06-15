type GateAudioToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function GateAudioToggle({ enabled, onToggle }: GateAudioToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      className="fixed right-4 z-30 min-h-[44px] rounded-full border border-orange-300/40 bg-black/35 px-4 text-[12px] font-semibold uppercase text-orange-100 shadow-ember"
      style={{ top: "max(1rem, env(safe-area-inset-top))" }}
    >
      {enabled ? "Sound On" : "Sound Off"}
    </button>
  );
}
