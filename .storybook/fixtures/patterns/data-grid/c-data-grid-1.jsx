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
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
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
    'Northwind',
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
// Every tableLayout flag on one grid: toggle them to compare density, borders, stripes and width.
const layoutOptions = [
  { key: 'dense', label: 'Dense' },
  { key: 'cellBorder', label: 'Cell borders' },
  { key: 'rowBorder', label: 'Row borders' },
  { key: 'stripped', label: 'Stripes' },
  { key: 'rowRounded', label: 'Rounded rows' },
  { key: 'headerBackground', label: 'Header fill' },
  { key: 'headerSticky', label: 'Sticky header' },
  { key: 'autoWidth', label: 'Auto width' }
];
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [layout, setLayout] = useState({
    dense: false,
    cellBorder: false,
    rowBorder: true,
    stripped: true,
    rowRounded: false,
    headerBackground: true,
    headerSticky: true,
    autoWidth: false
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
              src={`/flags/${row.original.flag.toLowerCase()}.svg`}
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
    <DataGrid
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{ ...layout, width: layout.autoWidth ? 'auto' : 'fixed' }}
    >
      <div className='w-full space-y-2.5'>
        <div role='group' aria-label='Layout options' className='flex flex-wrap gap-x-4 gap-y-2'>
          {layoutOptions.map((option) => (
            <Label key={option.key} className='gap-2 text-sm font-normal'>
              <Switch
                size='sm'
                checked={layout[option.key]}
                onCheckedChange={(checked) =>
                  setLayout((current) => ({ ...current, [option.key]: checked }))
                }
              />
              {option.label}
            </Label>
          ))}
        </div>
        <DataGridContainer>
          <DataGridScrollArea className={layout.headerSticky ? 'max-h-80' : undefined}>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  );
}
