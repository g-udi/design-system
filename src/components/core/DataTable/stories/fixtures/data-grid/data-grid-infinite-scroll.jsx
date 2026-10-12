'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  DataGrid,
  DataGridExport,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import { DataGridTableVirtual } from '@gaudi/design-system/core/DataTable';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
  CardContent,
  CardHeader
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const avatars = [
  '/avatars/person-41.svg',
  '/avatars/person-20.svg',
  '/avatars/person-31.svg',
  '/avatars/person-24.svg',
  '/avatars/person-45.svg',
  '/avatars/person-50.svg'
];
const names = [
  'Anouk Varga',
  'Sabine Okafor',
  'Rafe Okonkwo',
  'Ilse Valtonen',
  'Ottilie Nakamura',
  'Aurelio Brandt',
  'Felix Arrowsmith',
  'Mireille Gaspard',
  'Barnaby Okafor',
  'Quentin Hale'
];
const statuses = ['Active', 'Inactive', 'Pending'];
const TOTAL_SERVER_RECORDS = 200;
const PAGE_SIZE = 20;
function simulateRow(index) {
  const name = names[index % names.length];
  return {
    id: String(index + 1),
    name,
    avatar: avatars[index % avatars.length],
    email: `${name.toLowerCase().replace(' ', '.')}${index}@company.com`,
    status: statuses[index % statuses.length],
    balance: Math.round((Math.random() * 9e3 + 1e3) * 100) / 100
  };
}
function createInitialData() {
  return Array.from({ length: PAGE_SIZE }, (_, index) => simulateRow(index));
}
export function Pattern() {
  const [sorting, setSorting] = useState([]);
  const [initialData] = useState(() => createInitialData());
  const [data, setData] = useState(initialData);
  const [isFetching, setIsFetching] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const fetchTimeoutRef = useRef(null);
  const hasMore = data.length < TOTAL_SERVER_RECORDS;
  const clearPendingFetch = useCallback(() => {
    if (fetchTimeoutRef.current !== null) {
      window.clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
  }, []);
  useEffect(() => () => clearPendingFetch(), [clearPendingFetch]);
  const handleReset = useCallback(() => {
    clearPendingFetch();
    setSorting([]);
    setData(initialData);
    setIsFetching(false);
    setResetVersion((version) => version + 1);
  }, [clearPendingFetch, initialData]);
  const fetchMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    clearPendingFetch();
    setIsFetching(true);
    const timeoutId = window.setTimeout(() => {
      setData((prev) => {
        const next = Array.from({ length: PAGE_SIZE }, (_, index) =>
          simulateRow(prev.length + index)
        );
        return [...prev, ...next];
      });
      setIsFetching(false);
      fetchTimeoutRef.current = null;
    }, 800);
    fetchTimeoutRef.current = timeoutId;
  }, [clearPendingFetch, hasMore, isFetching]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: ({ column }) => (
          <DataGridColumnHeader title='#' column={column} />
        ),
        cell: ({ row }) => (
          <span className='text-ui-muted-foreground tabular-nums'>
            {row.original.id}
          </span>
        ),
        size: 70,
        enableSorting: false
      },
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
        minSize: 200,
        meta: {
          autoSize: true
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
          const status = row.original.status;
          if (status === 'Active') {
            return <Badge variant='success-outline'>Active</Badge>;
          }
          if (status === 'Inactive') {
            return <Badge variant='info-outline'>Inactive</Badge>;
          }
          return <Badge variant='warning-outline'>Pending</Badge>;
        },
        size: 120,
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
        enableSorting: true
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    // No pagination row model on v8, so every row rendered. The shared
    // bundle registers one, and manualPagination is v9's way to say the
    // data is already the page - it keeps the pagination APIs while
    // leaving the rows unsliced.
    manualPagination: true,
    columns,
    data,
    getRowId: (row) => row.id,
    state: { sorting },
    onSortingChange: setSorting
  });
  return (
    <DataGrid
      table={table}
      recordCount={data.length}
      tableLayout={{
        columnsResizable: true,
        headerSticky: true
      }}
      tableClassNames={{
        headerSticky: 'sticky top-0 z-10 bg-ui-muted/90 backdrop-blur-xs'
      }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex items-center justify-between gap-3 px-4 py-2'>
          <div className='flex items-center gap-2'>
            <RegistryIcon
              lucide='CloudDownloadIcon'
              className='text-ui-muted-foreground size-4'
            />
            <span className='text-ui-foreground text-sm font-medium'>
              Remote Data
            </span>
            <Badge variant='secondary' size='sm'>
              {data.length} / {TOTAL_SERVER_RECORDS}
            </Badge>
          </div>
          <CardAction className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleReset}>
              <RegistryIcon lucide='RefreshCwIcon' className='size-4' />
              Start over
            </Button>
            <DataGridExport
              filename='remote-data.csv'
              label=''
              variant='ghost'
              size='icon'
              className='size-8'
              aria-label='Download snapshot'
              title='Download snapshot'
            />
          </CardAction>
        </CardHeader>
        <CardContent className='border-t p-0'>
          <DataGridScrollArea key={resetVersion} className='h-[480px]'>
            <DataGridTableVirtual
              estimateSize={57}
              onFetchMore={fetchMore}
              isFetchingMore={isFetching}
              hasMore={hasMore}
            />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  );
}
