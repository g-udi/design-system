'use client';

import { useMediaQuery } from './use-media-query.js';

/**
 * The operating system colour scheme: `'dark'` or `'light'` (`fallback` during server rendering).
 * This is the system preference, not the site theme; read the active theme from the theme provider.
 */
export function usePrefersColorScheme(fallback = 'light') {
  const dark = useMediaQuery('(prefers-color-scheme: dark)', fallback === 'dark');
  return dark ? 'dark' : 'light';
}
