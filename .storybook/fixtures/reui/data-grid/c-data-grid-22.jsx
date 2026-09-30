// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
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
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const demoData = [
  {
    id: '1',
    name: 'Alex Johnson',
    availability: 'online',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'Active',
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
    status: 'Inactive',
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
    status: 'Blocked',
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
    status: 'Inactive',
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
    status: 'Active',
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
    status: 'Pending',
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
    status: 'Inactive',
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
    status: 'Blocked',
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
    status: 'Pending',
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
    status: 'Inactive',
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
    status: 'Blocked',
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
    status: 'Active',
    flag: 'in',
    email: 'sarah@tata.in',
    company: 'Tata',
    role: 'Sales Manager',
    joined: 'Oct, 2024',
    location: 'India',
    balance: 4521.67
  }
];
function ActionsCell({ row }) {
  const { copyToClipboard } = useCopyToClipboard();
  const handleCopyId = () => {
    copyToClipboard(row.original.id);
    toast.success('Employee ID successfully copied', {
      description: row.original.id
    });
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
  const [sorting, setSorting] = useState([{ id: 'name', desc: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const filteredData = useMemo(() => {
    return demoData.filter((item) => {
      const matchesStatus =
        !selectedStatuses?.length || selectedStatuses.includes(item.status);
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        Object.values(item).join(' ').toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, selectedStatuses]);
  const statusCounts = useMemo(() => {
    return demoData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, []);
  const handleStatusChange = (checked, value) => {
    setSelectedStatuses((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 35,
        meta: {
          headerClassName: '',
          cellClassName: ''
        },
        enableResizing: false
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='User'
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
        size: 260,
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
            visibility={true}
            column={column}
          />
        ),
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
        size: 150,
        meta: {
          headerClassName: '',
          cellClassName: 'text-start'
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'role',
        id: 'role',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Role'
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className='text-ui-foreground font-medium'>
              {row.original.role}
            </div>
          );
        },
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'joined',
        id: 'joined',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Joined'
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className='text-ui-foreground font-medium'>
              {row.original.joined}
            </div>
          );
        },
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Status'
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          if (status == 'Active') {
            return <Badge variant='success-outline'>Approved</Badge>;
          } else if (status == 'Blocked') {
            return <Badge variant='destructive-outline'>Blocked</Badge>;
          } else if (status == 'Inactive') {
            return <Badge variant='info-outline'>Inactive</Badge>;
          } else {
            return <Badge variant='warning-outline'>Pending</Badge>;
          }
        },
        size: 100,
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
  const [columnOrder, setColumnOrder] = useState(
    columns.map((column) => column.id)
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder
    },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting
  });
  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true
      }}
    >
      <Card className='w-full gap-3 py-0'>
        <CardHeader className='flex items-center justify-between px-3.5 py-2'>
          <div className='flex items-center gap-2.5'>
            <InputGroup className='w-48'>
              <InputGroupAddon align='inline-start'>
                <RegistryIcon lucide='SearchIcon' />
              </InputGroupAddon>

              <InputGroupInput
                aria-label='Search...'
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchQuery.length > 0 && (
                <InputGroupAddon align='inline-end'>
                  <InputGroupButton
                    aria-label='Copy'
                    title='Copy'
                    size='icon-xs'
                    onClick={() => setSearchQuery('')}
                  >
                    <RegistryIcon lucide='XIcon' />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>
                  <RegistryIcon lucide='FunnelIcon' />
                  Status
                  {selectedStatuses.length > 0 && (
                    <Badge size='sm' variant='info-outline'>
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-40' align='start'>
                <div className='space-y-3'>
                  <div className='text-ui-muted-foreground text-xs font-medium'>
                    Filters
                  </div>
                  <div className='space-y-3'>
                    {Object.keys(statusCounts).map((status) => (
                      <div key={status} className='flex items-center gap-2.5'>
                        <Checkbox
                          id={status}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={(checked) =>
                            handleStatusChange(checked === true, status)
                          }
                        />
                        <Label
                          htmlFor={status}
                          className='flex grow items-center justify-between gap-1.5 font-normal'
                        >
                          {status}
                          <span className='text-ui-muted-foreground'>
                            {statusCounts[status]}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <CardAction>
            <Button>
              <RegistryIcon lucide='UserPlusIcon' />
              Add new
            </Button>
          </CardAction>
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
        <CardFooter className='border-none bg-transparent! px-3.5 py-2'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
