'use client';
import { useMemo, useState } from 'react';
import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { Sparkline } from '@gaudi/design-system/charts/Sparkline';
import { StackedBarList } from '@gaudi/design-system/charts/StackedBarList';
import { GaugeChart } from '@gaudi/design-system/charts/GaugeChart';
import { default as DataTable } from '@gaudi/design-system/core/DataTable';
import { default as FilterBar } from '@gaudi/design-system/core/FilterBar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const today = new Date(2026, 9, 1);
const kpis = [
  { label: 'Utilisation', value: '82%', delta: '+3.1 pts', deltaDirection: 'up', deltaTone: 'success', data: [71, 74, 73, 76, 78, 77, 80, 79, 82], variant: 'area', color: 'var(--ds-color-chart-1)' },
  { label: 'Open exceptions', value: '14', delta: '-22%', deltaDirection: 'down', deltaTone: 'success', data: [21, 19, 22, 18, 17, 18, 15, 16, 14], variant: 'bar', color: 'var(--ds-color-chart-5)' },
  { label: 'Time to resolve', value: '3.4 h', delta: '-0.6 h', deltaDirection: 'down', deltaTone: 'success', data: [4.6, 4.4, 4.5, 4.1, 3.9, 4, 3.7, 3.6, 3.4], variant: 'line', color: 'var(--ds-color-chart-3)' },
  { label: 'SLA met', value: '96.1%', delta: '+1.4 pts', deltaDirection: 'up', deltaTone: 'success', data: [93, 94, 93.5, 94.6, 95, 94.8, 95.5, 95.9, 96.1], variant: 'line', color: 'var(--ds-color-chart-2)', reference: 95 }
];
const capacity = [
  { label: 'Editorial', committed: 310, scheduled: 92, available: 38 },
  { label: 'Platform', committed: 268, scheduled: 120, available: 52 },
  { label: 'Support', committed: 352, scheduled: 64, available: 24 },
  { label: 'Data', committed: 180, scheduled: 76, available: 84 }
];
const severityTone = { Critical: 'destructive-light', High: 'warning-light', Medium: 'info-light', Low: 'secondary' };
const initialExceptions = [
  { id: 'EX-1042', title: 'Publishing queue stalled on image resize', severity: 'Critical', team: 'Platform', owner: 'Kerem Haddadin', age: '42 min', status: 'Open' },
  { id: 'EX-1039', title: 'Newsletter send exceeded rate limit', severity: 'High', team: 'Platform', owner: 'Priyanka Nairn', age: '2 h', status: 'Acknowledged' },
  { id: 'EX-1036', title: 'Search index lagging by 18 minutes', severity: 'High', team: 'Data', owner: 'Li Wei', age: '3 h', status: 'Open' },
  { id: 'EX-1031', title: 'Support backlog above weekly target', severity: 'Medium', team: 'Support', owner: 'Ana Ruiz', age: '6 h', status: 'Open' },
  { id: 'EX-1027', title: 'Two scheduled posts missing alt text', severity: 'Low', team: 'Editorial', owner: 'Maya Lopez', age: '1 d', status: 'Acknowledged' },
  { id: 'EX-1022', title: 'Comment moderation queue over 200', severity: 'Medium', team: 'Support', owner: 'Tom Becker', age: '1 d', status: 'Open' }
];
const modules = [
  { id: 'publishing', name: 'Publishing', owner: 'Platform', health: 'Degraded', uptime: '99.21%', latency: [180, 190, 240, 410, 380, 260, 220] },
  { id: 'newsletter', name: 'Newsletter', owner: 'Platform', health: 'Healthy', uptime: '99.98%', latency: [120, 118, 122, 130, 126, 119, 121] },
  { id: 'search', name: 'Search', owner: 'Data', health: 'Degraded', uptime: '99.64%', latency: [90, 96, 140, 180, 160, 150, 130] },
  { id: 'comments', name: 'Comments', owner: 'Support', health: 'Healthy', uptime: '99.95%', latency: [70, 72, 69, 74, 71, 70, 73] },
  { id: 'billing', name: 'Billing', owner: 'Platform', health: 'Healthy', uptime: '100%', latency: [140, 138, 142, 139, 141, 140, 138] },
  { id: 'analytics', name: 'Analytics', owner: 'Data', health: 'Healthy', uptime: '99.9%', latency: [210, 205, 220, 215, 208, 212, 209] }
];

