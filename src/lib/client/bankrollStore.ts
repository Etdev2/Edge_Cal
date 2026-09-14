"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_BANKROLL,
  DEFAULT_KELLY_FRACTION,
  DEFAULT_MAX_STAKE_PCT,
} from "@/lib/domain/bankroll";

/**
 * Bankroll settings live in the browser only (localStorage).
 *
 * Per ADR 0005 (minimize identity & financial data) the bankroll amount,
 * Kelly fraction, and stake cap are never transmitted to the server and
 * never persisted in any snapshot. Each browser is independent; clearing
 * site data resets the tool to defaults.
 *
 * The hook is built on useSyncExternalStore: the server render and the
 * hydration pass both use the defaults (getServerSnapshot), and the real
 * stored value is applied on the first post-hydration snapshot check — no
 * effects, no setState-in-effect, no hydration mismatch.
 */

export interface BankrollSettings {
  bankroll: number; // total bankroll in whole dollars
  kellyFraction: number; // 0 < f <= 1 — e.g. 0.25 = quarter Kelly
  maxStakePct: number; // 0 < cap <= 1 — hard cap on any single stake
}

export const DEFAULT_BANKROLL_SETTINGS: BankrollSettings = {
  bankroll: DEFAULT_BANKROLL,
  kellyFraction: DEFAULT_KELLY_FRACTION,
  maxStakePct: DEFAULT_MAX_STAKE_PCT,
};

const STORAGE_KEY = "edge_cal_bankroll_settings_v1";
const LOCAL_CHANGE_EVENT = "edge-cal-bankroll-local-change";

function sanitize(parsed: Partial<BankrollSettings>): BankrollSettings {
  return {
    bankroll:
      typeof parsed.bankroll === "number" &&
      Number.isFinite(parsed.bankroll) &&
      parsed.bankroll > 0
        ? parsed.bankroll
        : DEFAULT_BANKROLL_SETTINGS.bankroll,
    kellyFraction:
      typeof parsed.kellyFraction === "number" &&
      Number.isFinite(parsed.kellyFraction) &&
      parsed.kellyFraction > 0 &&
      parsed.kellyFraction <= 1
        ? parsed.kellyFraction
        : DEFAULT_BANKROLL_SETTINGS.kellyFraction,
    maxStakePct:
      typeof parsed.maxStakePct === "number" &&
      Number.isFinite(parsed.maxStakePct) &&
      parsed.maxStakePct > 0 &&
      parsed.maxStakePct <= 1
        ? parsed.maxStakePct
        : DEFAULT_BANKROLL_SETTINGS.maxStakePct,
  };
}

// Module-level snapshot cache — getSnapshot must return a referentially
// stable value unless the underlying storage actually changed.
let cachedRaw: string | null = null;
let cachedSettings: BankrollSettings = DEFAULT_BANKROLL_SETTINGS;

function readSettings(): BankrollSettings {
  if (typeof window === "undefined") return DEFAULT_BANKROLL_SETTINGS;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return DEFAULT_BANKROLL_SETTINGS;
  }
  if (raw === cachedRaw) return cachedSettings;
  cachedRaw = raw;
  if (!raw) {
    cachedSettings = DEFAULT_BANKROLL_SETTINGS;
    return cachedSettings;
  }
  try {
    cachedSettings = sanitize(JSON.parse(raw) as Partial<BankrollSettings>);
  } catch {
    cachedSettings = DEFAULT_BANKROLL_SETTINGS;
  }
  return cachedSettings;
}

function subscribeBankroll(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  // Same-tab mutations dispatch the local event; the native "storage" event
  // covers other tabs of the same browser.
  window.addEventListener(LOCAL_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(LOCAL_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function notifyLocalChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
}

export function loadBankrollSettings(): BankrollSettings {
  return readSettings();
}

export function persistBankrollSettings(settings: BankrollSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    notifyLocalChange();
  } catch {
    // Private-mode / storage-full: the tool still works for the session.
  }
}

export function clearBankrollSettings(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    notifyLocalChange();
  } catch {
    // ignore
  }
}

/**
 * React hook for bankroll settings (see module docs for the storage model).
 * `update`/`reset` mutate localStorage, which the store subscription picks up.
 */
export function useBankrollSettings(): {
  settings: BankrollSettings;
  isHydrated: boolean;
  update: (patch: Partial<BankrollSettings>) => void;
  reset: () => void;
} {
  const settings = useSyncExternalStore(
    subscribeBankroll,
    readSettings,
    () => DEFAULT_BANKROLL_SETTINGS
  );

  const update = useCallback((patch: Partial<BankrollSettings>) => {
    const next = { ...readSettings(), ...patch };
    persistBankrollSettings(next);
  }, []);

  const reset = useCallback(() => {
    clearBankrollSettings();
  }, []);

  return {
    settings,
    isHydrated: typeof window !== "undefined",
    update,
    reset,
  };
}
