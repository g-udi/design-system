

export const CASCADER_ROOT_KEY = '\0root';
export const CASCADER_MORE_PREFIX = '\0more:';
export function createCascaderMoreNode(parentKey, loadedCount = 0) {
  return {
    value: `${CASCADER_MORE_PREFIX}${parentKey}`,
    // Empty on purpose: a typeahead letter must never reach the paging row.
    label: '',
    // Feeds the row's "Loading more..." wording, with no second prop to thread.
    count: loadedCount
  };
}
export function isCascaderMoreNode(node) {
  return node.value.startsWith(CASCADER_MORE_PREFIX);
}
export function getCascaderMoreParent(node) {
  if (!isCascaderMoreNode(node)) return null;
  return node.value.slice(CASCADER_MORE_PREFIX.length);
}
export function buildCascaderIndex(items, getParent) {
  const byValue = new Map();
  const childrenOf = new Map();
  const parentOf = new Map();
  const depthOf = new Map();
  const all = [];
  const push = (parentKey, node) => {
    const bucket = childrenOf.get(parentKey);
    if (bucket) {
      bucket.push(node);
    } else {
      childrenOf.set(parentKey, [node]);
    }
  };
  if (getParent) {
    for (const node of items ?? []) {
      if (node == null) {
        if (process.env.NODE_ENV !== 'production') {
          warnCascaderOnce(
            'nullish-entry',
            'Ignored a null or undefined entry in `items` or `children`. Check the arrays you pass in.'
          );
        }
        continue;
      }
      if (byValue.has(node.value)) continue;
      byValue.set(node.value, node);
      all.push(node);
    }
    for (const node of all) {
      const rawParent = getParent(node);
      const parent =
        rawParent != null && byValue.has(rawParent) ? rawParent : null;
      parentOf.set(node.value, parent);
      push(parent ?? CASCADER_ROOT_KEY, node);
    }
    for (const node of all) {
      let depth = 0;
      let cursor = parentOf.get(node.value) ?? null;
      const seen = new Set([node.value]);
      while (cursor != null && !seen.has(cursor)) {
        seen.add(cursor);
        depth += 1;
        cursor = parentOf.get(cursor) ?? null;
      }
      depthOf.set(node.value, depth);
    }
  } else {
    const walk = (nodes, parent, depth) => {
      for (const node of nodes ?? []) {
        if (node == null) {
          if (process.env.NODE_ENV !== 'production') {
            warnCascaderOnce(
              'nullish-entry',
              'Ignored a null or undefined entry in `items` or `children`. Check the arrays you pass in.'
            );
          }
          continue;
        }
        if (byValue.has(node.value)) continue;
        byValue.set(node.value, node);
        parentOf.set(node.value, parent);
        depthOf.set(node.value, depth);
        all.push(node);
        push(parent ?? CASCADER_ROOT_KEY, node);
        if (node.children?.length) walk(node.children, node.value, depth + 1);
      }
    };
    walk(items, null, 0);
  }
  return {
    byValue,
    childrenOf,
    parentOf,
    depthOf,
    roots: childrenOf.get(CASCADER_ROOT_KEY) ?? [],
    all
  };
}
export function mergeCascaderIndex(base, pages, detached) {
  if (pages.size === 0 && !detached?.size) return base;
  const byValue = new Map(base.byValue);
  const childrenOf = new Map(base.childrenOf);
  const parentOf = new Map(base.parentOf);
  const depthOf = new Map(base.depthOf);
  const copied = new Set();
  const append = (parentKey, node) => {
    let bucket = childrenOf.get(parentKey);
    if (!copied.has(parentKey)) {
      bucket = bucket ? bucket.slice() : [];
      childrenOf.set(parentKey, bucket);
      copied.add(parentKey);
    }
    bucket.push(node);
  };
  const insert = (parentKey, nodes) => {
    for (const node of nodes) {
      if (byValue.has(node.value)) continue;
      byValue.set(node.value, node);
      parentOf.set(
        node.value,
        parentKey === CASCADER_ROOT_KEY ? null : parentKey
      );
      append(parentKey, node);
      if (node.children?.length) insert(node.value, node.children);
    }
  };
  for (const [parentKey, nodes] of pages) insert(parentKey, nodes);
  for (const value of byValue.keys()) {
    if (depthOf.has(value)) continue;
    let depth = 0;
    let cursor = parentOf.get(value) ?? null;
    const seen = new Set([value]);
    while (cursor != null && !seen.has(cursor)) {
      seen.add(cursor);
      depth += 1;
      cursor = parentOf.get(cursor) ?? null;
    }
    depthOf.set(value, depth);
  }
  const roots = childrenOf.get(CASCADER_ROOT_KEY) ?? [];
  const all = [];
  const visited = new Set();
  const walk = (nodes) => {
    for (const node of nodes) {
      if (visited.has(node.value)) continue;
      visited.add(node.value);
      all.push(node);
      const children = childrenOf.get(node.value);
      if (children?.length) walk(children);
    }
  };
  walk(roots);
  for (const [value, node] of byValue) {
    if (visited.has(value)) continue;
    visited.add(value);
    all.push(node);
  }
  if (detached) {
    for (const [value, node] of detached) {
      if (byValue.has(value)) continue;
      byValue.set(value, node);
    }
  }
  return { byValue, childrenOf, parentOf, depthOf, roots, all };
}
export function getCascaderChildren(index, parent) {
  return index.childrenOf.get(parent ?? CASCADER_ROOT_KEY) ?? [];
}
export function isCascaderBranch(index, node) {
  if (node.hasChildren) return true;
  return (index.childrenOf.get(node.value)?.length ?? 0) > 0;
}
export function getCascaderCount(index, node) {
  if (typeof node.count === 'number') return node.count;
  return index.childrenOf.get(node.value)?.length ?? 0;
}
export function isCascaderSelectable(index, node, selectable) {
  if (isCascaderMoreNode(node)) return false;
  if (node.disabled) return false;
  {
    const seen = new Set([node.value]);
    let cursor = index.parentOf.get(node.value) ?? null;
    while (cursor != null && !seen.has(cursor)) {
      seen.add(cursor);
      if (index.byValue.get(cursor)?.disabled) return false;
      cursor = index.parentOf.get(cursor) ?? null;
    }
  }
  if (typeof selectable === 'function') return selectable(node);
  if (selectable === 'any') return true;
  return !isCascaderBranch(index, node);
}
export function getCascaderPath(index, value) {
  if (value == null) return [];
  const chain = [];
  const seen = new Set();
  let cursor = value;
  while (cursor != null && !seen.has(cursor)) {
    seen.add(cursor);
    const node = index.byValue.get(cursor);
    if (!node) break;
    chain.push(node);
    cursor = index.parentOf.get(cursor) ?? null;
  }
  return chain.reverse();
}
export function foldCascaderText(text) {
  return text.toLocaleLowerCase();
}
export function normalizeCascaderQuery(query) {
  return foldCascaderText(query.trim());
}
export function matchesCascaderQuery(node, normalized) {
  if (!normalized) return true;
  if (foldCascaderText(node.label ?? '').includes(normalized)) return true;
  if (node.keywords) {
    for (const keyword of node.keywords) {
      if (foldCascaderText(keyword).includes(normalized)) return true;
    }
  }
  return false;
}
export function filterCascaderLevel(
  nodes,
  query,
  matches = matchesCascaderQuery
) {
  const normalized = normalizeCascaderQuery(query);
  if (!normalized) return nodes;
  return nodes.filter((node) => matches(node, normalized));
}
export function searchCascaderDeep(index, query, options = {}) {
  const normalized = normalizeCascaderQuery(query);
  if (!normalized) return [];
  const { within, limit = 200, matches = matchesCascaderQuery } = options;
  const results = [];
  const ancestry = within == null ? null : new Map();
  const isWithin = (node) => {
    if (within == null || !ancestry) return true;
    const trail = [];
    let answer = false;
    let cursor = index.parentOf.get(node.value);
    while (cursor != null) {
      if (cursor === within) {
        answer = true;
        break;
      }
      const cached = ancestry.get(cursor);
      if (cached !== void 0) {
        answer = cached;
        break;
      }
      ancestry.set(cursor, false);
      trail.push(cursor);
      cursor = index.parentOf.get(cursor) ?? null;
    }
    if (answer) for (const value of trail) ancestry.set(value, true);
    return answer;
  };
  for (const node of index.all) {
    if (results.length >= limit) break;
    if (!matches(node, normalized)) continue;
    if (!isWithin(node)) continue;
    results.push(node);
  }
  return results;
}
export function flattenCascaderTree(index, expanded, sentinels) {
  const rows = [];
  const walk = (nodes, parentKey, depth) => {
    const sentinel = sentinels?.has(parentKey) ?? false;
    const setSize = nodes.length + (sentinel ? 1 : 0);
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const branch = isCascaderBranch(index, node);
      const isExpanded = branch && expanded.has(node.value);
      rows.push({
        node,
        depth,
        branch,
        expanded: isExpanded,
        setSize,
        posInSet: i + 1
      });
      if (isExpanded) {
        walk(index.childrenOf.get(node.value) ?? [], node.value, depth + 1);
      }
    }
    if (sentinel) {
      rows.push({
        node: createCascaderMoreNode(parentKey, nodes.length),
        depth,
        branch: false,
        expanded: false,
        setSize,
        posInSet: setSize
      });
    }
  };
  walk(index.roots, CASCADER_ROOT_KEY, 0);
  return rows;
}
export function collapseCascaderPath(path, options = {}) {
  const { maxSegments = 3, collapse = 'middle' } = options;
  const asNodes = (nodes) => nodes.map((node) => ({ type: 'node', node }));
  if (collapse === 'none' || maxSegments <= 0 || path.length <= maxSegments) {
    return asNodes(path);
  }
  if (collapse === 'start') {
    const tail2 = path.slice(path.length - maxSegments);
    return [
      { type: 'ellipsis', hidden: path.slice(0, path.length - maxSegments) },
      ...asNodes(tail2)
    ];
  }
  const head = path.slice(0, 1);
  const tailCount = maxSegments - 1;
  const tail = path.slice(path.length - tailCount);
  const hidden = path.slice(1, path.length - tailCount);
  if (hidden.length === 0) return asNodes(path);
  return [...asNodes(head), { type: 'ellipsis', hidden }, ...asNodes(tail)];
}
export function collectCascaderSubtree(index, value) {
  const root = index.byValue.get(value);
  if (!root) return [];
  const out = [];
  const seen = new Set();
  const walk = (node) => {
    if (seen.has(node.value)) return;
    seen.add(node.value);
    out.push(node);
    const children = index.childrenOf.get(node.value);
    if (children) for (const child of children) walk(child);
  };
  walk(root);
  return out;
}
export function applyCascadeSelection(
  index,
  selected,
  value,
  select,
  isSelectable = () => true
) {
  const next = new Set(selected);
  const subtree = collectCascaderSubtree(index, value);
  if (subtree.length === 0) {
    if (select) next.add(value);
    else next.delete(value);
  }
  for (const node of subtree) {
    if (node.value !== value && !isSelectable(node)) continue;
    if (select) next.add(node.value);
    else next.delete(node.value);
  }
  const seen = new Set([value]);
  let cursor = index.parentOf.get(value) ?? null;
  while (cursor != null && !seen.has(cursor)) {
    seen.add(cursor);
    const parent = index.byValue.get(cursor);
    const children = index.childrenOf.get(cursor) ?? [];
    const selectable = children.filter((child) => isSelectable(child));
    const full =
      selectable.length > 0 &&
      selectable.every((child) => next.has(child.value)) && // Never promote a node the consumer said may not be committed. Under
      // `selectable="leaf"` no branch qualifies, hence the `cascade` warning.
      !!parent &&
      isSelectable(parent);
    if (full) next.add(cursor);
    else next.delete(cursor);
    cursor = index.parentOf.get(cursor) ?? null;
  }
  return Array.from(next);
}
export function getCascaderSelectedDescendants(index, selected) {
  const counts = new Map();
  for (const value of selected) {
    const seen = new Set([value]);
    let cursor = index.parentOf.get(value) ?? null;
    while (cursor != null && !seen.has(cursor)) {
      seen.add(cursor);
      counts.set(cursor, (counts.get(cursor) ?? 0) + 1);
      cursor = index.parentOf.get(cursor) ?? null;
    }
  }
  return counts;
}
export function getCascaderIndeterminateFrom(counts, selected) {
  const selectedSet = new Set(selected);
  const partial = new Set();
  for (const [value, count] of counts) {
    if (count > 0 && !selectedSet.has(value)) partial.add(value);
  }
  return partial;
}
export function getCascaderIndeterminate(index, selected) {
  return getCascaderIndeterminateFrom(
    getCascaderSelectedDescendants(index, selected),
    selected
  );
}
export function getCascaderCheckedValues(index, selected, strategy) {
  if (strategy === 'all') return selected;
  const set = new Set(selected);
  if (strategy === 'parent') {
    return selected.filter((value) => {
      const parent = index.parentOf.get(value);
      return parent == null || !set.has(parent);
    });
  }
  return selected.filter((value) => {
    const children = index.childrenOf.get(value);
    if (!children?.length) return true;
    return !children.some((child) => set.has(child.value));
  });
}
export function findAmbiguousCascaderLabels(nodes) {
  const firstByLabel = new Map();
  const ambiguous = new Set();
  for (const node of nodes) {
    const first = firstByLabel.get(node.label);
    if (first === void 0) {
      firstByLabel.set(node.label, node.value);
      continue;
    }
    ambiguous.add(node.value);
    ambiguous.add(first);
  }
  return ambiguous;
}
const CASCADER_WARNED = new Set();
export function warnCascaderOnce(key, message) {
  if (process.env.NODE_ENV === 'production') return;
  if (CASCADER_WARNED.has(key)) return;
  CASCADER_WARNED.add(key);
  console.warn(`[Cascader] ${message}`);
}
export function resetCascaderWarnings() {
  CASCADER_WARNED.clear();
}
export function findCascaderDataIssues(items, getParent) {
  const seen = new Set();
  const duplicates = new Set();
  const flat = [];
  const visit = (nodes) => {
    for (const node of nodes ?? []) {
      if (node == null) continue;
      if (seen.has(node.value)) duplicates.add(node.value);
      else seen.add(node.value);
      flat.push(node);
      if (node.children?.length) visit(node.children);
    }
  };
  visit(items);
  const cycles = [];
  if (getParent) {
    const parentOf = new Map();
    for (const node of flat) {
      if (parentOf.has(node.value)) continue;
      const raw = getParent(node);
      parentOf.set(node.value, raw != null && seen.has(raw) ? raw : null);
    }
    for (const node of flat) {
      const walked = new Set([node.value]);
      let cursor = parentOf.get(node.value) ?? null;
      while (cursor != null) {
        if (walked.has(cursor)) {
          cycles.push(node.value);
          break;
        }
        walked.add(cursor);
        cursor = parentOf.get(cursor) ?? null;
      }
    }
  }
  return { duplicates: Array.from(duplicates), cycles };
}
