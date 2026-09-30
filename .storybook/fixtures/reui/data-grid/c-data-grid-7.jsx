// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
    joined: 'Apr, 2021',
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
    joined: 'Jul, 2020',
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
    joined: 'Mar, 2019',
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
    joined: 'Jan, 2022',
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
    joined: 'May, 2023',
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
    joined: 'Nov, 2018',
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
    joined: 'Jun, 2021',
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
    joined: 'Oct, 2020',
    location: 'Japan',
    balance: 8452.39
  },
  {
    id: '9',
    name: 'Nick Johnson',
    availability: 'online',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    status: 'active',
    flag: 'fr',
    email: 'nick@lvmh.fr',
    company: 'LVMH',
    role: 'Data Scientist',
    joined: 'Sep, 2019',
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
    joined: 'Feb, 2023',
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
    joined: 'Dec, 2022',
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
    joined: 'Mar, 2020',
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
  const [rowSelection, setRowSelection] = useState({});
  const [_selectedIds, setSelectedIds] = useState([]);
  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length > 0) {
      setSelectedIds(selectedRowIds);
    } else {
      setSelectedIds([]);
    }
  }, [rowSelection]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 20,
        meta: {
          headerClassName: '',
          cellClassName: ''
        }
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const availability = row.original.availability;
          const statusColors = {
            online: 'bg-green-500',
            away: 'bg-yellow-500',
            busy: 'bg-orange-500',
            offline: 'bg-gray-400'
          };
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
                <AvatarBadge
                  className={cn(
                    'size-1.5! p-0',
                    statusColors[availability] || statusColors.offline
                  )}
                />
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
        size: 200,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1.5'>
              <img
                src={`https://flagcdn.com/${row.original.flag.toLowerCase()}.svg`}
                alt={row.original.flag}
                className='size-4 rounded-full object-cover'
              />
              <div className='text-ui-foreground font-medium'>
                {row.original.location}
              </div>
            </div>
          );
        },
        size: 180,
        meta: {
          headerClassName: '',
          cellClassName: 'text-start'
        }
      },
      {
        accessorKey: 'joined',
        header: 'Joined',
        cell: (info) => info.getValue(),
        size: 120,
        meta: {
          headerClassName: '',
          cellClassName: 'font-medium'
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
      sorting,
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
