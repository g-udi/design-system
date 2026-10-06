'use client';
import { useState } from 'react';
import { StatCard, StatDelta } from '@gaudi/design-system/blocks/StatCard';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';

const metrics = [
  { label: 'Revenue', value: '$48,290', delta: '12.4%', deltaDirection: 'up', deltaTone: 'success', previous: '$42,960', icon: 'DollarSignIcon', tone: 'success' },
  { label: 'Subscribers', value: '1,284', delta: '8.1%', deltaDirection: 'up', deltaTone: 'success', previous: '1,188', icon: 'UsersIcon', tone: 'info' },
  { label: 'Orders', value: '326', delta: '-3.2%', deltaDirection: 'down', deltaTone: 'danger', previous: '337', icon: 'ShoppingCartIcon', tone: 'warning' },
  { label: 'Churn', value: '2.1%', delta: '-0.4%', deltaDirection: 'down', deltaTone: 'success', previous: '2.5%', icon: 'ActivityIcon', tone: 'discovery' }
];

function MetricMenu({ label }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-xs' aria-label={`${label} actions`}>
          <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>View report</DropdownMenuItem>
        <DropdownMenuItem>Set a goal</DropdownMenuItem>
        <DropdownMenuItem>Export CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Pattern() {
  const [layout, setLayout] = useState('cards');
  return (
    <div className='grid w-full max-w-5xl gap-3'>
      <ToggleGroup
        aria-label='KPI layout'
        type='single'
        variant='outline'
        size='sm'
        spacing={0}
        value={layout}
        onValueChange={(next) => setLayout(next || layout)}
        className='justify-self-end'
      >
        <ToggleGroupItem value='cards'>Cards</ToggleGroupItem>
        <ToggleGroupItem value='panel'>Panel</ToggleGroupItem>
        <ToggleGroupItem value='tinted'>Tinted</ToggleGroupItem>
      </ToggleGroup>
      {layout === 'panel' ? (
        /* One bordered panel divided into cells, for dense dashboards. */
        <dl className='bg-surface grid overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-4'>
          {metrics.map((metric) => (
            <div key={metric.label} className='grid gap-1 border-b p-4 last:border-b-0 sm:odd:border-e lg:border-e lg:border-b-0 lg:last:border-e-0'>
              <dt className='text-text-muted text-sm'>{metric.label}</dt>
              <dd className='flex items-baseline gap-2'>
                <span className='text-2xl font-semibold tabular-nums'>{metric.value}</span>
                <StatDelta value={metric.delta} direction={metric.deltaDirection} tone={metric.deltaTone} />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {metrics.map((metric) => (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              delta={metric.delta} deltaDirection={metric.deltaDirection} deltaTone={metric.deltaTone}
              icon={metric.icon}
              tone={metric.tone}
              variant={layout === 'tinted' ? 'tinted' : 'default'}
              action={<MetricMenu label={metric.label} />}
              description={`vs ${metric.previous} last month`}
              footer={layout === 'cards' ? 'Sep 1 – Sep 30, 2026' : undefined}
              className={cn(layout === 'tinted' && 'shadow-none')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
