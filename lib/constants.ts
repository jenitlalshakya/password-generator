export const PASSWORD_LENGTH = {
  default: 8,
  min: 4,
  max: 64,
} as const;

export const CHARSET = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

export type CharacterOptionKey = keyof typeof CHARSET;
