'use client';
import { useState } from 'react';
import { DashboardGrid, DashboardPanel, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { Sparkline } from '@gaudi/design-system/charts/Sparkline';
import { BarChart } from '@gaudi/design-system/charts/BarChart';
import { SankeyChart } from '@gaudi/design-system/charts/SankeyChart';
import { default as Progress } from '@gaudi/design-system/core/Progress';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const tiles = [
  { label: 'Requests', value: '1.42B', delta: '+6%', deltaDirection: 'up', deltaTone: 'success', data: [182, 190, 188, 201, 197, 210, 214], color: 'var(--ds-color-chart-1)', variant: 'area' },
  { label: 'Blocked', value: '3.8M', delta: '+41%', deltaDirection: 'up', deltaTone: 'danger', data: [310, 290, 340, 520, 610, 580, 540], color: 'var(--ds-color-chart-5)', variant: 'bar' },
  { label: 'p95 at edge', value: '38 ms', delta: '-4 ms', deltaDirection: 'down', deltaTone: 'success', data: [44, 43, 41, 42, 40, 39, 38], color: 'var(--ds-color-chart-3)', variant: 'line' },
  { label: 'Origin errors', value: '0.07%', delta: '-0.02 pts', deltaDirection: 'down', deltaTone: 'success', data: [0.11, 0.1, 0.09, 0.12, 0.08, 0.08, 0.07], color: 'var(--ds-color-chart-2)', variant: 'line' }
];
const vectors = [
  { label: 'Mon', bots: 210, injection: 64, ddos: 20, credential: 42 },
  { label: 'Tue', bots: 220, injection: 58, ddos: 12, credential: 40 },
  { label: 'Wed', bots: 240, injection: 72, ddos: 28, credential: 46 },
  { label: 'Thu', bots: 310, injection: 96, ddos: 110, credential: 52 },
  { label: 'Fri', bots: 340, injection: 120, ddos: 160, credential: 61 },
  { label: 'Sat', bots: 300, injection: 104, ddos: 140, credential: 58 },
  { label: 'Sun', bots: 280, injection: 92, ddos: 122, credential: 49 }
];
const flows = [
  { source: 'Europe', target: 'Edge', value: 610 },
  { source: 'Americas', target: 'Edge', value: 540 },
  { source: 'Asia Pacific', target: 'Edge', value: 270 },
  { source: 'Edge', target: 'Cache', value: 1060 },
  { source: 'Edge', target: 'Origin', value: 322 },
  { source: 'Edge', target: 'Blocked', value: 38 }
];
const clusters = {
  eu: [{ id: 'fra-1', load: 72 }, { id: 'ams-2', load: 64 }, { id: 'lhr-1', load: 91 }, { id: 'mad-1', load: 48 }],
  us: [{ id: 'iad-3', load: 83 }, { id: 'ord-1', load: 57 }, { id: 'sfo-2', load: 69 }, { id: 'gru-1', load: 44 }],
  ap: [{ id: 'sin-1', load: 77 }, { id: 'nrt-2', load: 62 }, { id: 'syd-1', load: 35 }, { id: 'bom-1', load: 88 }]
};
const threats = [
  { id: 'th-1', name: 'Layer 7 flood on /api/search', source: 'AS 64512 · 1,240 addresses', mitigated: 86, state: 'Mitigating' },
  { id: 'th-2', name: 'Credential stuffing on sign-in', source: 'Rotating residential proxies', mitigated: 64, state: 'Challenging' },
  { id: 'th-3', name: 'SQL injection probes', source: '18 addresses', mitigated: 100, state: 'Blocked' }
];
const loadTone = (load) => (load >= 85 ? 'danger' : load >= 70 ? 'warning' : 'success');

export function Pattern() {
  const [region, setRegion] = useState('eu');
  const [paused, setPaused] = useState({});
  return (
    <div className='grid w-full gap-4'>
      <header className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-text-muted text-xs'>Gaudi · Edge network</p>
          <h2 className='text-xl font-semibold'>Security telemetry</h2>
        </div>
        <Badge variant='warning-light'><RegistryIcon lucide='ShieldAlertIcon' aria-hidden='true' />2 active threats</Badge>
      </header>
      <DashboardGrid label='Security telemetry'>
        {tiles.map((tile) => (
          <StatCard key={tile.label} label={tile.label} value={tile.value} delta={tile.delta} deltaDirection={tile.deltaDirection} deltaTone={tile.deltaTone} description='Last 7 days' className={dashboardSpan(3)}>
            <Sparkline ariaLabel={`${tile.label}, last 7 days`} data={tile.data} variant={tile.variant} color={tile.color} valueLabel={tile.label} height={36} />
          </StatCard>
        ))}
        <DashboardPanel span={7} title='Threats by vector' description='Requests blocked per day, thousands'>
          <BarChart
            framed={false}
            ariaLabel='Blocked requests per day by attack vector'
            data={vectors}
            stacked
            showLegend
            height={240}
            series={[{ key: 'bots', label: 'Bad bots' }, { key: 'injection', label: 'Injection' }, { key: 'ddos', label: 'Floods' }, { key: 'credential', label: 'Credential abuse' }]}
          />
        </DashboardPanel>
        <DashboardPanel span={5} title='Network flow' description='Millions of requests, last 24 hours'>
          <SankeyChart framed={false} ariaLabel='Requests from each region through the edge to cache, origin or blocked' links={flows} height={240} />
        </DashboardPanel>
        <DashboardPanel
          span={5}
          title='Cluster load'
          description='CPU across edge nodes'
          action={
            <ToggleGroup type='single' variant='outline' size='sm' spacing={0} aria-label='Region' value={region} onValueChange={(next) => setRegion(next || region)}>
              <ToggleGroupItem value='eu'>EU</ToggleGroupItem>
              <ToggleGroupItem value='us'>US</ToggleGroupItem>
              <ToggleGroupItem value='ap'>APAC</ToggleGroupItem>
            </ToggleGroup>
          }
        >
          <div className='grid gap-3'>
            {clusters[region].map((node) => (
              <Progress key={node.id} label={node.id} value={node.load} valueText={`${node.load}%`} tone={loadTone(node.load)} />
            ))}
          </div>
        </DashboardPanel>
        <DashboardPanel span={7} title='Active threats' description='Mitigation progress by rule'>
          <ul className='grid gap-4'>
            {threats.map((threat) => (
              <li key={threat.id} className='grid gap-2'>
                <div className='flex flex-wrap items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>{threat.name}</p>
                    <p className='text-text-muted text-xs'>{threat.source}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant={threat.state === 'Blocked' ? 'success-light' : paused[threat.id] ? 'secondary' : 'warning-light'}>{paused[threat.id] ? 'Paused' : threat.state}</Badge>
                    {threat.state !== 'Blocked' ? (
                      <Button variant='outline' tone='neutral' size='xs' aria-pressed={Boolean(paused[threat.id])} onClick={() => setPaused((current) => ({ ...current, [threat.id]: !current[threat.id] }))}>
                        {paused[threat.id] ? 'Resume rule' : 'Pause rule'}
                      </Button>
                    ) : null}
                  </div>
                </div>
                <Progress label='Mitigated' value={threat.mitigated} valueText={`${threat.mitigated}%`} tone={threat.mitigated === 100 ? 'success' : 'accent'} />
              </li>
            ))}
          </ul>
        </DashboardPanel>
      </DashboardGrid>
    </div>
  );
}
