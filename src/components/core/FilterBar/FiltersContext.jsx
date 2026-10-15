'use client';
import * as React from 'react';
import { createFilterFocusStore, createFilterRowStateStore } from './filterStores.js';
const FilterActionsContext = React.createContext(null);
export function useFilterActions() {
  const context = React.useContext(FilterActionsContext);
  if (!context) {
    throw new Error('useFilterActions must be used inside <Filters>');
  }
  return context;
}
const FilterStateContext = React.createContext(null);
export function useFilterState() {
  const context = React.useContext(FilterStateContext);
  if (!context) {
    throw new Error('useFilterState must be used inside <Filters>');
  }
  return context;
}
const FilterRenderContext = React.createContext({});
export function useFilterRender() {
  return React.useContext(FilterRenderContext);
}
const FALLBACK_FOCUS_STORE = createFilterFocusStore();
const FilterFocusContext = React.createContext(FALLBACK_FOCUS_STORE);
const FilterReorderContext = React.createContext(false);
export const FilterReorderProvider = FilterReorderContext.Provider;
export function useFilterReorderable() {
  return React.useContext(FilterReorderContext);
}
const FALLBACK_ROW_STATE_STORE = createFilterRowStateStore();
const FilterRowStateContext = React.createContext(FALLBACK_ROW_STATE_STORE);
export const FilterRowStateProvider = FilterRowStateContext.Provider;
export function useFilterRowStateStore() {
  return React.useContext(FilterRowStateContext);
}
export function useFilterRowPending(id) {
  const store = React.useContext(FilterRowStateContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.isPending(id),
    () => false
  );
}
export function useFilterTouched(id) {
  const store = React.useContext(FilterRowStateContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.has(id),
    () => false
  );
}
export function useFilterFocus() {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
}
export function useFilterFocusStore() {
  return React.useContext(FilterFocusContext);
}
export function useFilterChipAutoOpen(id) {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => {
      const snapshot = store.getSnapshot();
      return snapshot.autoOpen && snapshot.id === id ? snapshot.segment : null;
    },
    () => null
  );
}
export function useFilterFocusEmpty() {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().id === null,
    () => true
  );
}
export function useFilterChipFocused(id) {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().id === id,
    () => false
  );
}
export function useFilterSegmentFocus(id) {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => {
      const snapshot = store.getSnapshot();
      return snapshot.id === id ? snapshot.segment : null;
    },
    () => null
  );
}
export {
  FilterActionsContext,
  FilterFocusContext,
  FilterRenderContext,
  FilterStateContext
};
