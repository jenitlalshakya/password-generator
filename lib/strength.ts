import type { CharacterOptions, StrengthLevel } from "./types";
import { getActiveCharsets } from "./password";

const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  weak: "bg-red-500",
  fair: "bg-amber-500",
  good: "bg-emerald-500",
  strong: "bg-violet-500",
};

export const getStrengthMeta = (level: StrengthLevel) => ({
  label: STRENGTH_LABELS[level],
  barClass: STRENGTH_COLORS[level],
});

export const calculateStrength = (
  password: string,
  options: CharacterOptions,
): StrengthLevel => {
  if (!password) {
    return "weak";
  }

  const activeCount = getActiveCharsets(options).length;
  let score = 0;

  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  score += activeCount - 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return "weak";
  if (score <= 4) return "fair";
  if (score <= 6) return "good";
  return "strong";
};

export const strengthToPercent = (level: StrengthLevel): number => {
  const map: Record<StrengthLevel, number> = {
    weak: 25,
    fair: 50,
    good: 75,
    strong: 100,
  };
  return map[level];
};
