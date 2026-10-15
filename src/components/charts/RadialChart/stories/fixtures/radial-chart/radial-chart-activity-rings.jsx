'use client';
import { useEffect, useRef, useState } from 'react';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Daily goals, one ring per goal from the outside in. A share above 1 laps the ring.
const goals = [
  { id: 'deep', label: 'Deep work', unit: 'min', goal: 180, color: 'var(--chart-1)' },
  { id: 'writing', label: 'Writing', unit: 'words', goal: 1200, color: 'var(--chart-4)' },
  { id: 'reading', label: 'Reading', unit: 'pages', goal: 40, color: 'var(--chart-2)' }
];
const week = [
  { day: 'Mon', values: { deep: 190, writing: 1250, reading: 30 } },
  { day: 'Tue', values: { deep: 120, writing: 860, reading: 44 } },
  { day: 'Wed', values: { deep: 200, writing: 640, reading: 18 } },
  { day: 'Thu', values: { deep: 175, writing: 1300, reading: 36 } },
  { day: 'Fri', values: { deep: 95, writing: 1000, reading: 21 } },
  { day: 'Sat', values: { deep: 60, writing: 500, reading: 32 } },
  { day: 'Sun', values: { deep: 130, writing: 940, reading: 22 } }
];

const SPOKES = 48;
const DIAL = 248;
const TICK = 14;
const RING_GAP = 20;
const LAPS = 2;
const SWEEP_MS = 700;
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en');
const shareOf = (day, goal) => Math.min(day.values[goal.id] / goal.goal, LAPS);
const easeOut = (t) => 1 - (1 - t) ** 3;

// Eases every ring from its current share to the selected day's; jumps under reduced motion.
function useSweep(targets) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(() => targets.map(() => 0));
  const from = useRef(shown);
  const key = targets.join('|');
  useEffect(() => {
    const start = from.current;
    const target = key.split('|').map(Number);
    if (reduced) {
      from.current = target;
      setShown(target);
      return undefined;
    }
    const began = performance.now();
    let frame = 0;
    const step = (now) => {
      const t = easeOut(Math.min((now - began) / SWEEP_MS, 1));
      const next = target.map((value, index) => start[index] + (value - start[index]) * t);
      from.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [key, reduced]);
  return shown;
}

function TickRings({ shares }) {
  const centre = DIAL / 2;
  return (
    <svg width={DIAL} height={DIAL} viewBox={`0 0 ${DIAL} ${DIAL}`} aria-hidden='true'>
      {goals.map((goal, ring) => {
        const radius = centre - TICK / 2 - 2 - ring * RING_GAP;
        const share = shares[ring] ?? 0;
        const filled = Math.min(share, 1) * SPOKES;
        const lap = Math.max(share - 1, 0) * 100;
        const head = share > 0 ? Math.ceil(share * SPOKES - 1) % SPOKES : -1;
        return (
          <g key={goal.id}>
            {lap > 0 && (
              <circle cx={centre} cy={centre} r={radius - TICK / 2 - 3} fill='none' stroke={goal.color} strokeWidth={1.5}
                strokeLinecap='round' pathLength={100} strokeDasharray={`${lap} 100`} transform={`rotate(-90 ${centre} ${centre})`} />
            )}
            {Array.from({ length: SPOKES }, (_, tick) => {
              const angle = (tick / SPOKES) * 2 * Math.PI - Math.PI / 2;
              const isHead = tick === head;
              const stroke = isHead ? 'var(--ds-color-text)' : tick < filled ? goal.color : 'var(--ds-color-border)';
              return (
                <line key={tick} stroke={stroke} strokeWidth={isHead ? 3.5 : 2.5} strokeLinecap='round'
                  x1={centre + (radius - TICK / 2) * Math.cos(angle)} y1={centre + (radius - TICK / 2) * Math.sin(angle)}
                  x2={centre + (radius + TICK / 2) * Math.cos(angle)} y2={centre + (radius + TICK / 2) * Math.sin(angle)} />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function MiniRings({ day }) {
  const size = 30;
  const stroke = 3;
  const centre = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className='size-7.5' aria-hidden='true'>
      {goals.map((goal, ring) => {
        const radius = centre - stroke / 2 - ring * (stroke + 1.5);
        const share = Math.min(shareOf(day, goal), 1) * 100;
        return (
          <g key={goal.id}>
            <circle cx={centre} cy={centre} r={radius} fill='none' stroke='var(--ds-color-border)' strokeWidth={stroke} />
            {share > 0 && (
              <circle cx={centre} cy={centre} r={radius} fill='none' stroke={goal.color} strokeWidth={stroke} strokeLinecap='round'
                pathLength={100} strokeDasharray={`${share} 100`} transform={`rotate(-90 ${centre} ${centre})`} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function Pattern() {
  const [selected, setSelected] = useState('Sun');
  const day = week.find((entry) => entry.day === selected) ?? week[week.length - 1];
  const shares = useSweep(goals.map((goal) => shareOf(day, goal)));
  const overall = shares.reduce((sum, share) => sum + Math.min(share, 1), 0) / goals.length;
  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <CardHeader>
        <CardTitle>Daily goals</CardTitle>
        <CardDescription>Tick rings sweep toward each goal and trace a second lap past 100%.</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-8'>
        <div className='flex flex-wrap items-center justify-center gap-x-14 gap-y-8'>
          <div className='relative'>
            <TickRings shares={shares} />
            <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
              <span className='text-4xl font-semibold tabular-nums'>{percent.format(overall)}</span>
              <span className='text-sm text-muted-foreground'>of goals</span>
            </div>
          </div>
          <dl className='m-0 grid min-w-64 gap-6' aria-label={`Goals on ${day.day}`}>
            {goals.map((goal) => {
              const value = day.values[goal.id];
              const met = value >= goal.goal;
              return (
                <div key={goal.id} className='grid grid-cols-[auto_1fr_auto] items-center gap-x-3'>
                  <span className='h-9 w-0.5 rounded-full' style={{ backgroundColor: goal.color }} aria-hidden='true' />
                  <div>
                    <dt className='text-sm font-medium'>{goal.label}</dt>
                    <dd className='m-0 text-sm tabular-nums text-muted-foreground'>
                      {number.format(value)} / {number.format(goal.goal)} {goal.unit}
                    </dd>
                  </div>
                  <dd className='m-0 flex items-center gap-2 text-sm tabular-nums text-muted-foreground'>
                    {met && <RegistryIcon lucide='CircleCheckIcon' aria-label='Goal met' className='size-4 text-[var(--ds-color-success)]' />}
                    {percent.format(value / goal.goal)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <ToggleGroup type='single' value={day.day} onValueChange={(next) => next && setSelected(next)} aria-label='Pick a day'>
          {week.map((entry) => (
            <ToggleGroupItem key={entry.day} value={entry.day} aria-label={entry.day} className='h-auto flex-col gap-1 py-1.5'>
              <MiniRings day={entry} />
              <span className='text-xs'>{entry.day}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}
