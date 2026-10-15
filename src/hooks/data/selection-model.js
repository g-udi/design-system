/** Pure Set helpers behind useSelection; safe to import during server rendering. */

/** A new Set with `id` added or removed. */
export function toggleInSet(set, id) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/** `true` when every id is selected, `false` when none is, `'indeterminate'` in between (for a select-all checkbox). */
export function selectionState(selected, ids) {
  if (!ids.length) return false;
  const count = ids.reduce((total, id) => total + (selected.has(id) ? 1 : 0), 0);
  return count === 0 ? false : count === ids.length ? true : 'indeterminate';
}
