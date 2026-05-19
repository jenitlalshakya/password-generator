import { buildCharset } from "./password";
import type { CharacterOptions } from "./types";

// Offline hash-cracking rate (approx. high-end GPU cluster on fast hashes).
export const OFFLINE_GUESSES_PER_SECOND = 10_000_000_000;

export const OFFLINE_GUESSES_PER_SECOND_LABEL = "10 billion guesses/sec";

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365.25 * DAY;

const formatUnit = (value: number, unit: string): string => {
  const rounded =
    value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"}`;
};

export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "less than a second";
  }
  if (seconds < 1) return "less than a second";
  if (seconds < MINUTE) return formatUnit(seconds, "second");
  if (seconds < HOUR) return formatUnit(seconds / MINUTE, "minute");
  if (seconds < DAY) return formatUnit(seconds / HOUR, "hour");
  if (seconds < YEAR) return formatUnit(seconds / DAY, "day");
  if (seconds < 100 * YEAR) return formatUnit(seconds / YEAR, "year");

  const years = seconds / YEAR;
  if (years < 1_000_000) {
    const thousands = years / 1000;
    const rounded =
      thousands >= 100
        ? Math.round(thousands)
        : Math.round(thousands * 10) / 10;
    return `about ${rounded} thousand years`;
  }
  if (years < 1_000_000_000) {
    const millions = years / 1_000_000;
    const rounded =
      millions >= 100
        ? Math.round(millions)
        : Math.round(millions * 10) / 10;
    return `about ${rounded} million years`;
  }
  if (years < 1_000_000_000_000) {
    const billions = years / 1_000_000_000;
    const rounded =
      billions >= 100
        ? Math.round(billions)
        : Math.round(billions * 10) / 10;
    return `about ${rounded} billion years`;
  }
  return "longer than the age of the universe";
};

export const getCharsetSize = (options: CharacterOptions): number =>
  buildCharset(options).length;

/*
 * Average offline brute-force time (half the keyspace) in seconds.
 * Uses log-space math so long passwords do not overflow.
 */
export const estimateBruteForceSeconds = (
  length: number,
  charsetSize: number,
): number => {
  if (length <= 0 || charsetSize <= 1) return 0;

  const log2Keyspace = length * Math.log2(charsetSize);
  const log2AvgGuesses = log2Keyspace - 1;
  const log2Seconds = log2AvgGuesses - Math.log2(OFFLINE_GUESSES_PER_SECOND);

  if (log2Seconds <= -10) return 0;
  return 2 ** log2Seconds;
};

export const getBruteForceEstimate = (
  password: string,
  options: CharacterOptions,
): { duration: string; charsetSize: number } => {
  const charsetSize = getCharsetSize(options);
  const seconds = estimateBruteForceSeconds(password.length, charsetSize);
  return {
    charsetSize,
    duration: formatDuration(seconds),
  };
};
