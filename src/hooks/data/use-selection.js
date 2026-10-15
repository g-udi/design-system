'use client';

import { useCallback, useMemo } from 'react';
import { useControllableState } from '../state/use-controllable-state.js';
import { toggleInSet, selectionState } from './selection-model.js';

/**
 * Multi-select state for lists, tables, galleries and bulk actions, kept in a `Set` of ids
 * (numbers or strings). Uncontrolled from `initialSelectedIds`, or controlled with `selectedIds`
 * and `onSelectionChange`; every change produces a new Set.
 */
export function useSelection({ selectedIds, initialSelectedIds, onSelectionChange } = {}) {
  const [ selected, setSelected ] = useControllableState({
    value: selectedIds,
    defaultValue: initialSelectedIds ?? new Set(),
    onChange: onSelectionChange
  });

  const toggleSelection = useCallback((id) => setSelected((current) => toggleInSet(current, id)), [ setSelected ]);
  const select = useCallback((id) => setSelected((current) => (current.has(id) ? current : new Set(current).add(id))), [ setSelected ]);
  const deselect = useCallback((id) => setSelected((current) => {
    if (!current.has(id)) return current;
    const next = new Set(current);
    next.delete(id);
    return next;
  }), [ setSelected ]);
  const selectAll = useCallback((ids) => setSelected(new Set(ids)), [ setSelected ]);
  const clearSelection = useCallback(() => setSelected((current) => (current.size ? new Set() : current)), [ setSelected ]);
  const isSelected = useCallback((id) => selected.has(id), [ selected ]);
  const getSelectAllState = useCallback((ids) => selectionState(selected, ids), [ selected ]);
  const toggleAll = useCallback(
    (ids) => setSelected((current) => (selectionState(current, ids) === true ? new Set([ ...current ].filter((id) => !ids.includes(id))) : new Set([ ...current, ...ids ]))),
    [ setSelected ]
  );

  return useMemo(() => ({
    selectedIds: selected,
    count: selected.size,
    isSelected,
    getSelectAllState,
    toggleSelection,
    select,
    deselect,
    selectAll,
    toggleAll,
    clearSelection,
    setSelection: setSelected
  }), [ clearSelection, deselect, getSelectAllState, isSelected, select, selectAll, selected, setSelected, toggleAll, toggleSelection ]);
}
