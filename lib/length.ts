import { PASSWORD_LENGTH } from "./constants";

export const clampLength = (value: number): number =>
  Math.min(
    PASSWORD_LENGTH.max,
    Math.max(
      PASSWORD_LENGTH.min,
      Number.isFinite(value) ? value : PASSWORD_LENGTH.default,
    ),
  );

export const lengthToInput = (value: number): string => String(value);

export const isAllowedLengthInput = (value: string): boolean =>
  value === "" || /^\d+$/.test(value);

export const resolveLengthFromInput = (
  input: string,
  fallback: number,
): number => {
  const trimmed = input.trim();
  if (trimmed === "") {
    return fallback;
  }

  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return clampLength(parsed);
};

/** Slider position while typing: preview parsed value, else last validated length. */
export const getSliderValue = (input: string, validatedLength: number): number =>
  resolveLengthFromInput(input, validatedLength);
