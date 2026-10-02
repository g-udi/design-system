'use client';
/* Banded sections: each group of a grouped grid renders as its own section
 with a header band (title, count, tone, per-section select-all, an optional
 add action and a collapse toggle) and its own repeated column headers. Sort,
 selection and column state stay on the one table, so they are shared across
 every section, and switching `grouping` re-bands the rows. */
import { createContext, useCallback, useContext, useId, useRef, useState } from 'react';
import { useDataGrid } from './data-grid-extended.jsx';
import {
  DataGridTable,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableFillHeadCell,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRenderedRow,
  DataGridTableViewport,
  getDataGridTableMergedHeaderGroups,
  hasDataGridTableRightPinnedColumns
} from './data-grid-table-extended.jsx';
import { useDataGridStructureLabels } from './data-grid-tree-rows-extended.jsx';
import { flexRender, Subscribe } from '@tanstack/react-table-v9';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Checkbox } from '../../Checkbox/parts/checkbox.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

function renderHeaderCell(header, resizable) {
  return (
    <DataGridTableHeadRowCell header={header} key={header.id}>
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      {resizable && header.column.getCanResize() ? <DataGridTableHeadRowCellResize header={header} /> : null}
    </DataGridTableHeadRowCell>
  );
}
/** The grid's column header rows, for bodies that render their own table. */
export function DataGridTableHeadRows() {
  const { table, props } = useDataGrid();
  const resizable = !!props.tableLayout?.columnsResizable;
  const hasEnd = hasDataGridTableRightPinnedColumns(table);
  return getDataGridTableMergedHeaderGroups(table).map((headerGroup) => (
    <DataGridTableHeadRow key={headerGroup.id} rowId={headerGroup.id}>
      {headerGroup.headers
        .filter((header) => header.column.getIsPinned() !== 'end')
        .map((header) => renderHeaderCell(header, resizable))}
      {resizable && hasEnd ? <DataGridTableFillHeadCell /> : null}
      {headerGroup.headers
        .filter((header) => header.column.getIsPinned() === 'end')
        .map((header) => renderHeaderCell(header, resizable))}
      {resizable && !hasEnd ? <DataGridTableFillHeadCell /> : null}
    </DataGridTableHeadRow>
  ));
}

/* Literal class strings so Tailwind sees every tone. */
// Dark subtle tones are deep, so the wash halves there to stay a tint.
const sectionTones = {
  neutral: { band: 'bg-ui-muted/40', mark: 'bg-ui-muted-foreground/60' },
  accent: { band: 'bg-accent-subtle dark:bg-accent-subtle/50', mark: 'bg-accent' },
  info: { band: 'bg-info-subtle dark:bg-info-subtle/50', mark: 'bg-info' },
  success: { band: 'bg-success-subtle dark:bg-success-subtle/50', mark: 'bg-success' },
  warning: { band: 'bg-warning-subtle dark:bg-warning-subtle/50', mark: 'bg-warning' },
  danger: { band: 'bg-danger-subtle dark:bg-danger-subtle/50', mark: 'bg-danger' },
  attention: { band: 'bg-attention-subtle dark:bg-attention-subtle/50', mark: 'bg-attention' },
  discovery: { band: 'bg-discovery-subtle dark:bg-discovery-subtle/50', mark: 'bg-discovery' }
};
export const dataGridSectionTones = Object.keys(sectionTones);

const DataGridSectionContext = createContext(null);
/** The section a component renders in, or `null` outside banded sections. */
export function useDataGridSection() {
  return useContext(DataGridSectionContext);
}
function collectLeafRows(rows, out = []) {
  for (const row of rows) {
    if (row.getIsGrouped?.()) collectLeafRows(row.subRows, out);
    else out.push(row);
  }
  return out;
}
/* Rows in display order under a group, opening nested groups that are expanded. */
function flattenSectionRows(rows, out = []) {
  for (const row of rows) {
    out.push(row);
    if (row.getIsGrouped?.() && row.getIsExpanded()) flattenSectionRows(row.subRows, out);
  }
  return out;
}

/**
 * Select all for the surrounding section: its records only, with a mixed
 * state when some are selected. Outside a section it selects the page.
 */
