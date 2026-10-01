import { StatCard } from '../../../../src/components/blocks/StatCard/StatCard.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';

const metrics = [
  { label: 'Open tickets', value: '128', delta: '-12%', icon: 'MessageSquareIcon', tone: 'info', status: ['On track', 'success-light'] },
  { label: 'First response', value: '1h 42m', delta: '18%', invert: true, icon: 'TimerIcon', tone: 'warning', status: ['Above SLA', 'warning-light'] },
  { label: 'Satisfaction', value: '4.7 / 5', delta: '0.2', icon: 'SmileIcon', tone: 'success', status: ['Excellent', 'success-light'] },
  { label: 'Escalations', value: '9', delta: '3', invert: true, icon: 'HeadphonesIcon', tone: 'danger', status: ['Investigate', 'destructive-light'] }
];

export function Pattern() {
  return (
    <div className='grid w-full max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4'>
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          delta={metric.delta}
          invert={metric.invert}
          icon={metric.icon}
          tone={metric.tone}
          action={<Badge variant={metric.status[1]} size='sm'>{metric.status[0]}</Badge>}
        />
      ))}
    </div>
  );
}
