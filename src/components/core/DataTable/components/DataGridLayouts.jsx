'use client';
import { useControllableState } from '../../../../hooks/state/use-controllable-state.js';
import { localStorageStore } from '../../../../hooks/data/storage-model.js';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  useDataGridStoreVersion
} from '../dataGridViewLabels.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Label } from '../../Field/Label.jsx';
import { default as Input } from '../../Input/Input.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/PopoverPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { resolveDataGridViewLabels, getDataGridLayout, applyDataGridLayout, isSameDataGridLayout, normalizeDataGridPinning as normalizePinning, canonicalDataGridLayout as canonicalLayout } from '../dataGridViewModel.js';
const LAYOUT_STORAGE_VERSION = 1;
function readStoredLayouts(storageKey) {
  if (!storageKey) return null;
  try {
    const raw = localStorageStore.get(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.version === LAYOUT_STORAGE_VERSION ? parsed : null;
  } catch {
    return null;
  }
}
// The shared store falls back to memory when storage refuses the write.
function writeStoredLayouts(storageKey, value) {
  if (!storageKey) return;
  localStorageStore.set(
    storageKey,
    JSON.stringify({ version: LAYOUT_STORAGE_VERSION, ...value })
  );
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
  const [layouts, setLayouts] = useControllableState({ value: layoutsProp, defaultValue: defaultLayouts, onChange: onLayoutsChange });
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
  const contentRef = useRef(null);
  const nameRef = useRef(null);
  const pendingDeleteFocus = useRef(null);
  useEffect(() => {
    const pending = pendingDeleteFocus.current;
    if (!pending || items.some((item) => item.id === pending.id)) return;
    pendingDeleteFocus.current = null;
    const activeElement = pending.trigger.ownerDocument.activeElement;
    if (activeElement !== pending.trigger && activeElement !== pending.trigger.ownerDocument.body) return;
    const buttons = contentRef.current?.querySelectorAll('[data-layout-delete]');
    (buttons?.[Math.min(pending.index, buttons.length - 1)] ?? nameRef.current)?.focus();
  }, [items]);
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
        ref={contentRef}
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
            {items.map((entry, index) => {
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
                    data-layout-delete=''
                    onClick={(event) => {
                      pendingDeleteFocus.current = { id: entry.id, index, trigger: event.currentTarget };
                      api.deleteLayout(entry.id);
                    }}
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
              ref={nameRef}
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
