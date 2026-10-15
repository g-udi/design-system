'use client';

import { useCallback, useRef, useState } from 'react';
import { isTextEntryTarget } from '../shared/dom.js';
import { useLatestRef } from '../shared/use-latest-ref.js';
import { getNextIndex } from './arrow-key-nav-model.js';

// Roles that accept aria-orientation; a plain group does not.
const ORIENTED_ROLES = new Set([ 'toolbar', 'listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid' ]);

const clampIndex =(index, count) => (Number.isFinite(index) && count > 0 ? Math.max(0, Math.min(Math.trunc(index), count - 1)) : 0);

/**
 * Arrow-key navigation with a roving tabindex for toolbars, listboxes, menus, tab lists and card
 * grids. The active item has `tabIndex={0}` and every other item `-1`, so Tab enters and leaves the
 * group in one stop while the arrow keys, Home and End move inside it. Keys pressed inside text
 * fields, and keys with Command, Control or Alt, are left alone.
 *
 * @param {number} itemCount - Number of navigable items.
 * @param {{ orientation?: 'vertical' | 'horizontal' | 'both', wrap?: boolean, dir?: 'ltr' | 'rtl', role?: string, defaultIndex?: number, onActiveChange?: (index: number) => void }} [options]
 */
export function useArrowKeyNav(itemCount, { orientation = 'vertical', wrap = false, dir = 'ltr', role = 'group', defaultIndex = 0, onActiveChange } = {}) {
  const count = Number.isFinite(itemCount) ? Math.max(0, Math.trunc(itemCount)) : 0;
  const [ stored, setStored ] = useState(() => clampIndex(defaultIndex, count));
  const activeIndex = clampIndex(stored, count);
  // Keep the stored index in range when items are removed.
  if (activeIndex !== stored) setStored(activeIndex);
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;
  const itemsRef = useRef([]);
  const onActiveChangeRef = useLatestRef(onActiveChange);

  const commit = useCallback((index) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    setStored(index);
    onActiveChangeRef.current?.(index);
  }, [ onActiveChangeRef ]);

  const setActiveIndex = useCallback((requested, { focus = true } = {}) => {
    const index = clampIndex(requested, count);
    commit(index);
    if (focus) itemsRef.current[index]?.focus();
  }, [ commit, count ]);

  const onKeyDown = useCallback((event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent?.isComposing || isTextEntryTarget(event.target)) return;
    const next = getNextIndex(activeRef.current, event.key, { count, orientation, wrap, dir });
    if (next === null) return;
    event.preventDefault();
    setActiveIndex(next);
  }, [ count, dir, orientation, setActiveIndex, wrap ]);

  const getItemProps = useCallback((index) => ({
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown,
    onFocus: () => commit(index),
    ref: (node) => {
      itemsRef.current[index] = node;
    }
  }), [ activeIndex, commit, onKeyDown ]);

  const withOrientation = ORIENTED_ROLES.has(role) && orientation !== 'both';

  return {
    activeIndex,
    setActiveIndex,
    getItemProps,
    containerProps: { role, ...(withOrientation ? { 'aria-orientation': orientation } : {}) }
  };
}
