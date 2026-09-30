// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import { DataGridTableVirtual } from '../../../../src/components/core/DataTable/parts/data-grid-table-virtual-extended.jsx';
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
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const avatars = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/11.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/49.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg'
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
const departments = [
  'Engineering',
  'Marketing',
  'Design',
  'Sales',
  'Finance',
  'Operations',
  'Legal',
  'Support'
];
const statuses = ['Active', 'Inactive', 'Pending'];
function generateData(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: names[i % names.length],
    avatar: avatars[i % avatars.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    balance: Math.round((Math.random() * 9e3 + 1e3) * 100) / 100
  }));
}
const allData = generateData(200);
export function Pattern() {
  const [sorting, setSorting] = useState([]);
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
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className='text-ui-foreground font-medium'>
              {row.original.name}
            </span>
          </div>
        ),
        minSize: 150,
        meta: {
          autoSize: true
        },
        enableSorting: true
      },
      {
        accessorKey: 'department',
        id: 'department',
        header: ({ column }) => (
          <DataGridColumnHeader title='Department' column={column} />
        ),
        cell: ({ row }) => row.original.department,
        size: 150,
        enableSorting: true
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' column={column} />
        ),
        cell: ({ row }) => {
          const s = row.original.status;
          if (s === 'Active')
            return <Badge variant='success-outline'>Active</Badge>;
          if (s === 'Inactive')
            return <Badge variant='info-outline'>Inactive</Badge>;
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
        enableSorting: true,
        enableResizing: true
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
    data: allData,
    getRowId: (row) => row.id,
    state: { sorting },
    onSortingChange: setSorting
  });
  return (
    <DataGrid
      table={table}
      recordCount={allData.length}
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
          <CardTitle className='text-sm font-medium'>
            Virtualized Directory
          </CardTitle>
          <CardAction>
            <Button variant='outline' size='sm'>
              <RegistryIcon lucide='RefreshCwIcon' />
              Refresh
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='border-t p-0'>
          <DataGridScrollArea className='h-[480px]'>
            <DataGridTableVirtual estimateSize={49} />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  );
}
