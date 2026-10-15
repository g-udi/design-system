/** Pure Tab-wrapping rule behind useFocusTrap; safe to import during server rendering. */

/** The element Tab should move to from `active` inside `elements`, wrapping at both ends (or null to let the browser move). */
export function getTrapTarget(elements, active, shiftKey) {
  if (!elements.length) return null;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (!elements.includes(active)) return shiftKey ? last : first;
  if (shiftKey && active === first) return last;
  if (!shiftKey && active === last) return first;
  return null;
}
