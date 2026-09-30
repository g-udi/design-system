// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const demoData = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'Active',
    balance: 5143.03,
    transactions: 48
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'Inactive',
    balance: 4321.87,
    transactions: 31
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    status: 'Blocked',
    balance: 7654.98,
    transactions: 67
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'Inactive',
    balance: 3456.45,
    transactions: 22
  },
  {
    id: '5',
    name: 'David Kim',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    status: 'Active',
    balance: 9876.54,
    transactions: 93
  },
  {
    id: '6',
    name: 'Aron Thompson',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    status: 'Pending',
    balance: 6214.22,
    transactions: 55
  },
  {
    id: '7',
    name: 'James Brown',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    status: 'Inactive',
    balance: 5321.77,
    transactions: 40
  },
  {
    id: '8',
    name: 'Maria Garcia',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    status: 'Blocked',
    balance: 8452.39,
    transactions: 74
  },
  {
    id: '9',
    name: 'Nick Johnson',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    status: 'Pending',
    balance: 7345.1,
    transactions: 61
  },
  {
    id: '10',
    name: 'Liam Thompson',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    status: 'Inactive',
    balance: 5214.88,
    transactions: 37
  }
];
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const aggregates = useMemo(() => {
    const n = demoData.length;
    const balances = demoData.map((r) => r.balance);
    const txns = demoData.map((r) => r.transactions);
    return {
      avgBalance: balances.reduce((a, b) => a + b, 0) / n,
      minBalance: Math.min(...balances),
      maxBalance: Math.max(...balances),
      avgTxns: Math.round(txns.reduce((a, b) => a + b, 0) / n),
      minTxns: Math.min(...txns),
      maxTxns: Math.max(...txns)
    };
  }, []);
  const fmt = (n) =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='User' visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Avatar className='size-8'>
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='text-ui-foreground font-medium'>
              {row.original.name}
            </div>
          </div>
        ),
        minSize: 200,
        meta: {
          autoSize: true
        },
        enableSorting: true,
        enableHiding: false,
        enableResizing: true
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' visibility column={column} />
        ),
        cell: ({ row }) => {
          const s = row.original.status;
          if (s === 'Active')
            return <Badge variant='success-outline'>Active</Badge>;
          if (s === 'Blocked')
            return <Badge variant='destructive-outline'>Blocked</Badge>;
          if (s === 'Inactive')
            return <Badge variant='info-outline'>Inactive</Badge>;
          return <Badge variant='warning-outline'>Pending</Badge>;
        },
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'balance',
        id: 'balance',
        header: ({ column }) => (
          <DataGridColumnHeader title='Balance' visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className='text-ui-foreground font-medium tabular-nums'>
            {fmt(row.original.balance)}
          </div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'transactions',
        id: 'transactions',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Transactions'
            visibility
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className='text-ui-foreground font-medium tabular-nums'>
            {row.original.transactions}
          </div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      }
    ],
    []
  );
  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.id));
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil(demoData.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: { pagination, sorting, columnOrder },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting
  });
  const footer = (
    <DataGridTableFootRow>
      <DataGridTableFootRowCell colSpan={2}>
        <div className='flex flex-col gap-0.5'>
          <span className='text-ui-muted-foreground'>Summary</span>
          <span className='text-ui-foreground font-medium'>
            Across all members
          </span>
          <span className='text-ui-muted-foreground tabular-nums'>
            {demoData.length} members
          </span>
        </div>
      </DataGridTableFootRowCell>
      <DataGridTableFootRowCell>
        <div className='flex flex-col gap-0.5'>
          <span className='text-ui-muted-foreground'>Avg</span>
          <span className='tabular-nums'>{fmt(aggregates.avgBalance)}</span>
          <span className='text-ui-muted-foreground tabular-nums'>
            {fmt(aggregates.minBalance)} - {fmt(aggregates.maxBalance)}
          </span>
        </div>
      </DataGridTableFootRowCell>
      {/* Transactions aggregate */}
      <DataGridTableFootRowCell>
        <div className='flex flex-col gap-0.5'>
          <span className='text-ui-muted-foreground'>Avg</span>
          <span className='tabular-nums'>{aggregates.avgTxns}</span>
          <span className='text-ui-muted-foreground tabular-nums'>
            {aggregates.minTxns} - {aggregates.maxTxns}
          </span>
        </div>
      </DataGridTableFootRowCell>
    </DataGridTableFootRow>
  );
  return (
    <DataGrid
      table={table}
      recordCount={demoData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsVisibility: true
      }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex items-center justify-between gap-3 px-4 py-2'>
          <CardTitle className='text-sm font-medium'>
            Column Aggregates
          </CardTitle>
          <CardAction>
            <Button variant='outline' size='sm'>
              <RegistryIcon lucide='DownloadIcon' />
              Export
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='border-y px-0'>
          <DataGridScrollArea>
            <DataGridTable footerContent={footer} />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className='border-none bg-transparent! px-3.5 py-2'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
