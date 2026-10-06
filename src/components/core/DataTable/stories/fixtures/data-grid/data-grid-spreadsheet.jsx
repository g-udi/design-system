'use client';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { Fragment, useId, useEffect, useMemo, useRef, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import {
  DataGridCellSelection,
  buildDataGridClearDetails,
  getDataGridActiveRegionGrid,
  serializeDataGridClipboardText
} from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import { DataGridPagination } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import { DataGridTable } from '@gaudi/design-system/core/DataTable';
import { useTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import {
  DialogConfirmationRoot as DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationTitle
} from '@gaudi/design-system/core/Dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@gaudi/design-system/core/Select';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import {
  CardRoot as Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
const MEMBERS = [
  {
    id: '1',
    name: 'Anouk Varga',
    email: 'anouk@example.com',
    avatar:
      '/avatars/person-41.svg',
    initials: 'AV'
  },
  {
    id: '2',
    name: 'Sabine Okafor',
    email: 'sabine@example.com',
    avatar:
      '/avatars/person-20.svg',
    initials: 'SO'
  },
  {
    id: '3',
    name: 'Rafe Okonkwo',
    email: 'rafe@example.com',
    avatar:
      '/avatars/person-31.svg',
    initials: 'RO'
  },
  {
    id: '4',
    name: 'Ilse Valtonen',
    email: 'ilse@example.com',
    avatar:
      '/avatars/person-24.svg',
    initials: 'IV'
  },
  {
    id: '5',
    name: 'Ottilie Nakamura',
    email: 'ottilie@example.com',
    avatar:
      '/avatars/person-45.svg',
    initials: 'ON'
  },
  {
    id: '6',
    name: 'Aurelio Brandt',
    email: 'lisa@example.com',
    avatar:
      '/avatars/person-50.svg',
    initials: 'LT'
  },
  {
    id: '7',
    name: 'Felix Arrowsmith',
    email: 'felix@example.com',
    avatar:
      '/avatars/person-47.svg',
    initials: 'FA'
  },
  {
    id: '8',
    name: 'Mireille Gaspard',
    email: 'mireille@example.com',
    avatar:
      '/avatars/person-25.svg',
    initials: 'MG'
  },
  {
    id: '9',
    name: 'Barnaby Okafor',
    email: 'barnaby@example.com',
    avatar:
      '/avatars/person-07.svg',
    initials: 'BO'
  },
  {
    id: '10',
    name: 'Quentin Hale',
    email: 'quentin@example.com',
    avatar:
      '/avatars/person-23.svg',
    initials: 'QH'
  }
];
const memberById = new Map(MEMBERS.map((member) => [member.id, member]));
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' }
];
const demoData = [
  {
    id: '1',
    sku: 'AU-1042',
    name: 'Linen Notebook',
    team: ['1', '2'],
    restock: '2026-09-04',
    stock: 42,
    price: 189,
    status: 'active'
  },
  {
    id: '2',
    sku: 'AU-1077',
    name: 'Letterpress Cards',
    team: ['3'],
    restock: '2026-09-12',
    stock: 18,
    price: 129.5,
    status: 'active'
  },
  {
    id: '3',
    sku: 'DS-2011',
    name: '27in 4K Monitor',
    team: ['2', '4', '5'],
    restock: '2026-10-01',
    stock: 7,
    price: 449.99,
    status: 'active'
  },
  {
    id: '4',
    sku: 'DS-2048',
    name: 'Reading Lamp',
    team: [],
    restock: '',
    stock: 25,
    price: 219,
    status: 'archived'
  },
  {
    id: '5',
    sku: 'PE-3003',
    name: 'Fountain Pen',
    team: ['6'],
    restock: '2026-09-18',
    stock: 64,
    price: 139,
    status: 'active'
  },
  {
    id: '6',
    sku: 'PE-3017',
    name: 'Brass Bookmark',
    team: ['7', '8'],
    restock: '2026-09-25',
    stock: 120,
    price: 59,
    status: 'active'
  },
  {
    id: '7',
    sku: 'PE-3050',
    name: 'USB Microphone',
    team: [],
    restock: '',
    stock: 33,
    price: 99,
    status: 'archived'
  }
];
function StatusBadge({ status }) {
  return (
    <Badge variant={status === 'active' ? 'success-light' : 'primary-light'}>
      {status === 'active' ? 'Active' : 'Archived'}
    </Badge>
  );
}
function TeamCell({ team, onChange }) {
  const anchor = useComboboxAnchor();
  const value = team
    .map((id) => memberById.get(id))
    .filter((member) => !!member);
  return (
    <Combobox
      multiple
      items={MEMBERS}
      itemToStringValue={(member) => member.name}
      value={value}
      onValueChange={(next) => onChange(next.map((member) => member.id))}
    >
      {/* Free-fit in the cell: every piece of the input chrome (border,
       background, ring, padding, radius) is stripped, so only the chips
       themselves render and the cell stays the container. */}
      {/* The whole strip opens the combobox, so the grid cannot infer it
       is a control: data-cell-control makes a press anywhere on it
       two-step (first click focuses the cell, the second activates). */}
      <ComboboxChips
        ref={anchor}
        data-cell-control=''
        className='min-h-6! w-full rounded-none! border-0! bg-transparent! p-0! shadow-none! ring-0! outline-hidden!'
      >
        <ComboboxValue>
          {(selected) => (
            <Fragment>
              {/* The chip primitive keeps the combobox behavior but hands its
       whole look to a real outline Badge, so the chips match every
       other avatar badge in the registry. Its built-in remove is
       swapped for the Badge-sized ghost button. */}
              {selected.map((member) => (
                <ComboboxChip
                  key={member.id}
                  showRemove={false}
                  className='rounded-none! border-0! bg-transparent! p-0!'
                >
                  <Badge variant='outline'>
                    <Avatar className='size-4'>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.initials.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {member.name.split(' ')[0]}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-3 hover:bg-transparent'
                      aria-label={`Remove ${member.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onChange(team.filter((id) => id !== member.id));
                      }}
                    >
                      <RegistryIcon lucide='XIcon' />
                    </Button>
                  </Badge>
                </ComboboxChip>
              ))}
              {/* Zero-footprint until focused: a permanently sized input
       would hold a wrap line of its own and keep the row tall
       after chips are removed. Pure CSS, so row height stays in
       sync with every state change at no runtime cost. */}
              <ComboboxChipsInput
                placeholder={selected.length ? '' : 'No assignment'}
                className={
                  selected.length
                    ? 'h-6 w-0 min-w-0 flex-none border-0! bg-transparent! p-0! shadow-none! outline-hidden! focus:min-w-16 focus:flex-1'
                    : 'h-6 min-w-16 border-0! bg-transparent! p-0! shadow-none! outline-hidden!'
                }
              />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent
        anchor={anchor}
        align='start'
        sideOffset={8}
        className='w-56'
      >
        {/* The full default combobox: a search field filters the list. */}
        <ComboboxInput
          placeholder='Search members'
          showTrigger={false}
          className='m-1'
        />
        <ComboboxEmpty>No members found.</ComboboxEmpty>
        <ComboboxList>
          {(member) => (
            <ComboboxItem key={member.id} value={member}>
              <Avatar className='size-5'>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              {member.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
function DateCell({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [offsets, setOffsets] = useState({ side: 9, align: -12 });
  const triggerRef = useRef(null);
  const date = value ? /* @__PURE__ */ new Date(`${value}T00:00:00`) : void 0;
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) {
          const trigger = triggerRef.current;
          const cell = trigger?.closest('td');
          if (trigger && cell) {
            const triggerRect = trigger.getBoundingClientRect();
            const cellRect = cell.getBoundingClientRect();
            setOffsets({
              side: Math.round(cellRect.bottom - triggerRect.bottom),
              align: Math.round(cellRect.left - triggerRect.left)
            });
          }
        }
        setOpen(next);
      }}
    >
      <PopoverTrigger
        ref={triggerRef}
        className='flex min-h-6 w-full cursor-pointer items-center text-start'
      >
        {date ? (
          format(date, 'MMM d, yyyy')
        ) : (
          <span className='text-ui-muted-foreground text-xs'>Pick date</span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align='start'
        side='bottom'
        sideOffset={offsets.side}
        alignOffset={offsets.align}
        className='w-auto p-0'
      >
        <Calendar
          mode='single'
          selected={date}
          defaultMonth={date}
          onSelect={(next) => {
            onChange(next ? format(next, 'yyyy-MM-dd') : '');
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
function SelectionToast({ count, bound }) {
  useEffect(() => {
    if (count < 2 || !bound) return;
    const rows = bound.maxRowIndex - bound.minRowIndex + 1;
    const columns = bound.maxColumnIndex - bound.minColumnIndex + 1;
    toast(`Selected ${rows} x ${columns} (${count} cells)`, {
      position: 'top-center',
      id: 'data-grid-selection',
      duration: 1500
    });
  }, [count, bound]);
  return null;
}
export function Pattern() {
  const toasterId = useId();
  const { copy } = useCopyToClipboard();
  const cardRef = useRef(null);
  const gridApiRef = useRef(null);
  const nextIdRef = useRef(demoData.length + 1);
  const [data, setData] = useState(demoData);
  const [rowMeta, setRowMeta] = useState({});
  const [dirtyCells, setDirtyCells] = useState(/* @__PURE__ */ new Set());
  const [cellSelection, setCellSelection] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState([]);
  const [columnPinning, setColumnPinning] = useState({
    start: [],
    end: []
  });
  const updateRows = (changes) => {
    if (!changes.length) return;
    const byRow = /* @__PURE__ */ new Map();
    for (const change of changes) {
      const rowChanges = byRow.get(change.rowId) ?? [];
      rowChanges.push(change);
      byRow.set(change.rowId, rowChanges);
    }
    setData((previous) =>
      previous.map((row) => {
        const rowChanges = byRow.get(row.id);
        if (!rowChanges) return row;
        const next = { ...row };
        for (const change of rowChanges) next[change.columnId] = change.value;
        return next;
      })
    );
    setRowMeta((previous) => {
      const next = { ...previous };
      for (const change of changes) {
        if (next[change.rowId] !== 'new') next[change.rowId] = 'dirty';
      }
      return next;
    });
    setDirtyCells((previous) => {
      const next = new Set(previous);
      for (const change of changes) {
        next.add(`${change.rowId}:${change.columnId}`);
      }
      return next;
    });
  };
  const handleCellsChange = (details) => {
    updateRows(details.changes);
    if (details.rejected.length) {
      toast.error(
        `${details.rejected.length} ${details.rejected.length === 1 ? 'value' : 'values'} could not be applied`,
        { toasterId, position: 'top-center', id: `${toasterId}-data-grid-rejected` }
      );
    }
  };
  const handleCellEditRequest = (request) => {
    if (request.initialText !== void 0) return;
    const cellSelector = 'td[data-cell-focused]';
    const control = [
      '[data-slot="select-trigger"]',
      '[data-slot="popover-trigger"]',
      'input',
      'button'
    ]
      .map((candidate) =>
        cardRef.current?.querySelector(`${cellSelector} ${candidate}`)
      )
      .find(Boolean);
    if (!control) return;
    control.focus();
    control.click();
    if (control instanceof HTMLInputElement) {
      control.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true
        })
      );
    }
  };
  const handleRowCreate = () => {
    const id = `p${nextIdRef.current}`;
    nextIdRef.current += 1;
    setData((previous) => [
      ...previous,
      {
        id,
        sku: `PR-${id.slice(1).padStart(4, '0')}`,
        name: '',
        team: [],
        restock: '',
        stock: 0,
        price: 0,
        status: 'active'
      }
    ]);
    setRowMeta((previous) => ({ ...previous, [id]: 'new' }));
    setPagination((previous) => ({
      ...previous,
      pageIndex: Math.ceil((data.length + 1) / previous.pageSize) - 1
    }));
    gridApiRef.current?.focusCell(id, 'name');
  };
  const [contextCell, setContextCell] = useState(null);
  const contextTriggerRef = useRef(null);
  const contextRowId = contextCell?.rowId ?? null;
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const confirmDeleteRow = data.find((row) => row.id === confirmDeleteId);
  const duplicateRow = (rowId) => {
    const source = data.find((row) => row.id === rowId);
    if (!source) return;
    const id = `p${nextIdRef.current}`;
    nextIdRef.current += 1;
    const index = data.findIndex((row) => row.id === rowId);
    setData((previous) => [
      ...previous.slice(0, index + 1),
      { ...source, id, name: `${source.name} copy` },
      ...previous.slice(index + 1)
    ]);
    setRowMeta((previous) => ({ ...previous, [id]: 'new' }));
    gridApiRef.current?.focusCell(id, 'name');
  };
  const gridViewport = () =>
    cardRef.current?.querySelector('[data-slot="data-grid-table-viewport"]') ??
    null;
  const copySelection = async () => {
    const grid = getDataGridActiveRegionGrid(table, gridViewport());
    if (!grid) return;
    if (!await copy(serializeDataGridClipboardText(grid))) {
      toast.error('Unable to copy cells', { toasterId });
      return;
    }
    const count = grid.reduce((total, line) => total + line.length, 0);
    toast.info(
      `Copied ${count} ${count === 1 ? 'cell' : 'cells'} to clipboard`,
      { toasterId, position: 'top-center', id: `${toasterId}-data-grid-copy` }
    );
  };
  const clearSelection = () => {
    const details = buildDataGridClearDetails(
      table,
      'clear',
      false,
      gridViewport()
    );
    if (details) handleCellsChange(details);
  };
  const copyRow = async (rowId) => {
    const row = data.find((candidate) => candidate.id === rowId);
    if (!row) return;
    const line = [
      row.name,
      row.team
        .map((memberId) => memberById.get(memberId)?.name ?? '')
        .filter(Boolean)
        .join(', '),
      row.restock,
      String(row.stock),
      row.price.toFixed(2),
      row.status
    ].join('	');
    if (!await copy(line)) {
      toast.error('Unable to copy row', { toasterId });
      return;
    }
    toast.info('Row copied to clipboard', {
      toasterId,
      position: 'top-center',
      id: `${toasterId}-data-grid-copy`
    });
  };
  const deleteRow = (rowId) => {
    const remaining = data.filter((row) => row.id !== rowId);
    setData(remaining);
    setPagination((previous) => ({
      ...previous,
      pageIndex: Math.min(
        previous.pageIndex,
        Math.max(0, Math.ceil(remaining.length / previous.pageSize) - 1)
      )
    }));
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: (info) => info.getValue(),
        enableSorting: false,
        size: 90,
        // No cellEdit: copyable but read-only, so a paste over it lands in
        // the batch's rejected list instead of changing data.
        meta: { cellClassName: 'text-ui-muted-foreground font-mono text-xs' }
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='Product' column={column} />
        ),
        cell: (info) => info.getValue(),
        size: 180,
        meta: {
          headerTitle: 'Product',
          cellClassName: 'font-medium',
          // The grid's built-in flush editor: Enter, F2, typing, or
          // double-click opens it right over the cell. The textarea control
          // grows downward as long text wraps, the Sheets look.
          cellEdit: { control: 'textarea' }
        }
      },
      {
        accessorKey: 'team',
        header: ({ column }) => (
          <DataGridColumnHeader title='Team' column={column} />
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <TeamCell
            team={row.original.team}
            onChange={(next) =>
              updateRows([{ rowId: row.id, columnId: 'team', value: next }])
            }
          />
        ),
        size: 230,
        minSize: 200,
        meta: {
          headerTitle: 'Team',
          autoSize: true,
          cellEdit: {
            // Clipboard carries names; parse maps them (or emails) back.
            parse: (raw) =>
              raw
                .split(',')
                .map((value) => value.trim().toLowerCase())
                .map(
                  (needle) =>
                    MEMBERS.find(
                      (member) =>
                        member.name.toLowerCase() === needle ||
                        member.email.toLowerCase() === needle
                    )?.id
                )
                .filter((id) => !!id),
            format: (value) =>
              Array.isArray(value)
                ? value
                    .map((id) => memberById.get(String(id))?.name ?? '')
                    .filter(Boolean)
                    .join(', ')
                : String(value ?? ''),
            clearValue: []
          }
        }
      },
      {
        accessorKey: 'restock',
        header: ({ column }) => (
          <DataGridColumnHeader title='Restock' column={column} />
        ),
        cell: ({ row }) => (
          <DateCell
            value={row.original.restock}
            onChange={(next) =>
              updateRows([{ rowId: row.id, columnId: 'restock', value: next }])
            }
          />
        ),
        size: 140,
        meta: {
          headerTitle: 'Restock',
          cellEdit: {
            // Clipboard carries the readable date; parse accepts anything
            // Date can read and stores the ISO day.
            parse: (raw) => {
              const trimmed = raw.trim();
              if (!trimmed) return '';
              const parsed = new Date(trimmed);
              return Number.isNaN(parsed.getTime())
                ? void 0
                : format(parsed, 'yyyy-MM-dd');
            },
            format: (value) =>
              value
                ? format(
                    /* @__PURE__ */ new Date(`${String(value)}T00:00:00`),
                    'MMM d, yyyy'
                  )
                : '',
            clearValue: ''
          }
        }
      },
      {
        accessorKey: 'stock',
        header: ({ column }) => (
          <DataGridColumnHeader title='Stock' column={column} />
        ),
        cell: (info) => String(info.getValue()),
        size: 70,
        meta: {
          headerTitle: 'Stock',
          cellClassName: 'text-end tabular-nums',
          headerClassName: 'justify-end',
          cellEdit: {
            control: 'text',
            parse: (raw) => {
              const parsed = Number.parseInt(raw.replace(/[^0-9-]/g, ''), 10);
              return Number.isNaN(parsed) ? void 0 : Math.max(0, parsed);
            },
            clearValue: 0
          }
        }
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <DataGridColumnHeader title='Price' column={column} />
        ),
        cell: ({ row }) => row.original.price.toFixed(2),
        size: 80,
        meta: {
          headerTitle: 'Price',
          cellClassName: 'text-end tabular-nums',
          headerClassName: 'justify-end',
          cellEdit: {
            control: 'text',
            parse: (raw) => {
              const parsed = Number.parseFloat(raw.replace(/[^0-9.-]/g, ''));
              return Number.isNaN(parsed) ? void 0 : parsed;
            },
            format: (value) =>
              typeof value === 'number'
                ? value.toFixed(2)
                : String(value ?? ''),
            clearValue: 0
          }
        }
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' column={column} />
        ),
        // A consumer-level editor: an always-on select with badge-rendered
        // value and items, opened by click or by Enter through
        // onCellEditRequest. The trigger is a button, so clicking it never
        // starts a cell range.
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            onValueChange={(status) =>
              updateRows([{ rowId: row.id, columnId: 'status', value: status }])
            }
          >
            {/* Reads as a plain value at rest: the select's arrow appears
             only while the cell is the focused one, the Notion idiom. */}
            <SelectTrigger
              size='sm'
              className='h-6 w-full border-0 bg-transparent px-1 shadow-none [&_svg]:opacity-0 [&_svg]:transition-opacity in-data-[cell-focused]:[&_svg]:opacity-100'
              aria-label='Status'
            >
              <SelectValue>
                <StatusBadge status={row.original.status} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent position='popper' align='start' sideOffset={8}>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <StatusBadge status={option.value} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
        size: 130,
        meta: {
          headerTitle: 'Status',
          cellEdit: {
            // Clipboard carries the label; parse maps it back to the value.
            parse: (raw) =>
              STATUS_OPTIONS.find(
                (option) =>
                  option.label.toLowerCase() === raw.trim().toLowerCase() ||
                  option.value === raw.trim().toLowerCase()
              )?.value,
            format: (value) =>
              STATUS_OPTIONS.find((option) => option.value === value)?.label ??
              String(value ?? '')
          }
        }
      }
    ],
    // Stable: every cell reads state through the grid's own change pipeline.
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
      columnPinning
    },
    // Every commit replaces `data`; without this, editing on page 2 would
    // snap the grid back to page 1 on each write.
    autoResetPageIndex: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnPinningChange: setColumnPinning
  });
  return (
    <DataGrid
      table={table}
      recordCount={data.length}
      onCellsChange={handleCellsChange}
      onCellEditRequest={handleCellEditRequest}
      onCellSelectionChange={setCellSelection}
      onCellsCopy={({ grid, cut }) => {
        const count = grid.reduce((total, line) => total + line.length, 0);
        toast.info(
          `${cut ? 'Cut' : 'Copied'} ${count} ${count === 1 ? 'cell' : 'cells'} to clipboard`,
          { toasterId, position: 'top-center', id: `${toasterId}-data-grid-copy` }
        );
      }}
      getRowStatus={(row) => rowMeta[row.id]}
      getCellStatus={(row, columnId) =>
        dirtyCells.has(`${row.id}:${columnId}`) ? 'dirty' : void 0
      }
      tableLayout={{
        dense: true,
        cellSelection: true,
        cellFillHandle: true,
        // The Excel-style solid square inside the selection corner.
        cellFillHandleVariant: 'square',
        cellBorder: true,
        columnsResizable: true,
        columnsPinnable: true
      }}
      tableClassNames={{
        // Breathing room against the container edges now that a data
        // column leads the row.
        edgeCell:
          'first:ps-4 last:pe-4 [&:has(+[data-slot=data-grid-table-fill-body-cell]:last-child)]:pe-4 [&:has(+[data-slot=data-grid-table-fill-head-cell]:last-child)]:pe-4',
        // The row the open context menu references, checkbox state untouched.
        bodyRow:
          'data-[context-open]:bg-ui-muted/50 data-[context-open]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]'
      }}
    >
      <ToastProvider id={toasterId} />
      <Card ref={cardRef} className='w-full gap-3 py-3.5'>
        <CardHeader className='items-center px-3.5'>
          <CardTitle>Products</CardTitle>
          <CardAction>
            <Button size='sm' variant='outline' onClick={handleRowCreate}>
              Add row
            </Button>
          </CardAction>
        </CardHeader>
        <ContextMenu
          onOpenChange={(open) => {
            if (open) return;
            cardRef.current
              ?.querySelectorAll('[data-context-open]')
              .forEach((rowEl) => rowEl.removeAttribute('data-context-open'));
            setContextCell(null);
          }}
        >
          <ContextMenuTrigger
            ref={contextTriggerRef}
            onContextMenuCapture={(event) => {
              const native = event.nativeEvent;
              if (native.__retargeted) return;
              const target = event.target;
              const cell = target.closest('td[data-col-id]');
              const rowId = target
                .closest('tr[data-row-id]')
                ?.getAttribute('data-row-id');
              if (!rowId) {
                event.stopPropagation();
                return;
              }
              const columnId = cell?.getAttribute('data-col-id') ?? null;
              setContextCell({ rowId, columnId });
              target
                .closest('tr[data-row-id]')
                ?.setAttribute('data-context-open', '');
              if (columnId && !cell?.hasAttribute('data-cell-selected')) {
                table.setFocusedCell(rowId, columnId);
              }
              const control = target.closest(
                'button, a, input, select, textarea, [contenteditable], [role="combobox"], [role="checkbox"]'
              );
              if (control) {
                event.preventDefault();
                event.stopPropagation();
                const retarget = new MouseEvent('contextmenu', {
                  bubbles: true,
                  cancelable: true,
                  clientX: native.clientX,
                  clientY: native.clientY
                });
                retarget.__retargeted = true;
                contextTriggerRef.current?.dispatchEvent(retarget);
              }
            }}
          >
            <DataGridContainer className='border-y'>
              <DataGridScrollArea>
                <DataGridTable />
              </DataGridScrollArea>
              <DataGridCellSelection apiRef={gridApiRef} />
            </DataGridContainer>
          </ContextMenuTrigger>
          <ContextMenuContent className='w-44'>
            {/* Labels must live inside a Group: the Base UI label wires
       itself to the surrounding group and throws without one. */}
            <ContextMenuGroup>
              <ContextMenuLabel>Cell</ContextMenuLabel>
              <ContextMenuItem
                onClick={() =>
                  contextCell?.columnId &&
                  gridApiRef.current?.focusCell(
                    contextCell.rowId,
                    contextCell.columnId,
                    { edit: true }
                  )
                }
              >
                Edit cell
              </ContextMenuItem>
              <ContextMenuItem onClick={copySelection}>Copy</ContextMenuItem>
              <ContextMenuItem onClick={clearSelection}>Clear</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuLabel>Row</ContextMenuLabel>
              <ContextMenuItem
                onClick={() => contextRowId && duplicateRow(contextRowId)}
              >
                Duplicate
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => contextRowId && copyRow(contextRowId)}
              >
                Copy row
              </ContextMenuItem>
              <ContextMenuItem
                className='text-ui-destructive'
                onClick={() => contextRowId && setConfirmDeleteId(contextRowId)}
              >
                Delete row
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
        <CardFooter className='border-none bg-transparent! px-3.5 py-0'>
          <DataGridPagination />
        </CardFooter>
      </Card>
      <SelectionToast
        count={cellSelection?.visibleCellCount ?? 0}
        bound={cellSelection?.activeBound ?? null}
      />
      <DialogConfirmation
        open={!!confirmDeleteId}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
      >
        <DialogConfirmationContent>
          <DialogConfirmationHeader>
            <DialogConfirmationTitle>Delete this row?</DialogConfirmationTitle>
            <DialogConfirmationDescription>
              {confirmDeleteRow?.name
                ? `"${confirmDeleteRow.name}" is removed from the grid.`
                : 'The row is removed from the grid.'}{' '}
              This cannot be undone.
            </DialogConfirmationDescription>
          </DialogConfirmationHeader>
          <DialogConfirmationFooter>
            <DialogConfirmationCancel>Cancel</DialogConfirmationCancel>
            <DialogConfirmationAction
              variant='destructive'
              onClick={() => {
                if (confirmDeleteId) deleteRow(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Delete
            </DialogConfirmationAction>
          </DialogConfirmationFooter>
        </DialogConfirmationContent>
      </DialogConfirmation>
    </DataGrid>
  );
}
