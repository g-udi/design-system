'use client';
import { useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import { DataGridTableVirtual } from '../../../../src/components/core/DataTable/parts/data-grid-table-virtual-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const METRIC_COLUMN_COUNT = 36;
const ROW_COUNT = 1e3;
const COLUMN_JUMP_SIZE = 8;
const columnVirtualizerOptions = { enabled: true, overscan: 3 };
const numberFormatter = new Intl.NumberFormat('en-US');
const PEOPLE = [
  {
    name: 'Alex Johnson',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ'
  },
  {
    name: 'Sarah Chen',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    initials: 'MR'
  },
  {
    name: 'Emma Wilson',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    initials: 'EW'
  },
  {
    name: 'David Kim',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    initials: 'DK'
  },
  {
    name: 'Aron Thompson',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    initials: 'AT'
  },
  {
    name: 'James Brown',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    initials: 'JB'
  },
  {
    name: 'Maria Garcia',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    initials: 'MG'
  },
  {
    name: 'Nick Johnson',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    initials: 'NJ'
  },
  {
    name: 'Liam Thompson',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LT'
  }
];
function generateData(count) {
  return Array.from({ length: count }, (_, rowIndex) => {
    const metrics = Array.from(
      { length: METRIC_COLUMN_COUNT },
      (_2, metricIndex) => 100 + ((rowIndex * 37 + metricIndex * 19) % 900)
    );
    return {
      id: String(rowIndex + 1),
      person: PEOPLE[rowIndex % PEOPLE.length],
      metrics,
      total: metrics.reduce((sum, value) => sum + value, 0)
    };
  });
}
const allData = generateData(ROW_COUNT);
export function Pattern() {
  const [sorting, setSorting] = useState([]);
  const [targetColumnIndex, setTargetColumnIndex] = useState(0);
  const columns = useMemo(() => {
    const metricColumns = Array.from(
      { length: METRIC_COLUMN_COUNT },
      (_, metricIndex) => {
        const metricLabel = `Metric ${String(metricIndex + 1).padStart(2, '0')}`;
        return {
          id: `metric-${metricIndex + 1}`,
          accessorFn: (row) => row.metrics[metricIndex],
          header: ({ column }) => (
            <DataGridColumnHeader title={metricLabel} column={column} />
          ),
          cell: ({ row }) => (
            <span className='block text-right font-mono tabular-nums'>
              {numberFormatter.format(row.original.metrics[metricIndex])}
            </span>
          ),
          size: 124
        };
      }
    );
    return [
      {
        accessorKey: 'id',
        id: 'id',
        header: ({ column }) => (
          <DataGridColumnHeader title='#' column={column} />
        ),
        cell: ({ row }) => (
          <span className='text-ui-muted-foreground tabular-nums'>
            {row.original.id}
          </span>
        ),
        size: 72,
        enableSorting: false,
        enableHiding: false
      },
      {
        id: 'name',
        accessorFn: (row) => row.person.name,
        header: ({ column }) => (
          <DataGridColumnHeader title='Team member' column={column} />
        ),
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Avatar className='size-6'>
              <AvatarImage
                src={row.original.person.avatar}
                alt={row.original.person.name}
              />
              <AvatarFallback className='text-xs'>
                {row.original.person.initials}
              </AvatarFallback>
            </Avatar>
            <span className='text-ui-foreground truncate font-medium'>
              {row.original.person.name}
            </span>
          </div>
        ),
        size: 190,
        enableHiding: false
      },
      ...metricColumns,
      {
        accessorKey: 'total',
        id: 'total',
        header: ({ column }) => (
          <DataGridColumnHeader title='Total' column={column} />
        ),
        cell: ({ row }) => (
          <span className='block text-right font-medium tabular-nums'>
            {numberFormatter.format(row.original.total)}
          </span>
        ),
        size: 132,
        enableHiding: false
      }
    ];
  }, []);
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: allData,
    enableColumnPinning: true,
    getRowId: (row) => row.id,
    state: {
      columnPinning: { start: ['id', 'name'], end: ['total'] },
      sorting
    },
    onSortingChange: setSorting,
    // The whole set is already client-side: without this, v9's registered
    // paginated row model would clip the virtual grid to one page.
    manualPagination: true
  });
  return (
    <DataGrid
      table={table}
      recordCount={allData.length}
      tableLayout={{
        width: 'fixed',
        dense: true,
        columnsPinnable: true,
        columnsResizable: true,
        headerSticky: true
      }}
      tableClassNames={{
        /* z-40, not z-10: pinned BODY cells are sticky at z-30, and a lower
         thead would let them paint over the header band while rows scroll
         under it. 40 is the primitive's sticky-header plane. */
        headerSticky: 'sticky top-0 z-40 bg-ui-muted/90 backdrop-blur-xs'
      }}
    >
      {/* No footer here, so the grid itself closes the card: pb-0 removes
       the empty strip below the container, and overflow-hidden lets the
       card's own radius clip the grid's square bottom corners. */}
      <Card className='w-full gap-3 overflow-hidden py-3.5 pb-0'>
        <CardHeader className='items-center px-3.5'>
          <CardTitle>Performance Matrix</CardTitle>
          <CardAction className='flex items-center gap-2'>
            <span className='text-ui-muted-foreground hidden text-xs tabular-nums sm:inline'>
              Metric {String(targetColumnIndex + 1).padStart(2, '0')} of{' '}
              {METRIC_COLUMN_COUNT}
            </span>
            <Button
              aria-label='Show previous metric columns'
              title='Show previous metric columns'
              className='size-8'
              disabled={targetColumnIndex === 0}
              size='icon'
              variant='outline'
              onClick={() =>
                setTargetColumnIndex((current) =>
                  Math.max(0, current - COLUMN_JUMP_SIZE)
                )
              }
            >
              <RegistryIcon lucide='ChevronLeftIcon' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Show next metric columns'
              title='Show next metric columns'
              className='size-8'
              disabled={targetColumnIndex === METRIC_COLUMN_COUNT - 1}
              size='icon'
              variant='outline'
              onClick={() =>
                setTargetColumnIndex((current) =>
                  Math.min(METRIC_COLUMN_COUNT - 1, current + COLUMN_JUMP_SIZE)
                )
              }
            >
              <RegistryIcon lucide='ChevronRightIcon' aria-hidden='true' />
            </Button>
          </CardAction>
        </CardHeader>
        <DataGridContainer className='border-t'>
          <DataGridScrollArea className='h-[480px]'>
            {/* Column index 2 + the jump target: the controlled reveal
       addresses CENTER columns only, so index 0 is Metric 01. */}
            <DataGridTableVirtual
              estimateSize={41}
              overscan={8}
              columnVirtualizerOptions={columnVirtualizerOptions}
              scrollBehavior='smooth'
              scrollToColumnAlign='center'
              scrollToColumnIndex={targetColumnIndex}
            />
          </DataGridScrollArea>
        </DataGridContainer>
      </Card>
    </DataGrid>
  );
}
