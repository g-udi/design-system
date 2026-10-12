// Runtime helpers shared by ThemeProvider and the pre-paint script: storage, <style> injection and
// the inline script that applies the stored theme before first paint. Server-safe (no DOM at import).
import { compileTheme } from './compile.js';
import { DARK_CLASS, DEFAULT_THEME_ID, THEME_ATTRIBUTE } from './contract.js';

export const THEME_STORAGE_KEY = 'gaudi-theme';
export const THEME_MODES = ['light', 'dark', 'system'];
export const STYLE_ATTRIBUTE = 'data-gaudi-theme';

/** Storage keys: `<key>` theme id, `<key>-mode` light/dark/system, `<key>-css` compiled CSS of a non-default theme. */
export const storageKeys = (key = THEME_STORAGE_KEY) => ({ theme: key, mode: `${key}-mode`, css: `${key}-css`, custom: `${key}-custom` });

/** Web Storage-shaped adapter over window.localStorage that never throws (private mode, SSR, quotas). */
export const localStorageAdapter = {
  getItem(key) { try { return typeof window === 'undefined' ? null : window.localStorage.getItem(key); } catch { return null; } },
  setItem(key, value) { try { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); } catch { /* storage unavailable or full */ } },
  removeItem(key) { try { if (typeof window !== 'undefined') window.localStorage.removeItem(key); } catch { /* storage unavailable */ } }
};

/**
 * applyTheme(theme, { document?, nonce?, derived? }) compiles a theme JSON and injects (or replaces)
 * a <style data-gaudi-theme="<id>"> in <head>. Returns { css, remove }. Without a DOM it only compiles.
 */
export function applyTheme(theme, { document: doc = globalThis.document, nonce, ...compileOptions } = {}) {
  const css = compileTheme(theme, compileOptions);
  if (!doc?.head) return { css, remove: () => {} };
  let style = doc.head.querySelector(`style[${STYLE_ATTRIBUTE}="${theme.id}"]`);
  if (!style) {
    style = doc.createElement('style');
    style.setAttribute(STYLE_ATTRIBUTE, theme.id);
    if (nonce) style.setAttribute('nonce', nonce);
    doc.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
  return { css, remove: () => style.remove() };
}

/** Whether `mode` resolves to dark, given the system preference. */
export const resolveMode = (mode, systemDark) => (mode === 'dark' || (mode === 'system' && systemDark) ? 'dark' : 'light');

const literal = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

/**
 * Inline script for <head> that applies the stored theme before first paint (no flash): sets
 * data-theme, injects the stored compiled CSS of a non-default theme, and toggles .dark from the
 * stored or system mode. Render it with dangerouslySetInnerHTML and add suppressHydrationWarning
 * on <html>. It reads localStorage only; with another storage, render data-theme on the server.
 */
export function getThemeScript({ storageKey = THEME_STORAGE_KEY, defaultTheme = DEFAULT_THEME_ID, defaultMode = 'system', attribute = THEME_ATTRIBUTE, darkClass = DARK_CLASS, enableMode = true } = {}) {
  const keys = storageKeys(storageKey);
  const mode = enableMode
    ? `var m=g(${literal(keys.mode)})||${literal(defaultMode)},k=m==='dark'||(m==='system'&&!!window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);d.classList.toggle(${literal(darkClass)},k);d.style.colorScheme=k?'dark':'light';`
    : '';
  return `(function(){var d=document.documentElement;function g(k){try{return window.localStorage.getItem(k)}catch(e){return null}}try{var t=g(${literal(keys.theme)})||${literal(defaultTheme)};d.setAttribute(${literal(attribute)},t);var c=g(${literal(keys.css)});if(c){var e=document.createElement('style');e.setAttribute(${literal(STYLE_ATTRIBUTE)},t);e.textContent=c;document.head.appendChild(e);}${mode}}catch(e){}})();`;
}
