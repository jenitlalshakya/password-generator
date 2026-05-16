import { CHARSET, type CharacterOptionKey } from "./constants";
import type { CharacterOptions } from "./types";

const getSecureRandomIndex = (max: number): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
};

const pickRandomChar = (pool: string): string =>
  pool.charAt(getSecureRandomIndex(pool.length));

export const getActiveCharsets = (
  options: CharacterOptions,
): CharacterOptionKey[] =>
  (Object.keys(CHARSET) as CharacterOptionKey[]).filter((key) => options[key]);

export const buildCharset = (options: CharacterOptions): string => {
  const active = getActiveCharsets(options);
  return active.map((key) => CHARSET[key]).join("");
};

export const generatePassword = (
  length: number,
  options: CharacterOptions,
): string => {
  const activeKeys = getActiveCharsets(options);
  if (activeKeys.length === 0) {
    return "";
  }

  const fullCharset = buildCharset(options);
  const targetLength = Math.max(length, activeKeys.length);
  const chars: string[] = activeKeys.map((key) =>
    pickRandomChar(CHARSET[key]),
  );

  while (chars.length < targetLength) {
    chars.push(pickRandomChar(fullCharset));
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = getSecureRandomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};
