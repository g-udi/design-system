'use client';
import { useId, useMemo, useState } from 'react';
import { useCopyToClipboard } from '../../../../src/hooks/interaction/use-copy-to-clipboard.js';
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
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import {
  Frame,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import {
  AlertDialogRoot as AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../../../src/components/core/AlertDialog/index.js';
import { toast } from 'sonner';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
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
    email: 'aron@northwind.dev',
    company: 'Northwind',
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
const STATUSES = ['Active', 'Pending', 'Inactive', 'Blocked'];
const LOCATIONS = [...new Map(demoData.map((member) => [member.location, member.flag]))].map(([location, flag]) => ({ location, flag }));
const EMPTY_MEMBER = { name: '', email: '', company: '', role: '', location: 'United States', status: 'Pending' };
const initials = (name) => name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
function validateMember(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Enter a name.';
  if (!values.email.trim()) errors.email = 'Enter an email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter an email address like name@company.com.';
  if (!values.role.trim()) errors.role = 'Enter a role.';
  return errors;
}
function MemberDialog({ member, open, onOpenChange, onSave }) {
  const id = useId();
  const [values, setValues] = useState(EMPTY_MEMBER);
  const [errors, setErrors] = useState({});
  const [openedFor, setOpenedFor] = useState(null);
  // Reset the form each time the dialog opens for a different member (or a new one).
  const key = open ? member?.id ?? 'new' : null;
  if (key !== openedFor) {
    setOpenedFor(key);
    setValues(member ? { ...EMPTY_MEMBER, ...member } : EMPTY_MEMBER);
    setErrors({});
  }
  const set = (field) => (value) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const submit = (event) => {
    event.preventDefault();
    const next = validateMember(values);
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({ ...values, name: values.name.trim(), email: values.email.trim(), role: values.role.trim(), company: values.company.trim() });
  };
  const field = (name, label, props = {}) => (
    <Field data-invalid={errors[name] ? true : undefined}>
      <FieldLabel htmlFor={`${id}-${name}`}>{label}</FieldLabel>
      <Input
        id={`${id}-${name}`}
        value={values[name]}
        aria-invalid={errors[name] ? true : undefined}
        onChange={(event) => set(name)(event.target.value)}
        {...props}
      />
      {errors[name] && <FieldError>{errors[name]}</FieldError>}
    </Field>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <form noValidate onSubmit={submit} className='flex flex-col gap-4'>
          <DialogHeader>
            <DialogTitle>{member ? 'Edit member' : 'Add member'}</DialogTitle>
            <DialogDescription>
              {member ? `Update ${member.name}'s details.` : 'Invite someone to the team. They start as Pending until they accept.'}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {field('name', 'Name', { autoComplete: 'name' })}
            {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
            <div className='grid gap-4 sm:grid-cols-2'>
              {field('role', 'Role')}
              {field('company', 'Company', { autoComplete: 'organization' })}
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field>
                <FieldLabel htmlFor={`${id}-location`}>Location</FieldLabel>
                <Select value={values.location} onValueChange={set('location')}>
                  <SelectTrigger id={`${id}-location`} className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(({ location }) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
                <Select value={values.status} onValueChange={set('status')}>
                  <SelectTrigger id={`${id}-status`} className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>{status === 'Active' ? 'Approved' : status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>{member ? 'Save changes' : 'Add member'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function DeleteDialog({ members, onOpenChange, onConfirm }) {
  const count = members?.length ?? 0;
  return (
    <AlertDialog open={count > 0} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{count === 1 ? `Remove ${members[0].name}?` : `Remove ${count} members?`}</AlertDialogTitle>
          <AlertDialogDescription>
            {count === 1 ? 'They lose access to the workspace straight away.' : 'They all lose access to the workspace straight away.'} You can invite them again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={onConfirm}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function ActionsCell({ row, onEdit, onDelete }) {
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
          aria-label={`Actions for ${row.original.name}`}
          className='size-7'
          size='icon'
          variant='ghost'
        >
          <RegistryIcon lucide='MoreHorizontalIcon' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start'>
        <DropdownMenuItem onSelect={() => onEdit(row.original)}>
          <RegistryIcon lucide='PencilIcon' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCopyId}>
          <RegistryIcon lucide='CopyIcon' />
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onSelect={() => onDelete([row.original])}>
          <RegistryIcon lucide='Trash2Icon' />
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
  const [members, setMembers] = useState(demoData);
  const [rowSelection, setRowSelection] = useState({});
  const [dialog, setDialog] = useState({ open: false, member: null });
  const [deleting, setDeleting] = useState(null);
  const filteredData = useMemo(() => {
    return members.filter((item) => {
      const matchesStatus =
        !selectedStatuses?.length || selectedStatuses.includes(item.status);
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        Object.values(item).join(' ').toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [members, searchQuery, selectedStatuses]);
  const statusCounts = useMemo(() => {
    return members.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [members]);
  const saveMember = (values) => {
    const flag = LOCATIONS.find(({ location }) => location === values.location)?.flag ?? 'us';
    if (dialog.member) {
      setMembers((current) => current.map((member) => (member.id === dialog.member.id ? { ...member, ...values, flag } : member)));
      toast.success('Member updated', { description: values.name });
    } else {
      const joined = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date()).replace(' ', ', ');
      const id = String(Math.max(0, ...members.map((member) => Number(member.id))) + 1);
      setMembers((current) => [{ ...values, id, flag, joined, availability: 'offline', avatar: '', balance: 0 }, ...current]);
      setSorting([]);
      setPagination((current) => ({ ...current, pageIndex: 0 }));
      toast.success('Member added', { description: `${values.name} was invited.` });
    }
    setDialog((current) => ({ ...current, open: false }));
  };
  const confirmDelete = () => {
    const ids = new Set(deleting.map((member) => member.id));
    const remaining = filteredData.filter((member) => !ids.has(member.id)).length;
    setMembers((current) => current.filter((member) => !ids.has(member.id)));
    setRowSelection((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !ids.has(id))));
    // Step back a page when the current one empties.
    setPagination((current) => ({ ...current, pageIndex: Math.min(current.pageIndex, Math.max(0, Math.ceil(remaining / current.pageSize) - 1)) }));
    toast.success(deleting.length === 1 ? 'Member removed' : `${deleting.length} members removed`, { description: deleting.length === 1 ? deleting[0].name : undefined });
    setDeleting(null);
  };
  const editMember = (member) => setDialog({ open: true, member });
  const selectedMembers = members.filter((member) => rowSelection[member.id]);
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
                {row.original.avatar && (
                  <AvatarImage
                    src={row.original.avatar}
                    alt={row.original.name}
                  />
                )}
                <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
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
              <div className='text-ui-foreground min-w-0 truncate font-medium'>
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
        cell: ({ row }) => <ActionsCell row={row} onEdit={editMember} onDelete={setDeleting} />,
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
      columnOrder,
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
        columnsResizable: false,
        columnsMovable: true,
        columnsVisibility: true
      }}
    >
      <Frame className='w-full' stacked dense>
        <FrameHeader className='flex w-full flex-row flex-wrap items-center justify-between gap-3'>
          <FrameTitle>Team members</FrameTitle>
          <div className='flex flex-wrap items-center gap-2.5'>
            <InputGroup className='bg-ui-background w-48'>
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
                    aria-label='Clear search'
                    title='Clear'
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
                      <div
                        key={status}
                        className='flex flex-wrap items-center gap-2.5'
                      >
                        <Checkbox
                          id={`${status}-23`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={(checked) =>
                            handleStatusChange(checked === true, status)
                          }
                        />
                        <Label
                          htmlFor={`${status}-23`}
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
            {selectedMembers.length > 0 && (
              <Button variant='outline' tone='danger' onClick={() => setDeleting(selectedMembers)}>
                <RegistryIcon lucide='Trash2Icon' />
                Delete {selectedMembers.length}
              </Button>
            )}
            <Button onClick={() => setDialog({ open: true, member: null })}>
              <RegistryIcon lucide='UserPlusIcon' />
              Add new
            </Button>
          </div>
        </FrameHeader>
        <FramePanel className='p-0 shadow-none'>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </FramePanel>
        <FrameFooter className='py-1.5 pr-2 pl-2.5'>
          <DataGridPagination />
        </FrameFooter>
      </Frame>
      <MemberDialog
        member={dialog.member}
        open={dialog.open}
        onOpenChange={(open) => setDialog((current) => ({ ...current, open }))}
        onSave={saveMember}
      />
      <DeleteDialog
        members={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </DataGrid>
  );
}
