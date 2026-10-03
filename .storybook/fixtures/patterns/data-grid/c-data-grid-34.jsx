'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import { DataGridTable } from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
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
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { Skeleton } from '../../../../src/components/core/Skeleton/parts/skeleton.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const avatars = [
  '/avatars/men/32.jpg',
  '/avatars/women/44.jpg',
  '/avatars/men/11.jpg',
  '/avatars/women/68.jpg',
  '/avatars/men/49.jpg',
  '/avatars/men/75.jpg'
];
const names = [
  'Alex Johnson',
  'Sarah Chen',
  'Michael Rodriguez',
  'Emma Wilson',
  'David Kim',
  'Aron Thompson',
  'James Brown',
  'Maria Garcia',
  'Nick Johnson',
  'Liam Thompson'
];
const companies = [
  'Apple',
  'OpenAI',
  'Meta',
  'Tesla',
  'SAP',
  'Northwind',
  'BBVA',
  'Sony',
  'LVMH',
  'ENI'
];
const statuses = ['Active', 'Inactive', 'Pending'];
const TOTAL_SERVER_RECORDS = 487;
const serverRecords = Array.from(
  { length: TOTAL_SERVER_RECORDS },
  (_, index) => {
    const name = names[index % names.length];
    return {
      id: String(index + 1),
      name,
      avatar: avatars[index % avatars.length],
      email: `${name.toLowerCase().replace(' ', '.')}${index + 1}@company.com`,
      company: companies[(index * 3) % companies.length],
      status: statuses[index % statuses.length],
      balance: Math.round((1e3 + ((index * 137.17) % 9e3)) * 100) / 100
    };
  }
);
async function fetchServerPage(params) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const search = params.search.toLowerCase();
  let rows = serverRecords;
  if (params.status !== 'all') {
    rows = rows.filter((record) => record.status === params.status);
  }
  if (search) {
    rows = rows.filter((record) =>
      [record.name, record.email, record.company].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }
  const sort = params.sorting[0];
  if (sort) {
    const direction = sort.desc ? -1 : 1;
    rows = [...rows].sort((a, b) => {
      const left = a[sort.id];
      const right = b[sort.id];
      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction;
      }
      return String(left).localeCompare(String(right)) * direction;
    });
  }
  const start = params.pageIndex * params.pageSize;
  return {
    rows: rows.slice(start, start + params.pageSize),
    total: rows.length
  };
}
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasActiveFilters = searchInput.trim() !== '' || status !== 'all';
  const resetToFirstPage = () =>
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
    );
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPagination((current) =>
        current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
      );
    }, 350);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);
  const requestIdRef = useRef(0);
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    fetchServerPage({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      search,
      status
    }).then((response) => {
      if (requestId !== requestIdRef.current) return;
      setData(response.rows);
      setTotal(response.total);
      setIsLoading(false);
    });
  }, [pagination.pageIndex, pagination.pageSize, sorting, search, status]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='User' column={column} />
        ),
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Avatar className='size-7'>
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name
                  .split(' ')
                  .map((namePart) => namePart[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='text-ui-foreground font-medium'>
                {row.original.name}
              </div>
              <div className='text-ui-muted-foreground text-xs'>
                {row.original.email}
              </div>
            </div>
          </div>
        ),
        minSize: 220,
        meta: {
          autoSize: true,
          skeleton: (
            <div className='flex items-center gap-3'>
              <Skeleton className='size-7 rounded-full' />
              <div className='space-y-1.5'>
                <Skeleton className='h-3.5 w-24' />
                <Skeleton className='h-3 w-36' />
              </div>
            </div>
          )
        },
        enableSorting: true
      },
      {
        accessorKey: 'company',
        id: 'company',
        header: ({ column }) => (
          <DataGridColumnHeader title='Company' column={column} />
        ),
        cell: ({ row }) => (
          <span className='text-ui-foreground'>{row.original.company}</span>
        ),
        size: 130,
        meta: {
          skeleton: <Skeleton className='h-4 w-20' />
        },
        enableSorting: true
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' column={column} />
        ),
        cell: ({ row }) => {
          const rowStatus = row.original.status;
          if (rowStatus === 'Active') {
            return <Badge variant='success-outline'>Active</Badge>;
          }
          if (rowStatus === 'Inactive') {
            return <Badge variant='info-outline'>Inactive</Badge>;
          }
          return <Badge variant='warning-outline'>Pending</Badge>;
        },
        size: 120,
        meta: {
          skeleton: <Skeleton className='h-5 w-16' />
        },
        enableSorting: true
      },
      {
        accessorKey: 'balance',
        id: 'balance',
        header: ({ column }) => (
          <DataGridColumnHeader title='Balance' column={column} />
        ),
        cell: ({ row }) => (
          <span className='tabular-nums'>
            $
            {row.original.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </span>
        ),
        size: 140,
        meta: {
          skeleton: <Skeleton className='h-4 w-24' />
        },
        enableSorting: true
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data,
    // Server-side mode: `data` is exactly one page, so paging and sorting are
    // the server's job instead of the row models'.
    manualPagination: true,
    manualSorting: true,
    // The server-side total. REQUIRED alongside recordCount below: without it
    // getPageCount() is derived from the one loaded page and the pagination
    // buttons collapse to a single page, while the info text still claims the
    // full count. recordCount only drives the "1 - 5 of N" text.
    rowCount: total,
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting
  });
  return (
    <DataGrid
      table={table}
      recordCount={total}
      isLoading={isLoading}
      tableLayout={{ columnsResizable: true }}
    >
      <Card className='w-full gap-3 py-3.5'>
        <CardHeader className='items-center px-3.5'>
          <CardTitle className='flex items-center gap-2'>
            Users
            <Badge variant='secondary' size='sm' className='tabular-nums'>
              {total}
            </Badge>
          </CardTitle>
          <CardAction className='flex flex-wrap items-center justify-end gap-2'>
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label='Search users'
              placeholder='Search name, email, company...'
              className='w-56'
            />
            <Select
              value={status}
              onValueChange={(next) => {
                setStatus(next ?? 'all');
                resetToFirstPage();
              }}
            >
              <SelectTrigger className='w-32' aria-label='Filter by status'>
                {/* Explicit label: the primitive can only resolve a value to
       its item label after the popup has mounted the items, so a
       fresh render would show the raw "all". */}
                <SelectValue placeholder='Status'>
                  {status === 'all' ? 'All statuses' : status}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                <SelectItem value='Active'>Active</SelectItem>
                <SelectItem value='Inactive'>Inactive</SelectItem>
                <SelectItem value='Pending'>Pending</SelectItem>
              </SelectContent>
            </Select>
            {/* Present only while a filter is active, so the resting toolbar
       stays quiet. Search is cleared through both halves at once:
       waiting out the debounce would leave stale rows for 350ms. */}
            {hasActiveFilters && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setSearchInput('');
                  setSearch('');
                  setStatus('all');
                  resetToFirstPage();
                }}
              >
                <RegistryIcon lucide='XIcon' className='size-4' />
                Clear
              </Button>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className='border-t p-0'>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className='border-none bg-transparent! px-3.5 py-0'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
