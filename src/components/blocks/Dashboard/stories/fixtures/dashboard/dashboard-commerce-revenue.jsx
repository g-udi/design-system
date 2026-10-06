'use client';
import { useRef, useState } from 'react';
import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { Sparkline } from '@gaudi/design-system/charts/Sparkline';
import { AreaChart } from '@gaudi/design-system/charts/AreaChart';
import { BarChart } from '@gaudi/design-system/charts/BarChart';
import { default as DataTable } from '@gaudi/design-system/core/DataTable';
import { ProgressRoot } from '@gaudi/design-system/core/Progress';
import Dialog from '@gaudi/design-system/core/Dialog';
import { Badge } from '@gaudi/design-system/core/Pill';

const today = new Date(2026, 9, 1);
// Revenue by product line for each period length; the toolbar picks the series.
const revenue = {
  '7d': ['Sep 25', 'Sep 26', 'Sep 27', 'Sep 28', 'Sep 29', 'Sep 30', 'Oct 1'].map((label, index) => ({ label, prints: 1800 + index * 90, books: 1200 + (index % 3) * 140, memberships: 2400 + index * 60 })),
  '30d': ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'].map((label, index) => ({ label, prints: 11800 + index * 900, books: 8400 + (index % 2) * 1100, memberships: 16200 + index * 700 })),
  '90d': ['Jul', 'Aug', 'Sep'].map((label, index) => ({ label, prints: 46200 + index * 5200, books: 35100 + index * 1800, memberships: 66400 + index * 4100 })),
  '12m': ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((label, index) => ({ label, prints: 38000 + index * 1500 + (index === 1 ? 14000 : 0), books: 29000 + index * 700 + (index === 1 ? 9000 : 0), memberships: 52000 + index * 1600 }))
};
const totals = {
  '7d': { revenue: '$37,410', orders: '1,028', aov: '$36.39', refunds: '1.2%', deltas: [{ value: '+8.2%', direction: 'up', tone: 'success' }, { value: '+5.1%', direction: 'up', tone: 'success' }, { value: '+2.9%', direction: 'up', tone: 'success' }, { value: '-0.3 pts', direction: 'down', tone: 'success' }] },
  '30d': { revenue: '$184,950', orders: '5,212', aov: '$35.49', refunds: '1.4%', deltas: [{ value: '+11.6%', direction: 'up', tone: 'success' }, { value: '+7.4%', direction: 'up', tone: 'success' }, { value: '+3.9%', direction: 'up', tone: 'success' }, { value: '-0.1 pts', direction: 'down', tone: 'success' }] },
  '90d': { revenue: '$510,300', orders: '14,870', aov: '$34.32', refunds: '1.5%', deltas: [{ value: '+9.8%', direction: 'up', tone: 'success' }, { value: '+6.2%', direction: 'up', tone: 'success' }, { value: '+3.4%', direction: 'up', tone: 'success' }, { value: '+0.2 pts', direction: 'up', tone: 'danger' }] },
  '12m': { revenue: '$1.93M', orders: '57,640', aov: '$33.49', refunds: '1.6%', deltas: [{ value: '+24%', direction: 'up', tone: 'success' }, { value: '+19%', direction: 'up', tone: 'success' }, { value: '+4.2%', direction: 'up', tone: 'success' }, { value: '+0.1 pts', direction: 'up', tone: 'danger' }] }
};
const channels = [
  { label: 'Online store', value: 41 },
  { label: 'Newsletter links', value: 23 },
  { label: 'Marketplace', value: 17 },
  { label: 'Events', value: 11 },
  { label: 'Wholesale', value: 8 }
];
const orders = [
  { id: '#5821', customer: 'Harbor Books', items: 14, total: 612.4, status: 'Packing', progress: 45, placed: 'Today, 09:12' },
  { id: '#5820', customer: 'Sofia Brandt', items: 2, total: 74, status: 'Shipped', progress: 80, placed: 'Today, 08:40' },
  { id: '#5818', customer: 'Fabrikam Studio', items: 30, total: 1320, status: 'Awaiting stock', progress: 15, placed: 'Yesterday' },
  { id: '#5816', customer: 'Ansel Mwangi', items: 1, total: 38, status: 'Delivered', progress: 100, placed: 'Yesterday' },
  { id: '#5815', customer: 'Kestrel Kites', items: 8, total: 296.5, status: 'Packing', progress: 55, placed: 'Sep 29' },
  { id: '#5812', customer: 'Maya Lopez', items: 3, total: 112, status: 'Shipped', progress: 85, placed: 'Sep 29' },
  { id: '#5809', customer: 'Contoso Research', items: 22, total: 948, status: 'Delivered', progress: 100, placed: 'Sep 28' }
];
const statusTone = { Packing: 'info-light', Shipped: 'discovery-light', Delivered: 'success-light', 'Awaiting stock': 'warning-light' };
const money = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const trend = [[31, 34, 33, 36, 35, 38, 40], [140, 151, 147, 158, 155, 160, 166], [34.2, 34.8, 35.1, 34.9, 35.6, 35.9, 36.4], [1.6, 1.5, 1.5, 1.4, 1.3, 1.3, 1.2]];

