'use client';
import { useEffect, useId, useRef, useState } from 'react';
import {
  useDataGrid
} from '../DataGrid.jsx';
import {
  useDataGridStoreVersion,
  useDataGridViewLabels
} from '../dataGridViewLabels.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Checkbox } from '../../Checkbox/CheckboxPrimitives.jsx';
import { Label } from '../../Field/Label.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/PopoverPrimitives.jsx';
import { Switch } from '../../Switch/SwitchPrimitives.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../ToggleGroup/ToggleGroupPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { getColumnHeaderLabel, toDataGridDomId } from '../dataGridModel.js';
import { getDataGridColumnOrder, moveDataGridColumn } from '../dataGridViewModel.js';
function DataGridViewOptionsSection({ title, children, className, action }) {
  const headingId = useId();
  return (
    <section
      data-slot='data-grid-view-options-section'
      aria-labelledby={headingId}
      className={cn('flex flex-col gap-2 py-3 first:pt-0 last:pb-0', className)}
    >
      <div className='flex min-h-6 items-center justify-between gap-2'>
        <h3
          id={headingId}
          className='text-ui-muted-foreground text-xs font-medium'
        >
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}
function DataGridViewOptionsDensity({ value, onValueChange, options, labels }) {
  const text = useDataGridViewLabels(labels);
  const items = options ?? [
    { value: 'comfortable', label: text.densityComfortable },
    { value: 'compact', label: text.densityCompact }
  ];
  return (
    <DataGridViewOptionsSection title={text.density}>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        spacing={0}
        value={value}
        onValueChange={(next) => next && onValueChange?.(next)}
        aria-label={text.density}
        className='w-full'
      >
        {items.map((item) => (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            className='flex-1'
          >
            {item.icon}
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </DataGridViewOptionsSection>
  );
}
function DataGridViewOptionsSwitch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled
}) {
  const id = useId();
  const descriptionId = useId();
  return (
    <div className='flex items-start justify-between gap-3'>
      <div className='flex min-w-0 flex-col gap-0.5'>
        <Label htmlFor={id} className='text-sm'>
          {label}
        </Label>
        {description ? (
          <p id={descriptionId} className='text-ui-muted-foreground text-xs'>
            {description}
          </p>
        ) : null}
      </div>
      <Switch
        id={id}
        size='sm'
        checked={!!checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-describedby={description ? descriptionId : void 0}
      />
    </div>
  );
}
function DataGridViewOptionsColumns({ reorderable = true, labels, title }) {
  const { table } = useDataGrid();
  const text = useDataGridViewLabels(labels);
  useDataGridStoreVersion(table);
  const [announcement, setAnnouncement] = useState('');
  const pendingFocusRef = useRef(null);
  const listRef = useRef(null);
  const baseId = useId();
  const order = getDataGridColumnOrder(table);
  const columns = order
    .map((id) => table.getColumn(id))
    .filter((column) => column && column.getCanHide());
  const listedIds = columns.map((column) => column.id);
  const hiddenCount = columns.filter((column) => !column.getIsVisible()).length;
  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending || !listRef.current) return;
    pendingFocusRef.current = null;
    const query = (direction) =>
      listRef.current.querySelector(
        `[data-column-move="${CSS.escape(`${pending.id}:${direction}`)}"]:not(:disabled)`
      );
    (query(pending.direction) ?? query(pending.direction === 'up' ? 'down' : 'up'))?.focus();
  });
  const move = (column, delta) => {
    const next = moveDataGridColumn(table, column.id, delta, listedIds);
    if (!next) return;
    const position = next.filter((id) => listedIds.includes(id)).indexOf(column.id) + 1;
    pendingFocusRef.current = { id: column.id, direction: delta < 0 ? 'up' : 'down' };
    setAnnouncement(
      text.columnMoved(getColumnHeaderLabel(column), position, listedIds.length)
    );
  };
  return (
    <DataGridViewOptionsSection
      title={title ?? text.columnsSection}
      action={
        hiddenCount > 0 ? (
          <Button
            variant='ghost'
            size='xs'
            onClick={() =>
              table.setColumnVisibility((old) => ({
                ...old,
                ...Object.fromEntries(listedIds.map((id) => [id, true]))
              }))
            }
          >
            {text.showAllColumns}
          </Button>
        ) : null
      }
    >
      <ul
        ref={listRef}
        aria-label={title ?? text.columnsSection}
        className='-mx-1 flex flex-col'
      >
        {columns.map((column, index) => {
          const label = getColumnHeaderLabel(column);
          const isPinned = !!column.getIsPinned();
          const canMove = reorderable && !isPinned;
          const checkboxId = `${baseId}-${toDataGridDomId(column.id)}`;
          return (
            <li
              key={column.id}
              data-column-id={column.id}
              onKeyDown={(event) => {
                if (!canMove || !event.altKey) return;
                if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
                event.preventDefault();
                move(column, event.key === 'ArrowUp' ? -1 : 1);
              }}
              className='hover:bg-ui-muted/60 flex min-h-8 items-center gap-2 rounded-sm px-1'
            >
              <Checkbox
                id={checkboxId}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              />
              <Label
                htmlFor={checkboxId}
                className='min-w-0 flex-1 truncate py-1 text-sm'
              >
                {label}
              </Label>
              {isPinned ? (
                <span className='text-ui-muted-foreground inline-flex items-center gap-1 text-xs'>
                  <RegistryIcon lucide='PinIcon' className='size-3' />
                  {text.columnPinned}
                </span>
              ) : null}
              {reorderable ? (
                <span className='flex shrink-0 items-center'>
                  <Button
                    variant='ghost'
                    size='icon-xs'
                    data-column-move={`${column.id}:up`}
                    disabled={!canMove || index === 0}
                    aria-label={text.moveColumnUp(label)}
                    title={text.moveColumnUp(label)}
                    onClick={() => move(column, -1)}
                  >
                    <RegistryIcon lucide='ChevronUpIcon' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon-xs'
                    data-column-move={`${column.id}:down`}
                    disabled={!canMove || index === columns.length - 1}
                    aria-label={text.moveColumnDown(label)}
                    title={text.moveColumnDown(label)}
                    onClick={() => move(column, 1)}
                  >
                    <RegistryIcon lucide='ChevronDownIcon' />
                  </Button>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <span role='status' className='sr-only'>
        {announcement}
      </span>
    </DataGridViewOptionsSection>
  );
}
/**
 * One popover for how the grid looks: density, the sticky header, extra row
 * toggles, and which columns show in what order. Pass `children` to compose
 * your own sections from the exported parts.
 */
function DataGridViewOptions({
  trigger,
  density,
  onDensityChange,
  headerSticky,
  onHeaderStickyChange,
  toggles,
  columns = true,
  reorderable = true,
  onReset,
  align = 'end',
  labels,
  className,
  open,
  defaultOpen,
  onOpenChange,
  children
}) {
  const text = useDataGridViewLabels(labels);
  const titleId = useId();
  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button variant='outline' size='sm'>
            <RegistryIcon lucide='SlidersHorizontalIcon' />
            <span className='max-sm:sr-only'>{text.viewOptions}</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        collisionPadding={8}
        aria-labelledby={titleId}
        className={cn(
          'flex max-h-[min(36rem,var(--radix-popover-content-available-height))] w-80 max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-y-auto',
          className
        )}
      >
        <h2 id={titleId} className='sr-only'>
          {text.viewOptionsTitle}
        </h2>
        <div className='divide-ui-border flex flex-col divide-y'>
          {children ?? (
            <>
              {onDensityChange ? (
                <DataGridViewOptionsDensity
                  value={density}
                  onValueChange={onDensityChange}
                  labels={labels}
                />
              ) : null}
              {onHeaderStickyChange || toggles?.length ? (
                <DataGridViewOptionsSection title={text.displaySection}>
                  {onHeaderStickyChange ? (
                    <DataGridViewOptionsSwitch
                      label={text.stickyHeader}
                      checked={headerSticky}
                      onCheckedChange={onHeaderStickyChange}
                    />
                  ) : null}
                  {toggles?.map((toggle) => (
                    <DataGridViewOptionsSwitch key={toggle.id} {...toggle} />
                  ))}
                </DataGridViewOptionsSection>
              ) : null}
              {columns ? (
                <DataGridViewOptionsColumns
                  reorderable={reorderable}
                  labels={labels}
                />
              ) : null}
            </>
          )}
        </div>
        {onReset ? (
          <div className='border-ui-border mt-3 flex justify-end border-t pt-3'>
            <Button variant='ghost' size='sm' onClick={onReset}>
              <RegistryIcon lucide='RotateCcwIcon' />
              {text.resetLayout}
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
export {
  DataGridViewOptions,
  DataGridViewOptionsColumns,
  DataGridViewOptionsDensity,
  DataGridViewOptionsSection,
  DataGridViewOptionsSwitch
};
