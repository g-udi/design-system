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
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const demoData = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'United States',
    flag: 'us',
    status: 'Active',
    balance: 5143.03
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'United Kingdom',
    flag: 'gb',
    status: 'Inactive',
    balance: 4321.87
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    location: 'Canada',
    flag: 'ca',
    status: 'Blocked',
    balance: 7654.98
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'Australia',
    flag: 'au',
    status: 'Inactive',
    balance: 3456.45
  },
  {
    id: '5',
    name: 'David Kim',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    location: 'Germany',
    flag: 'de',
    status: 'Active',
    balance: 9876.54
  },
  {
    id: '6',
    name: 'Aron Thompson',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    location: 'Malaysia',
    flag: 'my',
    status: 'Pending',
    balance: 6214.22
  },
  {
    id: '7',
    name: 'James Brown',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    location: 'Spain',
    flag: 'es',
    status: 'Inactive',
    balance: 5321.77
  },
  {
    id: '8',
    name: 'Maria Garcia',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    location: 'Japan',
    flag: 'jp',
    status: 'Blocked',
    balance: 8452.39
  },
  {
    id: '9',
    name: 'Nick Johnson',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    location: 'France',
    flag: 'fr',
    status: 'Pending',
    balance: 7345.1
  },
  {
    id: '10',
    name: 'Liam Thompson',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    location: 'Italy',
    flag: 'it',
    status: 'Inactive',
    balance: 5214.88
  }
];
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const stats = useMemo(() => {
    const count = demoData.length;
    const activeCount = demoData.filter((r) => r.status === 'Active').length;
    const balances = demoData.map((r) => r.balance);
    const minBalance = Math.min(...balances);
    const maxBalance = Math.max(...balances);
    const avgBalance = balances.reduce((a, b) => a + b, 0) / count;
    return { count, activeCount, minBalance, maxBalance, avgBalance };
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
        size: 220,
        meta: {
          autoSize: true
        },
        enableSorting: true,
        enableHiding: false,
        enableResizing: true
      },
      {
        accessorKey: 'location',
        id: 'location',
        header: ({ column }) => (
          <DataGridColumnHeader title='Location' visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className='flex items-center gap-1.5'>
            <img
              src={`https://flagcdn.com/${row.original.flag}.svg`}
              alt={row.original.flag}
              className='size-4 rounded-full object-cover'
            />
            <div className='text-ui-foreground font-medium'>
              {row.original.location}
            </div>
          </div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
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
        size: 110,
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
        size: 130,
        enableSorting: true,
        enableHiding: true,
        enableResizing: false
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
  const visibleCount = table.getVisibleLeafColumns().length;
  const footer = (
    <>
      {/* Row 1: record count, min balance, max balance */}
      <DataGridTableFootRow>
        <DataGridTableFootRowCell colSpan={visibleCount - 2} />
        <DataGridTableFootRowCell>
          <div className='flex flex-col gap-0.5'>
            <span className='text-ui-muted-foreground text-xs'>Min</span>
            <span className='tabular-nums'>{fmt(stats.minBalance)}</span>
          </div>
        </DataGridTableFootRowCell>
        <DataGridTableFootRowCell>
          <div className='flex flex-col gap-0.5'>
            <span className='text-ui-muted-foreground text-xs'>Max</span>
            <span className='tabular-nums'>{fmt(stats.maxBalance)}</span>
          </div>
        </DataGridTableFootRowCell>
      </DataGridTableFootRow>
      {/* Row 2: avg balance, active count */}
      <DataGridTableFootRow>
        <DataGridTableFootRowCell colSpan={visibleCount - 2}>
          <div className='flex items-center gap-1.5'>
            <span className='text-ui-muted-foreground'>Avg balance</span>
            <span className='tabular-nums'>{fmt(stats.avgBalance)}</span>
          </div>
        </DataGridTableFootRowCell>
        <DataGridTableFootRowCell colSpan={2}>
          <div className='flex items-center gap-1.5'>
            <span className='text-ui-muted-foreground'>Active</span>
            <Badge variant='success' size='sm'>
              {stats.activeCount}
            </Badge>
          </div>
        </DataGridTableFootRowCell>
      </DataGridTableFootRow>
    </>
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
        <CardHeader className='flex items-center justify-between px-3.5 py-2'>
          <div className='flex items-center gap-2'>
            <RegistryIcon
              lucide='BarChartIcon'
              className='text-ui-muted-foreground size-4'
            />
            <span className='text-ui-foreground text-sm font-medium'>
              Team Summary
            </span>
          </div>
          <CardAction>
            <Button variant='outline' size='sm'>
              <RegistryIcon lucide='RefreshCwIcon' />
              Refresh
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='border-y px-0'>
          <DataGridScrollArea>
            <DataGridTable footerContent={footer} />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className='border-none bg-transparent! px-2.5 py-2'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
