'use client';
import * as React from 'react';
import { createCascaderHighlightStore } from './cascaderHighlightStore.js';
const CascaderStateContext = React.createContext(void 0);
export function useCascaderState() {
  const context = React.useContext(CascaderStateContext);
  if (!context) {
    throw new Error('useCascaderState must be used within a Cascader');
  }
  return context;
}
const CascaderActionsContext = React.createContext(void 0);
export function useCascaderActions() {
  const context = React.useContext(CascaderActionsContext);
  if (!context) {
    throw new Error('useCascaderActions must be used within a Cascader');
  }
  return context;
}
const CascaderRenderContext = React.createContext({});
export function useCascaderRender() {
  return React.useContext(CascaderRenderContext);
}
const FALLBACK_HIGHLIGHT_STORE = createCascaderHighlightStore();
const CascaderHighlightContext = React.createContext(FALLBACK_HIGHLIGHT_STORE);
export function useCascaderHighlight() {
  const store = React.useContext(CascaderHighlightContext);
  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
}
export {
  CascaderActionsContext,
  CascaderHighlightContext,
  CascaderRenderContext,
  CascaderStateContext
};
