import { StatCard, StatDelta } from '../../../../src/components/blocks/StatCard/StatCard.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';

const kpis = [
  ['Deals won', '24', '20%'],
  ['Win rate', '38%', '4%'],
  ['Avg. deal', '$6.2k', '-8%'],
  ['Cycle', '19d', '-2d', true]
];
const activity = [
  ['Maya Lopez', 'women/65', 'closed Contoso · $18,400', '12m'],
  ['Omar Haddad', 'men/41', 'moved Litware to negotiation', '1h'],
  ['Priya Nair', 'women/23', 'booked a demo with Fabrikam', '3h']
];

// A team summary: KPI grid, pipeline progress and the latest activity in one card.
export function Pattern() {
  return (
    <StatCard className='w-full max-w-md' label='Sales team · Q3' value='$148,900' delta='14%' description='closed of a $180,000 target'>
      <Progress value={83} aria-label='Quarter target' className='h-2' />
      <dl className='mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border'>
        {kpis.map(([label, value, delta, invert]) => (
          <div key={label} className='bg-surface grid gap-0.5 p-3'>
            <dt className='text-text-muted text-xs'>{label}</dt>
            <dd className='flex items-baseline gap-1.5'>
              <span className='text-lg font-semibold tabular-nums'>{value}</span>
              <StatDelta value={delta} invert={invert} />
            </dd>
          </div>
        ))}
      </dl>
      <ul className='mt-2 grid gap-2.5'>
        {activity.map(([name, portrait, action, when]) => (
          <li key={name} className='flex items-center gap-2.5 text-sm'>
            <Avatar className='size-6'>
              <AvatarImage src={`/avatars/${portrait}.jpg`} alt={name} />
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
