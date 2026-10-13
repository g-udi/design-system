'use client';
import { useMemo, useState } from 'react';
import Link from '@gaudi/design-system/core/Link';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import { DataGridPagination } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import {
  DataGridTableDndRowHandle,
  DataGridTableDndRows
} from '@gaudi/design-system/core/DataTable';
import { arrayMove } from '@dnd-kit/sortable';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
const FOLLOW_POINTER = [({ transform }) => transform];
const demoData = [
  {
    id: '1',
    name: 'Anouk Varga',
    availability: 'online',
    avatar:
      '/avatars/person-41.svg',
    status: 'active',
    flag: 'us',
    email: 'anouk@harbourline.example',
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
    email: 'sabine@lumen-press.example',
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
    email: 'rafe@northgate.example',
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
    email: 'ilse@kestrel.example',
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
    email: 'ottilie@brightwater.example',
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
    email: 'aurelio@northwind.dev',
    company: 'Northwind',
    role: 'Director',
    joined: 'Feb, 2022',
    location: 'Malaysia',
    balance: 6214.22
  }
];
export function Pattern() {
  const columns = useMemo(
    () => [
      {
        id: 'drag',
        cell: () => <DataGridTableDndRowHandle />,
        size: 30
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
              <Link href='#'>{row.original.name}</Link>
            </div>
          );
        },
        size: 170,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'email',
        id: 'email',
        header: 'Email',
        cell: (info) => (
          <Link
            href={`mailto:${info.getValue()}`}
            variant='bare'
            title={info.getValue()}
            className='block truncate hover:text-ui-primary hover:underline'
          >
            {info.getValue()}
          </Link>
        ),
        size: 150,
        meta: {
          headerClassName: '',
          cellClassName: ''
        }
      },
      {
        accessorKey: 'location',
        id: 'location',
        header: 'Location',
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
        size: 170,
        meta: {
          headerClassName: '',
          cellClassName: 'text-start'
        }
      }
    ],
    []
  );
  const [data, setData] = useState(demoData);
  const dataIds = useMemo(() => data?.map(({ id }) => id), [data]);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data2) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data2, oldIndex, newIndex);
      });
    }
  };
  const table = useTable({
    features: dataGridFeatures,
    // No pagination row model on v8, so every row rendered. The shared
    // bundle registers one, and manualPagination is v9's way to say the
    // data is already the page - it keeps the pagination APIs while
    // leaving the rows unsliced.
    manualPagination: true,
    columns,
    data,
    getRowId: (row) => row.id
  });
  return (
    <DataGrid
      table={table}
      recordCount={data?.length || 0}
      tableLayout={{ rowsDraggable: true }}
    >
      <div className='w-full space-y-2.5'>
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTableDndRows
              handleDragEnd={handleDragEnd}
              dataIds={dataIds}
              modifiers={FOLLOW_POINTER}
            />
          </DataGridScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  );
}
