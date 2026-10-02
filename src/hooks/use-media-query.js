import * as React from 'react';

/**
 * Tracks a CSS media query, for layouts that render a different tree at a breakpoint (for example one
 * pane at a time on phones instead of two resizable panes). Returns `fallback` during server rendering
 * and the first client render, so markup stays stable until the query is measured.
 */
export function useMediaQuery(query, fallback = false) {
  const [matches, setMatches] = React.useState(fallback);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);
  return matches;
}
