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
const users = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'static/images/art/2.svg',
    initials: 'AJ'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'static/images/art/6.svg',
    initials: 'SC'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    avatar:
      'static/images/art/10.svg',
    initials: 'MR'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar:
      'static/images/art/1.svg',
    initials: 'EW'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    avatar:
      'static/images/art/3.svg',
    initials: 'DK'
  },
  {
    id: '6',
    name: 'Aron Thompson',
    email: 'lisa@example.com',
    avatar:
      'static/images/art/7.svg',
    initials: 'LT'
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@example.com',
    avatar:
      'static/images/art/0.svg',
    initials: 'JB'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar:
      'static/images/art/9.svg',
    initials: 'MG'
  },
  {
    id: '9',
    name: 'Nick Johnson',
    email: 'nick@example.com',
    avatar:
      'static/images/art/5.svg',
    initials: 'NJ'
  },
  {
    id: '10',
    name: 'Liam Thompson',
    email: 'liam@example.com',
    avatar:
      'static/images/art/8.svg',
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
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => <>{info.getValue()}</>,
        size: 150,
        meta: {
          headerClassName: '',
          cellClassName: ''
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => (
          <div className='truncate'>
            <a
              href={`mailto:${info.getValue()}`}
              className='hover:text-ui-primary truncate hover:underline'
            >
              {info.getValue()}
            </a>
          </div>
        ),
        size: 150,
        meta: {
          headerClassName: '',
          cellClassName: ''
        }
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <div className='flex items-center gap-1.5'>
            <img
              src={`https://flagcdn.com/${row.original.flag.toLowerCase()}.svg`}
              alt={row.original.flag}
              className='size-4 rounded-full object-cover'
            />
            <div className='text-ui-foreground'>{row.original.location}</div>
          </div>
        ),
        size: 175,
        meta: {
          headerClassName: '',
          cellClassName: ''
        }
      },
      {
        accessorKey: 'balance',
        header: 'Balance ($)',
        cell: (info) => <>${info.getValue().toFixed(2)}</>,
        size: 100,
        meta: {
          headerClassName: 'text-right rtl:text-left',
          cellClassName: 'text-right rtl:text-left'
        }
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
      sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting
  });
  return (
    <DataGrid table={table} recordCount={demoData?.length || 0}>
      <div className='w-full space-y-2.5'>
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  );
}
