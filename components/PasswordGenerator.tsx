"use client";

import { useCallback, useMemo, useState } from "react";
import {
  HiCheck,
  HiDocumentDuplicate,
  HiEye,
  HiEyeSlash,
} from "react-icons/hi2";
import { CHARSET, PASSWORD_LENGTH } from "@/lib/constants";
import {
  clampLength,
  getSliderValue,
  isAllowedLengthInput,
  lengthToInput,
  resolveLengthFromInput,
} from "@/lib/length";
import { generatePassword } from "@/lib/password";
import {
  getBruteForceEstimate,
  OFFLINE_GUESSES_PER_SECOND_LABEL,
} from "@/lib/crack-estimate";
import {
  calculateStrength,
  getStrengthMeta,
  strengthToPercent,
} from "@/lib/strength";
import type { CharacterOptions } from "@/lib/types";

const CHARACTER_LABELS: {
  key: keyof typeof CHARSET;
  label: string;
  description: string;
}[] = [
  {
    key: "uppercase",
    label: "Uppercase letters",
    description: "A–Z",
  },
  {
    key: "lowercase",
    label: "Lowercase letters",
    description: "a–z",
  },
  {
    key: "numbers",
    label: "Numbers",
    description: "0–9",
  },
  {
    key: "symbols",
    label: "Symbols",
    description: "!@#$%^&*_-+=",
  },
];

