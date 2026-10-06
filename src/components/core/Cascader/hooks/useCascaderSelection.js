'use client';
import * as React from 'react';
import { useCascaderActions, useCascaderState } from '../CascaderContext.jsx';
import { getCascaderPath } from '../cascaderModel.jsx';
export function useCascader() {
  const actions = useCascaderActions();
  const state = useCascaderState();
  return React.useMemo(() => ({ ...actions, ...state }), [actions, state]);
}
export function useCascaderSelection() {
  const { multiple, setSelection } = useCascaderActions();
  const { index, selectedValues } = useCascaderState();
  return React.useMemo(() => {
    const selected = selectedValues
      .map((value) => index.byValue.get(value))
      .filter(Boolean);
    const paths = selectedValues.map((value) => getCascaderPath(index, value));
    return {
      selected,
      paths,
      first: selected[0] ?? null,
      firstPath: paths[0] ?? [],
      count: selectedValues.length,
      isEmpty: selectedValues.length === 0,
      multiple,
      remove: (value) =>
        setSelection(selectedValues.filter((entry) => entry !== value)),
      // Explicit reason: emptying on purpose is not "deselect the last node".
      clear: () => setSelection([], 'clear')
    };
  }, [index, selectedValues, multiple, setSelection]);
}
