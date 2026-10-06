'use client';
import { lazy, Suspense, useMemo, useState } from 'react';
import {
  DataGrid,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import { DataGridCardView, DataGridViewToggle } from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import {
  DataGridColumnPicker,
  createDataGridColumnRegistry
} from '@gaudi/design-system/core/DataTable';
import { DataGridHeatmapCell } from '@gaudi/design-system/core/DataTable';
import {
  DataGridLayouts,
  useDataGridLayouts
} from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import {
  DataGridStatusTabs,
  dataGridEqualsFilter
} from '@gaudi/design-system/core/DataTable';
import {
  DataGridTable,
  DataGridTableRowPin,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '@gaudi/design-system/core/DataTable';
import { DataGridViewOptions } from '@gaudi/design-system/core/DataTable';
import { Filters } from '@gaudi/design-system/core/FilterBar';
import {
  createFilterQuery,
  isFilterRule
} from '@gaudi/design-system/core/FilterBar';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CardRoot as Card,
  CardContent,
  CardHeader
} from '@gaudi/design-system/core/Card';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
// Charts stay out of the core bundle: the trend cell loads Sparkline on demand.
const Sparkline = lazy(() =>
  import('@gaudi/design-system/charts/Sparkline').then(
    (module) => ({ default: module.Sparkline })
  )
);
const STAGES = [
  { value: 'lead', label: 'Lead', variant: 'secondary' },
  { value: 'qualified', label: 'Qualified', variant: 'info-light' },
  { value: 'proposal', label: 'Proposal', variant: 'warning-light' },
  { value: 'won', label: 'Won', variant: 'success-light' },
  { value: 'lost', label: 'Lost', variant: 'destructive-light' }
];
const STAGE_BY_VALUE = new Map(STAGES.map((stage) => [stage.value, stage]));
const OWNERS = [
  { value: 'ada', portrait: 'person-23', label: 'Odile Marchetti' },
  { value: 'grace', portrait: 'person-07', label: 'Edda Quilliam' },
  { value: 'alan', portrait: 'person-44', label: 'Casimir Oduya' },
  { value: 'barbara', portrait: 'person-19', label: 'Hedda Kowalczyk' }
];
const OWNER_LABELS = new Map(OWNERS.map((owner) => [owner.value, owner.label]));
const OWNER_PORTRAITS = new Map(OWNERS.map((owner) => [owner.label, owner.portrait]));
const REGIONS = [
  { value: 'emea', label: 'EMEA' },
  { value: 'amer', label: 'AMER' },
  { value: 'apac', label: 'APAC' }
];
const INDUSTRIES = ['Retail', 'Logistics', 'Health', 'Media', 'Finance', 'Energy'];
const ACCOUNTS = [
  'Northwind', 'Contoso', 'Fabrikam', 'Adatum', 'Kestrel Kites', 'Woodgrove',
  'Litware', 'Proseware', 'Relecloud', 'Arden Cellars', 'Paperwing Games', 'Third Shelf Café',
  'Quillmark Labs', 'Farfield Air', 'Lucerne Publishing', 'Margie Travel', 'Alpine Ski House',
  'Humongous Insurance', 'Wide World Importers', 'Graphic Design Institute', 'Southridge Video',
  'Bellows College', 'City Power & Light', 'Datum Corporation'
];
// A deterministic generator, so tests and screenshots see the same pipeline.
function seeded(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
const random = seeded(42);
const DEALS = ACCOUNTS.map((account, index) => {
  const stage = STAGES[index % STAGES.length].value;
  const base = 8 + Math.round(random() * 40);
  return {
    id: `deal-${index + 1}`,
    account,
    domain: `${account.toLowerCase().replace(/[^a-z]+/g, '')}.com`,
    owner: OWNERS[(index * 3) % OWNERS.length].value,
    stage,
    amount: Math.round((12 + random() * 180) * 1000),
    probability: stage === 'won' ? 100 : stage === 'lost' ? 0 : Math.round(15 + random() * 70),
    health: Math.round(20 + random() * 80),
    lastContact: new Date(Date.UTC(2026, 8, 30 - ((index * 5) % 40))),
    region: REGIONS[index % REGIONS.length].value,
    industry: INDUSTRIES[index % INDUSTRIES.length],
    seats: 40 + Math.round(random() * 1400),
    tickets: Math.round(random() * 14),
    csat: Math.round(55 + random() * 45),
    trend: Array.from({ length: 8 }, (_, week) =>
      Math.max(1, Math.round(base + week * (random() * 6 - 2) + random() * 6))
    )
  };
});
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const compactMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
// The Filters builder describes the query; matching it stays in the host.
const FILTER_FIELDS = [
  {
    id: 'owner',
    label: 'Owner',
    type: 'select',
    defaultOperator: 'is_any_of',
    options: OWNERS,
    icon: <RegistryIcon lucide='UserIcon' />
  },
  {
    id: 'amount',
    label: 'Amount',
    type: 'number',
    defaultOperator: 'gte',
    icon: <RegistryIcon lucide='BanknoteIcon' />
  },
  {
    id: 'region',
    label: 'Region',
    type: 'select',
    defaultOperator: 'is',
    options: REGIONS,
    searchable: false,
    icon: <RegistryIcon lucide='GlobeIcon' />
  },
  {
    id: 'health',
    label: 'Health',
    type: 'number',
    defaultOperator: 'lt',
    icon: <RegistryIcon lucide='HeartPulseIcon' />
  }
];
const list = (value) => (Array.isArray(value) ? value.map(String) : []);
const TESTS = {
  is: (actual, value) => String(actual) === String(value),
  is_not: (actual, value) => String(actual) !== String(value),
  is_any_of: (actual, value) => list(value).includes(String(actual)),
  is_none_of: (actual, value) => !list(value).includes(String(actual)),
  eq: (actual, value) => Number(actual) === Number(value),
  neq: (actual, value) => Number(actual) !== Number(value),
  gt: (actual, value) => Number(actual) > Number(value),
  gte: (actual, value) => Number(actual) >= Number(value),
  lt: (actual, value) => Number(actual) < Number(value),
  lte: (actual, value) => Number(actual) <= Number(value),
  between: (actual, [from, to] = []) => Number(actual) >= Number(from) && Number(actual) <= Number(to)
};
function matches(deal, node) {
  if (!isFilterRule(node)) {
    if (!node.rules.length) return true;
    const results = node.rules.map((child) => matches(deal, child));
    return node.combinator === 'or' ? results.some(Boolean) : results.every(Boolean);
  }
  const test = TESTS[node.operator];
  const incomplete = node.value === void 0 || (Array.isArray(node.value) && !node.value.length);
  if (!test || incomplete) return true;
  const result = test(deal[node.path[0]], node.value);
  return node.negated ? !result : result;
}
function Initials({ name }) {
  return (
    <Avatar aria-hidden='true' className='size-6 shrink-0'>
      <AvatarImage src={`/avatars/${OWNER_PORTRAITS.get(name)}.svg`} />
      <AvatarFallback>
        {name.split(' ').map((part) => part[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
}
function TrendCell({ deal }) {
  return (
    <div className='h-7 w-24'>
      <Suspense fallback={<Skeleton className='h-7 w-24' />}>
        <Sparkline
          ariaLabel={`${deal.account} weekly revenue, last 8 weeks`}
          data={deal.trend}
          height={28}
          showEndpoint={false}
          valueLabel='Revenue (k)'
        />
      </Suspense>
    </div>
  );
}
const headerFor = (title, align) => {
  function Header({ column }) {
    return (
      <DataGridColumnHeader
        title={title}
        column={column}
        visibility
        className={align === 'end' ? 'ms-auto -me-2' : void 0}
      />
    );
  }
  return Header;
};
const END = { headerClassName: 'text-end', cellClassName: 'text-end' };
// Columns a person can add from the Cascader, grouped the way they think of them.
const registry = createDataGridColumnRegistry([
  {
    id: 'account-details',
    label: 'Account',
    icon: <RegistryIcon lucide='Building2Icon' />,
    children: [
      { id: 'industry', label: 'Industry', column: { accessorKey: 'industry', header: headerFor('Industry'), size: 120, meta: { stats: true } } },
      { id: 'region', label: 'Region', column: { accessorFn: (deal) => REGIONS.find((region) => region.value === deal.region)?.label, header: headerFor('Region'), size: 100, meta: { stats: true } } },
      { id: 'seats', label: 'Seats', keywords: ['licenses', 'users'], column: { accessorKey: 'seats', header: headerFor('Seats', 'end'), size: 100, meta: { ...END, stats: true } } }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: <RegistryIcon lucide='LifeBuoyIcon' />,
    children: [
      {
        id: 'tickets',
        label: 'Open tickets',
        keywords: ['issues'],
        column: {
          accessorKey: 'tickets',
          header: headerFor('Open tickets', 'end'),
          size: 120,
          cell: ({ cell }) => <DataGridHeatmapCell cell={cell} />,
          meta: { ...END, stats: ['count', 'min', 'max', 'avg', 'sum'] }
        }
      },
      {
        id: 'csat',
        label: 'CSAT',
        keywords: ['satisfaction'],
        column: {
          accessorKey: 'csat',
          header: headerFor('CSAT', 'end'),
          size: 100,
          cell: ({ cell }) => <DataGridHeatmapCell cell={cell} scale='diverging' midpoint={80}>{cell.getValue()}%</DataGridHeatmapCell>,
          meta: { ...END, stats: ['min', 'max', 'avg'] }
        }
      }
    ]
  }
]);
const BASE_COLUMNS = [
  {
    id: 'pin',
    header: () => <span className='sr-only'>Pin</span>,
    cell: ({ row }) => <DataGridTableRowPin row={row} />,
    size: 44,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    meta: { card: false, export: false }
  },
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
    accessorKey: 'account',
    header: headerFor('Account'),
    cell: ({ row }) => (
      <div className='min-w-0'>
        <div className='text-ui-foreground truncate font-medium'>{row.original.account}</div>
        <div className='text-ui-muted-foreground truncate text-xs'>{row.original.domain}</div>
      </div>
    ),
    size: 190,
    enableHiding: false,
    meta: { card: 'title', headerTitle: 'Account', stats: ['count', 'distinct'] }
  },
  {
    id: 'owner',
    accessorFn: (deal) => OWNER_LABELS.get(deal.owner),
    header: headerFor('Owner'),
    cell: ({ getValue }) => (
      <div className='flex min-w-0 items-center gap-2'>
        <Initials name={getValue()} />
        <span className='truncate'>{getValue()}</span>
      </div>
    ),
    size: 160,
    meta: { card: 'subtitle', headerTitle: 'Owner', stats: true }
  },
  {
    accessorKey: 'stage',
    header: headerFor('Stage'),
    cell: ({ getValue }) => {
      const stage = STAGE_BY_VALUE.get(getValue());
      return <Badge variant={stage.variant}>{stage.label}</Badge>;
    },
    filterFn: dataGridEqualsFilter,
    size: 110,
    meta: { card: 'badge', headerTitle: 'Stage', stats: true }
  },
  {
    accessorKey: 'amount',
    header: headerFor('Amount', 'end'),
    cell: ({ getValue }) => <span className='font-medium tabular-nums'>{money.format(getValue())}</span>,
    size: 120,
    aggregationFn: 'sum',
    meta: { ...END, headerTitle: 'Amount', stats: true, statsFormat: (value) => compactMoney.format(value) }
  },
  {
    accessorKey: 'probability',
    header: headerFor('Win %', 'end'),
    cell: ({ getValue }) => <span className='tabular-nums'>{getValue()}%</span>,
    size: 90,
    meta: { ...END, headerTitle: 'Win %', stats: ['min', 'max', 'avg'], statsFormat: (value) => `${Math.round(value)}%` }
  },
  {
    accessorKey: 'health',
    header: headerFor('Health', 'end'),
    cell: ({ cell }) => <DataGridHeatmapCell cell={cell} />,
    size: 96,
    meta: { ...END, headerTitle: 'Health', stats: ['min', 'max', 'avg'] }
  },
  {
    id: 'trend',
    header: headerFor('Revenue trend'),
    cell: ({ row }) => <TrendCell deal={row.original} />,
    size: 130,
    enableSorting: false,
    meta: { headerTitle: 'Revenue trend', export: false, card: 'field' }
  },
  {
    accessorKey: 'lastContact',
    header: headerFor('Last contact'),
    cell: ({ getValue }) => <span className='tabular-nums'>{shortDate.format(getValue())}</span>,
    sortFn: 'datetime',
    size: 120,
    meta: { headerTitle: 'Last contact', stats: true, statsFormat: (value) => shortDate.format(value), exportValue: (value) => value.toISOString().slice(0, 10) }
  }
];
const PIPELINE_REVIEW = {
  id: 'pipeline-review',
  name: 'Pipeline review',
  layout: {
    columnOrder: ['pin', 'select', 'account', 'stage', 'amount', 'probability', 'owner'],
    columnVisibility: { health: false, trend: false, lastContact: false },
    columnPinning: { start: ['pin', 'select', 'account'], end: [] },
    columnSizing: {},
    density: 'compact'
  }
};
const CRM_LAYOUT_STORAGE_KEY = 'gaudi-crm-workspace-layouts';
export function Pattern() {
  const [query, setQuery] = useState(() => createFilterQuery([], 'and'));
  const [view, setView] = useState('table');
  const [density, setDensity] = useState('comfortable');
  const [headerSticky, setHeaderSticky] = useState(true);
  const [striped, setStriped] = useState(false);
  const [addedIds, setAddedIds] = useState([]);
  const rows = useMemo(() => DEALS.filter((deal) => matches(deal, query)), [query]);
  const columns = useMemo(
    () => [...BASE_COLUMNS, ...registry.getColumns(addedIds)],
    [addedIds]
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: rows,
    getRowId: (deal) => deal.id,
    enableRowSelection: true,
    enableRowPinning: true,
    columnResizeMode: 'onChange',
    initialState: {
      sorting: [{ id: 'amount', desc: true }],
      // Only the narrow control columns are frozen by default, so a phone keeps
      // room to scroll; the Pipeline review layout freezes Account as well.
      columnPinning: { start: ['pin', 'select'], end: [] },
      rowPinning: { top: ['deal-4'], bottom: [] },
      pagination: { pageIndex: 0, pageSize: 50 }
    }
  });
  const layouts = useDataGridLayouts({
    table,
    density,
    onDensityChange: setDensity,
    defaultLayouts: [PIPELINE_REVIEW],
    storageKey: CRM_LAYOUT_STORAGE_KEY
  });
  const selected = Object.keys(table.state.rowSelection ?? {}).length;
  const pipeline = rows.filter((deal) => deal.stage !== 'lost').reduce((sum, deal) => sum + deal.amount, 0);
  return (
    <DataGrid
      table={table}
      recordCount={rows.length}
      emptyMessage='No deals match these filters'
      tableLayout={{
        dense: density === 'compact',
        headerSticky,
        stripped: striped,
        rowBorder: true,
        columnsResizable: true,
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        rowsPinnable: true
      }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'>
          <div className='flex min-w-0 flex-col'>
            <h2 className='text-ui-foreground text-sm font-medium'>Pipeline</h2>
            <p className='text-ui-muted-foreground text-xs tabular-nums'>
              {rows.length} deals · {compactMoney.format(pipeline)} open
              {selected ? ` · ${selected} selected` : ''}
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <DataGridColumnPicker
              registry={registry}
              value={addedIds}
              onAdd={(id) => setAddedIds((ids) => [...ids, id])}
            />
            <DataGridLayouts layouts={layouts} />
            <DataGridViewOptions
              density={density}
              onDensityChange={setDensity}
              headerSticky={headerSticky}
              onHeaderStickyChange={setHeaderSticky}
              toggles={[{ id: 'striped', label: 'Striped rows', checked: striped, onCheckedChange: setStriped }]}
              onReset={layouts.resetLayout}
            />
            <DataGridViewToggle value={view} onValueChange={setView} />
          </div>
        </CardHeader>
        <div className='border-ui-border border-t px-4 py-2'>
          <Filters fields={FILTER_FIELDS} query={query} onQueryChange={setQuery} showClear />
        </div>
        <CardContent className='p-0'>
          <DataGridStatusTabs
            columnId='stage'
            options={STAGES}
            listClassName='px-2'
            panelClassName='min-w-0'
          >
            {view === 'table' ? (
              <DataGridScrollArea className='h-[min(30rem,70dvh)]'>
                <DataGridTable />
              </DataGridScrollArea>
            ) : (
              <DataGridCardView
                aria-label='Deals'
                minCardWidth='17rem'
                className='p-4'
              />
            )}
          </DataGridStatusTabs>
        </CardContent>
      </Card>
    </DataGrid>
  );
}
