'use client';
import { useDataGrid } from '../DataGrid.jsx';
import { flexRender } from '@tanstack/react-table';
import {
  getDataGridTableMergedHeaderGroups,
  hasDataGridTableRightPinnedColumns
} from '../dataGridTableModel.js';
import {
  DataGridTableFillHeadCell,
  DataGridTableFillBodyCell,
  DataGridTableAddRow,
  DataGridTableRowSpacer,
  DataGridTableBody,
  DataGridTableFoot,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableLoader
} from './DataGridTableStructure.jsx';
import { DataGridTableBase, DataGridTableViewport } from './DataGridTableFrame.jsx';
import {
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeader
} from './DataGridTableHeader.jsx';
import { DataGridTableHeadRowCellResize } from './DataGridColumnResize.jsx';
import {
  DataGridTableBodyRow,
  DataGridTableBodyRowExpandded,
  DataGridTableBodyRowCell,
  DataGridTableGroupedCell,
  DataGridTableRenderedRow,
  MemoizedDataGridTableBodyRows
} from './DataGridTableRows.jsx';
import {
  DataGridTableRowPin,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowExpand
} from './DataGridTableControls.jsx';
function DataGridTable({ footerContent, renderHeader = true }) {
  const { table, props } = useDataGrid();
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table);
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table);
  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {mergedHeaderGroups.map((headerGroup, rowIndex) => {
              return (
                <DataGridTableHeadRow
                  key={headerGroup.id}
                  rowId={headerGroup.id} rowIndex={rowIndex}
                >
                  {headerGroup.headers
                    .filter((header) => header.column.getIsPinned() !== 'end')
                    .map((header) => {
                      const { column } = header;
                      return (
                        <DataGridTableHeadRowCell
                          header={header}
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {props.tableLayout?.columnsResizable &&
                            column.getCanResize() && (
                              <DataGridTableHeadRowCellResize header={header} />
                            )}
                        </DataGridTableHeadRowCell>
                      );
                    })}
                  {props.tableLayout?.columnsResizable &&
                  hasRightPinnedColumns ? (
                    <DataGridTableFillHeadCell />
                  ) : null}
                  {headerGroup.headers
                    .filter((header) => header.column.getIsPinned() === 'end')
                    .map((header) => {
                      const { column } = header;
                      return (
                        <DataGridTableHeadRowCell
                          header={header}
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {props.tableLayout?.columnsResizable &&
                            column.getCanResize() && (
                              <DataGridTableHeadRowCellResize header={header} />
                            )}
                        </DataGridTableHeadRowCell>
                      );
                    })}
                  {props.tableLayout?.columnsResizable &&
                  !hasRightPinnedColumns ? (
                    <DataGridTableFillHeadCell />
                  ) : null}
                </DataGridTableHeadRow>
              );
            })}
          </DataGridTableHead>
        )}

        {renderHeader &&
          (props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

        <DataGridTableBody>
          <MemoizedDataGridTableBodyRows table={table} />
          {props.appendRow}
          <DataGridTableAddRow />
        </DataGridTableBody>

        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  );
}
export {
  DataGridTable,
  DataGridTableAddRow,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableGroupedCell,
  DataGridTableRenderedRow,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableFillBodyCell,
  DataGridTableFillHeadCell,
  DataGridTableFoot,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableHeader,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableLoader,
  DataGridTableRowExpand,
  DataGridTableRowPin,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowSpacer,
  DataGridTableViewport
};
