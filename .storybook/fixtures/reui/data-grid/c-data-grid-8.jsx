// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
'use no memo';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
    balance: 5143.03,
    details:
      'Alex is a visionary leader at Apple, focusing on innovation and team growth.'
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
    balance: 4321.87,
    details:
      'Sarah is a technology pioneer specializing in artificial intelligence and machine learning.'
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
    balance: 7654.98,
    details:
      'Michael is a creative designer passionate about building user-centric experiences.'
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
    balance: 3456.45,
    details:
      'Emma is a talented developer focused on innovative solutions in automotive technology.'
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
    balance: 9876.54,
    details:
      'David is a corporate lawyer specializing in technology and software agreements.'
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
    balance: 6214.22,
    details:
      'Aron oversees product development and team leadership at Keenthemes.'
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
    balance: 5321.77,
    details:
      "James manages product development and strategy for BBVA's digital platforms."
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
    balance: 8452.39,
    details:
      "Maria leads innovative marketing campaigns for Sony's flagship products."
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
    balance: 7345.1,
    details:
      'Nick is a data scientist optimizing sales and marketing analytics at LVMH.'
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
    balance: 5214.88,
    details:
      'Liam is a lead engineer developing sustainable energy solutions at ENI.'
  },
  {
    id: '11',
    name: 'Alex Johnson',
    availability: 'busy',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'inactive',
    flag: 'br',
    email: 'alex@vale.br',
    company: 'Vale',
    role: 'Software Engineer',
    joined: 'May, 2023',
    location: 'Brazil',
    balance: 9421.5,
    details:
      'Alex develops cutting-edge software to optimize mining operations at Vale.'
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
    balance: 4521.67,
    details:
      "Sarah manages international sales for Tata's industrial and automotive products."
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
        id: 'id',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button
              aria-label='Collapse'
              {...{
                className:
                  'size-6 text-ui-muted-foreground hover:bg-transparent',
                onClick: row.getToggleExpandedHandler(),
                mode: 'icon',
                variant: 'ghost'
              }}
            >
              {row.getIsExpanded() ? (
                <RegistryIcon lucide='ChevronUpIcon' aria-hidden='true' />
              ) : (
                <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
              )}
            </Button>
          ) : null;
        },
        size: 25,
        meta: {
          expandedContent: (row) => (
            <div className='text-ui-muted-foreground ms-12 py-3 text-sm'>
              {row.details}
            </div>
          )
        }
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Name',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-2'>
              <Avatar className='size-6'>
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
              <a
                href='#'
                className='text-ui-foreground hover:text-ui-primary font-medium'
              >
                {row.original.name}
              </a>
            </div>
          );
        },
        size: 150,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => (
          <a
            href={`mailto:${info.getValue()}`}
            className='hover:text-ui-primary hover:underline'
          >
            {info.getValue()}
          </a>
        ),
        size: 150
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
            <div className='text-ui-foreground font-medium'>
              {row.original.location}
            </div>
          </div>
        ),
        size: 175,
        meta: {
          headerClassName: '',
          cellClassName: 'text-start'
        }
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          if (status == 'active') {
            return <Badge variant='success-outline'>Approved</Badge>;
          } else {
            return <Badge variant='warning-outline'>Pending</Badge>;
          }
        },
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
    getRowCanExpand: (row) => Boolean(row.original.details),
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
      tableLayout={{ headerBackground: false }}
    >
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
