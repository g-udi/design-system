// Keep a useful scrolling area when fixed columns would crowd a narrow container.
export function canPinTableColumns(pinnedWidth, viewportWidth) {
  return pinnedWidth > 0 && pinnedWidth < viewportWidth * 0.75;
}

function getPinningStyles(column, enabled = true) {
  const isPinned = enabled && column.getIsPinned();
  return {
    // Logical offsets: TanStack's "left"/"right" buckets are start/end
    // semantics, so pinned columns stick to the correct edge in RTL too
    // (identical to left/right in LTR).
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : void 0,
    insetInlineEnd: isPinned === 'end' ? `${column.getAfter('end')}px` : void 0,
    position: isPinned ? 'sticky' : void 0,
    transform: isPinned ? 'translateZ(0)' : void 0,
    contain: isPinned ? 'paint' : void 0,
    width: column.getSize(),
    zIndex: isPinned ? 30 : void 0,
    backgroundClip: isPinned ? 'padding-box' : void 0
  };
}
function getDataGridTreeIndentStyle(row, indent = 20) {
  return {
    '--data-grid-tree-padding': `${row.depth * indent}px`
  };
}
function getDataGridTableRowSections(table, rowsPinnable) {
  if (!rowsPinnable) {
    return {
      topRows: [],
      centerRows: table.getRowModel().rows,
      bottomRows: []
    };
  }
  return {
    topRows: table.getTopRows(),
    centerRows: table.getCenterRows(),
    bottomRows: table.getBottomRows()
  };
}
function getDataGridTableResolvedRows(table, rowsPinnable) {
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    rowsPinnable
  );
  const resolvedRows = [];
  topRows.forEach((row, index) => {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === topRows.length - 1 &&
        (centerRows.length > 0 || bottomRows.length > 0)
          ? 'top'
          : void 0
    });
  });
  centerRows.forEach((row) => {
    resolvedRows.push({ row });
  });
  bottomRows.forEach((row, index) => {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === 0 && (centerRows.length > 0 || topRows.length > 0)
          ? 'bottom'
          : void 0
    });
  });
  return resolvedRows;
}
function getDataGridTableOrderedVisibleColumns(table) {
  return [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns()
  ];
}
function getDataGridTableOrderedVisibleCells(row) {
  return [
    ...row.getStartVisibleCells(),
    ...row.getCenterVisibleCells(),
    ...row.getEndVisibleCells()
  ];
}
function getDataGridTableMergedHeaderGroups(table) {
  const leftHeaderGroups = table.getStartHeaderGroups();
  const centerHeaderGroups = table.getCenterHeaderGroups();
  const rightHeaderGroups = table.getEndHeaderGroups();
  const headerGroupCount = Math.max(
    leftHeaderGroups.length,
    centerHeaderGroups.length,
    rightHeaderGroups.length
  );
  return Array.from({ length: headerGroupCount }, (_, index) => {
    const leftGroup = leftHeaderGroups[index];
    const centerGroup = centerHeaderGroups[index];
    const rightGroup = rightHeaderGroups[index];
    return {
      id:
        [leftGroup?.id, centerGroup?.id, rightGroup?.id]
          .filter(Boolean)
          .join(':') || `header-group-${index}`,
      headers: [
        ...(leftGroup?.headers ?? []),
        ...(centerGroup?.headers ?? []),
        ...(rightGroup?.headers ?? [])
      ]
    };
  });
}
function hasDataGridTableRightPinnedColumns(table) {
  return (table.state.columnPinning.end?.length ?? 0) > 0;
}
function hasDataGridFillColumn(table) {
  return table
    .getVisibleLeafColumns()
    .some((column) => column.columnDef.meta?.fillWidth);
}
const columnDefId = (def) =>
  def.id ?? (def.accessorKey === void 0 ? void 0 : String(def.accessorKey).replaceAll('.', '_'));
// The host's own definition, before the table merges in its defaults.
function findDataGridColumnDef(defs = [], id) {
  for (const def of defs) {
    if (columnDefId(def) === id) return def;
    const nested = def.columns && findDataGridColumnDef(def.columns, id);
    if (nested) return nested;
  }
  return void 0;
}
const formatDataGridAggregate = (value) =>
  typeof value === 'number'
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : Array.isArray(value)
      ? value.map(formatDataGridAggregate).join(' – ')
      : value ?? '';
export { getPinningStyles, getDataGridTreeIndentStyle, getDataGridTableRowSections, getDataGridTableResolvedRows, getDataGridTableMergedHeaderGroups, hasDataGridTableRightPinnedColumns, getDataGridTableOrderedVisibleCells, findDataGridColumnDef, formatDataGridAggregate, getDataGridTableOrderedVisibleColumns, hasDataGridFillColumn };
