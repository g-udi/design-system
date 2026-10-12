/** Follow scoped theme selectors and token overrides without observing animated descendants. */
export function observeTheme(element, onChange) {
  const Observer = element?.ownerDocument?.defaultView?.MutationObserver;
  if (!Observer) return () => {};

  const observer = new Observer(onChange);
  // Hosts may configure their own theme attribute or dark-mode class.
  for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
    observer.observe(ancestor, { attributes: true });
  }
  return () => observer.disconnect();
}
