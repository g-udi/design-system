/**
 * Href Utilities
 *
 * @description Shared URL-safety helpers: normalizing hrefs to a safe subset of
 * protocols and detecting external destinations. Used by Link, Button, and the
 * icon link wrapper so every anchor applies the same rules.
 */

const safeExternalProtocols = new Set([ 'http:', 'https:', 'mailto:', 'tel:' ]);

/**
 * Normalizes an href, allowing relative paths, hash/query links, and a safe
 * set of external protocols; anything else resolves to null.
 *
 * @param {*} href - Candidate href value
 * @returns {string|null|*} The trimmed href when safe, null when rejected, or the value untouched when not a string
 */
export const normalizeHref = (href) => {
  if (typeof href !== 'string') return href;

  const normalizedHref = href.trim();

  if (!normalizedHref) return null;
  if (normalizedHref.startsWith('/') || normalizedHref.startsWith('#')) return normalizedHref;

  try {
    // A base validates relative references without changing the authored destination.
    const parsed = new URL(normalizedHref, 'https://gaudi.invalid/');

    return safeExternalProtocols.has(parsed.protocol) ? normalizedHref : null;
  } catch {
    return null;
  }
};

/**
 * Whether an href points at an external destination
 *
 * @param {*} href - Candidate href value
 * @returns {boolean} True for absolute http(s) and protocol-relative URLs
 */
export const isExternalHref = (href) => typeof href === 'string' && (/^https?:\/\//i.test(href) || href.startsWith('//'));
