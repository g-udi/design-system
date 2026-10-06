import { useState } from 'react';
import { useTable } from '@tanstack/react-table';
import DataTable, { DataGrid, DataGridColumnHeader, DataGridContainer, DataGridScrollArea, DataGridTable, dataGridFeatures } from '@gaudi/design-system/core/DataTable';
import Switch from '@gaudi/design-system/core/Switch';
import ArticleTable, { TableRoot, TableHeader, TableHeadPrimitive, TableRowPrimitive, TableBodyPrimitive, TableCellPrimitive } from '@gaudi/design-system/mdx/Table';

const records = [{ id: 'a', etag: 'alpha', key: 'Read only' }, { id: 'b', etag: 'bravo', key: 'Read and write' }];
const columns = [{ key: 'etag', header: 'eTag' }, { key: 'key', header: 'API key' }];
const gridColumns = columns.map(({ key, header }) => ({
  accessorKey: key,
  header: ({ column }) => <DataGridColumnHeader column={column} title={header} />,
  meta: { headerTitle: header }
}));

export function HeaderConsistencyExample() {
  const [compact, setCompact] = useState(false);
  const [plain, setPlain] = useState(false);
  const density = compact ? 'compact' : 'normal';
  const variant = plain ? 'plain' : 'muted';
  const table = useTable({ features: dataGridFeatures, columns: gridColumns, data: records, getRowId: row => row.id });
  const cells = <>
    <TableHeader><TableRowPrimitive>{columns.map(column => <TableHeadPrimitive key={column.key} variant={variant} scope='col'>{column.header}</TableHeadPrimitive>)}</TableRowPrimitive></TableHeader>
    <TableBodyPrimitive>{records.map(row => <TableRowPrimitive key={row.id}>{columns.map(column => <TableCellPrimitive key={column.key}>{row[column.key]}</TableCellPrimitive>)}</TableRowPrimitive>)}</TableBodyPrimitive>
  </>;
  return (
    <div className='grid min-w-0 gap-6'>
      <div className='flex flex-wrap gap-4'>
        <Switch label='Compact density' checked={compact} onCheckedChange={setCompact} />
        <Switch label='Plain headers' checked={plain} onCheckedChange={setPlain} />
      </div>
      <div className='grid min-w-0 gap-6 lg:grid-cols-2'>
        <section aria-label='Primitive table' className='min-w-0'>
          <h2 className='mb-3 text-base font-medium'>Table primitives</h2>
          <TableRoot density={density} aria-label='Primitive table' containerProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Primitive table scroll area' }}>{cells}</TableRoot>
        </section>
        <section aria-label='Convenience table' className='min-w-0'>
          <h2 className='mb-3 text-base font-medium'>DataTable</h2>
          <DataTable columns={columns} rows={records} density={density} headerVariant={variant} sortable caption='Convenience table' />
        </section>
        <section aria-label='Compound grid' className='min-w-0'>
          <h2 className='mb-3 text-base font-medium'>DataGrid</h2>
          <DataGrid table={table} recordCount={records.length} tableLayout={{ dense: compact, headerBackground: !plain }}>
            <DataGridContainer><DataGridScrollArea><DataGridTable /></DataGridScrollArea></DataGridContainer>
          </DataGrid>
        </section>
        <section aria-label='Article table' className='min-w-0 [&_.not-prose]:my-0!'>
          <h2 className='mb-3 text-base font-medium'>Article table</h2>
          <ArticleTable density={density} aria-label='Article table'>{cells}</ArticleTable>
        </section>
      </div>
    </div>
  );
}
