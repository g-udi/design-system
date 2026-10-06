import { StatCard, StatDelta } from '@gaudi/design-system/blocks/StatCard';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';

const kpis = [
  ['Deals won', '24', '20%', 'up', 'success'],
  ['Win rate', '38%', '4%', 'up', 'success'],
  ['Avg. deal', '$6.2k', '-8%', 'down', 'danger'],
  ['Cycle', '19d', '-2d', 'down', 'success']
];
const activity = [
  ['Maya Lopez', 'person-23', 'closed Contoso · $18,400', '12m'],
  ['Kerem Haddadin', 'person-43', 'moved Litware to negotiation', '1h'],
  ['Priyanka Nairn', 'person-14', 'booked a demo with Fabrikam', '3h']
];

// A team summary: KPI grid, pipeline progress and the latest activity in one card.
export function Pattern() {
  return (
    <StatCard className='w-full max-w-md' label='Sales team · Q3' value='$148,900' delta='14%' deltaDirection='up' deltaTone='success' description='closed of a $180,000 target'>
      <Progress value={83} aria-label='Quarter target' className='h-2' />
      <dl className='mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border'>
        {kpis.map(([label, value, delta, direction, tone]) => (
          <div key={label} className='bg-surface grid gap-0.5 p-3'>
            <dt className='text-text-muted text-xs'>{label}</dt>
            <dd className='flex flex-wrap items-baseline gap-1.5'>
              <span className='text-lg font-semibold tabular-nums'>{value}</span>
              <StatDelta value={delta} direction={direction} tone={tone} />
            </dd>
          </div>
        ))}
      </dl>
      <ul className='mt-2 grid grid-cols-1 gap-2.5'>
        {activity.map(([name, portrait, action, when]) => (
          <li key={name} className='flex items-center gap-2.5 text-sm'>
            <Avatar className='size-6'>
              <AvatarImage src={`/avatars/${portrait}.svg`} alt={name} />
              <AvatarFallback>{name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
            </Avatar>
            <p className='min-w-0 flex-1 truncate'>
              <span className='font-medium'>{name}</span> <span className='text-text-muted'>{action}</span>
            </p>
            <span className='text-text-muted text-xs'>{when}</span>
          </li>
        ))}
      </ul>
    </StatCard>
  );
}