export const PasswordGenerator = () => {
  const [length, setLength] = useState<number>(PASSWORD_LENGTH.default);
  const [lengthInput, setLengthInput] = useState(() =>
    lengthToInput(PASSWORD_LENGTH.default),
  );
  const [options, setOptions] = useState<CharacterOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [analysisOptions, setAnalysisOptions] = useState<CharacterOptions | null>(null);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const hasSelection = useMemo(
    () => Object.values(options).some(Boolean),
    [options],
  );

  const effectiveAnalysisOptions = analysisOptions ?? options;
  const strength = useMemo(
    () => calculateStrength(password, effectiveAnalysisOptions),
    [password, effectiveAnalysisOptions],
  );

  const strengthMeta = getStrengthMeta(strength);
  const strengthPercent = strengthToPercent(strength);
  const bruteForceEstimate = useMemo(
    () => getBruteForceEstimate(password, effectiveAnalysisOptions),
    [password, effectiveAnalysisOptions],
  );
  const sliderValue = getSliderValue(lengthInput, length);
  const displayLength = sliderValue;

  const applyValidatedLength = useCallback((next: number) => {
    const clamped = clampLength(next);
    setLength(clamped);
    setLengthInput(lengthToInput(clamped));
  }, []);

  const commitLengthInput = useCallback(() => {
    applyValidatedLength(resolveLengthFromInput(lengthInput, length));
  }, [applyValidatedLength, lengthInput, length]);

  const handleLengthInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (!isAllowedLengthInput(raw)) return;
      setLengthInput(raw);
    },
    [],
  );

  const handleLengthInputBlur = useCallback(() => {
    commitLengthInput();
  }, [commitLengthInput]);

  const handleLengthInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      const base = resolveLengthFromInput(lengthInput, length);
      const delta = e.key === "ArrowUp" ? 1 : -1;
      applyValidatedLength(base + delta);
    },
    [applyValidatedLength, lengthInput, length],
  );

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      applyValidatedLength(Number(e.target.value));
    },
    [applyValidatedLength],
  );

  const handleOptionToggle = useCallback((key: keyof CharacterOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleGenerate = useCallback(() => {
    if (!hasSelection) return;
    const resolved = resolveLengthFromInput(lengthInput, length);
    applyValidatedLength(resolved);
    setPassword(generatePassword(resolved, options));
    setAnalysisOptions({ ...options });
    setCopied(false);
  }, [hasSelection, lengthInput, length, options, applyValidatedLength]);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {
      setCopied(false);
    }
  }, [password]);

  return (
    <div className="w-full max-w-lg">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Password Generator
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
          Create secure passwords instantly. Nothing is stored — everything runs
          in your browser.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/40 transition-shadow duration-300 hover:shadow-zinc-300/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none dark:hover:shadow-zinc-900/60 sm:p-8">
          <div className="space-y-6">
            <section aria-labelledby="length-heading">
              <label
                id="length-heading"
                htmlFor="length-input"
                className="mb-3 flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                <span>Password length</span>
                <span className="tabular-nums text-violet-600 dark:text-violet-400">
                  {displayLength}
                </span>
              </label>
              <input
                id="length-slider"
                type="range"
                min={PASSWORD_LENGTH.min}
                max={PASSWORD_LENGTH.max}
                value={sliderValue}
                onChange={handleSliderChange}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-violet-600 transition-[accent-color] duration-200 dark:bg-zinc-800"
              />
              <div className="mt-3 flex items-center gap-3">
                <input
                  id="length-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={lengthInput}
                  onChange={handleLengthInputChange}
                  onBlur={handleLengthInputBlur}
                  onKeyDown={handleLengthInputKeyDown}
                  className="w-20 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-sm tabular-nums text-zinc-900 outline-none transition-colors duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {PASSWORD_LENGTH.min}–{PASSWORD_LENGTH.max} characters
                </span>
              </div>
            </section>

            <section aria-labelledby="options-heading">
              <h2
                id="options-heading"
                className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Include characters
              </h2>
              <ul className="grid grid-cols-2 gap-2">
                {CHARACTER_LABELS.map(({ key, label, description }) => (
                  <li key={key} className="min-w-0">
                    <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors duration-200 hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/80">
                      <input
                        type="checkbox"
                        checked={options[key]}
                        onChange={() => handleOptionToggle(key)}
                        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-zinc-300 text-violet-600 transition-colors duration-200 focus:ring-violet-500/30 dark:border-zinc-600"
                      />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-800 transition-colors duration-200 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-50">
                          {label}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {description}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            {!hasSelection && (
              <p
                role="alert"
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
              >
                Select at least one character type to generate a password.
              </p>
            )}

            <button
              id="generate-password-btn"
              type="button"
              onClick={handleGenerate}
              disabled={!hasSelection}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none dark:disabled:bg-zinc-700"
            >
              Generate password
            </button>

            <section aria-labelledby="output-heading">
              <h2 id="output-heading" className="sr-only">
                Generated password
              </h2>
              <output
                htmlFor="generate-password-btn"
                className="flex min-h-13 w-full items-start gap-1 rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-4 pr-2 transition-colors duration-200 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <span
                  className={`min-w-0 flex-1 break-all py-1 font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 ${
                    password && !showPassword ? "[-webkit-text-security:disc]" : ""
                  }`}
                >
                  {password || (
                    <span className="font-sans text-zinc-400 dark:text-zinc-500">
                      Your password will appear here
                    </span>
                  )}
                </span>
                {password && (
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="rounded-lg p-2 text-zinc-500 transition-colors duration-200 hover:bg-zinc-200/80 hover:text-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <HiEyeSlash className="size-5" aria-hidden />
                      ) : (
                        <HiEye className="size-5" aria-hidden />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded-lg p-2 text-zinc-500 transition-colors duration-200 hover:bg-zinc-200/80 hover:text-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-300"
                      aria-label={copied ? "Copied" : "Copy password"}
                    >
                      {copied ? (
                        <HiCheck
                          className="size-5 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                      ) : (
                        <HiDocumentDuplicate className="size-5" aria-hidden />
                      )}
                    </button>
                  </div>
                )}
              </output>

              {password && (
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
                      Strength
                    </span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {strengthMeta.label}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${strengthMeta.barClass}`}
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>

                  <aside
                    aria-label="Password security notes"
                    className="mt-3 space-y-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3 py-3 text-xs leading-relaxed text-zinc-600 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-400 sm:px-3.5"
                  >
                    <p>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Brute-force estimate:{" "}
                      </span>
                      About{" "}
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {bruteForceEstimate.duration}
                      </span>{" "}
                      to try half of all combinations offline (
                      {bruteForceEstimate.charsetSize} possible characters,{" "}
                      {OFFLINE_GUESSES_PER_SECOND_LABEL}).
                    </p>
                    <p>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        How long to keep it:{" "}
                      </span>
                      A strong, unique password does not need a fixed expiry —
                      keep it until a breach, phishing attempt, or account
                      compromise. Change critical accounts (email, banking,
                      work) about every{" "}
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        12–18 months
                      </span>{" "}
                      if your policy allows, or sooner if a service notifies
                      you.
                    </p>
                  </aside>
                </div>
              )}
            </section>
          </div>
        </div>
    </div>
  );
};
