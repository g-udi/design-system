'use client';
import { useRef } from 'react';
import { useDataGrid } from '../DataGrid.jsx';
import { Subscribe } from '@tanstack/react-table';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
function DataGridSelectionBar({
  children,
  className,
  label,
  clearLabel = 'Clear',
  onClear
}) {
  const context = useDataGrid();
  const latestContext = useRef(context);
  latestContext.current = context;
  const rowSelectionAtom = latestContext.current.table.atoms.rowSelection;
  if (rowSelectionAtom == null) return null;
  return (
    <Subscribe source={rowSelectionAtom}>
      {() => {
        const table = latestContext.current.table;
        // flatRows: in a tree, `rows` drops selected children of unselected parents.
        const count = table.getSelectedRowModel().flatRows.length;
        if (count === 0) return null;
        return (
          <div
            data-slot='data-grid-selection-bar'
            className={cn(
              'bg-ui-background rounded-card sticky inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 border px-4 py-2.5 shadow-lg',
              className
            )}
          >
            <span className='text-ui-foreground text-sm font-medium'>
              {label ? label(count) : `${count} selected`}
            </span>
            <div className='flex flex-1 flex-wrap items-center justify-end gap-2.5'>
              {children}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  latestContext.current.table.resetRowSelection();
                  onClear?.();
                }}
              >
                {clearLabel}
              </Button>
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}
export { DataGridSelectionBar };
