'use client';
import { memo } from 'react';
import { useGanttSettings, useGanttViewConfig } from '../Gantt.jsx';
import { DEFAULT_ROW_ALIGN } from '../ganttConfig.js';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Checkbox } from '../../Checkbox/CheckboxPrimitives.jsx';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '../../DropdownMenu/ContextMenu.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { DEFAULT_COLUMN_WIDTH } from '../ganttViewModel.js';
const GanttTreeRow = memo(function GanttTreeRow2({
  row,
  heightRem,
  bandRem,
  columns,
  nameWidth,
  dimmed,
  selected,
  onSelectedChange,
  onGripPointerDown,
  onToggle
}) {
  const settings = useGanttSettings();
  const viewConfig = useGanttViewConfig();
  const ctx = {
    resource: row.resource,
    depth: row.depth,
    isGroup: row.isGroup,
    collapsed: row.collapsed
  };
  const menu = viewConfig.renderResourceMenu?.(ctx);
  const alignStart = (viewConfig.rowAlign ?? DEFAULT_ROW_ALIGN) === 'start';
  const rowNode = (
    <div
      data-slot='gantt-row-group'
      data-gantt-row-id={row.resource.id}
      data-selected={selected || void 0}
      className={cn(
        'group/gantt-row data-hover:bg-ui-muted/40 data-selected:bg-ui-primary/5 data-selected:data-hover:bg-ui-primary/5 flex border-b',
        dimmed && 'opacity-50'
      )}
      style={{ height: `${heightRem}rem` }}
      onClick={
        settings.onResourceClick
          ? (e) => {
              if (e.target.closest('button, [role=checkbox]')) return;
              settings.onResourceClick?.(ctx, e);
            }
          : void 0
      }
      onDoubleClick={
        settings.onResourceDoubleClick
          ? (e) => {
              if (e.target.closest('button, [role=checkbox]')) return;
              settings.onResourceDoubleClick?.(ctx, e);
            }
          : void 0
      }
    >
      <div className='flex h-full w-full min-w-0'>
        {/* In-flow name cell: the whole tree row scrolls horizontally as one;
     row-level hover/selected tints show through the transparent cell */}
        <div
          data-slot='gantt-tree-cell'
          className={cn(
            // ps-3 keeps the row toggles off the left edge (kept in sync with
            // namePaddingStart above so headers stay aligned with row titles)
            'flex shrink-0 ps-3 pe-3',
            alignStart ? 'items-start' : 'items-center',
            row.isGroup && 'font-medium'
          )}
          style={{ width: nameWidth }}
        >
          {/* exactly the band the first schedule occupies: same height, both
     top-anchored, so the label and that schedule share a centerline */}
          <div
            className='flex w-full min-w-0 items-center'
            style={{ height: `${bandRem}rem` }}
          >
            {onGripPointerDown && (
              <button
                type='button'
                data-slot='gantt-row-grip'
                aria-label={settings.i18n.labels.reorder}
                className='text-ui-muted-foreground hover:text-ui-foreground -ms-1.5 me-1.5 flex w-3.5 shrink-0 cursor-grab touch-none items-center justify-center opacity-0 group-hover/gantt-row:opacity-100 group-data-hover/gantt-row:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100'
                onPointerDown={(e) => onGripPointerDown(e, row)}
                onClick={(e) => e.stopPropagation()}
              >
                <RegistryIcon
                  lucide='GripVerticalIcon'
                  className='size-3'
                  aria-hidden='true'
                />
              </button>
            )}
            {/* per-level indent keeps sibling titles on one x */}
            <span
              aria-hidden
              className='shrink-0'
              style={{ width: `${row.depth * 0.875}rem` }}
            />
            {/* fixed gutter: groups toggle here, leaves carry the checkbox -
     titles of one level share the same x either way */}
            <span className='me-1 flex w-5 shrink-0 items-center justify-start'>
              {row.isGroup ? (
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-expanded={!row.collapsed}
                  aria-label={row.resource.title}
                  className={cn(
                    'size-5! aria-expanded:bg-transparent!',
                    row.collapsed
                      ? 'text-ui-foreground'
                      : 'text-ui-muted-foreground aria-expanded:text-ui-muted-foreground! hover:text-ui-foreground!'
                  )}
                  onClick={() => onToggle(row)}
                >
                  <RegistryIcon
                    lucide='ChevronRightIcon'
                    className={cn(
                      'size-3.5 transition-transform',
                      !row.collapsed && 'rotate-90'
                    )}
                    aria-hidden='true'
                  />
                </Button>
              ) : (
                viewConfig.rowCheckboxes &&
                onSelectedChange && (
                  <Checkbox
                    data-slot='gantt-row-checkbox'
                    checked={selected}
                    onCheckedChange={(checked) =>
                      onSelectedChange(row.resource.id, checked)
                    }
                    aria-label={row.resource.title}
                    className={cn(
                      'size-3.5 opacity-0 transition-opacity group-hover/gantt-row:opacity-100 group-data-hover/gantt-row:opacity-100 focus-visible:opacity-100',
                      selected && 'opacity-100'
                    )}
                  />
                )
              )}
            </span>
            {viewConfig.renderResourceLabel?.(ctx) ?? (
              <span className='truncate'>{row.resource.title}</span>
            )}
          </div>
        </div>
        {columns.map((column) => (
          <div
            key={column.id}
            data-slot='gantt-tree-column-cell'
            data-column={column.id}
            className={cn(
              'flex shrink-0 px-2',
              alignStart ? 'items-start' : 'items-center',
              column.className
            )}
            style={{ width: column.width ?? DEFAULT_COLUMN_WIDTH }}
          >
            <div
              className={cn(
                'flex w-full min-w-0 items-center',
                column.align === 'center' && 'justify-center',
                column.align === 'end' && 'justify-end'
              )}
              style={{ height: `${bandRem}rem` }}
            >
              {column.render?.(ctx)}
            </div>
          </div>
        ))}
        <div className='min-w-0 flex-1' />
      </div>
    </div>
  );
  if (!menu) return rowNode;
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{rowNode}</ContextMenuTrigger>
      <ContextMenuContent data-slot='gantt-resource-menu' className='min-w-44'>
        {menu}
      </ContextMenuContent>
    </ContextMenu>
  );
});
export { GanttTreeRow };
