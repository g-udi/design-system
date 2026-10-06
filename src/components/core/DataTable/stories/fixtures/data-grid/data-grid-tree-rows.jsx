'use client';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import { DataGridPagination } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import {
  DataGridTable,
  DataGridTableRowExpand
} from '@gaudi/design-system/core/DataTable';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { CardRoot as Card } from '@gaudi/design-system/core/Card';
const demoData = [
  {
    id: 'eng',
    name: 'Engineering',
    type: 'department',
    status: 'active',
    children: [
      {
        id: 'eng-platform',
        name: 'Platform',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'eng-platform-1',
            name: 'Anouk Varga',
            type: 'member',
            status: 'active',
            role: 'Staff Engineer',
            avatar:
              '/avatars/person-41.svg',
            flag: 'us',
            location: 'United States'
          },
          {
            id: 'eng-platform-2',
            name: 'Sabine Okafor',
            type: 'member',
            status: 'active',
            role: 'Senior Engineer',
            avatar:
              '/avatars/person-20.svg',
            flag: 'gb',
            location: 'United Kingdom'
          },
          {
            id: 'eng-platform-3',
            name: 'Rafe Okonkwo',
            type: 'member',
            status: 'inactive',
            role: 'Frontend Engineer',
            avatar:
              '/avatars/person-31.svg',
            flag: 'ca',
            location: 'Canada'
          }
        ]
      },
      {
        id: 'eng-mobile',
        name: 'Mobile',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'eng-mobile-1',
            name: 'Ilse Valtonen',
            type: 'member',
            status: 'active',
            role: 'iOS Engineer',
            avatar:
              '/avatars/person-24.svg',
            flag: 'au',
            location: 'Australia'
          },
          {
            id: 'eng-mobile-2',
            name: 'Ottilie Nakamura',
            type: 'member',
            status: 'active',
            role: 'Android Engineer',
            avatar:
              '/avatars/person-45.svg',
            flag: 'de',
            location: 'Germany'
          }
        ]
      }
    ]
  },
  {
    id: 'design',
    name: 'Design',
    type: 'department',
    status: 'active',
    children: [
      {
        id: 'design-product',
        name: 'Product Design',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'design-product-1',
            name: 'Aurelio Brandt',
            type: 'member',
            status: 'active',
            role: 'Design Lead',
            avatar:
              '/avatars/person-50.svg',
            flag: 'my',
            location: 'Malaysia'
          },
          {
            id: 'design-product-2',
            name: 'Mireille Gaspard',
            type: 'member',
            status: 'active',
            role: 'Product Designer',
            avatar:
              '/avatars/person-25.svg',
            flag: 'jp',
            location: 'Japan'
          },
          {
            id: 'design-product-3',
            name: 'Felix Arrowsmith',
            type: 'member',
            status: 'inactive',
            role: 'UX Researcher',
            avatar:
              '/avatars/person-47.svg',
            flag: 'es',
            location: 'Spain'
          }
        ]
      },
      {
        id: 'design-brand',
        name: 'Brand',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'design-brand-1',
            name: 'Barnaby Okafor',
            type: 'member',
            status: 'active',
            role: 'Brand Designer',
            avatar:
              '/avatars/person-07.svg',
            flag: 'fr',
            location: 'France'
          },
          {
            id: 'design-brand-2',
            name: 'Quentin Hale',
            type: 'member',
            status: 'inactive',
            role: 'Motion Designer',
            avatar:
              '/avatars/person-23.svg',
            flag: 'it',
            location: 'Italy'
          }
        ]
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    type: 'department',
    status: 'active',
    children: [
      {
        id: 'marketing-growth',
        name: 'Growth',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'marketing-growth-1',
            name: 'Orla Martel',
            type: 'member',
            status: 'active',
            role: 'Growth Lead',
            avatar:
              '/avatars/person-20.svg',
            flag: 'us',
            location: 'United States'
          },
          {
            id: 'marketing-growth-2',
            name: 'Caspian Tremaine',
            type: 'member',
            status: 'active',
            role: 'Performance Marketer',
            avatar:
              '/avatars/person-41.svg',
            flag: 'ca',
            location: 'Canada'
          }
        ]
      },
      {
        id: 'marketing-content',
        name: 'Content',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'marketing-content-1',
            name: 'Sorrel Rossetti',
            type: 'member',
            status: 'active',
            role: 'Content Lead',
            avatar:
              '/avatars/person-24.svg',
            flag: 'it',
            location: 'Italy'
          },
          {
            id: 'marketing-content-2',
            name: 'Quinlan Meyrick',
            type: 'member',
            status: 'inactive',
            role: 'Copywriter',
            avatar:
              '/avatars/person-31.svg',
            flag: 'de',
            location: 'Germany'
          }
        ]
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    type: 'department',
    status: 'active',
    children: [
      {
        id: 'operations-finance',
        name: 'Finance',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'operations-finance-1',
            name: 'Pernille Sato',
            type: 'member',
            status: 'active',
            role: 'Finance Lead',
            avatar:
              '/avatars/person-25.svg',
            flag: 'kr',
            location: 'South Korea'
          },
          {
            id: 'operations-finance-2',
            name: 'Severin Dvořák',
            type: 'member',
            status: 'active',
            role: 'Accountant',
            avatar:
              '/avatars/person-45.svg',
            flag: 'cz',
            location: 'Czechia'
          }
        ]
      },
      {
        id: 'operations-people',
        name: 'People',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'operations-people-1',
            name: 'Lys Aubertin',
            type: 'member',
            status: 'active',
            role: 'People Lead',
            avatar:
              '/avatars/person-20.svg',
            flag: 'fr',
            location: 'France'
          },
          {
            id: 'operations-people-2',
            name: 'Rhian Walcott',
            type: 'member',
            status: 'active',
            role: 'Recruiter',
            avatar:
              '/avatars/person-50.svg',
            flag: 'ie',
            location: 'Ireland'
          }
        ]
      }
    ]
  },
  {
    id: 'sales',
    name: 'Sales',
    type: 'department',
    status: 'active',
    children: [
      {
        id: 'sales-accounts',
        name: 'Accounts',
        type: 'team',
        status: 'active',
        children: [
          {
            id: 'sales-accounts-1',
            name: 'Mireille Pakarinen',
            type: 'member',
            status: 'active',
            role: 'Account Executive',
            avatar:
              '/avatars/person-24.svg',
            flag: 'kr',
            location: 'South Korea'
          },
          {
            id: 'sales-accounts-2',
            name: 'Linnea Fairweather',
            type: 'member',
            status: 'inactive',
            role: 'Account Manager',
            avatar:
              '/avatars/person-47.svg',
            flag: 'at',
            location: 'Austria'
          }
        ]
      }
    ]
  }
];
function collectImageUrls(rows) {
  return rows.flatMap((row) => [
    ...(row.avatar ? [row.avatar] : []),
    ...(row.flag ? [`/flags/${row.flag.toLowerCase()}.svg`] : []),
    ...(row.children ? collectImageUrls(row.children) : [])
  ]);
}
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4
  });
  const [sorting, setSorting] = useState([]);
  const [expanded, setExpanded] = useState({
    eng: true,
    'eng-platform': true
  });
  useEffect(() => {
    for (const src of collectImageUrls(demoData)) {
      const image = new Image();
      image.src = src;
    }
  }, []);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='Name' column={column} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className='flex items-center gap-1'>
              <DataGridTableRowExpand row={row} className='-ms-1.5 -me-1' />
              {item.type === 'member' ? (
                <>
                  <Avatar className='size-6 shrink-0'>
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>
                      {item.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <a
                    href='#'
                    className='text-ui-foreground hover:text-ui-primary font-medium'
                  >
                    {item.name}
                  </a>
                </>
              ) : (
                <span className='text-ui-foreground font-medium'>
                  {item.name}
                </span>
              )}
            </div>
          );
        },
        minSize: 260,
        enableSorting: true,
        enableHiding: false,
        meta: {
          autoSize: true
        }
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataGridColumnHeader title='Role' column={column} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className='text-ui-muted-foreground'>
              {item.role ??
                (item.type === 'department' ? 'Department' : 'Team')}
            </div>
          );
        },
        size: 180
      },
      {
        accessorKey: 'location',
        header: ({ column }) => (
          <DataGridColumnHeader title='Location' column={column} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          if (!item.location || !item.flag) {
            return <span className='text-ui-muted-foreground'>-</span>;
          }
          return (
            <div className='flex items-center gap-1.5'>
              <img
                src={`/flags/${item.flag.toLowerCase()}.svg`}
                alt={item.flag}
                className='size-4 rounded-full object-cover'
              />
              <div className='text-ui-foreground font-medium'>
                {item.location}
              </div>
            </div>
          );
        },
        size: 180
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' column={column} />
        ),
        cell: ({ row }) => {
          if (row.original.status === 'active') {
            return <Badge variant='success-outline'>Active</Badge>;
          }
          return <Badge variant='warning-outline'>Inactive</Badge>;
        },
        size: 130
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
    getSubRows: (row) => row.children,
    state: {
      pagination,
      sorting,
      expanded
    },
    // Keep expanded children on the same page as their parent.
    paginateExpandedRows: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded
  });
  return (
    <DataGrid
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true
      }}
    >
      <div className='w-full space-y-2.5'>
        <Card className='overflow-hidden p-0'>
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </Card>
        <DataGridPagination sizes={[4, 8, 16]} />
      </div>
    </DataGrid>
  );
}
