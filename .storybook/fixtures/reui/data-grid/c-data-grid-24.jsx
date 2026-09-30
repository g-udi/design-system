// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from '../../../../src/hooks/use-copy-to-clipboard.js';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import { toast } from 'sonner';
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
  CardFooter,
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const demoData = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'CEO',
    status: 'Active',
    balance: 5143.03
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'CTO',
    status: 'Inactive',
    balance: 4321.87
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    role: 'Designer',
    status: 'Blocked',
    balance: 7654.98
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Developer',
    status: 'Inactive',
    balance: 3456.45
  },
  {
    id: '5',
    name: 'David Kim',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    role: 'Lawyer',
    status: 'Active',
    balance: 9876.54
  },
  {
    id: '6',
    name: 'Aron Thompson',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    role: 'Director',
    status: 'Pending',
    balance: 6214.22
  },
  {
    id: '7',
    name: 'James Brown',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    role: 'Product Manager',
    status: 'Inactive',
    balance: 5321.77
  },
  {
    id: '8',
    name: 'Maria Garcia',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    role: 'Marketing Lead',
    status: 'Blocked',
    balance: 8452.39
  },
  {
    id: '9',
    name: 'Nick Johnson',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    role: 'Data Scientist',
    status: 'Pending',
    balance: 7345.1
  },
  {
    id: '10',
    name: 'Liam Thompson',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'Engineer',
    status: 'Inactive',
    balance: 5214.88
  }
];
function ActionsCell({ row }) {
  const { copyToClipboard } = useCopyToClipboard();
  const handleCopyId = () => {
    copyToClipboard(row.original.id);
    toast.success('Employee ID copied', { description: row.original.id });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='More actions'
          className='size-7'
          size='icon'
          variant='ghost'
        >
          <RegistryIcon lucide='MoreHorizontalIcon' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start'>
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const totalBalance = useMemo(
    () => demoData.reduce((sum, row) => sum + row.balance, 0),
    []
  );
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 35,
        enableResizing: false
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='User' visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Avatar className='size-8'>
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='text-ui-foreground font-medium'>
              {row.original.name}
            </div>
          </div>
        ),
        minSize: 200,
        meta: {
          autoSize: true
        },
        enableSorting: true,
        enableHiding: false,
        enableResizing: true
      },
      {
        accessorKey: 'role',
        id: 'role',
        header: ({ column }) => (
          <DataGridColumnHeader title='Role' visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className='text-ui-foreground font-medium'>
            {row.original.role}
          </div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' visibility column={column} />
        ),
        cell: ({ row }) => {
          const s = row.original.status;
          if (s === 'Active')
            return <Badge variant='success-outline'>Active</Badge>;
          if (s === 'Blocked')
            return <Badge variant='destructive-outline'>Blocked</Badge>;
          if (s === 'Inactive')
            return <Badge variant='info-outline'>Inactive</Badge>;
          return <Badge variant='warning-outline'>Pending</Badge>;
        },
        size: 110,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'balance',
        id: 'balance',
        header: ({ column }) => (
          <DataGridColumnHeader title='Balance' visibility column={column} />
        ),
        cell: ({ row }) => (
          <div className='text-ui-foreground font-medium tabular-nums'>
            $
            {row.original.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </div>
        ),
        size: 130,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 60,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false
      }
    ],
    []
  );
  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.id));
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil(demoData.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: { pagination, sorting, columnOrder },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting
  });
  const visibleCount = table.getVisibleLeafColumns().length;
  const footer = (
    <DataGridTableFootRow>
      {/* Label spans checkbox + user + role + status */}
      <DataGridTableFootRowCell colSpan={visibleCount - 2}>
        <span className='text-ui-muted-foreground'>Total balance</span>
      </DataGridTableFootRowCell>
      {/* Balance total */}
      <DataGridTableFootRowCell className='font-bold tabular-nums'>
        ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </DataGridTableFootRowCell>
      {/* Actions column - empty */}
      <DataGridTableFootRowCell />
    </DataGridTableFootRow>
  );
  return (
    <DataGrid
      table={table}
      recordCount={demoData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsVisibility: true
      }}
    >
      <Card className='w-full gap-0 py-0'>
        <CardHeader className='flex items-center justify-between px-3.5 py-2'>
          <div className='flex items-center gap-2'>
            <RegistryIcon
              lucide='TableIcon'
              className='text-ui-muted-foreground size-4'
            />
            <span className='text-ui-foreground text-sm font-medium'>
              Employee Balances
            </span>
          </div>
          <CardAction>
            <Button variant='outline' size='sm'>
              <RegistryIcon lucide='DownloadIcon' />
              Export
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='border-y px-0'>
          <DataGridScrollArea>
            <DataGridTable footerContent={footer} />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className='border-none bg-transparent! px-3.5 py-2'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
