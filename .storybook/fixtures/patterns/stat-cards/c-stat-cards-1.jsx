'use client';
import { useState } from 'react';
import { StatCard, StatDelta } from '../../../../src/components/blocks/StatCard/StatCard.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

const metrics = [
  { label: 'Revenue', value: '$48,290', delta: '12.4%', previous: '$42,960', icon: 'DollarSignIcon', tone: 'success' },
  { label: 'Subscribers', value: '1,284', delta: '8.1%', previous: '1,188', icon: 'UsersIcon', tone: 'info' },
  { label: 'Orders', value: '326', delta: '-3.2%', previous: '337', icon: 'ShoppingCartIcon', tone: 'warning' },
  { label: 'Churn', value: '2.1%', delta: '-0.4%', previous: '2.5%', icon: 'ActivityIcon', tone: 'discovery', invert: true }
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
                <StatDelta value={metric.delta} invert={metric.invert} />
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
              delta={metric.delta}
              invert={metric.invert}
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
