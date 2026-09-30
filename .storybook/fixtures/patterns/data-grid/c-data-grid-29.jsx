'use client';
'use no memo';
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from '../../../../src/hooks/use-copy-to-clipboard.js';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableRowPin,
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
    status: 'Active',
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
    status: 'Active',
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
  },
  {
    id: '11',
    name: 'Olivia Martinez',
    avatar:
      'static/images/art/11.svg',
    role: 'VP of Sales',
    status: 'Active',
    balance: 11234.56
  },
  {
    id: '12',
    name: 'Ethan Park',
    avatar:
      'static/images/art/5.svg',
    role: 'DevOps Lead',
    status: 'Active',
    balance: 8910.33
  },
  {
    id: '13',
    name: 'Sophie Taylor',
    avatar:
      'static/images/art/6.svg',
    role: 'UX Researcher',
    status: 'Pending',
    balance: 6543.21
  },
  {
    id: '14',
    name: 'Ryan Mitchell',
    avatar:
      'static/images/art/4.svg',
    role: 'Architect',
    status: 'Inactive',
    balance: 7821.44
  },
  {
    id: '15',
    name: 'Isabella Wong',
    avatar:
      'static/images/art/1.svg',
    role: 'QA Manager',
    status: 'Active',
    balance: 5678.9
  }
];
function ActionsCell({ row }) {
  const { copyToClipboard } = useCopyToClipboard();
  const isPinned = row.getIsPinned();
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
        <DropdownMenuItem onClick={() => row.pin(isPinned ? false : 'top')}>
          {isPinned ? 'Unpin row' : 'Pin to top'}
        </DropdownMenuItem>
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
    pageSize: 10
  });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [rowPinning, setRowPinning] = useState({
    top: [],
    bottom: []
  });
  const [rowSelection, setRowSelection] = useState({});
  const selected = Object.keys(rowSelection).length;
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false
      },
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => (
          <Button
            aria-label={row.getIsExpanded() ? `Hide ${row.original.name}` : `Show ${row.original.name}`}
            aria-expanded={row.getIsExpanded()}
            className='text-ui-muted-foreground size-6 hover:bg-transparent'
            onClick={row.getToggleExpandedHandler()}
            mode='icon'
            variant='ghost'
          >
            <RegistryIcon
              lucide='ChevronRightIcon'
              aria-hidden='true'
              className={row.getIsExpanded() ? 'rotate-90 transition-transform' : 'transition-transform'}
            />
          </Button>
        ),
        size: 36,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        meta: {
          expandedContent: (row) => (
            <div className='text-ui-muted-foreground ms-24 py-2.5 text-sm'>
              {row.name} works as {row.role} with a balance of $
              {row.balance.toFixed(2)}. Pin the row to keep it above the page as you sort or page.
            </div>
          )
        }
      },
      {
        id: 'pin',
        header: '',
        cell: ({ row }) => <DataGridTableRowPin row={row} />,
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='User' column={column} />
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
            <div className='text-ui-foreground min-w-0 truncate font-medium'>
              {row.original.name}
            </div>
          </div>
        ),
        minSize: 150,
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
          <DataGridColumnHeader title='Role' column={column} />
        ),
        cell: ({ row }) => (
          <span className='text-ui-foreground'>{row.original.role}</span>
        ),
        size: 160,
        enableSorting: true
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' column={column} />
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
        size: 120,
        enableSorting: true
      },
      {
        accessorKey: 'balance',
        id: 'balance',
        header: ({ column }) => (
          <DataGridColumnHeader title='Balance' column={column} />
        ),
        cell: ({ row }) => (
          <span className='text-ui-foreground tabular-nums'>
            $
            {row.original.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </span>
        ),
        size: 140,
        enableSorting: true
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
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil(demoData.length / pagination.pageSize),
    getRowId: (row) => row.id,
    enableRowPinning: true,
    keepPinnedRows: true,
    enableRowSelection: true,
    getRowCanExpand: () => true,
    state: { pagination, sorting, rowPinning, rowSelection },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onRowPinningChange: setRowPinning
  });
  return (
    <DataGrid
      table={table}
      recordCount={demoData.length}
      tableLayout={{
        rowsPinnable: true,
        columnsResizable: true
      }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex items-center justify-between px-3 py-2'>
          <div className='flex items-center gap-2'>
            <span className='text-ui-foreground text-sm font-medium'>
              Team Members
            </span>
            {(rowPinning.top?.length ?? 0) > 0 && (
              <Badge variant='primary-outline' size='sm'>
                {rowPinning.top?.length} pinned
              </Badge>
            )}
            {selected > 0 && (
              <Badge variant='outline' size='sm'>
                {selected} selected
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-1'>
            {(rowPinning.top?.length ?? 0) > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setRowPinning({ top: [], bottom: [] })}
              >
                Unpin all
              </Button>
            )}
            <Button
              aria-label='Refresh'
              variant='ghost'
              size='icon'
              className='size-8'
            >
              <RegistryIcon lucide='RefreshCwIcon' className='size-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <Card className='p-0'>
            <DataGridContainer>
              <DataGridScrollArea>
                <DataGridTable />
              </DataGridScrollArea>
            </DataGridContainer>
          </Card>
        </CardContent>
        <CardFooter className='border-none bg-transparent! px-3 py-2'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
