'use client';
import * as React from 'react';
import {
  CASCADER_ROOT_KEY,
  createCascaderMoreNode,
  filterCascaderLevel,
  flattenCascaderTree,
  getCascaderChildren,
  getCascaderPath,
  matchesCascaderQuery,
  normalizeCascaderQuery,
  searchCascaderDeep
} from '../cascaderModel.jsx';
function useCascaderRows({
  selectedValues,
  index,
  path,
  searchScope,
  query,
  mode,
  filter,
  loader,
  needsMoreRow,
  expanded
}) {
  const labelCacheRef = React.useRef(new Map());
  for (const selected of selectedValues) {
    const node = index.byValue.get(selected);
    if (node) labelCacheRef.current.set(selected, node);
  }
  const resolveNode = React.useCallback(
    (nodeValue) =>
      index.byValue.get(nodeValue) ??
      labelCacheRef.current.get(nodeValue) ?? {
        value: nodeValue,
        label: nodeValue
      },
    [index]
  );
  const currentParentValue = path.length ? path[path.length - 1] : null;
  const currentParent = currentParentValue
    ? (index.byValue.get(currentParentValue) ?? null)
    : null;
  const currentLevelKey = currentParentValue ?? CASCADER_ROOT_KEY;
  const isDeepSearching =
    searchScope === 'deep' && query.trim().length > 0 && mode !== 'tree';
  const localDeepResults = React.useMemo(() => {
    if (!isDeepSearching) return null;
    return searchCascaderDeep(index, query, {
      within: currentParentValue,
      matches: filter
    });
  }, [isDeepSearching, index, query, currentParentValue, filter]);
  const deepResults = loader.searchResults ?? localDeepResults;
  const levelItems = React.useMemo(() => {
    const level = getCascaderChildren(index, currentParentValue);
    return filterCascaderLevel(level, query, filter);
  }, [index, currentParentValue, query, filter]);
  const levelRendered = React.useMemo(() => {
    if (deepResults) return deepResults;
    if (!needsMoreRow(currentLevelKey, levelItems.length)) return levelItems;
    return [
      ...levelItems,
      createCascaderMoreNode(currentLevelKey, levelItems.length)
    ];
  }, [deepResults, levelItems, currentLevelKey, needsMoreRow]);
  const columns = React.useMemo(() => {
    if (mode !== 'columns') return [];
    const trail = [];
    for (let depth = 0; depth <= path.length; depth += 1) {
      const parentValue = depth === 0 ? null : path[depth - 1];
      const parent = parentValue
        ? (index.byValue.get(parentValue) ?? null)
        : null;
      const isActive = depth === path.length;
      let columnItems;
      if (isActive) {
        columnItems = levelRendered;
      } else {
        const key = parentValue ?? CASCADER_ROOT_KEY;
        const children2 = getCascaderChildren(index, parentValue);
        columnItems = needsMoreRow(key, children2.length)
          ? [...children2, createCascaderMoreNode(key, children2.length)]
          : children2;
      }
      trail.push({
        parent,
        depth,
        activeValue: path[depth] ?? null,
        active: isActive,
        // Only the active column is filtered: a query narrows what you type
        // into, never the trail behind it.
        items: columnItems
      });
    }
    return trail;
  }, [mode, path, index, levelRendered, needsMoreRow]);
  const treeSentinels = React.useMemo(() => {
    if (mode !== 'tree') return void 0;
    const keys = new Set();
    const consider = (key) => {
      if (needsMoreRow(key, index.childrenOf.get(key)?.length ?? 0)) {
        keys.add(key);
      }
    };
    consider(CASCADER_ROOT_KEY);
    for (const value2 of expanded) consider(value2);
    return keys.size ? keys : void 0;
  }, [mode, index, expanded, needsMoreRow]);
  const treeRows = React.useMemo(() => {
    if (mode !== 'tree') return [];
    const rows = flattenCascaderTree(index, expanded, treeSentinels);
    const normalized = normalizeCascaderQuery(query);
    if (!normalized) return rows;
    const keep = new Set();
    for (const node of index.all) {
      if (
        !(filter
          ? filter(node, normalized)
          : matchesCascaderQuery(node, normalized))
      ) {
        continue;
      }
      for (const ancestor of getCascaderPath(index, node.value)) {
        keep.add(ancestor.value);
      }
    }
    return flattenCascaderTree(
      index,
      new Set([...expanded, ...keep])
    ).filter((row) => keep.has(row.node.value));
  }, [mode, index, expanded, treeSentinels, query, filter]);
  const renderedItems = React.useMemo(
    () => (mode === 'tree' ? treeRows.map((row) => row.node) : levelRendered),
    [mode, treeRows, levelRendered]
  );
  const levelKey = currentParentValue ?? '';
  return { resolveNode, currentParent, currentLevelKey, deepResults, levelItems, columns, treeRows, renderedItems, levelKey };
}
export { useCascaderRows };
