'use client';
import { useState } from 'react';
import { resolveDataGridViewLabels } from '../dataGridViewLabels.jsx';
import { default as Button } from '../../Button/index.js';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderTrigger
} from '../../Cascader/Cascader.jsx';
import { CascaderItems } from '../../Cascader/components/CascaderItem.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav
} from '../../Cascader/components/CascaderNav.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
/**
 * A catalogue of columns a person can add at runtime, grouped for a Cascader.
 * Entries are `{ id, label, icon?, description?, keywords?, children? }`;
 * leaves also carry `column`, a TanStack column definition (its `id` defaults
 * to the entry id). The registry only describes columns: the host keeps the
 * list of added ids in state and builds its `columns` from it.
 */
export function createDataGridColumnRegistry(entries) {
  const leaves = new Map();
  const toNodes = (list, path = []) =>
    list.map((entry) => {
      const node = {
        value: entry.id,
        label: entry.label,
        icon: entry.icon,
        description: entry.description,
        keywords: entry.keywords
      };
      if (entry.children?.length) {
        node.children = toNodes(entry.children, [...path, entry.label]);
      } else {
        leaves.set(entry.id, {
          ...entry,
          path: [...path, entry.label],
          column: {
            header: entry.label,
            ...entry.column,
            id: entry.column?.id ?? entry.id,
            meta: { headerTitle: entry.label, ...entry.column?.meta }
          }
        });
      }
      return node;
    });
  const items = toNodes(entries);
  return {
    items,
    has: (id) => leaves.has(id),
    get: (id) => leaves.get(id) ?? null,
    getColumn: (id) => leaves.get(id)?.column ?? null,
    getColumns: (ids) =>
      ids.map((id) => leaves.get(id)?.column).filter(Boolean),
    /** Cascader items with already-added columns disabled. */
    itemsExcept(activeIds) {
      const active = new Set(activeIds);
      const mark = (nodes) =>
        nodes.map((node) =>
          node.children
            ? { ...node, children: mark(node.children) }
            : active.has(node.value)
              ? { ...node, disabled: true }
              : node
        );
      return mark(items);
    }
  };
}
/**
 * "Add column": a searchable Cascader over a column registry. Columns already
 * in the grid (`value`) are disabled; picking a leaf calls `onAdd(id, column)`
 * and the picker resets, ready for the next one.
 */
function DataGridColumnPicker({
  registry,
  value = [],
  onAdd,
  labels: labelsProp,
  trigger,
  align = 'end',
  disabled
}) {
  const labels = resolveDataGridViewLabels(labelsProp);
  const [message, setMessage] = useState('');
  return (
    <>
      <Cascader
        items={registry.itemsExcept(value)}
        value=''
        searchScope='deep'
        disabled={disabled}
        onValueChange={(next) => {
          if (!next || !registry.has(next)) return;
          const entry = registry.get(next);
          onAdd?.(next, entry.column);
          setMessage(labels.columnAdded(entry.label));
        }}
      >
        <CascaderTrigger
          aria-label={labels.addColumn}
          showIcon={false}
          render={
            trigger ?? (
              <Button variant='outline' size='sm' className='font-normal' />
            )
          }
        >
          <RegistryIcon lucide='PlusIcon' />
          <span className='max-sm:sr-only'>{labels.addColumn}</span>
        </CascaderTrigger>
        <CascaderContent align={align} className='w-72 max-w-[calc(100vw-1rem)]'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput placeholder={labels.addColumnSearch} />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
      <span role='status' className='sr-only'>
        {message}
      </span>
    </>
  );
}
export { DataGridColumnPicker };
