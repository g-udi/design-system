'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DataGrid,
  dataGridFeatures,
  getColumnHeaderLabel
} from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import { DataGridHeatmapCell } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '@gaudi/design-system/core/DataTable';
import { DataGridTableVirtual } from '@gaudi/design-system/core/DataTable';
import { DataGridViewOptions } from '@gaudi/design-system/core/DataTable';
import { downloadCsv, toCsv } from '@gaudi/design-system/core/DataTable';
import { default as FilterBar } from '@gaudi/design-system/core/FilterBar';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardHeader
} from '@gaudi/design-system/core/Card';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const TOTAL = 5000;
const PAGE = 100;
const EXCEPTIONS = [
  { value: 'delayed', label: 'Delayed', variant: 'warning-light' },
  { value: 'customs', label: 'Customs hold', variant: 'info-light' },
  { value: 'address', label: 'Address issue', variant: 'discovery-light' },
  { value: 'damaged', label: 'Damaged', variant: 'destructive-light' },
  { value: 'refused', label: 'Refused', variant: 'secondary' }
];
const CARRIERS = ['DHL', 'UPS', 'FedEx', 'Maersk', 'DPD'].map((label) => ({ value: label.toLowerCase(), label }));
const PRIORITIES = [
  { value: 'critical', label: 'Critical', variant: 'destructive-outline' },
  { value: 'high', label: 'High', variant: 'warning-outline' },
  { value: 'normal', label: 'Normal', variant: 'outline' }
];
const AGENTS = ['Priya Shah', 'Mateo Ruiz', 'Hana Kim', 'Kerem Haddadin'];
const PORTRAITS = { 'Priya Shah': 'person-20', 'Mateo Ruiz': 'person-41', 'Hana Kim': 'person-24', 'Kerem Haddadin': 'person-50' };
const CITIES = ['Rotterdam', 'Hamburg', 'Antwerp', 'Dubai', 'Singapore', 'Shanghai', 'Newark', 'Felixstowe', 'Valencia', 'Busan'];
const byValue = (list) => new Map(list.map((entry) => [entry.value, entry]));
const EXCEPTION_BY_VALUE = byValue(EXCEPTIONS);
const PRIORITY_BY_VALUE = byValue(PRIORITIES);
const CARRIER_BY_VALUE = byValue(CARRIERS);
function seeded(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
const random = seeded(7);
const pick = (list) => list[Math.floor(random() * list.length)];
// Five thousand exceptions on the "server". The grid only ever holds what has loaded.
const SHIPMENTS = Array.from({ length: TOTAL }, (_, index) => {
  const origin = pick(CITIES);
  return {
    id: `SHP-${String(10001 + index)}`,
    exception: EXCEPTIONS[Math.floor(random() ** 1.6 * EXCEPTIONS.length)].value,
    carrier: pick(CARRIERS).value,
    priority: PRIORITIES[Math.floor(random() ** 1.8 * PRIORITIES.length)].value,
    origin,
    destination: pick(CITIES.filter((city) => city !== origin)),
    delay: Math.round(random() ** 2 * 96),
    assignee: random() < 0.35 ? pick(AGENTS) : null,
    updatedMinutes: Math.round(random() * 600)
  };
});
const ago = (minutes) => (minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`);
function matchesQuery(shipment, { search, exception, carrier, priority }, skip) {
  const needle = search.trim().toLowerCase();
  if (needle && ![shipment.id, shipment.origin, shipment.destination].some((text) => text.toLowerCase().includes(needle)))
    return false;
  if (skip !== 'exception' && exception.length && !exception.includes(shipment.exception)) return false;
  if (skip !== 'carrier' && carrier.length && !carrier.includes(shipment.carrier)) return false;
  if (skip !== 'priority' && priority.length && !priority.includes(shipment.priority)) return false;
  return true;
}
// Facet counts over every matching record, each facet ignoring its own choice.
function facetCounts(filters, facet, options) {
  const counts = new Map(options.map((option) => [option.value, 0]));
  for (const shipment of SHIPMENTS) {
    if (matchesQuery(shipment, filters, facet)) counts.set(shipment[facet], (counts.get(shipment[facet]) ?? 0) + 1);
  }
  return options.map((option) => ({ ...option, count: counts.get(option.value) }));
}
const header = (title) => {
  function ColumnHeader({ column }) {
    return <DataGridColumnHeader title={title} column={column} />;
  }
  return ColumnHeader;
};
const count = new Intl.NumberFormat('en-US');
export function Pattern() {
  const [filters, setFilters] = useState({ search: '', exception: [], carrier: [], priority: [] });
  const [limit, setLimit] = useState(PAGE);
  const [isFetching, setIsFetching] = useState(false);
  const [assignments, setAssignments] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [allMatching, setAllMatching] = useState(false);
  const [density, setDensity] = useState('compact');
  const [status, setStatus] = useState('');
  const timeoutRef = useRef(null);
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);
  const matching = useMemo(() => SHIPMENTS.filter((shipment) => matchesQuery(shipment, filters)), [filters]);
  const data = useMemo(
    () =>
      matching.slice(0, limit).map((shipment) =>
        shipment.id in assignments ? { ...shipment, assignee: assignments[shipment.id] } : shipment
      ),
    [matching, limit, assignments]
  );
  const hasMore = limit < matching.length;
  const updateFilters = (patch) => {
    window.clearTimeout(timeoutRef.current);
    setIsFetching(false);
    setFilters((current) => ({ ...current, ...patch }));
    setLimit(PAGE);
    // A selection belongs to the query it was made in: a new query starts empty,
    // so a bulk action never reaches rows the filters now hide.
    setAllMatching(false);
    setRowSelection({});
  };
  const fetchMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    timeoutRef.current = window.setTimeout(() => {
      setLimit((current) => current + PAGE);
      setIsFetching(false);
    }, 500);
  }, [hasMore, isFetching]);
  // Selecting every match is a flag, not five thousand keys: loaded rows read as
  // selected, rows that arrive later join it, and unticking one row leaves the mode.
  const effectiveSelection = useMemo(
    () => (allMatching ? Object.fromEntries(data.map((shipment) => [shipment.id, true])) : rowSelection),
    [allMatching, data, rowSelection]
  );
  const handleRowSelectionChange = (updater) => {
    const next = typeof updater === 'function' ? updater(effectiveSelection) : updater;
    if (allMatching && data.some((shipment) => !next[shipment.id])) setAllMatching(false);
    setRowSelection(next);
  };
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        meta: { export: false }
      },
      {
        accessorKey: 'id',
        header: header('Shipment'),
        cell: ({ getValue }) => <span className='font-mono text-xs'>{getValue()}</span>,
        size: 120,
        enableHiding: false,
        meta: { headerTitle: 'Shipment' }
      },
      {
        accessorKey: 'exception',
        header: header('Exception'),
        cell: ({ getValue }) => {
          const exception = EXCEPTION_BY_VALUE.get(getValue());
          return <Badge variant={exception.variant}>{exception.label}</Badge>;
        },
        size: 140,
        meta: { headerTitle: 'Exception', exportValue: (value) => EXCEPTION_BY_VALUE.get(value)?.label }
      },
      {
        accessorKey: 'priority',
        header: header('Priority'),
        cell: ({ getValue }) => {
          const priority = PRIORITY_BY_VALUE.get(getValue());
          return <Badge variant={priority.variant}>{priority.label}</Badge>;
        },
        size: 100,
        meta: { headerTitle: 'Priority', exportValue: (value) => PRIORITY_BY_VALUE.get(value)?.label }
      },
      {
        accessorKey: 'carrier',
        header: header('Carrier'),
        cell: ({ getValue }) => CARRIER_BY_VALUE.get(getValue())?.label,
        size: 90,
        meta: { headerTitle: 'Carrier', exportValue: (value) => CARRIER_BY_VALUE.get(value)?.label }
      },
      {
        id: 'route',
        accessorFn: (shipment) => `${shipment.origin} → ${shipment.destination}`,
        header: header('Route'),
        cell: ({ getValue }) => <span className='truncate'>{getValue()}</span>,
        size: 200,
        meta: { headerTitle: 'Route' }
      },
      {
        accessorKey: 'delay',
        header: header('Delay (h)'),
        cell: ({ cell }) => <DataGridHeatmapCell cell={cell} domain={[0, 96]} />,
        size: 96,
        meta: { headerTitle: 'Delay (h)', headerClassName: 'text-end', cellClassName: 'text-end' }
      },
      {
        accessorKey: 'assignee',
        header: header('Assignee'),
        cell: ({ getValue }) =>
          getValue() ? (
            <span className='flex min-w-0 items-center gap-2'>
              <Avatar aria-hidden='true' className='size-6 shrink-0'>
                <AvatarImage src={`/avatars/${PORTRAITS[getValue()]}.svg`} />
                <AvatarFallback>{getValue().split(' ').map((part) => part[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className='truncate'>{getValue()}</span>
            </span>
          ) : (
            <span className='text-ui-muted-foreground'>Unassigned</span>
          ),
        size: 150,
        meta: { headerTitle: 'Assignee' }
      },
      {
        accessorKey: 'updatedMinutes',
        header: header('Updated'),
        cell: ({ getValue }) => <span className='text-ui-muted-foreground tabular-nums'>{ago(getValue())}</span>,
        size: 100,
        meta: { headerTitle: 'Updated', exportValue: (value) => ago(value) }
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data,
    getRowId: (shipment) => shipment.id,
    enableRowSelection: true,
    // The data is already the loaded window, so nothing is paged away.
    manualPagination: true,
    state: { rowSelection: effectiveSelection },
    onRowSelectionChange: handleRowSelectionChange,
    initialState: { sorting: [] }
  });
  const explicitCount = Object.values(rowSelection).filter(Boolean).length;
  const selectedCount = allMatching ? matching.length : explicitCount;
  const allLoadedSelected = data.length > 0 && data.every((shipment) => effectiveSelection[shipment.id]);
  const targetIds = () =>
    allMatching ? matching.map((shipment) => shipment.id) : Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const assign = (agent) => {
    const ids = targetIds();
    setAssignments((current) => ({ ...current, ...Object.fromEntries(ids.map((id) => [id, agent])) }));
    setStatus(`Assigned ${count.format(ids.length)} ${ids.length === 1 ? 'shipment' : 'shipments'} to ${agent}`);
  };
  const exportSelection = () => {
    const ids = new Set(targetIds());
    const records = SHIPMENTS.filter((shipment) => ids.has(shipment.id)).map((shipment) =>
      shipment.id in assignments ? { ...shipment, assignee: assignments[shipment.id] } : shipment
    );
    const fields = table
      .getVisibleLeafColumns()
      .filter((column) => column.accessorFn && column.columnDef.meta?.export !== false)
      .map((column) => ({
        header: getColumnHeaderLabel(column),
        value: (record, index) => {
          const value = column.accessorFn(record, index);
          return column.columnDef.meta?.exportValue ? column.columnDef.meta.exportValue(value, record) : value;
        }
      }));
    downloadCsv(toCsv(records, fields), 'shipment-exceptions.csv');
    setStatus(`Exported ${count.format(records.length)} ${records.length === 1 ? 'shipment' : 'shipments'}`);
  };
  const clearSelection = () => {
    setAllMatching(false);
    setRowSelection({});
  };
  const facets = [
    { id: 'exception', label: 'Exception', multiple: true, options: facetCounts(filters, 'exception', EXCEPTIONS), value: filters.exception, onChange: (value) => updateFilters({ exception: value }) },
    { id: 'carrier', label: 'Carrier', multiple: true, options: facetCounts(filters, 'carrier', CARRIERS), value: filters.carrier, onChange: (value) => updateFilters({ carrier: value }) },
    { id: 'priority', label: 'Priority', multiple: true, options: facetCounts(filters, 'priority', PRIORITIES), value: filters.priority, onChange: (value) => updateFilters({ priority: value }) }
  ];
  return (
    <DataGrid
      table={table}
      recordCount={matching.length}
      emptyMessage='No shipments match these filters'
      allRowsLoadedMessage={`All ${count.format(matching.length)} shipments loaded`}
      tableLayout={{ dense: density === 'compact', headerSticky: true, columnsVisibility: true, columnsResizable: true }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex flex-col gap-3 px-4 py-3'>
          <div className='flex w-full flex-wrap items-center justify-between gap-2'>
            <div className='flex min-w-0 items-center gap-2'>
              <RegistryIcon lucide='TruckIcon' className='text-ui-muted-foreground size-4' />
              <h2 className='text-ui-foreground text-sm font-medium'>Shipment exceptions</h2>
              <Badge variant='secondary' size='sm' className='tabular-nums'>
                {count.format(data.length)} / {count.format(matching.length)}
              </Badge>
            </div>
            <DataGridViewOptions density={density} onDensityChange={setDensity} />
          </div>
          <FilterBar
            className='w-full'
            query={filters.search}
            onQueryChange={(search) => updateFilters({ search })}
            searchLabel='Search shipments'
            placeholder='Search ID or city…'
            count={{ shown: matching.length, total: TOTAL }}
            facets={facets}
            onClearFilters={() => updateFilters({ search: '', exception: [], carrier: [], priority: [] })}
          />
        </CardHeader>
        {selectedCount > 0 ? (
          <section
            aria-label='Bulk actions'
            className='bg-ui-muted/50 border-ui-border flex flex-wrap items-center gap-2 border-t px-4 py-2'
          >
            <span className='text-sm font-medium tabular-nums'>{count.format(selectedCount)} selected</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  <RegistryIcon lucide='UserPlusIcon' />
                  Assign
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuLabel>Assign to</DropdownMenuLabel>
                {AGENTS.map((agent) => (
                  <DropdownMenuItem key={agent} onSelect={() => assign(agent)}>
                    {agent}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant='outline' size='sm' onClick={exportSelection}>
              <RegistryIcon lucide='DownloadIcon' />
              Export
            </Button>
            <Button variant='ghost' size='sm' onClick={clearSelection}>
              Clear selection
            </Button>
            {allLoadedSelected && hasMore && !allMatching ? (
              <p className='text-ui-muted-foreground basis-full text-xs sm:ms-auto sm:basis-auto'>
                All {count.format(data.length)} loaded shipments are selected.{' '}
                <Button variant='link' size='xs' className='px-0' onClick={() => setAllMatching(true)}>
                  Select all {count.format(matching.length)} matching
                </Button>
              </p>
            ) : null}
            {allMatching ? (
              <p className='text-ui-muted-foreground basis-full text-xs sm:ms-auto sm:basis-auto'>
                Every matching shipment is selected, including ones not loaded yet.
              </p>
            ) : null}
          </section>
        ) : null}
        <p role='status' className='text-ui-muted-foreground px-4 pb-2 text-xs empty:hidden'>
          {status}
        </p>
        <CardContent className='border-ui-border border-t p-0'>
          <DataGridScrollArea className='h-[min(30rem,70dvh)]'>
            <DataGridTableVirtual
              estimateSize={density === 'compact' ? 37 : 45}
              onFetchMore={fetchMore}
              isFetchingMore={isFetching}
              hasMore={hasMore}
            />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  );
}
