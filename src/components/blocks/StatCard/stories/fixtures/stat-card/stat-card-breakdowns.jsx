import { StatCard, StatMeter } from '@gaudi/design-system/blocks/StatCard';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const renewals = [
  ['Northwind', 'Team', 'in 3 days'],
  ['Litware', 'Business', 'in 5 days'],
  ['Fabrikam', 'Team', 'in 9 days']
];

function Menu({ label, items }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-xs' aria-label={`${label} actions`}>
          <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {items.map((item) => (
          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Three breakdowns that share one segmented meter: plan mix, compliance and adoption.
export function Pattern() {
  return (
    <div className='grid w-full max-w-5xl gap-3 lg:grid-cols-3'>
      <StatCard label='Active subscriptions' value='2,148' delta='5.3%' deltaDirection='up' deltaTone='success'>
        <StatMeter
          label='By plan'
          segments={[
            { label: 'Starter', value: 1120, tone: 'info' },
            { label: 'Team', value: 784, tone: 'warning' },
            { label: 'Business', value: 212, tone: 'discovery' },
            { label: 'Enterprise', value: 32, tone: 'attention' }
          ]}
        />
        <div className='mt-2 grid gap-1.5'>
          <p className='text-text-muted text-xs'>Expiring soon</p>
          <ul className='grid gap-1.5 text-sm'>
            {renewals.map(([account, plan, when]) => (
              <li key={account} className='flex items-center gap-2'>
                <span className='flex-1 font-medium'>{account}</span>
                <Badge variant='outline' size='sm'>{plan}</Badge>
                <span className='text-text-muted w-16 text-end text-xs'>{when}</span>
              </li>
            ))}
          </ul>
        </div>
      </StatCard>
      <StatCard
        label='Compliance checks'
        icon='ShieldCheckIcon'
        tone='success'
        value='94%'
        description='188 of 200 controls passing'
        action={<Menu label='Compliance' items={['Run checks now', 'View failing controls', 'Export evidence']} />}
        footer='Last scan 12 minutes ago'
      >
        <StatMeter
          segments={[
            { label: 'Passing', value: 188, tone: 'success' },
            { label: 'Needs review', value: 8, tone: 'warning' },
            { label: 'Failing', value: 4, tone: 'danger' }
          ]}
        />
      </StatCard>
      <StatCard
        label='Feature adoption'
        icon='ZapIcon'
        tone='discovery'
        value='61%'
        delta='9%' deltaDirection='up' deltaTone='success'
        description='of active workspaces use at least one'
        action={<Menu label='Adoption' items={['Open cohort', 'Compare releases']} />}
      >
        <StatMeter
          formatValue={(value) => `${value}`}
          segments={[
            { label: 'Saved views', value: 42, tone: 'info' },
            { label: 'Automations', value: 27, tone: 'discovery' },
            { label: 'AI summaries', value: 19, tone: 'warning' },
            { label: 'Not yet', value: 12, tone: 'neutral' }
          ]}
        />
      </StatCard>
    </div>
  );
}
