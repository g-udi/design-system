'use client';
import { useState } from 'react';
import { DashboardGrid, DashboardPanel, DashboardToolbar } from '@gaudi/design-system/blocks/Dashboard';
import { ComposedChart } from '@gaudi/design-system/charts/ComposedChart';
import { DonutChart } from '@gaudi/design-system/charts/DonutChart';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { StatDelta } from '@gaudi/design-system/blocks/StatCard';
import { ProgressRoot } from '@gaudi/design-system/core/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { Badge } from '@gaudi/design-system/core/Pill';

const today = new Date(2026, 9, 1);
const days = ['Sep 18', 'Sep 19', 'Sep 20', 'Sep 21', 'Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26', 'Sep 27', 'Sep 28', 'Sep 29', 'Sep 30', 'Oct 1'];
const curve = (base, swing, trend, seed) => days.map((_, index) => Math.round((base + trend * index + swing * Math.sin(index * 0.9 + seed)) * 100) / 100);
// Six assistant metrics for the last 14 days, each with the 14 days before it.
const metrics = [
  { id: 'conversations', label: 'Conversations', value: '18,420', delta: '+14%', deltaDirection: 'up', deltaTone: 'success', current: curve(1180, 120, 22, 0), previous: curve(1060, 90, 8, 1.4), format: { maximumFractionDigits: 0 } },
  { id: 'duration', label: 'Avg duration', value: '3m 12s', delta: '-9%', deltaDirection: 'down', deltaTone: 'success', current: curve(3.4, 0.2, -0.02, 2), previous: curve(3.6, 0.2, 0, 0.3), format: { maximumFractionDigits: 1 }, unit: 'min' },
  { id: 'resolution', label: 'Resolved', value: '87.4%', delta: '+2.8 pts', deltaDirection: 'up', deltaTone: 'success', current: curve(84, 1.5, 0.25, 1), previous: curve(83, 1.2, 0.05, 2.2), format: { maximumFractionDigits: 1 }, unit: '%' },
  { id: 'handoffs', label: 'Handoffs', value: '1,162', delta: '-6%', deltaDirection: 'down', deltaTone: 'success', current: curve(88, 9, -0.6, 0.5), previous: curve(92, 8, 0, 1.9), format: { maximumFractionDigits: 0 } },
  { id: 'tokens', label: 'Tokens', value: '41.8M', delta: '+11%', deltaDirection: 'up', deltaTone: 'success', current: curve(2.8, 0.3, 0.04, 3), previous: curve(2.6, 0.25, 0.01, 0.8), format: { maximumFractionDigits: 2 }, unit: 'M' },
  { id: 'cost', label: 'Model cost', value: '$1,284', delta: '+7%', deltaDirection: 'up', deltaTone: 'danger', current: curve(86, 8, 1.1, 1.2), previous: curve(82, 7, 0.4, 2.6), format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } }
];
const agents = [
  { seed: 'support-agent', name: 'Support', conversations: 7120, resolved: 91, cost: '$412' },
  { seed: 'billing-agent', name: 'Billing', conversations: 3840, resolved: 88, cost: '$268' },
  { seed: 'editor-agent', name: 'Writing help', conversations: 3310, resolved: 84, cost: '$301' },
  { seed: 'onboarding-agent', name: 'Onboarding', conversations: 2460, resolved: 79, cost: '$157' },
  { seed: 'research-agent', name: 'Research', conversations: 1690, resolved: 72, cost: '$146' }
];
const channels = [
  { label: 'In-app chat', value: 9420 },
  { label: 'Help centre', value: 4810 },
  { label: 'Email', value: 2630 },
  { label: 'Voice', value: 1560 }
];
const top = Math.max(...agents.map((agent) => agent.conversations));

