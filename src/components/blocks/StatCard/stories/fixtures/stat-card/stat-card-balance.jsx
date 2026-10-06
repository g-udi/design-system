import { StatCard, StatMeter } from '@gaudi/design-system/blocks/StatCard';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

// The inverse card keeps the dark surface in both themes.
export function Pattern() {
  return (
    <StatCard
      className='w-full max-w-sm'
      variant='inverse'
      label='Available balance'
      value='€24,860'
      delta='3.1%' deltaDirection='up' deltaTone='success'
      description='Across 4 currencies, converted at today’s rate'
      action={
        <Button size='xs'>
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
          Top up
        </Button>
      }
    >
      <StatMeter
        className='mt-1'
        formatValue={(value) => currency.format(value)}
        segments={[
          { label: 'EUR', value: 12400, tone: 'info' },
          { label: 'USD', value: 7350, tone: 'success' },
          { label: 'GBP', value: 3610, tone: 'warning' },
          { label: 'JPY', value: 1500, tone: 'attention' }
        ]}
      />
    </StatCard>
  );
}
