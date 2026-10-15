/** The shared page scroll lock behind useScrollLock. `document` is read only when called, so this module is server-safe. */

// Shared across every caller, so nested overlays release the page only when the last one closes.
const lockState = { count: 0, overflow: '', paddingRight: '' };

/** Lock page scrolling. Returns the release function; locks nest and the last release restores the page. */
export function lockScroll() {
  if (typeof document === 'undefined') return () => {};
  const { body, documentElement } = document;
  if (lockState.count === 0) {
    lockState.overflow = body.style.overflow;
    lockState.paddingRight = body.style.paddingRight;
    // Keep content from shifting sideways when the scrollbar disappears.
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    if (scrollbar > 0) {
      const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbar}px`;
    }
    body.style.overflow = 'hidden';
  }
  lockState.count += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockState.count = Math.max(0, lockState.count - 1);
    if (lockState.count === 0) {
      body.style.overflow = lockState.overflow;
      body.style.paddingRight = lockState.paddingRight;
    }
  };
}
