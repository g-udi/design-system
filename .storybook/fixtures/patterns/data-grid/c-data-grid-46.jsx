'use client';
import { useMemo, useRef, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridSelectionBar } from '../../../../src/components/core/DataTable/parts/data-grid-cell-selection-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridTableRowMoveItems } from '../../../../src/components/core/DataTable/parts/data-grid-row-move-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTableDndRowHandle,
  DataGridTableDndRows
} from '../../../../src/components/core/DataTable/parts/data-grid-table-dnd-rows-extended.jsx';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import {
  DataGridTableSections,
  useDataGridSection
} from '../../../../src/components/core/DataTable/parts/data-grid-table-sections-extended.jsx';
import { useDataGridRowOrder } from '../../../../src/components/core/DataTable/parts/data-grid-tree-rows-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Tomorrow's edition, in the order the desk planned it.
const stories = [
  ['s1', 'City council approves the night bus plan', 'News', 'Editing', 'Maya Chen', 820, '2026-10-02'],
  ['s2', 'Inside the last independent bookshop on the high street', 'Features', 'Drafting', 'Jo Morgan', 2400, '2026-10-04'],
  ['s3', 'Why the river cleanup is working', 'News', 'Pitched', 'Sam Rivera', 900, '2026-10-05'],
  ['s4', 'The case for slower football', 'Opinion', 'Editing', 'Lina Ahmed', 1100, '2026-10-02'],
  ['s5', 'A festival guide for people who hate festivals', 'Culture', 'Drafting', 'Jo Morgan', 1600, '2026-10-03'],
  ['s6', 'School meals: what changed this term', 'News', 'Drafting', 'Maya Chen', 950, '2026-10-03'],
  ['s7', 'Letters: the bike lane debate', 'Opinion', 'Pitched', 'Lina Ahmed', 600, '2026-10-06'],
  ['s8', 'Ten albums recorded in this town', 'Culture', 'Editing', 'Sam Rivera', 1800, '2026-10-02'],
  ['s9', 'The baker who opens at four', 'Features', 'Pitched', 'Jo Morgan', 2000, '2026-10-08']
].map(([id, headline, desk, status, editor, words, due]) => ({ id, headline, desk, status, editor, words, due }));

const groupings = [
  ['status', 'Status'],
  ['desk', 'Desk'],
  ['editor', 'Editor'],
  ['order', 'Running order']
];
// Bands keep their order, title and tone, and stay visible when empty.
const sectionsBy = {
  status: [
    { value: 'Pitched', tone: 'discovery', description: 'Waiting for a yes' },
    { value: 'Drafting', tone: 'info' },
    { value: 'Editing', tone: 'warning' },
    { value: 'Ready', tone: 'success', description: 'Cleared for the edition' }
  ],
  desk: [
    { value: 'News', tone: 'info' },
    { value: 'Features', tone: 'discovery' },
    { value: 'Opinion', tone: 'attention' },
    { value: 'Culture', tone: 'accent' }
  ]
};
const statusVariant = {
  Pitched: 'discovery-outline',
  Drafting: 'info-outline',
  Editing: 'warning-outline',
  Ready: 'success-outline'
};
const number = new Intl.NumberFormat('en-GB');
const dateFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

