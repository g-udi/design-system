'use client';
import * as React from 'react';
import { getCascaderPath } from '../cascaderModel.jsx';
function useCascaderNavigation({
  setPathWithReason,
  setQuery,
  bumpAnnouncement,
  latest,
  toggleExpanded,
  requestChildren,
  pushLevel,
  pendingNavigation,
  loadStates,
  setPendingNavigation,
  open,
  inline
}) {
  const goToLevelAt = React.useCallback(
    (nodeValue, depth) => {
      setPathWithReason(
        (prev) => [...prev.slice(0, Math.max(0, depth)), nodeValue],
        'drill'
      );
      setQuery('');
      bumpAnnouncement(null);
    },
    [setPathWithReason, setQuery, bumpAnnouncement]
  );
  const navigateAt = React.useCallback(
    (node, depth) => {
      if (latest.current.mode === 'tree') {
        toggleExpanded(node.value);
        return;
      }
      if (latest.current.needsChildren(node)) {
        requestChildren(node, { value: node.value, kind: 'at', depth });
        return;
      }
      goToLevelAt(node.value, depth);
    },
    [latest, toggleExpanded, goToLevelAt, requestChildren]
  );
  const navigate = React.useCallback(
    (node) => {
      const {
        mode: currentMode,
        deepResults: currentDeepResults,
        index: currentIndex,
        expanded: currentExpanded,
        needsChildren: pending
      } = latest.current;
      if (currentMode === 'tree') {
        if (!currentExpanded.has(node.value) && pending(node)) {
          requestChildren(node, {
            value: node.value,
            kind: 'expand',
            depth: 0
          });
          return;
        }
        toggleExpanded(node.value);
        return;
      }
      if (currentDeepResults) {
        if (pending(node)) {
          const ancestors2 = getCascaderPath(currentIndex, node.value);
          requestChildren(node, {
            value: node.value,
            kind: 'at',
            // The hit's own depth, so the settle rebuilds the same trail.
            depth: Math.max(0, ancestors2.length - 1)
          });
          return;
        }
        const ancestors = getCascaderPath(currentIndex, node.value);
        setPathWithReason(
          ancestors.map((entry) => entry.value),
          'drill'
        );
        setQuery('');
        bumpAnnouncement(null);
        return;
      }
      if (pending(node)) {
        requestChildren(node, { value: node.value, kind: 'push', depth: 0 });
        return;
      }
      pushLevel(node.value);
    },
    [
      latest,
      toggleExpanded,
      setPathWithReason,
      setQuery,
      pushLevel,
      bumpAnnouncement,
      requestChildren
    ]
  );
  React.useEffect(() => {
    if (!pendingNavigation) return;
    const state = loadStates.get(pendingNavigation.value);
    if (!state || state.loading || state.error) return;
    setPendingNavigation(null);
    if (pendingNavigation.kind === 'expand') {
      toggleExpanded(pendingNavigation.value);
      return;
    }
    if (pendingNavigation.kind === 'at') {
      goToLevelAt(pendingNavigation.value, pendingNavigation.depth);
      return;
    }
    pushLevel(pendingNavigation.value);
  }, [pendingNavigation, loadStates, toggleExpanded, goToLevelAt, pushLevel, setPendingNavigation]);
  React.useEffect(() => {
    if (!open && !inline) setPendingNavigation(null);
  }, [open, inline, setPendingNavigation]);
  return { navigateAt, navigate };
}
export { useCascaderNavigation };
