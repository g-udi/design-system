'use client';
import { useMemo, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import { DataGridColumnFilter } from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import { DataGridPagination } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import { DataGridTable } from '@gaudi/design-system/core/DataTable';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  CardRoot as Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const demoData = [
  {
    id: '1',
    name: 'Anouk Varga',
    availability: 'online',
    avatar:
      '/avatars/person-41.svg',
    status: 'active',
    flag: 'us',
    email: 'anouk@example.com',
    company: 'Apple',
    role: 'CEO',
    joined: 'Jan, 2024',
    location: 'United States',
    balance: 5143.03
  },
  {
    id: '2',
    name: 'Sabine Okafor',
    availability: 'away',
    avatar:
      '/avatars/person-20.svg',
    status: 'inactive',
    flag: 'gb',
    email: 'sabine@example.com',
    company: 'OpenAI',
    role: 'CTO',
    joined: 'Mar, 2023',
    location: 'United Kingdom',
    balance: 4321.87
  },
  {
    id: '3',
    name: 'Rafe Okonkwo',
    availability: 'busy',
    avatar:
      '/avatars/person-31.svg',
    status: 'active',
    flag: 'ca',
    email: 'rafe@example.com',
    company: 'Meta',
    role: 'Designer',
    joined: 'Jun, 2022',
    location: 'Canada',
    balance: 7654.98
  },
  {
    id: '4',
    name: 'Ilse Valtonen',
    availability: 'offline',
    avatar:
      '/avatars/person-24.svg',
    status: 'inactive',
    flag: 'au',
    email: 'ilse@example.com',
    company: 'Tesla',
    role: 'Developer',
    joined: 'Sep, 2024',
    location: 'Australia',
    balance: 3456.45
  },
  {
    id: '5',
    name: 'Ottilie Nakamura',
    availability: 'online',
    avatar:
      '/avatars/person-45.svg',
    status: 'active',
    flag: 'de',
    email: 'ottilie@example.com',
    company: 'SAP',
    role: 'Lawyer',
    joined: 'Nov, 2023',
    location: 'Germany',
    balance: 9876.54
  },
  {
    id: '6',
    name: 'Aurelio Brandt',
    availability: 'away',
    avatar:
      '/avatars/person-50.svg',
    status: 'active',
    flag: 'my',
    email: 'nell@example.com',
    company: 'Northwind',
    role: 'Director',
    joined: 'Feb, 2022',
    location: 'Malaysia',
    balance: 6214.22
  },
  {
    id: '7',
    name: 'Felix Arrowsmith',
    availability: 'busy',
    avatar:
      '/avatars/person-47.svg',
    status: 'inactive',
    flag: 'es',
    email: 'felix@example.com',
    company: 'BBVA',
    role: 'Product Manager',
    joined: 'Aug, 2024',
    location: 'Spain',
    balance: 5321.77
  },
  {
    id: '8',
    name: 'Mireille Gaspard',
    availability: 'offline',
    avatar:
      '/avatars/person-25.svg',
    status: 'active',
    flag: 'jp',
    email: 'mireille@example.com',
    company: 'Sony',
    role: 'Marketing Lead',
    joined: 'Dec, 2023',
    location: 'Japan',
    balance: 8452.39
  },
  {
    id: '9',
    name: 'Barnaby Okafor',
    availability: 'online',
    avatar:
      '/avatars/person-07.svg',
    status: 'active',
    flag: 'fr',
    email: 'barnaby@example.com',
    company: 'LVMH',
    role: 'Data Scientist',
    joined: 'Apr, 2022',
    location: 'France',
    balance: 7345.1
  },
  {
    id: '10',
    name: 'Quentin Hale',
    availability: 'away',
    avatar:
      '/avatars/person-23.svg',
    status: 'inactive',
    flag: 'it',
    email: 'quentin@example.com',
    company: 'ENI',
    role: 'Engineer',
    joined: 'Jul, 2024',
    location: 'Italy',
    balance: 5214.88
  },
  {
    id: '11',
    name: 'Anouk Varga',
    availability: 'busy',
    avatar:
      '/avatars/person-41.svg',
    status: 'active',
    flag: 'br',
    email: 'anouk@example.com',
    company: 'Vale',
    role: 'Software Engineer',
    joined: 'May, 2023',
    location: 'Brazil',
    balance: 9421.5
  },
  {
    id: '12',
    name: 'Sabine Okafor',
    availability: 'offline',
    avatar:
      '/avatars/person-20.svg',
    status: 'active',
    flag: 'in',
    email: 'sabine@example.com',
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
          <DataGridColumnHeader
            title='User'
            icon={<RegistryIcon lucide='UserIcon' />}
            visibility={true}
            column={column}
          />
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
        minSize: 200,
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
          <DataGridColumnHeader
            title='Location'
            icon={<RegistryIcon lucide='MapPinIcon' />}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1.5'>
              <img
                src={`/flags/${row.original.flag.toLowerCase()}.svg`}
                alt={row.original.flag}
                className='size-4 rounded-full object-cover'
              />
              <div className='text-ui-foreground font-medium'>
                {row.original.location}
              </div>
            </div>
          );
        },
        size: 200,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'status',
        filterFn: (row, id, values) => values.includes(row.getValue(id)),
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Status'
            icon={<RegistryIcon lucide='CircleCheckIcon' />}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          if (status == 'active') {
            return <Badge variant='primary-outline'>Approved</Badge>;
          } else {
            return <Badge variant='destructive-outline'>Pending</Badge>;
          }
        },
        size: 200,
        enableSorting: true,
        enableHiding: true,
        enableResizing: false
      }
    ],
    []
  );
  const [columnOrder, setColumnOrder] = useState(
    [columns[0].id]
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
      tableClassNames={{
        edgeCell: 'px-5'
      }}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true
      }}
    >
      <Card className='w-full gap-3 py-3.5'>
        <CardHeader className='flex items-center justify-between px-3.5'>
          <CardTitle>Users</CardTitle>
          <CardAction>
            <DataGridColumnFilter
              column={table.getColumn('status')}
              title='Status filter'
              options={[{ value: 'active', label: 'Approved' }, { value: 'inactive', label: 'Pending' }]}
            />
          </CardAction>
        </CardHeader>
        <DataGridContainer className='border-y'>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <CardFooter className='border-none bg-transparent! px-3.5 py-0'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
