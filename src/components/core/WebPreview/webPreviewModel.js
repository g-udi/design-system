/**
 * WebPreview model
 *
 * @description Pure rules behind the web preview chrome: which device widths
 * exist, what an address-bar entry resolves to, and how back/forward history
 * moves. No DOM access, so these run on the server and in tests.
 */

/** Device frames: `width` is the iframe width in CSS pixels (null fills the frame). */
export const webPreviewDevices = Object.freeze({
  'desktop': { 'icon': 'Monitor', 'label': 'Desktop', 'width': null },
  'tablet': { 'icon': 'Tablet', 'label': 'Tablet', 'width': 768 },
  'phone': { 'icon': 'Smartphone', 'label': 'Phone', 'width': 390 }
});

/** Sandbox for previews: scripts and forms run, but the page cannot reach the host's origin. */
export const DEFAULT_WEB_PREVIEW_SANDBOX = 'allow-scripts allow-forms allow-popups allow-presentation allow-modals';

const SAFE_PROTOCOLS = new Set([ 'http:', 'https:' ]);

/**
 * Resolves an address-bar entry to a safe URL: adds https:// to bare hosts,
 * keeps about:blank, and rejects other schemes (javascript:, data:, file:).
 *
 * @param {string} input - What the person typed
 * @returns {string|null} An absolute http(s) URL, about:blank, or null when unusable
 */
export function normalizeWebPreviewUrl(input) {
  const value = String(input ?? '').trim();

  if (!value) return null;
  if (value === 'about:blank') return value;

  // "example.com:8080" is a host with a port, not a scheme; only "x://" and opaque schemes count.
  const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(value) || /^(about|blob|data|file|javascript|mailto|vbscript):/i.test(value);
  const looksLikeHost = /^(localhost|[\w-]+(\.[\w-]+)+|\d{1,3}(\.\d{1,3}){3})(:\d+)?([/?#]|$)/i.test(value);
  const candidate = hasScheme ? value : looksLikeHost ? `${/^localhost/i.test(value) ? 'http' : 'https'}://${value}` : null;

  if (!candidate) return null;

  try {
    const url = new URL(candidate);

    return SAFE_PROTOCOLS.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

/** The address bar text for a URL: hides a lone trailing slash on the origin. */
export const formatWebPreviewUrl = (url) => (typeof url === 'string' ? url.replace(/^(https?:\/\/[^/?#]+)\/$/, '$1') : '');

/** A fresh history holding one entry. */
export const createWebPreviewHistory = (url) => ({ 'entries': url ? [ url ] : [], 'index': url ? 0 : -1 });

/** Visits a URL: drops forward entries and appends, unless it is the current entry. */
export function pushWebPreviewHistory(history, url) {
  if (!url) return history;
  if (history.entries[history.index] === url) return history;

  const entries = [ ...history.entries.slice(0, history.index + 1), url ];

  return { entries, 'index': entries.length - 1 };
}

/** Moves back (-1) or forward (+1) when possible. */
export function stepWebPreviewHistory(history, delta) {
  const index = history.index + delta;

  if (index < 0 || index >= history.entries.length) return history;

  return { ...history, index };
}

/** Counts console entries by level so the console toggle can name errors and warnings. */
export function countWebPreviewLogs(logs = []) {
  return logs.reduce((counts, log) => {
    const level = log?.level === 'warning' ? 'warn' : log?.level || 'log';

    counts[level] = (counts[level] || 0) + 1;
    counts.total += 1;

    return counts;
  }, { 'error': 0, 'info': 0, 'log': 0, 'total': 0, 'warn': 0 });
}

// Default copy; hosts merge their own over it through `labels`.
export const defaultWebPreviewLabels = Object.freeze({
  'address': 'Address',
  'back': 'Go back',
  'blocked': 'This page can’t be shown here',
  'body': 'Page preview',
  'blockedHint': 'The site doesn’t allow embedding. Open it in a new tab instead.',
  'console': 'Console',
  'consoleEmpty': 'No console output yet.',
  'devices': 'Preview width',
  'forward': 'Go forward',
  'invalid': 'Enter a web address such as example.com',
  'loading': 'Loading preview',
  'open': 'Open in new tab',
  'reload': 'Reload preview'
});
