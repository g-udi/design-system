import { useState } from 'react';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';

const periods = [
  { value: 'today', label: 'Today', revenue: '$4,558', delta: '3.1%', direction: 'up', tone: 'success', comparison: 'vs yesterday' },
  { value: 'week', label: 'Week', revenue: '$31,904', delta: '12.4%', direction: 'up', tone: 'success', comparison: 'vs last week' },
  { value: 'month', label: 'Month', revenue: '$127,616', delta: '2.2%', direction: 'down', tone: 'danger', comparison: 'vs last month' },
  { value: 'year', label: 'Year', revenue: '$1,531,392', delta: '18.6%', direction: 'up', tone: 'success', comparison: 'vs last year' }
];

export function Pattern() {
  const [period, setPeriod] = useState('week');
  const current = periods.find((entry) => entry.value === period) ?? periods[1];
  return (
    <StatCard
      className='w-full max-w-sm'
      label='Revenue'
      value={current.revenue}
      valueMotion='reel'
      delta={current.delta} deltaDirection={current.direction} deltaTone={current.tone}
      description={current.comparison}
    >
      <ToggleGroup
        type='single'
        label='Revenue period'
        value={period}
        onValueChange={(value) => value && setPeriod(value)}
        options={periods.map(({ value, label }) => ({ value, label }))}
      />
    </StatCard>
  );
}
