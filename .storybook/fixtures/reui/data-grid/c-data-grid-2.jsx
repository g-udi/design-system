// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import { DataGridTable } from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
const users = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    initials: 'MR'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    initials: 'EW'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    initials: 'DK'
  },
  {
    id: '6',
    name: 'Aron Thompson',
    email: 'lisa@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    initials: 'LT'
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    initials: 'JB'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    initials: 'MG'
  },
  {
    id: '9',
    name: 'Nick Johnson',
    email: 'nick@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    initials: 'NJ'
  },
  {
    id: '10',
    name: 'Liam Thompson',
    email: 'liam@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LT'
  }
];
const demoData = users.map((user, index) => ({
  ...user,
  availability: ['online', 'away', 'busy', 'offline'][index % 4],
  status: index % 2 === 0 ? 'active' : 'inactive',
  flag: ['us', 'gb', 'ca', 'au', 'de', 'my', 'es', 'jp', 'fr', 'it'][
    index % 10
  ],
  company: [
    'Apple',
    'OpenAI',
    'Meta',
    'Tesla',
    'SAP',
    'Keenthemes',
    'BBVA',
    'Sony',
    'LVMH',
    'ENI'
  ][index % 10],
  role: [
    'CEO',
    'CTO',
    'Designer',
    'Developer',
    'Lawyer',
    'Director',
    'Product Manager',
    'Marketing Lead',
    'Data Scientist',
    'Engineer'
  ][index % 10],
  joined: 'Jan, 2024',
  location: [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'Malaysia',
    'Spain',
    'Japan',
    'France',
    'Italy'
  ][index % 10],
  balance: 5143.03 + index * 100
}));
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([{ id: 'name', desc: true }]);
  const [columnOrder, setColumnOrder] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Name',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-3'>
              <Avatar className='size-8'>
                <AvatarImage
                  src={row.original.avatar}
                  alt={row.original.name}
                />
                <AvatarFallback>
                  {row.original.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className='space-y-px'>
                <div className='text-ui-foreground font-medium'>
                  {row.original.name}
                </div>
                <div className='text-ui-muted-foreground'>
                  {row.original.email}
                </div>
              </div>
            </div>
          );
        },
        size: 250,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'company',
        header: 'Company',
        cell: (info) => <span>{info.getValue()}</span>,
        size: 100,
        meta: {
          headerClassName: ''
        }
      },
      {
        accessorKey: 'role',
        header: 'Occupation',
        cell: (info) => <span>{info.getValue()}</span>,
        size: 100,
        meta: {
          headerClassName: ''
        }
      },
      {
        accessorKey: 'balance',
        header: 'Salary',
        cell: (info) => (
          <span className='font-semibold'>${info.getValue().toFixed(2)}</span>
        ),
        size: 100
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder
  });
  return (
    <DataGrid
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{
        cellBorder: true
      }}
    >
      <div className='w-full space-y-2.5'>
        <Card className='p-0'>
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </Card>
        <DataGridPagination />
      </div>
    </DataGrid>
  );
}
