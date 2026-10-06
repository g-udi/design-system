'use client';
import { useState } from 'react';
import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { AreaChart } from '@gaudi/design-system/charts/AreaChart';
import { FunnelChart } from '@gaudi/design-system/charts/FunnelChart';
import { HeatmapChart } from '@gaudi/design-system/charts/HeatmapChart';
import { ChatActivity } from '@gaudi/design-system/chat/ChatActivityHistory';
import { default as DataTable } from '@gaudi/design-system/core/DataTable';
import { Badge } from '@gaudi/design-system/core/Pill';

const today = new Date(2026, 9, 1);
const growth = ['Sep 4', 'Sep 8', 'Sep 12', 'Sep 16', 'Sep 20', 'Sep 24', 'Sep 28', 'Oct 1'].map((label, index) => ({ label, free: 11200 + index * 260, paid: 1480 + index * 42 }));
const funnel = [
  { label: 'Sent', value: 12680 },
  { label: 'Opened', value: 7230 },
  { label: 'Clicked', value: 1910 },
  { label: 'Upgraded', value: 96 }
];
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['6', '9', '12', '15', '18', '21'];
const engagement = weekdays.flatMap((day, row) => hours.map((hour, column) => ({ x: hour, y: day, value: Math.round(18 + 30 * Math.exp(-((column - (row > 4 ? 1 : 2)) ** 2) / 3) + (row < 5 ? 12 : 0) - row * 1.5) })));
const posts = [
  { id: 'p1', title: 'Notes on local-first software', sent: 'Sep 29', opens: 64.2, clicks: 11.8, upgrades: 31 },
  { id: 'p2', title: 'Small tools, long lifetimes', sent: 'Sep 22', opens: 61.5, clicks: 9.4, upgrades: 22 },
  { id: 'p3', title: 'Designing for real data', sent: 'Sep 15', opens: 58.9, clicks: 13.1, upgrades: 27 },
  { id: 'p4', title: 'A practical guide to knowledge graphs', sent: 'Sep 8', opens: 55.3, clicks: 7.2, upgrades: 9 },
  { id: 'p5', title: 'What we learned shipping weekly', sent: 'Sep 1', opens: 57.7, clicks: 8.6, upgrades: 7 }
];
const activity = [
  { id: 'a1', title: 'Sent “Notes on local-first software” to 12,680 readers', time: 'Sep 29, 08:00', status: 'done' },
  { id: 'a2', title: 'Gaudi drafted subject lines for Friday’s issue', time: 'Sep 30, 16:20', icon: 'Sparkles', detail: 'Three options; the shortest tested best last month.' },
  { id: 'a3', title: 'Welcome series updated', time: 'Sep 30, 17:05', icon: 'Mail' },
  { id: 'a4', title: 'Friday’s issue scheduled', time: 'Oct 1, 09:30', icon: 'Calendar', detail: 'Goes out October 2 at 08:00 to 12,940 readers.' }
];

export function Pattern() {
  const [summary, setSummary] = useState(null);
  return (
    <div className='grid w-full gap-4'>
      <header>
        <p className='text-text-muted text-xs'>Gaudi · Newsletter</p>
        <h2 className='text-xl font-semibold'>Newsletter analytics</h2>
      </header>
      <DashboardToolbar today={today} defaultPeriod='30d' onChange={setSummary} />
      <DashboardGrid label='Newsletter analytics'>
        <StatCard label='Subscribers' value='14,706' delta='+6.4%' deltaDirection='up' deltaTone='success' description={summary?.compare ? 'vs previous period' : 'Free and paid'} className={dashboardSpan(3)} />
        <StatCard label='Open rate' value='57.0%' delta='+1.8 pts' deltaDirection='up' deltaTone='success' description='Across 5 issues' className={dashboardSpan(3)} />
        <StatCard label='Click rate' value='15.1%' delta='-0.6 pts' deltaDirection='down' deltaTone='danger' description='Of opens' className={dashboardSpan(3)} />
        <StatCard label='Unsubscribes' value='0.21%' delta='-0.04 pts' deltaDirection='down' deltaTone='success' description='Per issue' className={dashboardSpan(3)} />
        <DashboardPanel span={8} title='Subscriber growth'>
          <AreaChart framed={false} ariaLabel='Free and paid subscribers over the month' data={growth} stacked showLegend height={240} series={[{ key: 'free', label: 'Free' }, { key: 'paid', label: 'Paid' }]} />
        </DashboardPanel>
        <DashboardPanel span={4} title='Last issue' description='From inbox to upgrade'>
          <FunnelChart framed={false} ariaLabel='Last issue from sent to upgraded' data={funnel} />
        </DashboardPanel>
        <DashboardPanel span={7} title='When readers open' description='Opens by weekday and hour, % of peak'>
          <HeatmapChart framed={false} ariaLabel='Opens by weekday and hour of day' data={engagement} xLabels={hours} yLabels={weekdays} valueLabel='Opens' height={260} />
        </DashboardPanel>
        <DashboardPanel span={5} scrollLabel='Recent activity'>
          <ChatActivity title='Recent activity' items={activity} />
        </DashboardPanel>
        <DashboardPanel span={12} title='Issues' description='Performance of each issue this month'>
          <DataTable
            caption='Issues this month'
            rows={posts}
            sortable
            density='compact'
            columns={[
              { key: 'title', header: 'Issue' },
              { key: 'sent', header: 'Sent', sortable: false },
              { key: 'opens', header: 'Opens', align: 'right', render: (row) => `${row.opens}%` },
              { key: 'clicks', header: 'Clicks', align: 'right', render: (row) => `${row.clicks}%` },
              { key: 'upgrades', header: 'Upgrades', align: 'right', render: (row) => (row.upgrades >= 25 ? <Badge variant='success-light'>{row.upgrades}</Badge> : row.upgrades) }
            ]}
          />
        </DashboardPanel>
      </DashboardGrid>
    </div>
  );
}
