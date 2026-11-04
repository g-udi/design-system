'use client';
import { useId, useState } from 'react';
import { StatMeter } from '@gaudi/design-system/blocks/StatCard';
import { CardRoot, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@gaudi/design-system/core/Card';
import { ToggleGroupRoot, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import { ProgressRoot } from '@gaudi/design-system/core/Progress';
import { Badge } from '@gaudi/design-system/core/Pill';
import Button from '@gaudi/design-system/core/Button';
import { Sparkline } from '@gaudi/design-system/charts/Sparkline';

const format = (value) => value.toLocaleString('en-GB');
const categories = [
  { label: 'Chat', tone: 'accent' }, { label: 'Search', tone: 'warning' },
  { label: 'Images', tone: 'discovery' }, { label: 'API', tone: 'neutral' }
];
// Prepared example data, not a billing integration. Periods use independent daily records.
const periods = {
  month: { label: 'This month', values: [3980, 1640, 1120, 680], days: [210, 360, 250, 440, 330, 280, 560, 410, 520, 310, 450, 380, 490, 610, 430, 540, 390, 460], date: 'Nov', seats: 8, storage: 3.2 },
  previous: { label: 'Last month', values: [2940, 1210, 850, 500], days: [180, 240, 310, 210, 280, 340, 260, 190, 320, 370, 230, 280, 410, 360, 250, 310, 290, 390, 280, 310, 200, 350, 330, 280, 410, 230, 270, 310, 350, 290, 260], date: 'Oct', seats: 6, storage: 2.4 },
  week: { label: '7 days', values: [980, 420, 280, 140], days: [230, 280, 190, 340, 210, 310, 260], date: 'Nov', seats: 8, storage: 3.2 }
};
const scenarios = { normal: 'Standard', warning: 'Near limit', limit: 'Limit reached', empty: 'Empty' };

export function Pattern() {
  const titleId = useId();
  const [period, setPeriod] = useState('month');
  const [scenario, setScenario] = useState('normal');
  const [extraCredits, setExtraCredits] = useState(0);
  const [planOpen, setPlanOpen] = useState(false);
  const data = periods[period];
  const historical = period === 'previous';
  const base = data.values.reduce((sum, value) => sum + value, 0);
  const used = scenario === 'warning' ? 9400 : scenario === 'limit' ? 10000 : scenario === 'empty' ? 0 : base;
  const total = 10000 + (historical ? 0 : extraCredits);
  const remaining = total - used;
  const percent = Math.round(used / total * 100);
  const tone = percent >= 100 ? 'destructive-light' : percent >= 80 ? 'warning-light' : 'secondary';
  const segments = categories.map((category, index) => ({ ...category, value: index === 3 ? used - data.values.slice(0, 3).reduce((sum, value) => sum + Math.round(value / base * used), 0) : Math.round(data.values[index] / base * used) }));
  // Match the daily series to the same prepared total, including rounding on the final day.
  const dayTotal = data.days.reduce((sum, value) => sum + value, 0);
  const dailyValues = data.days.map(value => Math.floor(value / dayTotal * used));
  dailyValues[dailyValues.length - 1] += used - dailyValues.reduce((sum, value) => sum + value, 0);
  const daily = dailyValues.map((value, index) => ({ label: `${index + 1} ${data.date}`, value }));
  const status = historical ? 'Closed billing period' : remaining === 0 ? 'Credit limit reached' : percent >= 80 ? 'Running low on credits' : `${format(remaining)} credits available`;

  return (
    <div className='ds-touch-controls mx-auto grid w-full max-w-md gap-4 text-sm'>
      <CardRoot role='region' aria-labelledby={titleId} className='@container w-full gap-5 py-4'>
        <CardHeader className='gap-1 px-4'>
          <CardTitle id={titleId}>Workspace usage</CardTitle>
          <CardDescription>Team plan · {historical ? '1–31 October' : 'Resets 1 December'}</CardDescription>
        </CardHeader>
        <CardContent className='grid min-w-0 gap-5 px-4'>
          <ToggleGroupRoot aria-label='Usage period' type='single' variant='outline' size='sm' spacing={0} value={period}
            className='max-w-full flex-wrap' onValueChange={(next) => { if (next) { setPeriod(next); setPlanOpen(false); } }}>
            {Object.entries(periods).map(([key, value]) => <ToggleGroupItem key={key} value={key} className='min-w-0'>{value.label}</ToggleGroupItem>)}
          </ToggleGroupRoot>
          <div className='grid gap-3'>
            <div className='flex flex-wrap items-baseline justify-between gap-2'>
              <p className='flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums'>
                <strong className='text-2xl font-semibold tracking-tight'>{format(used)}</strong>
                <span className='text-xs text-text-muted'>of {format(total)} credits</span>
              </p>
              <Badge variant={tone} size='sm'>{percent}% used</Badge>
            </div>
            <div>
              <span className='sr-only' role='meter' aria-label='AI credits used' aria-valuemin={0} aria-valuemax={total} aria-valuenow={used} aria-valuetext={`${format(used)} of ${format(total)} credits`} />
              <StatMeter segments={segments} max={total} formatValue={format} />
            </div>
          </div>
          <div className='grid min-w-0 gap-2 border-t pt-4'>
            <div className='flex flex-wrap items-baseline justify-between gap-2 text-xs'>
              <span>Daily usage</span><span className='text-text-muted tabular-nums'>{format(Math.round(used / daily.length))} credits / day</span>
            </div>
            <Sparkline ariaLabel={`Daily credit usage, ${data.label.toLowerCase()}`} data={daily} variant='bar' reference={0} height={64} showEndpoint={false} valueLabel='Credits' formatValue={format} color='var(--ds-color-chart-1)' />
            <div className='flex justify-between text-xs text-text-muted'><span>{daily[0].label}</span><span>{daily.at(-1).label}</span></div>
          </div>
          <dl className='grid min-w-0 gap-4 border-t pt-4 @[24rem]:grid-cols-3'>
            {[{ label: 'Seats', value: data.seats, max: 10, text: `${data.seats} of 10` }, { label: 'Storage', value: data.storage, max: 5, text: `${data.storage} of 5 GB` }, { label: 'Projects', text: '12 · Unlimited' }].map(limit => (
              <div key={limit.label} className='grid min-w-0 gap-2'>
                <dt className='text-xs text-text-muted'>{limit.label}</dt>
                <dd className='grid gap-2 text-xs tabular-nums'>
                  <span>{limit.text}</span>
                  {limit.max ? <ProgressRoot role='meter' value={limit.value} max={limit.max} aria-label={`${limit.label} used`} aria-valuetext={limit.text} className='h-1.5' /> : <span className='text-text-muted'>No plan limit</span>}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
        <CardFooter className='block border-t px-4 pt-4'>
          <Collapsible open={planOpen} onOpenChange={setPlanOpen} className='grid gap-3'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <p role='status' className='text-xs text-text-muted'>{status}</p>
              <CollapsibleTrigger asChild><Button variant={percent >= 80 && !historical ? 'solid' : 'outline'} size='sm'>{percent >= 80 && !historical ? 'Add credits' : 'Plan details'}</Button></CollapsibleTrigger>
            </div>
            <CollapsibleContent className='grid gap-3 text-xs'>
              <p className='text-text-muted'>Sample Team plan: 10,000 credits per month, 10 seats, 5 GB storage and unlimited projects.</p>
              <Button variant='outline' size='sm' disabled={historical} className='justify-self-start max-w-full' onClick={() => { setExtraCredits(value => value + 2000); setPlanOpen(false); }}>Add 2,000 demo credits</Button>
              <p className='text-text-muted'>{historical ? 'Top-ups apply to the current cycle only.' : 'Demo only. No payment or account change.'}</p>
            </CollapsibleContent>
          </Collapsible>
        </CardFooter>
      </CardRoot>
      <div className='grid gap-2'>
        <span className='text-xs text-text-muted'>Sample usage state</span>
        <ToggleGroupRoot aria-label='Sample usage state' type='single' variant='outline' size='sm' value={scenario} className='max-w-full flex-wrap'
          onValueChange={(next) => { if (next) { setScenario(next); setExtraCredits(0); setPlanOpen(false); } }}>
          {Object.entries(scenarios).map(([key, label]) => <ToggleGroupItem key={key} value={key}>{label}</ToggleGroupItem>)}
        </ToggleGroupRoot>
      </div>
    </div>
  );
}
