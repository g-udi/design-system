'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridColumnVisibility } from '../../../../src/components/core/DataTable/parts/data-grid-column-visibility-extended.jsx';
import { DataGridExport } from '../../../../src/components/core/DataTable/parts/data-grid-export-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Card,
  CardContent,
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import { CodeBlock } from '../../../../src/components/core/CodeBlock/parts/code-block-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Subscribers to a newsletter: dates, plans and a free-text note that needs quoting in CSV.
const subscribers = [
  ['s1', 'Maya Chen', 'maya@gaudi.dev', 'Paid', '2026-03-14', 42, 'Prefers the weekly digest'],
  ['s2', 'Sam Rivera', 'sam@gaudi.dev', 'Free', '2026-05-02', 17, ''],
  ['s3', 'Jo Morgan', 'jo@gaudi.dev', 'Paid', '2025-11-20', 88, 'Asked for "longer" essays, please'],
  ['s4', 'Lina Ahmed', 'lina@gaudi.dev', 'Trial', '2026-09-01', 5, ''],
  ['s5', 'Jules Martin', 'jules@gaudi.dev', 'Free', '2026-01-09', 23, 'Reads on mobile, mostly'],
  ['s6', 'Ana Ruiz', 'ana@gaudi.dev', 'Paid', '2025-08-17', 112, '=Founding member']
].map(([id, name, email, plan, joined, opens, note]) => ({ id, name, email, plan, joined, opens, note }));
const planVariant = { Paid: 'success-outline', Free: 'secondary', Trial: 'info-outline' };
const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function Pattern() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([{ id: 'opens', desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState({ note: true });
  const [preview, setPreview] = useState('');
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 40,
        // A control column has no value to write.
        meta: { export: false }
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title='Subscriber' column={column} />,
        cell: ({ row }) => (
          <span className='grid min-w-0'>
            <span className='truncate font-medium'>{row.original.name}</span>
            <span className='text-ui-muted-foreground truncate text-xs'>{row.original.email}</span>
          </span>
        ),
        enableHiding: false,
        size: 220,
        meta: { headerTitle: 'Subscriber' }
      },
      {
        accessorKey: 'email',
        id: 'email',
        header: ({ column }) => <DataGridColumnHeader title='Email' column={column} />,
        size: 200,
        meta: { headerTitle: 'Email' }
      },
      {
        accessorKey: 'plan',
        id: 'plan',
        header: ({ column }) => <DataGridColumnHeader title='Plan' column={column} />,
        cell: ({ getValue }) => <Badge variant={planVariant[getValue()]}>{getValue()}</Badge>,
        size: 110,
        meta: { headerTitle: 'Plan' }
      },
      {
        accessorKey: 'joined',
        id: 'joined',
        header: ({ column }) => <DataGridColumnHeader title='Joined' column={column} />,
        cell: ({ getValue }) => <time dateTime={getValue()}>{date.format(new Date(getValue()))}</time>,
        size: 130,
        // The file keeps an ISO date for spreadsheets; the grid shows a readable one.
        meta: { headerTitle: 'Joined', exportValue: (value) => value }
      },
      {
        accessorKey: 'opens',
        id: 'opens',
        header: ({ column }) => <DataGridColumnHeader title='Opens' column={column} />,
        cell: ({ getValue }) => <span className='tabular-nums'>{getValue()}</span>,
        size: 90,
        meta: { headerTitle: 'Opens', cellClassName: 'text-end' }
      },
      {
        accessorKey: 'note',
        id: 'note',
        header: ({ column }) => <DataGridColumnHeader title='Note' column={column} />,
        cell: ({ getValue }) => <span className='text-ui-muted-foreground truncate'>{getValue() || '—'}</span>,
        size: 240,
        meta: { headerTitle: 'Note' }
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: subscribers,
    getRowId: (row) => row.id,
    state: { globalFilter, rowSelection, sorting, columnVisibility },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: 'includesString',
    enableRowSelection: true
  });
  const selected = Object.keys(rowSelection).length;
  return (
    <div className='grid w-full gap-3'>
      <DataGrid table={table} recordCount={subscribers.length} tableLayout={{ headerBackground: true }}>
        <Card className='w-full gap-0 p-0'>
          <CardHeader className='flex flex-wrap items-center gap-2 px-4 py-3'>
            <Input
              type='search'
              aria-label='Search subscribers'
              placeholder='Search subscribers…'
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className='min-w-0 flex-1 basis-48'
            />
            <DataGridColumnVisibility
              table={table}
              trigger={
                <Button variant='outline' tone='neutral' size='sm'>
                  <RegistryIcon lucide='Columns3' className='size-4' />
                  Columns
                </Button>
              }
            />
            {/* Preview the file inline here; a real app lets the button save it. */}
            <DataGridExport filename='subscribers.csv' onExport={(csv) => {
                setPreview(csv);
                return false;
              }}>
              {selected ? `Export ${selected} selected` : 'Export CSV'}
            </DataGridExport>
          </CardHeader>
          <CardContent className='border-t px-0'>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </CardContent>
        </Card>
      </DataGrid>
      {preview && <CodeBlock code={preview} language='csv' label='subscribers.csv' />}
    </div>
  );
}
