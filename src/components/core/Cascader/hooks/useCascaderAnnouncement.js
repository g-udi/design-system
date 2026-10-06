'use client';
import * as React from 'react';
import {
  getCascaderCount,
  isCascaderMoreNode,
  matchesCascaderQuery,
  normalizeCascaderQuery
} from '../cascaderModel.jsx';
const ANNOUNCE_MARKER = '\u2060';
const ANNOUNCE_DEBOUNCE = 150;
function useCascaderAnnouncement({
  deepResults,
  query,
  filter,
  renderedItems,
  open,
  inline,
  announceSignal,
  mode,
  index,
  pendingNavigation,
  loadStates,
  searchLoadState,
  currentLoadState,
  labels,
  expanded,
  currentParent,
  path
}) {
  const announcedMatches = React.useMemo(() => {
    if (deepResults) return deepResults.length;
    const normalized = normalizeCascaderQuery(query);
    if (!normalized) return 0;
    const matches = filter ?? matchesCascaderQuery;
    return renderedItems.filter(
      (node) => !isCascaderMoreNode(node) && matches(node, normalized)
    ).length;
  }, [deepResults, renderedItems, query, filter]);
  const announcementTarget = React.useMemo(() => {
    if (!open && !inline) return { text: '', defer: false };
    const total = renderedItems.length;
    const marker = ANNOUNCE_MARKER.repeat(announceSignal.seq % 2);
    if (announceSignal.notice) {
      return { text: `${announceSignal.notice}${marker}`, defer: false };
    }
    const toggled =
      mode === 'tree' && announceSignal.toggled
        ? (index.byValue.get(announceSignal.toggled) ?? null)
        : null;
    const pendingState = pendingNavigation
      ? (loadStates.get(pendingNavigation.value) ?? null)
      : null;
    const levelState = query.trim() ? searchLoadState : currentLoadState;
    let text;
    let defer = false;
    if (pendingState?.error) {
      text = labels.error;
    } else if (pendingNavigation) {
      text = labels.loading;
    } else if (levelState?.error) {
      text = labels.error;
    } else if (levelState?.loading) {
      text = query.trim()
        ? labels.searchingAnnouncement
        : total > 0
          ? labels.loadingMore
          : labels.loading;
    } else if (query.trim()) {
      text =
        announcedMatches === 0
          ? labels.empty
          : labels.resultsAnnouncement(announcedMatches);
      defer = true;
    } else if (toggled) {
      text = expanded.has(toggled.value)
        ? labels.expandedAnnouncement(
            toggled.label,
            getCascaderCount(index, toggled)
          )
        : labels.collapsedAnnouncement(toggled.label);
    } else if (currentParent) {
      text = labels.levelAnnouncement(
        currentParent.label,
        path.length + 1,
        total
      );
    } else {
      text = labels.rootAnnouncement(total);
    }
    return { text: `${text}${marker}`, defer };
  }, [
    open,
    inline,
    mode,
    index,
    expanded,
    announceSignal,
    query,
    labels,
    renderedItems.length,
    announcedMatches,
    currentParent,
    path.length,
    currentLoadState,
    searchLoadState,
    pendingNavigation,
    loadStates
  ]);
  const [announced, setAnnounced] = React.useState(announcementTarget);
  if (!announcementTarget.defer && announced.text !== announcementTarget.text) {
    setAnnounced(announcementTarget);
  }
  React.useEffect(() => {
    if (!announcementTarget.defer) return void 0;
    const timer = setTimeout(
      () => setAnnounced(announcementTarget),
      ANNOUNCE_DEBOUNCE
    );
    return () => clearTimeout(timer);
  }, [announcementTarget]);
  const announcement = announced.text;
  return { announcement };
}
export { useCascaderAnnouncement };
