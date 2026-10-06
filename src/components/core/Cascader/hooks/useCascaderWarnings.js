'use client';
import * as React from 'react';
import { findCascaderDataIssues, warnCascaderOnce } from '../cascaderModel.jsx';
function useCascaderDevWarnings(options) {
  const {
    items,
    getParent,
    mode,
    multiple,
    cascade,
    indicator,
    selectable,
    searchScope,
    max,
    value,
    defaultValue,
    hasExpanded,
    hasPath,
    hasOnSearch
  } = options;
  const issues = React.useMemo(
    () =>
      process.env.NODE_ENV === 'production'
        ? null
        : findCascaderDataIssues(items, getParent),
    [items, getParent]
  );
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    for (const duplicate of issues?.duplicates ?? []) {
      warnCascaderOnce(
        `duplicate-value:${duplicate}`,
        `Duplicate node value ${JSON.stringify(duplicate)}. \`value\` is the selection key, so only the first occurrence is indexed and the rest never render.`
      );
    }
    for (const cycle of issues?.cycles ?? []) {
      warnCascaderOnce(
        `cycle:${cycle}`,
        `\`getParent\` puts ${JSON.stringify(cycle)} on a cycle. The depth walk is cycle-guarded so nothing hangs, but every depth on that chain is clamped rather than derived.`
      );
    }
  }, [issues]);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    for (const [prop, current] of [
      ['value', value],
      ['defaultValue', defaultValue]
    ]) {
      if (current == null) continue;
      if (multiple && !Array.isArray(current)) {
        warnCascaderOnce(
          `value-shape:multiple:${prop}`,
          `\`multiple\` is set but \`${prop}\` is a string. Multi-select reads and writes a \`string[]\`; a string is treated as no selection at all.`
        );
      } else if (!multiple && Array.isArray(current)) {
        warnCascaderOnce(
          `value-shape:single:${prop}`,
          `\`${prop}\` is an array but \`multiple\` is not set. Single-select reads and writes a \`string\`; only the first entry would survive a commit.`
        );
      }
    }
    if (cascade && !multiple) {
      warnCascaderOnce(
        'cascade-without-multiple',
        '`cascade` does nothing without `multiple`: a single selection has no subtree to propagate over.'
      );
    }
    if (cascade && selectable === 'leaf') {
      warnCascaderOnce(
        'cascade-with-leaf-selectable',
        '`cascade` does nothing while `selectable="leaf"`: no branch can be committed, so no commit ever has a subtree under it. Pass `selectable="any"` or a predicate that accepts branches.'
      );
    }
    if (!indicator && multiple) {
      warnCascaderOnce(
        'indicator-false-with-multiple',
        '`indicator={false}` does nothing with `multiple`: the checkbox is the selection control rather than a decoration, so it and its gutter stay. Mark selection your own way from `data-selected` on the row, and drop the prop.'
      );
    }
    if (max != null && !multiple) {
      warnCascaderOnce(
        'max-without-multiple',
        '`max` does nothing without `multiple`: there is only ever one selection to cap.'
      );
    }
    if (hasExpanded && mode !== 'tree') {
      warnCascaderOnce(
        `expanded-outside-tree:${mode}`,
        `\`expanded\` only does something in \`mode="tree"\`, and this cascader is in \`mode="${mode}"\`. Drill and columns navigate with \`path\`.`
      );
    }
    if (hasPath && mode === 'tree') {
      warnCascaderOnce(
        'path-in-tree',
        '`path` does nothing in `mode="tree"`: branches expand in place rather than replacing the level. Use `expanded`.'
      );
    }
    if (searchScope === 'deep' && mode === 'tree') {
      warnCascaderOnce(
        'deep-search-in-tree',
        '`searchScope="deep"` does nothing in `mode="tree"`: a tree query already matches at any depth and auto-expands the ancestors of every hit.'
      );
    }
    if (hasOnSearch && mode === 'tree') {
      warnCascaderOnce(
        'onsearch-in-tree',
        '`onSearch` does nothing in `mode="tree"`: a tree query filters the loaded tree in place, and a server hit belongs to no visible branch, so its results would never render. The request is not fired. Filter the tree locally, or use drill or columns for server search.'
      );
    }
  }, [
    mode,
    multiple,
    cascade,
    indicator,
    selectable,
    searchScope,
    max,
    value,
    defaultValue,
    hasExpanded,
    hasPath,
    hasOnSearch
  ]);
}
export { useCascaderDevWarnings };
