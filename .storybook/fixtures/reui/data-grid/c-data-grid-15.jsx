// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  DataGridContainer,
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
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
const demoData = [
  {
    id: '1',
    name: 'Alex Johnson',
    availability: 'online',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'active',
    flag: 'us',
    email: 'alex@apple.com',
    company: 'Apple',
    role: 'CEO',
    joined: 'Jan, 2024',
    location: 'United States',
    balance: 5143.03
  },
  {
    id: '2',
    name: 'Sarah Chen',
    availability: 'away',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'inactive',
    flag: 'gb',
    email: 'sarah@openai.com',
    company: 'OpenAI',
    role: 'CTO',
    joined: 'Mar, 2023',
    location: 'United Kingdom',
    balance: 4321.87
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    availability: 'busy',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    status: 'active',
    flag: 'ca',
    email: 'michael@meta.com',
    company: 'Meta',
    role: 'Designer',
    joined: 'Jun, 2022',
    location: 'Canada',
    balance: 7654.98
  },
  {
    id: '4',
    name: 'Emma Wilson',
    availability: 'offline',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'inactive',
    flag: 'au',
    email: 'emma@tesla.com',
    company: 'Tesla',
    role: 'Developer',
    joined: 'Sep, 2024',
    location: 'Australia',
    balance: 3456.45
  },
  {
    id: '5',
    name: 'David Kim',
    availability: 'online',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    status: 'active',
    flag: 'de',
    email: 'david@sap.com',
    company: 'SAP',
    role: 'Lawyer',
    joined: 'Nov, 2023',
    location: 'Germany',
    balance: 9876.54
  },
  {
    id: '6',
    name: 'Aron Thompson',
    availability: 'away',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    status: 'active',
    flag: 'my',
    email: 'aron@keenthemes.com',
    company: 'Keenthemes',
    role: 'Director',
    joined: 'Feb, 2022',
    location: 'Malaysia',
    balance: 6214.22
  },
  {
    id: '7',
    name: 'James Brown',
    availability: 'busy',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    status: 'inactive',
    flag: 'es',
    email: 'james@bbva.es',
    company: 'BBVA',
    role: 'Product Manager',
    joined: 'Aug, 2024',
    location: 'Spain',
    balance: 5321.77
  },
  {
    id: '8',
    name: 'Maria Garcia',
    availability: 'offline',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    status: 'active',
    flag: 'jp',
    email: 'maria@sony.jp',
    company: 'Sony',
    role: 'Marketing Lead',
    joined: 'Dec, 2023',
    location: 'Japan',
    balance: 8452.39
  },
  {
    id: '9',
    name: 'Nick Johnson',
    availability: 'online',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    status: 'inactive',
    flag: 'fr',
    email: 'nick@lvmh.fr',
    company: 'LVMH',
    role: 'Data Scientist',
    joined: 'Apr, 2022',
    location: 'France',
    balance: 7345.1
  },
  {
    id: '10',
    name: 'Liam Thompson',
    availability: 'away',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    status: 'inactive',
    flag: 'it',
    email: 'liam@eni.it',
    company: 'ENI',
    role: 'Engineer',
    joined: 'Jul, 2024',
    location: 'Italy',
    balance: 5214.88
  },
  {
    id: '11',
    name: 'Alex Johnson',
    availability: 'busy',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'active',
    flag: 'br',
    email: 'alex@vale.br',
    company: 'Vale',
    role: 'Software Engineer',
    joined: 'May, 2023',
    location: 'Brazil',
    balance: 9421.5
  },
  {
    id: '12',
    name: 'Sarah Chen',
    availability: 'offline',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'active',
    flag: 'in',
    email: 'sarah@tata.in',
    company: 'Tata',
    role: 'Sales Manager',
    joined: 'Oct, 2024',
    location: 'India',
    balance: 4521.67
  }
];
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
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='Staff' column={column} />
        ),
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
        minSize: 300,
        meta: {
          autoSize: true
        },
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'role',
        id: 'role',
        header: ({ column }) => (
          <DataGridColumnHeader title='Occupation' column={column} />
        ),
        cell: ({ row }) => {
          return (
            <div className='space-y-0.5'>
              <div className='text-ui-foreground font-medium'>
                {row.original.role}
              </div>
              <div className='text-ui-muted-foreground'>
                {row.original.company}
              </div>
            </div>
          );
        },
        size: 200,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' column={column} />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          if (status == 'active') {
            return <Badge variant='success-outline'>Approved</Badge>;
          } else {
            return <Badge variant='warning-outline'>Pending</Badge>;
          }
        },
        size: 200,
        enableResizing: false
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
    <DataGrid
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{ columnsResizable: true }}
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
