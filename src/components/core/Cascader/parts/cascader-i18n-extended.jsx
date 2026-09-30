// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
const ROOT_LEVEL = 'Top level';
const itemCount = (count) => `${count} ${count === 1 ? 'item' : 'items'}`;
export const CASCADER_LABELS = {
  // Deliberately NOT lowercased. `toLowerCase()` is locale-hostile - it maps
  // Turkish "İ" to a two-code-point sequence and German "İstanbul" style
  // proper nouns lose their casing - and a label is already written the way
  // its author wants it read.
  search: (parentLabel) =>
    parentLabel ? `Search ${parentLabel}...` : 'Search...',
  back: 'Back',
  loading: 'Loading...',
  loadingMore: 'Loading more...',
  loadMore: 'Load more',
  error: 'Could not load items.',
  retry: 'Retry',
  empty: 'No results found.',
  selectedCount: (count) => `${count} selected`,
  breadcrumbLabel: 'Breadcrumb',
  chipsLabel: 'Selected items',
  removeChip: (label) => `Remove ${label}`,
  pathSeparator: '/',
  rootLevel: ROOT_LEVEL,
  itemCount,
  branchAffordance: 'submenu',
  selectedState: 'selected',
  partiallySelectedState: 'partially selected',
  columnsLabel: 'Levels',
  actionsLabel: 'Actions',
  submenuAffordance: 'opens a menu',
  panelLabel: 'Options',
  keyboardHint: (mode, dir) => {
    const open = dir === 'rtl' ? 'Left' : 'Right';
    const back = dir === 'rtl' ? 'Right' : 'Left';
    if (mode === 'tree') {
      return `Use the ${open} Arrow key to expand and the ${back} Arrow key to collapse.`;
    }
    if (mode === 'columns') {
      return `Use the ${open} Arrow key to open the next column and the ${back} Arrow key to go back.`;
    }
    return `Use the ${open} Arrow key to open a branch and the ${back} Arrow key to go back.`;
  },
  rootAnnouncement: (count) => `${ROOT_LEVEL}, ${itemCount(count)}`,
  expandedAnnouncement: (label, count) =>
    `${label} expanded, ${itemCount(count)}`,
  collapsedAnnouncement: (label) => `${label} collapsed`,
  levelAnnouncement: (parentLabel, depth, count) =>
    `${parentLabel}, level ${depth}, ${itemCount(count)}`,
  resultsAnnouncement: (count) =>
    count === 1 ? '1 result' : `${count} results`,
  maxReachedAnnouncement: (max) => `Selection limit of ${max} reached`,
  cascadeAnnouncement: (label, count, selecting) =>
    `${label} ${selecting ? 'selected' : 'deselected'}, ${itemCount(count)} followed`,
  searchingAnnouncement: 'Searching...'
};
export function resolveCascaderLabels(labels) {
  if (!labels) return CASCADER_LABELS;
  return { ...CASCADER_LABELS, ...labels };
}
export function resolveCascaderSearchLabel(labels, parentLabel) {
  return typeof labels.search === 'function'
    ? labels.search(parentLabel)
    : labels.search;
}
