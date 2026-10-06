'use client';
import { useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import { DataGridTableVirtual } from '@gaudi/design-system/core/DataTable';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const METRIC_COLUMN_COUNT = 36;
const ROW_COUNT = 1e3;
const COLUMN_JUMP_SIZE = 8;
const columnVirtualizerOptions = { enabled: true, overscan: 3 };
const numberFormatter = new Intl.NumberFormat('en-US');
const PEOPLE = [
  {
    name: 'Anouk Varga',
    avatar:
      '/avatars/person-41.svg',
    initials: 'AV'
  },
  {
    name: 'Sabine Okafor',
    avatar:
      '/avatars/person-20.svg',
    initials: 'SO'
  },
  {
    name: 'Rafe Okonkwo',
    avatar:
      '/avatars/person-31.svg',
    initials: 'RO'
  },
  {
    name: 'Ilse Valtonen',
    avatar:
      '/avatars/person-24.svg',
    initials: 'IV'
  },
  {
    name: 'Ottilie Nakamura',
    avatar:
      '/avatars/person-45.svg',
    initials: 'ON'
  },
  {
    name: 'Aurelio Brandt',
    avatar:
      '/avatars/person-50.svg',
    initials: 'AB'
  },
  {
    name: 'Felix Arrowsmith',
    avatar:
      '/avatars/person-47.svg',
    initials: 'FA'
  },
  {
    name: 'Mireille Gaspard',
    avatar:
      '/avatars/person-25.svg',
    initials: 'MG'
  },
  {
    name: 'Barnaby Okafor',
    avatar:
      '/avatars/person-07.svg',
    initials: 'BO'
  },
  {
    name: 'Quentin Hale',
    avatar:
      '/avatars/person-23.svg',
    initials: 'QH'
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
              <AvatarFallback>
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