export function Pattern() {
  const [metricId, setMetricId] = useState('conversations');
  const [compare, setCompare] = useState(true);
  const metric = metrics.find((item) => item.id === metricId);
  const data = days.map((label, index) => ({ label, current: metric.current[index], previous: metric.previous[index] }));
  return (
    <div className='grid w-full gap-4'>
      <header className='flex flex-wrap items-center gap-3'>
        <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='lg' decorative />
        <div>
          <h2 className='text-xl font-semibold'>Assistant analytics</h2>
          <p className='text-text-muted text-sm'>Every agent answering readers and customers through Gaudi</p>
        </div>
      </header>
      <DashboardToolbar today={today} periods={[{ value: '14d', label: '14d', days: 14, description: 'Last 14 days' }, { value: '30d', label: '30d', days: 30, description: 'Last 30 days' }]} defaultPeriod='14d' compare={compare} onCompareChange={setCompare} allowCustom={false} />
      <DashboardGrid label='Assistant analytics'>
        <DashboardPanel span={12} title='Performance' description='Pick a metric to chart it'>
          <Tabs value={metricId} onValueChange={setMetricId} className='gap-3'>
            <TabsList aria-label='Metric' variant='outline' className='grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 @2xl/dashboard:grid-cols-3 @5xl/dashboard:grid-cols-6'>
              {metrics.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className='h-auto flex-col items-start gap-1 border px-3 py-2 text-start'>
                  <span className='text-text-muted text-xs font-normal'>{item.label}</span>
                  <span className='flex flex-wrap items-baseline gap-1.5'>
                    <span className='text-base font-semibold tabular-nums'>{item.value}</span>
                    <StatDelta value={item.delta} direction={item.deltaDirection} tone={item.deltaTone} />
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {metrics.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <ComposedChart
                  framed={false}
                  ariaLabel={`${item.label}, last 14 days${compare ? ', with the 14 days before' : ''}`}
                  data={item.id === metric.id ? data : []}
                  height={260}
                  showLegend={compare}
                  formatValue={item.format}
                  series={[
                    { key: 'current', label: 'This period', type: 'area' },
                    ...(compare ? [{ key: 'previous', label: 'Previous period', type: 'line', dashed: true }] : [])
                  ]}
                />
              </TabsContent>
            ))}
          </Tabs>
        </DashboardPanel>
        <DashboardPanel span={7} title='Agents ranked by conversations' description='Resolution rate and model cost per agent'>
          <ol className='@container grid gap-3'>
            {agents.map((agent, index) => (
              <li key={agent.seed} className='grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 @sm:grid-cols-[auto_minmax(0,1fr)_auto]'>
                <ChatAgentMark name={agent.name} seed={agent.seed} size='md' decorative />
                <div className='grid min-w-0 gap-1'>
                  <div className='flex items-baseline justify-between gap-2 text-sm'>
                    <span className='truncate font-medium'><span className='text-text-muted me-1.5 tabular-nums'>{index + 1}</span>{agent.name}</span>
                    <span className='tabular-nums'>{agent.conversations.toLocaleString('en-US')}</span>
                  </div>
                  <ProgressRoot value={agent.conversations} max={top} aria-label={`${agent.name}, ${agent.conversations} conversations`} />
                </div>
                <div className='col-start-2 flex items-center justify-between gap-2 text-xs @sm:col-start-auto @sm:grid @sm:justify-items-end'>
                  <Badge variant={agent.resolved >= 85 ? 'success-light' : agent.resolved >= 78 ? 'info-light' : 'warning-light'}>{agent.resolved}% resolved</Badge>
                  <span className='text-text-muted mt-1 tabular-nums'>{agent.cost}</span>
                </div>
              </li>
            ))}
          </ol>
        </DashboardPanel>
        <DashboardPanel span={5} title='Where conversations start'>
          <DonutChart framed={false} ariaLabel='Conversations by channel' data={channels} centerLabel='Conversations' height={220} showLegend />
        </DashboardPanel>
      </DashboardGrid>
    </div>
  );
}
