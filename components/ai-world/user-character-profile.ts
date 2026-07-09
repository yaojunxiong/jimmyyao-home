import type { UserCharacterProfile } from "./JyCharacter";

const palette = [
  ["#2563eb", "#38bdf8"],
  ["#7c3aed", "#a78bfa"],
  ["#dc2626", "#fb7185"],
  ["#0891b2", "#22d3ee"],
  ["#16a34a", "#86efac"],
  ["#c2410c", "#facc15"],
  ["#be185d", "#f9a8d4"],
  ["#4338ca", "#818cf8"]
] as const;

export const guestCharacterProfile: UserCharacterProfile = {
  email: null,
  initial: "JY",
  primaryColor: "#2563eb",
  accentColor: "#38bdf8",
  label: "JY"
};

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function createUserCharacterProfile(email: string | null | undefined): UserCharacterProfile {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return guestCharacterProfile;
  }

  const rawInitial = normalizedEmail.split("@")[0]?.charAt(0) || normalizedEmail.charAt(0);
  const initial = rawInitial.toUpperCase();
  const colors = palette[hashText(normalizedEmail) % palette.length];

  return {
    email: normalizedEmail,
    initial,
    primaryColor: colors[0],
    accentColor: colors[1],
    label: initial
  };
}
