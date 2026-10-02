'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { getDataGridColumnOrder } from './data-grid-view-options-extended.jsx';
import {
  readDataGridState,
  resolveDataGridViewLabels,
  useDataGridStoreVersion
} from './data-grid-view-i18n-extended.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Label } from '../../Field/parts/label.jsx';
import { default as Input } from '../../Input/Input.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const LAYOUT_STORAGE_VERSION = 1;
function normalizePinning(pinning) {
  const value = pinning ?? {};
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((side) => [side, [...(value[side] ?? [])]])
  );
}
/**
 * Snapshots what a person changes about a grid's shape: column order (the full
 * resolved order), sizing, visibility and pinning, plus any `extra` view state
 * such as density. Data, sorting and filters are not part of a layout.
 */
export function getDataGridLayout(table, extra = {}) {
  return {
    columnOrder: getDataGridColumnOrder(table),
    columnSizing: { ...(readDataGridState(table, 'columnSizing') ?? {}) },
    columnVisibility: {
      ...(readDataGridState(table, 'columnVisibility') ?? {})
    },
    columnPinning: normalizePinning(readDataGridState(table, 'columnPinning')),
    ...extra
  };
}
/** Applies every slice a layout carries; slices it omits keep their state. */
export function applyDataGridLayout(table, layout) {
  if (!layout) return;
  if (layout.columnOrder) table.setColumnOrder([...layout.columnOrder]);
  if (layout.columnSizing) table.setColumnSizing({ ...layout.columnSizing });
  if (layout.columnVisibility)
    table.setColumnVisibility({ ...layout.columnVisibility });
  if (layout.columnPinning)
    table.setColumnPinning(normalizePinning(layout.columnPinning));
}
function canonicalLayout(layout, columnIds) {
  if (!layout) return '';
  const known = (id) => !columnIds || columnIds.includes(id);
  const visibility = Object.entries(layout.columnVisibility ?? {})
    .filter(([id, visible]) => visible === false && known(id))
    .map(([id]) => id)
    .sort();
  const sizing = Object.entries(layout.columnSizing ?? {})
    .filter(([id]) => known(id))
    .sort(([a], [b]) => a.localeCompare(b));
  const pinning = Object.entries(normalizePinning(layout.columnPinning)).map(
    ([side, ids]) => [side, ids.filter(known)]
  );
  const rest = Object.entries(layout)
    .filter(
      ([key]) =>
        !['columnOrder', 'columnSizing', 'columnVisibility', 'columnPinning'].includes(key)
    )
    .sort(([a], [b]) => a.localeCompare(b));
  // A partial order means "these first"; the grid appends the rest in leaf order.
  const order = (layout.columnOrder ?? []).filter(known);
  if (columnIds) order.push(...columnIds.filter((id) => !order.includes(id)));
  return JSON.stringify([
    order,
    visibility,
    sizing,
    pinning.filter(([, ids]) => ids.length),
    rest
  ]);
}
/**
 * Two layouts match when they would render the same grid: a column shown by
 * default equals one explicitly set visible, and slices for columns the grid
 * no longer has are ignored.
 */