// In a section the band carries select-all; the running order keeps it in the header.
function SelectHeader() {
  const section = useDataGridSection();
  return section ? <span className='sr-only'>Select</span> : <DataGridTableRowSelectAll />;
}
function StoryActions({ row, onRemove }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='size-7' aria-label={`Actions for ${row.original.headline}`}>
          <RegistryIcon lucide='MoreHorizontalIcon' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='end'>
        <DataGridTableRowMoveItems row={row} />
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onSelect={() => onRemove(row.original.id)}>
          Spike story
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Pattern() {
  const order = useDataGridRowOrder(stories);
  const [groupBy, setGroupBy] = useState('status');
  const [sorting, setSorting] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState('');
  const created = useRef(0);
  const runningOrder = groupBy === 'order';
  const remove = (id) => order.setRows((rows) => rows.filter((row) => row.id !== id));
  const columns = useMemo(
    () => [
      {
        id: 'drag',
        header: () => <span className='sr-only'>Reorder</span>,
        cell: () => (
          <DataGridTableDndRowHandle
            disabled={!!search}
            disabledLabel='Clear the search to reorder stories'
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false
      },
      {
        id: 'select',
        header: () => <SelectHeader />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 40,
        enableSorting: false
      },
      {
        accessorKey: 'headline',
        id: 'headline',
        header: ({ column }) => <DataGridColumnHeader title='Headline' column={column} />,
        cell: ({ getValue }) => <span className='block truncate font-medium'>{getValue()}</span>,
        size: 300,
        meta: { headerTitle: 'Headline' }
      },
      {
        accessorKey: 'desk',
        id: 'desk',
        header: ({ column }) => <DataGridColumnHeader title='Desk' column={column} />,
        cell: ({ getValue }) => <span className='text-ui-muted-foreground'>{getValue()}</span>,
        size: 120,
        meta: { headerTitle: 'Desk' }
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title='Status' column={column} />,
        cell: ({ getValue }) => <Badge variant={statusVariant[getValue()]}>{getValue()}</Badge>,
        size: 120,
        meta: { headerTitle: 'Status' }
      },
      {
        accessorKey: 'editor',
        id: 'editor',
        header: ({ column }) => <DataGridColumnHeader title='Editor' column={column} />,
        cell: ({ getValue }) => getValue(),
        size: 140,
        meta: { headerTitle: 'Editor' }
      },
      {
        accessorKey: 'words',
        id: 'words',
        header: ({ column }) => <DataGridColumnHeader title='Words' column={column} />,
        cell: ({ getValue }) => <span className='tabular-nums'>{number.format(getValue())}</span>,
        size: 100,
        meta: { headerTitle: 'Words', cellClassName: 'text-end' }
      },
      {
        accessorKey: 'due',
        id: 'due',
        header: ({ column }) => <DataGridColumnHeader title='Due' column={column} />,
        cell: ({ getValue }) => <span className='tabular-nums'>{dateFormat.format(new Date(getValue()))}</span>,
        size: 120,
        meta: { headerTitle: 'Due' }
      },
      {
        id: 'actions',
        header: () => <span className='sr-only'>Actions</span>,
        cell: ({ row }) => <StoryActions row={row} onRemove={remove} />,
        size: 56,
        enableSorting: false
      }
    ],
    // `remove` only reads the order's stable setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: order.rows,
    getRowId: (row) => row.id,
    manualPagination: true,
    // The band names the group, so its column steps aside instead of moving first.
    groupedColumnMode: false,
    state: {
      grouping: runningOrder ? [] : [groupBy],
      columnVisibility: { drag: runningOrder, ...(runningOrder ? null : { [groupBy]: false }) },
      expanded,
      sorting,
      rowSelection,
      globalFilter: search
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearch,
    autoResetExpanded: false
  });
  const addStory = (section) => {
    created.current += 1;
    const story = {
      id: `new-${created.current}`,
      headline: 'Untitled story',
      desk: 'News',
      status: 'Pitched',
      editor: 'Maya Chen',
      words: 0,
      due: '2026-10-09',
      [groupBy]: section.value
    };
    order.setRows((rows) => [...rows, story]);
  };
  const markReady = () => {
    const ids = new Set(Object.keys(rowSelection));
    order.setRows((rows) => rows.map((row) => (ids.has(row.id) ? { ...row, status: 'Ready' } : row)));
    setRowSelection({});
  };
  const empty = (
    <Empty className='py-4'>
      <EmptyHeader>
        <EmptyTitle>No stories match “{search}”</EmptyTitle>
        <EmptyDescription>Try a headline word or an editor’s name. Reordering returns when the search is clear.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
  return (
    <DataGrid
      table={table}
      recordCount={order.rows.length}
      onRowMove={order.moveRow}
      emptyMessage={empty}
      tableLayout={{ headerBackground: true, rowsDraggable: runningOrder }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'>
          <CardTitle className='text-sm font-medium'>Editorial desk</CardTitle>
          <CardAction className='flex flex-wrap items-center gap-2'>
            <Input
              type='search'
              aria-label='Search stories'
              placeholder='Search stories'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className='h-8 w-44'
            />
            <ToggleGroup
              type='single'
              size='sm'
              variant='outline'
              aria-label='Arrange stories by'
              className='flex-wrap'
              value={groupBy}
              onValueChange={(value) => {
                if (!value) return;
                setGroupBy(value);
                setExpanded(true);
              }}
            >
              {groupings.map(([value, label]) => (
                <ToggleGroupItem key={value} value={value}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button variant='outline' size='sm' disabled={!order.isReordered} onClick={order.reset}>
              <RegistryIcon lucide='RotateCcw' aria-hidden='true' />
              Reset order
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='border-t px-0'>
          <DataGridContainer>
            {runningOrder ? (
              <DataGridScrollArea>
                <DataGridTableDndRows dataIds={order.dataIds} handleDragEnd={order.handleDragEnd} />
              </DataGridScrollArea>
            ) : (
              <DataGridTableSections
                sections={sectionsBy[groupBy]}
                selectable
                onSectionAdd={addStory}
                addLabel={(section) => `Add to ${section.label}`}
                emptyContent={(section) => (search ? `No ${section.label} stories match “${search}”.` : `Nothing in ${section.label} yet.`)}
              />
            )}
          </DataGridContainer>
        </CardContent>
      </Card>
      <DataGridSelectionBar label={(count) => `${count} ${count === 1 ? 'story' : 'stories'} selected`}>
        <Button size='sm' onClick={markReady}>
          Mark ready
        </Button>
      </DataGridSelectionBar>
    </DataGrid>
  );
}
