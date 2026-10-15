/** Pure index arithmetic behind useArrowKeyNav; safe to import during server rendering. */

/**
 * The index a key moves to, or `null` when the key does not navigate along `orientation`.
 * Home and End jump to the ends; `wrap` loops past them. In right-to-left layouts (`dir: 'rtl'`)
 * ArrowLeft moves forward.
 */
export function getNextIndex(current, key, { count, orientation = 'vertical', wrap = false, dir = 'ltr' } = {}) {
  if (!count) return null;
  const vertical = orientation === 'vertical' || orientation === 'both';
  const horizontal = orientation === 'horizontal' || orientation === 'both';
  const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  let next;
  if (key === 'Home') next = 0;
  else if (key === 'End') next = count - 1;
  else if ((key === 'ArrowDown' && vertical) || (key === forward && horizontal)) next = current + 1;
  else if ((key === 'ArrowUp' && vertical) || (key === backward && horizontal)) next = current - 1;
  else return null;
  if (wrap) return ((next % count) + count) % count;
  return Math.max(0, Math.min(next, count - 1));
}