export function isSameDataGridLayout(a, b, columnIds) {
  return canonicalLayout(a, columnIds) === canonicalLayout(b, columnIds);
}
function readStoredLayouts(storageKey) {
  if (!storageKey || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.version === LAYOUT_STORAGE_VERSION ? parsed : null;
  } catch {
    return null;
  }
}
function writeStoredLayouts(storageKey, value) {
  if (!storageKey || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ version: LAYOUT_STORAGE_VERSION, ...value })
    );
  } catch {
    // Private mode or a full quota: the layouts still work for this session.
  }
}
function createLayoutId(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug || 'layout'}-${Date.now().toString(36)}`;
}
/**
 * Named grid layouts: save, apply, delete and reset. Saved layouts are
 * controlled (`layouts` + `onLayoutsChange`) or uncontrolled
 * (`defaultLayouts`); `storageKey` also keeps them, and the current layout, in
 * localStorage. Density joins the layout when `onDensityChange` is given.
 */
export function useDataGridLayouts({
  table,
  density,
  onDensityChange,
  defaultLayout: defaultLayoutProp,
  layouts: layoutsProp,
  defaultLayouts = [],
  onLayoutsChange,
  storageKey,
  labels: labelsProp
}) {
  useDataGridStoreVersion(table);
  const labels = resolveDataGridViewLabels(labelsProp);
  const [uncontrolledLayouts, setUncontrolledLayouts] = useState(defaultLayouts);
  const layouts = layoutsProp ?? uncontrolledLayouts;
  const layoutsRef = useRef(layouts);
  layoutsRef.current = layouts;
  const tracksDensity = typeof onDensityChange === 'function';
  const extra = tracksDensity ? { density } : {};
  const current = getDataGridLayout(table, extra);
  const [initialLayout] = useState(() => {
    const initial = table.initialState ?? {};
    const leafIds = table.getAllLeafColumns().map((column) => column.id);
    const order = (initial.columnOrder ?? []).length
      ? initial.columnOrder
      : leafIds;
    return {
      columnOrder: [...order, ...leafIds.filter((id) => !order.includes(id))],
      columnSizing: { ...(initial.columnSizing ?? {}) },
      columnVisibility: { ...(initial.columnVisibility ?? {}) },
      columnPinning: normalizePinning(initial.columnPinning),
      ...extra
    };
  });
  const defaultLayout = defaultLayoutProp ?? initialLayout;
  const columnIds = table.getAllLeafColumns().map((column) => column.id);
  const setLayouts = useCallback(
    (updater) => {
      const next =
        typeof updater === 'function' ? updater(layoutsRef.current) : updater;
      layoutsRef.current = next;
      if (layoutsProp === undefined) setUncontrolledLayouts(next);
      onLayoutsChange?.(next);
    },
    [layoutsProp, onLayoutsChange]
  );
  const [message, setMessage] = useState('');
  const apply = useCallback(
    (layout) => {
      applyDataGridLayout(table, layout);
      if (tracksDensity && layout?.density !== undefined)
        onDensityChange(layout.density);
    },
    [table, tracksDensity, onDensityChange]
  );
  // Restore once on mount, after hydration, so server and first client render agree.
  const restoredRef = useRef(!storageKey);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const stored = readStoredLayouts(storageKey);
    if (!stored) return;
    if (Array.isArray(stored.layouts) && layoutsProp === undefined)
      setLayouts(stored.layouts);
    if (stored.current) apply(stored.current);
    // Mount-only: later prop changes must not re-apply the stored layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const currentKey = canonicalLayout(current);
  useEffect(() => {
    if (!storageKey || !restoredRef.current) return;
    writeStoredLayouts(storageKey, { layouts, current });
    // `currentKey` stands for `current`, which is rebuilt every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, layouts, currentKey]);
  const activeLayout =
    layouts.find((entry) => isSameDataGridLayout(entry.layout, current, columnIds)) ??
    null;
  const isDefault = isSameDataGridLayout(defaultLayout, current, columnIds);
  return {
    layouts,
    current,
    defaultLayout,
    activeLayout,
    isDefault,
    message,
    saveLayout(name) {
      const trimmed = String(name ?? '').trim();
      if (!trimmed) return null;
      const existing = layoutsRef.current.find(
        (entry) => entry.name.toLowerCase() === trimmed.toLowerCase()
      );
      const entry = {
        id: existing?.id ?? createLayoutId(trimmed),
        name: trimmed,
        layout: getDataGridLayout(table, extra)
      };
      setLayouts((old) =>
        existing
          ? old.map((item) => (item.id === existing.id ? entry : item))
          : [...old, entry]
      );
      setMessage(labels.layoutSaved(trimmed));
      return entry;
    },
    applyLayout(id) {
      const entry = layoutsRef.current.find((item) => item.id === id);
      if (!entry) return;
      apply(entry.layout);
      setMessage(labels.layoutApplied(entry.name));
    },
    deleteLayout(id) {
      const entry = layoutsRef.current.find((item) => item.id === id);
      if (!entry) return;
      setLayouts((old) => old.filter((item) => item.id !== id));
      setMessage(labels.layoutDeleted(entry.name));
    },
    resetLayout() {
      apply(defaultLayout);
      setMessage(labels.layoutReset);
    }
  };
}
/**
 * The saved-layouts menu: apply or delete a named layout, save the current
 * one under a name, and reset to the default. Drive it with the object
 * `useDataGridLayouts` returns.
 */
function DataGridLayouts({
  layouts: api,
  trigger,
  align = 'end',
  labels: labelsProp,
  className
}) {
  const labels = resolveDataGridViewLabels(labelsProp);
  const [name, setName] = useState('');
  const inputId = useId();
  const titleId = useId();
  const active = api.activeLayout;
  const triggerLabel =
    active?.name ?? (api.isDefault ? labels.defaultLayout : labels.customLayout);
  const modified = !active && !api.isDefault;
  const items = api.layouts;
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button
            variant='outline'
            size='sm'
            aria-label={`${labels.layouts}: ${triggerLabel}${modified ? `, ${labels.layoutModified}` : ''}`}
          >
            <RegistryIcon lucide={active ? 'BookmarkCheckIcon' : 'BookmarkIcon'} />
            <span className='max-w-28 truncate max-sm:sr-only'>{triggerLabel}</span>
            {modified ? (
              <span aria-hidden='true' className='bg-ui-primary size-1.5 rounded-full' />
            ) : null}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        collisionPadding={8}
        aria-labelledby={titleId}
        className={cn('flex w-72 max-w-[calc(100vw-1rem)] flex-col gap-3', className)}
      >
        <h2 id={titleId} className='text-ui-muted-foreground text-xs font-medium'>
          {labels.layoutsTitle}
        </h2>
        {items.length ? (
          <ul aria-labelledby={titleId} className='-mx-1 flex flex-col'>
            {items.map((entry) => {
              const isActive = active?.id === entry.id;
              return (
                <li key={entry.id} className='flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    aria-pressed={isActive}
                    aria-label={labels.applyLayout(entry.name)}
                    onClick={() => api.applyLayout(entry.id)}
                    className='min-w-0 flex-1 justify-start font-normal'
                  >
                    <RegistryIcon
                      lucide='CheckIcon'
                      className={cn('size-3.5', !isActive && 'invisible')}
                    />
                    <span className='truncate'>{entry.name}</span>
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    aria-label={labels.deleteLayout(entry.name)}
                    title={labels.deleteLayout(entry.name)}
                    onClick={() => api.deleteLayout(entry.id)}
                  >
                    <RegistryIcon lucide='Trash2Icon' />
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className='text-ui-muted-foreground text-sm'>{labels.layoutsEmpty}</p>
        )}
        <form
          className='flex flex-col gap-1.5'
          onSubmit={(event) => {
            event.preventDefault();
            if (api.saveLayout(name)) setName('');
          }}
        >
          <Label htmlFor={inputId} className='text-xs font-medium'>
            {labels.layoutName}
          </Label>
          <div className='flex items-center gap-2'>
            <Input
              id={inputId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={labels.layoutNamePlaceholder}
              className='min-w-0 flex-1'
              autoComplete='off'
            />
            <Button type='submit' size='sm' disabled={!name.trim()}>
              <RegistryIcon lucide='SaveIcon' />
              {labels.saveLayout}
            </Button>
          </div>
        </form>
        <div className='border-ui-border flex items-center justify-between gap-2 border-t pt-3'>
          <span className='text-ui-muted-foreground min-w-0 truncate text-xs'>
            {modified ? labels.layoutModified : ''}
          </span>
          <Button
            variant='ghost'
            size='sm'
            disabled={api.isDefault}
            onClick={api.resetLayout}
          >
            <RegistryIcon lucide='RotateCcwIcon' />
            {labels.resetLayout}
          </Button>
        </div>
        <span role='status' className='sr-only'>
          {api.message}
        </span>
      </PopoverContent>
    </Popover>
  );
}
export { DataGridLayouts };