export function Pattern() {
  const [period, setPeriod] = useState('30d');
  const [preview, setPreview] = useState(null);
  const returnFocus = useRef(null);
  const openOrder = (order, mode) => {
    const menu = document.activeElement?.closest('[role="menu"]');
    returnFocus.current = document.getElementById(menu?.getAttribute('aria-labelledby'));
    setPreview({ order, mode });
  };
  const current = totals[period] ? period : '30d';
  const kpis = [
    { label: 'Revenue', value: totals[current].revenue },
    { label: 'Orders', value: totals[current].orders },
    { label: 'Average order', value: totals[current].aov },
    { label: 'Refund rate', value: totals[current].refunds }
  ];
  return (
    <div className='grid w-full gap-4'>
      <header>
        <p className='text-text-muted text-xs'>Gaudi · Shop</p>
        <h2 className='text-xl font-semibold'>Revenue</h2>
      </header>
      <DashboardToolbar today={today} period={current} onPeriodChange={(next) => setPeriod(next)} allowCustom={false} defaultCompare />
      <DashboardGrid label='Shop revenue'>
        {kpis.map((kpi, index) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} delta={totals[current].deltas[index].value} deltaDirection={totals[current].deltas[index].direction} deltaTone={totals[current].deltas[index].tone} description='vs previous period' className={dashboardSpan(3)}>
            <Sparkline ariaLabel={`${kpi.label} trend`} data={trend[index]} variant={index === 1 ? 'bar' : 'area'} color={`var(--ds-color-chart-${index + 1})`} valueLabel={kpi.label} height={36} />
          </StatCard>
        ))}
        <DashboardPanel span={8} title='Revenue by product line'>
          <AreaChart
            framed={false}
            ariaLabel='Revenue by product line'
            data={revenue[current]}
            stacked
            showLegend
            height={260}
            formatValue={{ style: 'currency', currency: 'USD', notation: 'compact' }}
            series={[{ key: 'memberships', label: 'Memberships' }, { key: 'prints', label: 'Prints' }, { key: 'books', label: 'Books' }]}
          />
        </DashboardPanel>
        <DashboardPanel span={4} title='Channel mix' description='Share of revenue'>
          <BarChart framed={false} ariaLabel='Share of revenue by channel' data={channels} layout='horizontal' highlight='Online store' height={260} formatValue={(value) => `${value}%`} />
        </DashboardPanel>
        <DashboardPanel span={12} title='Order queue' description='Sort by any column; open an order from its menu'>
          <DataTable
            caption='Order queue'
            rows={orders}
            sortable
            searchable
            density='compact'
            exportable={{ filename: 'gaudi-orders' }}
            columns={[
              { key: 'id', header: 'Order', width: 90 },
              { key: 'customer', header: 'Customer' },
              { key: 'placed', header: 'Placed', sortable: false },
              { key: 'items', header: 'Items', align: 'right' },
              { key: 'total', header: 'Total', align: 'right', render: (row) => money(row.total), exportValue: (value) => value },
              { key: 'status', header: 'Status', render: (row) => <Badge variant={statusTone[row.status]}>{row.status}</Badge> },
              { key: 'progress', header: 'Fulfilment', render: (row) => (
                <span className='flex min-w-32 items-center gap-2'>
                  <ProgressRoot value={row.progress} aria-label={`Order ${row.id}, ${row.progress}% fulfilled`} className='flex-1' />
                  <span className='w-9 text-end text-xs tabular-nums'>{row.progress}%</span>
                </span>
              ) }
            ]}
            getRowActions={(order) => [{ label: 'Open order', icon: 'ArrowUpRight', onSelect: () => openOrder(order, 'order') }, { label: 'Preview packing slip', icon: 'FileText', onSelect: () => openOrder(order, 'packing') }]}
          />
        </DashboardPanel>
      </DashboardGrid>
      <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null); }} title={preview ? `${preview.mode === 'packing' ? 'Packing slip' : 'Order'} ${preview.order.id}` : 'Order'} description='Local example data; no order service is connected.' contentProps={{ onCloseAutoFocus: (event) => {
        if (returnFocus.current?.isConnected) { event.preventDefault(); returnFocus.current.focus(); }
      } }}>
        {preview ? <dl className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm'>
          <dt className='text-text-muted'>Customer</dt><dd>{preview.order.customer}</dd>
          <dt className='text-text-muted'>Items</dt><dd>{preview.order.items}</dd>
          {preview.mode === 'packing' ? <><dt className='text-text-muted'>Status</dt><dd>{preview.order.status}</dd></> : <><dt className='text-text-muted'>Total</dt><dd>{money(preview.order.total)}</dd></>}
        </dl> : null}
      </Dialog>
    </div>
  );
}
