import {
  Field,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const items = [
  {
    title: 'Payments',
    description: 'Receive payments from your customers',
    value: 'payments',
    icon: (
      <RegistryIcon
        lucide='CircleDollarSignIcon'
        aria-hidden='true'
        className='size-4'
      />
    )
  },
  {
    title: 'Invoices',
    description: 'Create and send invoices to your customers',
    value: 'invoices',
    icon: (
      <RegistryIcon
        lucide='FileTextIcon'
        aria-hidden='true'
        className='size-4'
      />
    )
  },
  {
    title: 'Billing',
    description: 'Manage your billing and subscriptions',
    value: 'billing',
    icon: (
      <RegistryIcon
        lucide='CreditCardIcon'
        aria-hidden='true'
        className='size-4'
      />
    )
  },
  {
    title: 'Reports',
    description: 'View your reports and analytics',
    value: 'reports',
    icon: (
      <RegistryIcon
        lucide='ChartNoAxesColumnDecreasingIcon'
        aria-hidden='true'
        className='size-4'
      />
    )
  }
];
export function Pattern() {
  return (
    <RadioGroup
      defaultValue='payments'
      className='grid w-full max-w-xs grid-cols-2 gap-4'
    >
      {items.map((item) => (
        <FieldLabel
          key={item.value}
          htmlFor={item.value}
          className='relative p-0!'
        >
          <Field orientation='horizontal'>
            <div className='absolute top-3 right-3'>
              <RadioGroupItem value={item.value} id={item.value} />
            </div>
            <FieldTitle className='flex flex-col items-start'>
              <div className='bg-ui-background border-ui-border rounded-2xl flex shrink-0 items-center justify-center border p-2 shadow-xs shadow-black/5'>
                {item.icon}
              </div>
              <div className='flex flex-col items-start gap-0.5'>
                <span className='text-sm font-semibold'>{item.title}</span>
                <span className='text-ui-muted-foreground text-xs'>
                  {item.description}
                </span>
              </div>
            </FieldTitle>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
