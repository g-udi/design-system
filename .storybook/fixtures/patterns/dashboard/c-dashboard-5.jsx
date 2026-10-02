'use client';
import { useState } from 'react';
import { DashboardGrid, DashboardPanel, dashboardSpan } from '../../../../src/components/blocks/Dashboard/index.js';
import { StatCard, StatMeter } from '../../../../src/components/blocks/StatCard/StatCard.jsx';
import { ComposedChart } from '../../../../src/components/charts/ComposedChart/index.js';
import { default as DataTable } from '../../../../src/components/core/DataTable/index.js';
import { ProgressRoot } from '../../../../src/components/core/Progress/index.js';
import { default as Avatar } from '../../../../src/components/core/Avatar/index.js';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const crews = [
  { id: 'north', crew: 'North Loop', lead: 'Ana Ruiz', avatar: 'women/44', region: 'Lisbon', sites: 18, covered: 17, shift: 'Day' },
  { id: 'harbour', crew: 'Harbour', lead: 'Tom Becker', avatar: 'men/41', region: 'Porto', sites: 22, covered: 16, shift: 'Day' },
  { id: 'ridge', crew: 'Ridge', lead: 'Priya Nair', avatar: 'women/23', region: 'Braga', sites: 12, covered: 12, shift: 'Night' },
  { id: 'valley', crew: 'Valley', lead: 'Omar Haddad', avatar: 'men/32', region: 'Coimbra', sites: 15, covered: 10, shift: 'Day' },
  { id: 'coast', crew: 'Coast', lead: 'Li Wei', avatar: 'men/75', region: 'Faro', sites: 9, covered: 8, shift: 'Night' }
];
const initialQueue = [
  { id: 'q1', title: 'Cover 6 sites in Porto', detail: 'Harbour is two technicians short until Thursday', action: 'Move 2 from Ridge', tone: 'warning-light', level: 'Gap' },
  { id: 'q2', title: 'Approve overtime for Valley', detail: '14 hours to clear the Coimbra backlog', action: 'Approve 14 h', tone: 'info-light', level: 'Approval' },
  { id: 'q3', title: 'Confirm contractor for Faro', detail: 'Coast asked for one contractor on night shifts', action: 'Confirm', tone: 'info-light', level: 'Approval' },
  { id: 'q4', title: 'Vehicle due for inspection', detail: 'Van 12 in Lisbon fails its check on Monday', action: 'Book slot', tone: 'destructive-light', level: 'Risk' }
];
const supply = [
  { label: 'Mon', staff: 42, contractors: 6, forecast: 50 },
  { label: 'Tue', staff: 44, contractors: 6, forecast: 52 },
  { label: 'Wed', staff: 41, contractors: 8, forecast: 55 },
  { label: 'Thu', staff: 39, contractors: 8, forecast: 58 },
  { label: 'Fri', staff: 43, contractors: 10, forecast: 54 },
  { label: 'Sat', staff: 22, contractors: 4, forecast: 28 },
  { label: 'Sun', staff: 18, contractors: 2, forecast: 21 }
];
const coverage = (row) => Math.round((row.covered / row.sites) * 100);

export function Pattern() {
  const [queue, setQueue] = useState(initialQueue);
  const [done, setDone] = useState([]);
  const sites = crews.reduce((total, row) => total + row.sites, 0);
  const covered = crews.reduce((total, row) => total + row.covered, 0);
  const settle = (item) => {
    setQueue((current) => current.filter((entry) => entry.id !== item.id));
    setDone((current) => [item.title, ...current]);
  };
  return (
    <div className='grid w-full gap-4'>
      <header className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-text-muted text-xs'>Gaudi · Field teams</p>
          <h2 className='text-xl font-semibold'>Coverage this week</h2>
        </div>
        <Button size='sm'><RegistryIcon lucide='PlusIcon' aria-hidden='true' />Schedule a shift</Button>
      </header>
      <DashboardGrid label='Field coverage'>
        <StatCard label='Sites covered' value={`${covered} of ${sites}`} delta='-3' description={`${Math.round((covered / sites) * 100)}% coverage`} className={dashboardSpan(4, 2)} />
        <StatCard label='On shift now' value='48' description='42 staff and 6 contractors' className={dashboardSpan(4, 2)}>
          <StatMeter showLegend={false} label='Staff and contractors' segments={[{ label: 'Staff', value: 42, tone: 'info' }, { label: 'Contractors', value: 6, tone: 'warning' }]} />
        </StatCard>
        <StatCard label='Open actions' value={String(queue.length)} description='Gaps, approvals and risks' className={dashboardSpan(4, 2)} />
        <DashboardPanel span={8} title='Crews' description='Coverage by crew and region'>
          <DataTable
            caption='Crew coverage'
            rows={crews}
            sortable
            density='compact'
            columns={[
              { key: 'crew', header: 'Crew', render: (row) => (
                <span className='flex items-center gap-2'>
                  <Avatar src={`https://randomuser.me/api/portraits/${row.avatar}.jpg`} name={row.lead} alt='' size='xs' />
                  <span className='grid leading-tight'><span className='font-medium'>{row.crew}</span><span className='text-text-muted text-xs'>{row.lead}</span></span>
                </span>
              ) },
              { key: 'region', header: 'Region' },
              { key: 'shift', header: 'Shift', render: (row) => <Badge variant={row.shift === 'Night' ? 'discovery-light' : 'secondary'}>{row.shift}</Badge> },
              { key: 'sites', header: 'Sites', align: 'right' },
              { key: 'coverage', header: 'Coverage', accessor: coverage, render: (row) => (
                <span className='flex min-w-36 items-center gap-2'>
                  <ProgressRoot value={coverage(row)} aria-label={`${row.crew}, ${coverage(row)}% covered`} className='flex-1' />
                  <span className='w-10 text-end text-xs tabular-nums'>{coverage(row)}%</span>
                </span>
              ) }
            ]}
          />
        </DashboardPanel>
        <DashboardPanel span={4} title='Action queue' description={queue.length ? `${queue.length} to decide` : 'All clear'}>
          {queue.length ? (
            <ul className='grid gap-3'>
              {queue.map((item) => (
                <li key={item.id} className='grid gap-2 rounded-(--ds-radius-card) border p-3'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='text-sm font-medium'>{item.title}</p>
                    <Badge variant={item.tone}>{item.level}</Badge>
                  </div>
                  <p className='text-text-muted text-xs'>{item.detail}</p>
                  <div className='flex gap-2'>
                    <Button size='xs' onClick={() => settle(item)}>{item.action}</Button>
                    <Button size='xs' variant='ghost' tone='neutral' onClick={() => settle(item)}>Dismiss</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-text-muted text-sm'>Every gap, approval and risk is handled.</p>
          )}
          <p aria-live='polite' className='sr-only'>{done[0] ? `${done[0]} handled.` : ''}</p>
        </DashboardPanel>
        <DashboardPanel span={12} title='Supply against forecast' description='Technicians on shift per day, with the demand forecast'>
          <ComposedChart
            framed={false}
            ariaLabel='Staff and contractors on shift against forecast demand, by day'
            data={supply}
            height={240}
            showLegend
            series={[
              { key: 'staff', label: 'Staff', type: 'bar', stack: 'supply' },
              { key: 'contractors', label: 'Contractors', type: 'bar', stack: 'supply' },
              { key: 'forecast', label: 'Forecast demand', type: 'line', dashed: true }
            ]}
          />
        </DashboardPanel>
      </DashboardGrid>
    </div>
  );
}