export function DataGridTableSectionSelectAll({ className }) {
  const { table, isLoading } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const section = useDataGridSection();
  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => {
        const rows = (section ? section.rows : table.getRowModel().rows).filter(
          (row) => row.getCanSelect?.() !== false
        );
        const selected = rows.filter((row) => row.getIsSelected()).length;
        const all = rows.length > 0 && selected === rows.length;
        return (
          <Checkbox
            checked={all ? true : selected ? 'indeterminate' : false}
            disabled={isLoading || rows.length === 0}
            onCheckedChange={(value) =>
              table.setRowSelection((old) => {
                const next = { ...old };
                for (const row of rows) {
                  if (value === true) next[row.id] = true;
                  else delete next[row.id];
                }
                return next;
              })
            }
            onClick={(event) => event.stopPropagation()}
            aria-label={section ? labels.selectSection(section.label) : labels.selectAll}
            className={cn('align-[inherit]', className)}
          />
        );
      }}
    </Subscribe>
  );
}

function DataGridTableSection({
  section,
  collapsible,
  selectable,
  onSectionAdd,
  addLabel,
  renderSectionActions,
  emptyContent
}) {
  const { props, table } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const titleId = useId();
  const regionId = useId();
  // Empty sections have no group row to hold their open state.
  const [localOpen, setLocalOpen] = useState(true);
  const open = section.groupRow ? section.groupRow.getIsExpanded() : localOpen;
  const tone = sectionTones[section.tone] ?? sectionTones.neutral;
  const count = section.rows.length;
  const columnCount = table.getVisibleLeafColumns().length + (props.tableLayout?.columnsResizable ? 1 : 0);
  const rows = section.groupRow ? flattenSectionRows(section.groupRow.subRows) : [];
  return (
    <DataGridSectionContext.Provider value={section}>
      <section
        data-slot='data-grid-section'
        data-section={String(section.value)}
        data-tone={section.tone ?? 'neutral'}
        aria-labelledby={titleId}
        className='not-first:border-t'
      >
        <div
          data-slot='data-grid-section-band'
          className={cn(
            'relative flex flex-wrap items-center gap-x-2 gap-y-1 border-b py-2 ps-3 pe-2',
            tone.band
          )}
        >
          <span aria-hidden='true' className={cn('absolute inset-y-0 start-0 w-1', tone.mark)} />
          {selectable ? <DataGridTableSectionSelectAll /> : null}
          {collapsible ? (
            <Button
              variant='ghost'
              tone='neutral'
              size='icon-xs'
              aria-expanded={open}
              aria-controls={regionId}
              aria-label={open ? labels.collapseSection(section.label) : labels.expandSection(section.label)}
              onClick={() => (section.groupRow ? section.groupRow.toggleExpanded() : setLocalOpen((value) => !value))}
              className='text-ui-muted-foreground hover:text-ui-foreground'
            >
              <RegistryIcon
                lucide='ChevronDown'
                className='size-4 transition-transform duration-200 in-aria-[expanded=false]:-rotate-90 rtl:in-aria-[expanded=false]:rotate-90'
              />
            </Button>
          ) : null}
          <h3 id={titleId} className='text-ui-foreground min-w-0 truncate text-sm font-medium'>
            {section.label}
          </h3>
          <span
            aria-hidden='true'
            className='text-ui-muted-foreground bg-ui-background/70 rounded-pill shrink-0 px-1.5 text-xs leading-5 tabular-nums'
          >
            {count}
          </span>
          <span className='sr-only'>{labels.sectionCount(count)}</span>
          {section.description ? (
            // On narrow bands the description drops below, keeping the actions on the title line.
            <span className='text-ui-muted-foreground order-last min-w-0 basis-full truncate ps-6 text-xs sm:order-none sm:basis-auto sm:ps-0'>
              {section.description}
            </span>
          ) : null}
          {renderSectionActions || onSectionAdd ? (
            <div className='ms-auto flex flex-wrap items-center gap-1'>
              {renderSectionActions?.(section)}
              {onSectionAdd ? (
                <Button variant='ghost' size='sm' onClick={() => onSectionAdd(section)}>
                  <RegistryIcon lucide='Plus' aria-hidden='true' />
                  <span className='sr-only sm:not-sr-only'>{addLabel ? addLabel(section) : labels.addToSection(section.label)}</span>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
        {open ? (
          <div
            id={regionId}
            data-slot='data-grid-section-viewport'
            className='overflow-x-auto overscroll-x-contain'
          >
            <DataGridTableViewport>
              <DataGridTableBase>
                <caption className='sr-only'>{section.label}</caption>
                <DataGridTableHead>
                  <DataGridTableHeadRows />
                </DataGridTableHead>
                <DataGridTableBody>
                  {rows.length ? (
                    rows.map((row) => <DataGridTableRenderedRow key={row.id} row={row} />)
                  ) : (
                    <tr>
                      <td colSpan={columnCount} className='text-ui-muted-foreground px-3 py-5 text-center text-sm'>
                        {typeof emptyContent === 'function' ? emptyContent(section) : emptyContent ?? labels.sectionEmpty(section.label)}
                      </td>
                    </tr>
                  )}
                </DataGridTableBody>
              </DataGridTableBase>
            </DataGridTableViewport>
          </div>
        ) : null}
      </section>
    </DataGridSectionContext.Provider>
  );
}

/**
 * Renders a grouped grid as banded sections. The first `grouping` column
 * bands the rows; without grouping it falls back to the ordinary table.
 *
 * - `sections`: optional `[{ value, label, tone, description }]` to order the
 *   bands, give them titles and tones, and keep empty ones visible.
 * - `getSectionTone(value)`: tone for bands not listed in `sections`
 *   (`neutral`, `accent`, `info`, `success`, `warning`, `danger`,
 *   `attention`, `discovery`).
 * - `onSectionAdd(section)` adds an Add action to each band; `addLabel`
 *   names it. `renderSectionActions(section)` adds anything else.
 * - `selectable` puts a select-all checkbox for the section in its band.
 */
export function DataGridTableSections({
  sections,
  getSectionTone,
  collapsible = true,
  selectable = false,
  onSectionAdd,
  addLabel,
  renderSectionActions,
  emptyContent,
  className
}) {
  const { table } = useDataGrid();
  const containerRef = useRef(null);
  const syncing = useRef(false);
  const groupingColumnId = table.state.grouping?.[0];
  // Every section scrolls sideways as one: scrolling one viewport moves the rest.
  const handleScroll = useCallback((event) => {
    const source = event.target;
    if (syncing.current || !(source instanceof HTMLElement)) return;
    if (source.dataset.slot !== 'data-grid-section-viewport') return;
    syncing.current = true;
    containerRef.current
      ?.querySelectorAll('[data-slot="data-grid-section-viewport"]')
      .forEach((viewport) => {
        if (viewport !== source) viewport.scrollLeft = source.scrollLeft;
      });
    syncing.current = false;
  }, []);
  if (!groupingColumnId) return <DataGridTable />;
  const groupRows = table
    .getRowModel()
    .rows.filter((row) => row.depth === 0 && row.getIsGrouped?.() && row.groupingColumnId === groupingColumnId);
  const byValue = new Map(groupRows.map((row) => [String(row.groupingValue), row]));
  const toSection = (value, groupRow, config = {}) => ({
    value,
    label: config.label ?? String(value ?? ''),
    tone: config.tone ?? getSectionTone?.(value) ?? 'neutral',
    description: config.description,
    groupRow,
    rows: groupRow ? collectLeafRows(groupRow.subRows) : []
  });
  const listed = new Set();
  const resolved = [];
  for (const config of sections ?? []) {
    const key = String(config.value);
    listed.add(key);
    resolved.push(toSection(config.value, byValue.get(key), config));
  }
  for (const row of groupRows) {
    if (!listed.has(String(row.groupingValue))) resolved.push(toSection(row.groupingValue, row));
  }
  return (
    <div
      ref={containerRef}
      data-slot='data-grid-sections'
      data-grouping={groupingColumnId}
      onScrollCapture={handleScroll}
      className={cn('w-full min-w-0', className)}
    >
      {resolved.map((section) => (
        <DataGridTableSection
          key={String(section.value)}
          section={section}
          collapsible={collapsible}
          selectable={selectable}
          onSectionAdd={onSectionAdd}
          addLabel={addLabel}
          renderSectionActions={renderSectionActions}
          emptyContent={emptyContent}
        />
      ))}
    </div>
  );
}
