'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePrefersColorScheme } from '../hooks/environment/use-prefers-color-scheme.js';
import { DARK_CLASS, DEFAULT_THEME_ID, THEME_ATTRIBUTE } from './contract.js';
import { themePresets } from './presets.js';
import { THEME_MODES, THEME_STORAGE_KEY, applyTheme, localStorageAdapter, resolveMode, storageKeys } from './runtime.js';
import { assertTheme } from './validate.js';

const noop = () => {};
const defaultContext = {
  theme: DEFAULT_THEME_ID,
  themes: themePresets,
  mode: 'system',
  resolvedMode: 'light',
  setTheme: noop,
  setMode: noop,
  applyCustomTheme: noop
};
const ThemeContext = createContext(defaultContext);

const readCustom = (storage, key) => {
  try {
    const value = JSON.parse(storage?.getItem(key) || 'null');
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
};

/**
 * Theme and colour-mode state for an app. Server and first client renders use the defaults; the
 * stored choice is read after mount (getThemeScript has already applied it before paint, so there
 * is no flash). The active non-default theme's CSS is injected and persisted for the script.
 */
export function ThemeProvider({
  children,
  themes = themePresets,
  defaultTheme = DEFAULT_THEME_ID,
  defaultMode = 'system',
  storageKey = THEME_STORAGE_KEY,
  storage = localStorageAdapter,
  enableMode = true,
  attribute = THEME_ATTRIBUTE,
  darkClass = DARK_CLASS,
  nonce,
  onThemeChange
}) {
  const keys = useMemo(() => storageKeys(storageKey), [ storageKey ]);
  const [ theme, setThemeState ] = useState(defaultTheme);
  const [ mode, setModeState ] = useState(defaultMode);
  const [ custom, setCustom ] = useState(null);
  const systemMode = usePrefersColorScheme();
  const resolvedMode = resolveMode(mode, systemMode === 'dark');

  // Read the persisted choice after hydration, and follow other tabs.
  useEffect(() => {
    const sync = () => {
      setCustom(readCustom(storage, keys.custom));
      setThemeState(storage?.getItem(keys.theme) || defaultTheme);
      const storedMode = storage?.getItem(keys.mode);
      setModeState(THEME_MODES.includes(storedMode) ? storedMode : defaultMode);
    };
    sync();
    if (typeof window === 'undefined') return undefined;
    const onStorage = (event) => { if (!event.key || Object.values(keys).includes(event.key)) sync(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [ defaultMode, defaultTheme, keys, storage ]);

  const allThemes = useMemo(() => (custom && !themes.some((entry) => entry.id === custom.id) ? [ ...themes, custom ] : themes), [ custom, themes ]);
  const active = allThemes.find((entry) => entry.id === theme);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.documentElement.setAttribute(attribute, theme);
    if (!active || active.id === DEFAULT_THEME_ID) {
      storage?.removeItem(keys.css);
      return undefined;
    }
    const { css, remove } = applyTheme(active, { nonce });
    storage?.setItem(keys.css, css);
    return remove;
  }, [ active, attribute, keys, nonce, storage, theme ]);

  useEffect(() => {
    if (!enableMode || typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle(darkClass, resolvedMode === 'dark');
    root.style.colorScheme = resolvedMode;
  }, [ darkClass, enableMode, resolvedMode ]);

  const setTheme = useCallback((id) => {
    setThemeState(id);
    storage?.setItem(keys.theme, id);
    onThemeChange?.(id);
  }, [ keys, onThemeChange, storage ]);

  const setMode = useCallback((next) => {
    if (!THEME_MODES.includes(next)) throw new RangeError(`Theme mode must be one of ${THEME_MODES.join(', ')}.`);
    setModeState(next);
    storage?.setItem(keys.mode, next);
  }, [ keys, storage ]);

  /** Validate, persist and activate an imported or generated theme JSON. */
  const applyCustomTheme = useCallback((themeJson) => {
    assertTheme(themeJson);
    setCustom(themeJson);
    storage?.setItem(keys.custom, JSON.stringify(themeJson));
    setTheme(themeJson.id);
  }, [ keys, setTheme, storage ]);

  const value = useMemo(() => ({ theme, themes: allThemes, mode, resolvedMode, setTheme, setMode, applyCustomTheme }), [ allThemes, applyCustomTheme, mode, resolvedMode, setMode, setTheme, theme ]);
  return <ThemeContext.Provider value={ value }>{children}</ThemeContext.Provider>;
}

/** { theme, themes, mode, resolvedMode, setTheme(id), setMode('light'|'dark'|'system'), applyCustomTheme(json) }. */
export const useTheme = () => useContext(ThemeContext);
