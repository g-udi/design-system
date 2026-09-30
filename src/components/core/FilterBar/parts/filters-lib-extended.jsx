// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { collapseCascaderPath } from '../../Cascader/parts/cascader-lib-extended.jsx';
export const FILTER_MENU_CLASS =
  'w-max min-w-32 max-w-[min(24rem,calc(100vw-2rem))] [&_[data-slot=dropdown-menu-item]]:min-w-0';
export const FILTER_MENU_LABEL_CLASS = 'min-w-0 truncate';
export const FILTER_FIELD_PICKER_CLASS = 'w-auto min-w-56 p-0';
export const FILTER_ROOT_KEY = '\0root';
const PATH_SEPARATOR = '\0';
export function joinFilterPath(path) {
  return path.join(PATH_SEPARATOR);
}
export function splitFilterPath(key) {
  return key === '' ? [] : key.split(PATH_SEPARATOR);
}
export function parentFilterKey(path) {
  return path.length <= 1 ? FILTER_ROOT_KEY : joinFilterPath(path.slice(0, -1));
}
export function computeFilterSchemaSignature(fields) {
  const parts = [];
  const walk = (list, depth) => {
    for (const field of list) {
      parts.push(
        depth +
          ':' +
          field.id +
          '|' +
          (field.label ?? '') +
          '|' +
          (field.type ?? '') +
          '|' +
          (field.defaultOperator ?? '') +
          '|' +
          (field.column ?? '') +
          '|' +
          (field.selectable ? '1' : '0') +
          (field.disabled ? '1' : '0') +
          (field.icon ? '1' : '0') +
          (field.renderValue ? '1' : '0') +
          (field.loadOptions ? '1' : '0') +
          (field.resolveValues ? '1' : '0') +
          '|' +
          (typeof field.editor === 'string'
            ? field.editor
            : field.editor
              ? 'fn'
              : '') +
          '|' +
          (field.keywords?.join(',') ?? '') +
          '|' +
          (field.count ?? '') +
          '|' + // Options are part of the shape, and `exclusive` rides along: it
          // decides what a pick DOES, so turning it on must force a rebuild.
          (field.options
            ? field.options
                .map(
                  (option) =>
                    option.value +
                    '~' +
                    option.label +
                    (option.exclusive ? '~x' : '')
                )
                .join(',')
            : '') +
          '|' +
          (Array.isArray(field.operators)
            ? field.operators.map((operator) => operator.value).join(',')
            : field.operators
              ? 'fn'
              : '')
      );
      if (field.fields?.length) walk(field.fields, depth + 1);
    }
  };
  walk(fields, 0);
  return parts.join('\n');
}
const EMPTY_INDEX = {
  byPath: /* @__PURE__ */ new Map(),
  childrenOf: /* @__PURE__ */ new Map(),
  parentOf: /* @__PURE__ */ new Map(),
  all: [],
  roots: [],
  signature: ''
};
export function buildFilterIndex(fields, previous, precomputedSignature) {
  const signature =
    precomputedSignature ?? computeFilterSchemaSignature(fields);
  if (previous && previous.signature === signature) return previous;
  if (fields.length === 0) {
    return { ...EMPTY_INDEX, signature };
  }
  const byPath = /* @__PURE__ */ new Map();
  const childrenOf = /* @__PURE__ */ new Map();
  const parentOf = /* @__PURE__ */ new Map();
  const all = [];
  const roots = [];
  const walk = (list, parentPath, parentKey) => {
    const accepted = [];
    const seen = /* @__PURE__ */ new Set();
    for (const field of list) {
      if (seen.has(field.id)) continue;
      seen.add(field.id);
      const path = [...parentPath, field.id];
      const key = joinFilterPath(path);
      if (byPath.has(key)) continue;
      byPath.set(key, field);
      parentOf.set(key, parentKey === FILTER_ROOT_KEY ? '' : parentKey);
      all.push({ field, path });
      accepted.push(field);
      if (field.fields?.length) walk(field.fields, path, key);
    }
    childrenOf.set(parentKey, accepted);
    if (parentKey === FILTER_ROOT_KEY) roots.push(...accepted);
  };
  walk(fields, [], FILTER_ROOT_KEY);
  return { byPath, childrenOf, parentOf, all, roots, signature };
}
export function getFilterField(index, path) {
  return index.byPath.get(joinFilterPath(path));
}
export function getFilterFieldChain(index, path) {
  const chain = [];
  for (let i = 1; i <= path.length; i++) {
    const field = index.byPath.get(joinFilterPath(path.slice(0, i)));
    if (!field) break;
    chain.push(field);
  }
  return chain;
}
export function getFilterChildren(index, path) {
  const key = path.length === 0 ? FILTER_ROOT_KEY : joinFilterPath(path);
  return index.childrenOf.get(key) ?? [];
}
export function isFilterBranch(field) {
  return Boolean(field.fields?.length);
}
export function isFilterFieldSelectable(field) {
  if (field.disabled) return false;
  return isFilterBranch(field) ? Boolean(field.selectable) : true;
}
export function isFilterFieldPickable(field) {
  if (field.disabled) return false;
  return !isFilterBranch(field);
}
export function getFilterFieldCount(field) {
  return field.count ?? field.fields?.length ?? 0;
}
export function formatFilterPath(index, path, separator) {
  const chain = getFilterFieldChain(index, path);
  if (chain.length === 0) return path.join(separator);
  return chain.map((field) => field.label).join(separator);
}
export function collapseFilterPath(chain, options = {}) {
  const segments = collapseCascaderPath(
    chain.map((field, index) => ({ value: String(index), label: field.label })),
    { maxSegments: options.maxSegments, collapse: options.collapse ?? 'none' }
  );
  return segments.map((segment) =>
    segment.type === 'node'
      ? { type: 'field', field: chain[Number(segment.node.value)] }
      : {
          type: 'ellipsis',
          hidden: segment.hidden.map((node) => chain[Number(node.value)])
        }
  );
}
export function filterCombinatorSlot(index) {
  if (index === 0) return 'where';
  return index === 1 ? 'toggle' : 'echo';
}
export function foldFilterText(text) {
  return text.toLocaleLowerCase();
}
export function normalizeFilterQuery(query) {
  return foldFilterText(query.trim());
}
export function matchesFilterQuery(field, normalizedQuery) {
  if (normalizedQuery === '') return true;
  if (foldFilterText(field.label).includes(normalizedQuery)) return true;
  if (field.keywords) {
    for (const keyword of field.keywords) {
      if (foldFilterText(keyword).includes(normalizedQuery)) return true;
    }
  }
  return false;
}
export function filterFilterLevel(fields, normalizedQuery) {
  if (normalizedQuery === '') return fields;
  return fields.filter((field) => matchesFilterQuery(field, normalizedQuery));
}
export function searchFilterDeep(index, normalizedQuery, limit = 200) {
  if (normalizedQuery === '') return [];
  const results = [];
  for (const entry of index.all) {
    if (results.length >= limit) break;
    if (!isFilterFieldSelectable(entry.field)) continue;
    if (matchesFilterQuery(entry.field, normalizedQuery)) results.push(entry);
  }
  return results;
}
export function filterFilterOptions(options, normalizedQuery) {
  if (normalizedQuery === '') return options;
  return options.filter((option) => {
    if (foldFilterText(option.label).includes(normalizedQuery)) return true;
    if (option.keywords) {
      for (const keyword of option.keywords) {
        if (foldFilterText(keyword).includes(normalizedQuery)) return true;
      }
    }
    return false;
  });
}
export function applyFilterExclusiveSelection(next, previous, isExclusive) {
  const held = new Set(previous);
  const added = next.filter((value) => !held.has(value));
  if (added.length === 0) return next;
  let arrived = null;
  for (const value of added) {
    if (isExclusive(value)) arrived = value;
  }
  if (arrived !== null) return [arrived];
  const kept = next.filter((value) => !isExclusive(value));
  return kept.length === next.length ? next : kept;
}
export function createFilterIdFactory(seed) {
  let counter = 0;
  return () => {
    counter += 1;
    return `${seed}${counter}`;
  };
}
const warned = /* @__PURE__ */ new Set();
export function warnFilterOnce(key, message) {
  if (process.env.NODE_ENV === 'production') return;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[filters] ${message}`);
}
export function resetFilterWarnings() {
  warned.clear();
}
export function findFilterSchemaIssues(fields, resolveOperators) {
  const duplicatePaths = [];
  const emptyIds = [];
  const emptyBranches = [];
  const unknownDefaultOperators = [];
  const walk = (list, parentPath) => {
    const seen = /* @__PURE__ */ new Set();
    for (const field of list) {
      const label = [...parentPath, field.id].join('.');
      if (!field.id) emptyIds.push(label);
      else if (seen.has(field.id)) duplicatePaths.push(label);
      seen.add(field.id);
      if (field.selectable && field.fields && field.fields.length === 0) {
        emptyBranches.push(label);
      }
      if (field.defaultOperator) {
        const operators = resolveOperators(field);
        if (!operators.some((op) => op.value === field.defaultOperator)) {
          unknownDefaultOperators.push(`${label} -> ${field.defaultOperator}`);
        }
      }
      if (field.fields?.length) walk(field.fields, [...parentPath, field.id]);
    }
  };
  walk(fields, []);
  return { duplicatePaths, emptyIds, emptyBranches, unknownDefaultOperators };
}