export function Pattern() {
  const [rows, setRows] = useState(initialExceptions);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState([]);
  const [status, setStatus] = useState([]);
  const visible = useMemo(
    () => rows.filter((row) => (!severity.length || severity.includes(row.severity)) && (!status.length || status.includes(row.status)) && `${row.id} ${row.title} ${row.owner}`.toLowerCase().includes(query.toLowerCase())),
    [rows, severity, status, query]
  );
  const facet = (id, label, value, onChange, values) => ({
    id, label, value, onChange, multiple: true,
    options: values.map((option) => ({ value: option, label: option, count: rows.filter((row) => row[id] === option).length }))
  });
  const update = (id, next) => setRows((current) => current.map((row) => (row.id === id ? { ...row, status: next } : row)));
  return (
    <div className='grid w-full gap-4'>
      <header className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-text-muted text-xs'>Gaudi · Operations</p>
          <h2 className='text-xl font-semibold'>Capacity and exceptions</h2>
        </div>
        <Button variant='outline' tone='neutral' size='sm'><RegistryIcon lucide='DownloadIcon' aria-hidden='true' />Export report</Button>
      </header>
      <DashboardToolbar today={today} defaultPeriod='7d' />
      <DashboardGrid label='Operations overview'>
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} deltaDirection={kpi.deltaDirection} deltaTone={kpi.deltaTone} description='Last 7 days' className={dashboardSpan(3)}>
            <Sparkline ariaLabel={`${kpi.label}, last 9 days`} data={kpi.data} variant={kpi.variant} color={kpi.color} reference={kpi.reference} valueLabel={kpi.label} height={40} />
          </StatCard>
        ))}
        <DashboardPanel title='Capacity allocation' description='Hours this week by team' span={8}>
          <StackedBarList
            ariaLabel='Hours committed, scheduled and available by team'
            framed={false}
            data={capacity}
            series={[{ key: 'committed', label: 'Committed' }, { key: 'scheduled', label: 'Scheduled' }, { key: 'available', label: 'Available' }]}
            formatValue={(value) => `${value} h`}
          />
        </DashboardPanel>
        <DashboardPanel title='Overall utilisation' description='Target 80%' span={4}>
          <GaugeChart ariaLabel='Utilisation against target' framed={false} value={82} target={80} unit='%' label='of planned hours' bands={[{ to: 60, tone: 'warning' }, { to: 90, tone: 'success' }, { to: 100, tone: 'danger' }]} />
        </DashboardPanel>
        <DashboardPanel span={12} title='Work queue' description='Exceptions to clear and the modules behind them'>
          <Tabs defaultValue='exceptions' className='gap-3'>
            <TabsList aria-label='Work queue view'>
              <TabsTrigger value='exceptions'>Exceptions <Badge variant='secondary' size='sm'>{rows.filter((row) => row.status !== 'Resolved').length}</Badge></TabsTrigger>
              <TabsTrigger value='modules'>Modules</TabsTrigger>
            </TabsList>
            <TabsContent value='exceptions' className='grid gap-3'>
              <FilterBar
                query={query}
                onQueryChange={setQuery}
                searchLabel='Search exceptions'
                placeholder='Search by ID, title or owner…'
                count={visible.length}
                facets={[facet('severity', 'Severity', severity, setSeverity, ['Critical', 'High', 'Medium', 'Low']), facet('status', 'Status', status, setStatus, ['Open', 'Acknowledged', 'Resolved'])]}
                onClearFilters={() => { setSeverity([]); setStatus([]); setQuery(''); }}
              />
              <DataTable
                caption='Open exceptions'
                rows={visible}
                sortable
                density='compact'
                columns={[
                  { key: 'id', header: 'ID', width: 96 },
                  { key: 'title', header: 'Exception' },
                  { key: 'severity', header: 'Severity', render: (row) => <Badge variant={severityTone[row.severity]}>{row.severity}</Badge> },
                  { key: 'team', header: 'Team' },
                  { key: 'owner', header: 'Owner' },
                  { key: 'age', header: 'Age', align: 'right' },
                  { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Resolved' ? 'success-light' : row.status === 'Acknowledged' ? 'info-light' : 'outline'}>{row.status}</Badge> }
                ]}
                getRowActions={(row) => [
                  { label: 'Acknowledge', icon: 'Eye', onSelect: () => update(row.id, 'Acknowledged') },
                  { label: 'Mark resolved', icon: 'CircleCheck', onSelect: () => update(row.id, 'Resolved') }
                ]}
                emptyTitle='No exceptions' emptyDescription='Nothing matches these filters.'
              />
            </TabsContent>
            <TabsContent value='modules'>
              <DataTable
                caption='Modules'
                rows={modules}
                searchable
                sortable
                density='compact'
                columns={[
                  { key: 'name', header: 'Module' },
                  { key: 'owner', header: 'Owner' },
                  { key: 'health', header: 'Health', render: (row) => <Badge variant={row.health === 'Healthy' ? 'success-light' : 'warning-light'}>{row.health}</Badge> },
                  { key: 'uptime', header: 'Uptime (30d)', align: 'right' },
                  { key: 'latency', header: 'p95 latency, 7 days', sortable: false, searchable: false, render: (row) => <div className='w-32'><Sparkline ariaLabel={`${row.name} p95 latency`} data={row.latency} height={24} showEndpoint={false} valueLabel='ms' /></div> }
                ]}
              />
            </TabsContent>
          </Tabs>
        </DashboardPanel>
      </DashboardGrid>
    </div>
  );
}
