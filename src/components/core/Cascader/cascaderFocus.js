const CASCADER_TAB_STOP_SELECTOR =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const CASCADER_TAB_SKIP_SELECTOR = '[data-slot="scroll-area-viewport"]';
const CASCADER_TAB_HIDDEN_SELECTOR = "[hidden],[inert],[aria-hidden='true']";
function getCascaderTabStops(panel) {
  const stops = Array.from(panel.querySelectorAll(CASCADER_TAB_STOP_SELECTOR));
  return stops.filter(
    (stop) =>
      // Option and trail rows are real `<button>`s with `tabindex="-1"`.
      stop.getAttribute('tabindex') !== '-1' &&
      !stop.matches(CASCADER_TAB_SKIP_SELECTOR) &&
      !stop.closest(CASCADER_TAB_HIDDEN_SELECTOR)
  );
}
export function getCascaderFooterStops(scope) {
  const footer = scope.matches('[data-slot="cascader-footer"]')
    ? scope
    : scope.querySelector('[data-slot="cascader-footer"]');
  if (!footer) return [];
  return getCascaderTabStops(footer);
}
export function getCascaderTabTarget(panel, from, backwards) {
  const stops = getCascaderTabStops(panel);
  if (stops.length === 0 || !from) return null;
  const index = stops.indexOf(from);
  if (index !== -1) return stops[index + (backwards ? -1 : 1)] ?? null;
  if (backwards) {
    for (let i = stops.length - 1; i >= 0; i -= 1) {
      const position = from.compareDocumentPosition(stops[i]);
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return stops[i];
    }
    return null;
  }
  for (const stop of stops) {
    const position = from.compareDocumentPosition(stop);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return stop;
  }
  return null;
}
export function isCascaderRtl(element, provided) {
  if (provided === 'rtl') return true;
  const explicit = element.closest('[dir]')?.getAttribute('dir')?.toLowerCase();
  if (explicit === 'rtl') return true;
  if (explicit === 'ltr') return false;
  return (
    element.ownerDocument?.defaultView?.getComputedStyle(element).direction ===
    'rtl'
  );
}
