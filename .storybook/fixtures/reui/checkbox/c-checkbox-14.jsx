// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const items = [
  {
    title: 'Payments',
    description: 'Receive payments from your customers',
    icon: (
      <RegistryIcon
        lucide='CircleDollarSignIcon'
        aria-hidden='true'
        className='size-4'
      />
    ),
    checked: true
  },
  {
    title: 'Invoices',
    description: 'Create and send invoices to your customers',
    icon: (
      <RegistryIcon
        lucide='FileTextIcon'
        aria-hidden='true'
        className='size-4'
      />
    ),
    checked: false
  },
  {
    title: 'Billing',
    description: 'Manage your billing and subscriptions',
    icon: (
      <RegistryIcon
        lucide='CreditCardIcon'
        aria-hidden='true'
        className='size-4'
      />
    ),
    checked: false
  },
  {
    title: 'Reports',
    description: 'View your reports and analytics',
    icon: (
      <RegistryIcon
        lucide='ChartNoAxesColumnDecreasingIcon'
        aria-hidden='true'
        className='size-4'
      />
    ),
    checked: false
  }
];
export function Pattern() {
  return (
    <FieldGroup className='grid w-full max-w-xs grid-cols-2 gap-4'>
      {items.map((item) => (
        <FieldLabel key={item.title} className='relative p-0'>
          <Field orientation='horizontal'>
            <Checkbox
              defaultChecked={item.checked}
              className='absolute top-3 right-3 size-5 rounded-full'
            />
            <FieldTitle className='flex flex-col items-start'>
              <div className='bg-ui-background border-ui-border rounded-2xl flex shrink-0 items-center justify-center border p-2 shadow-xs shadow-black/5'>
                {item.icon}
              </div>
              <div className='flex flex-col items-start gap-0.5'>
                <span className='text-sm font-semibold'> {item.title} </span>
                <span className='text-ui-muted-foreground text-xs'>
                  {' '}
                  {item.description}{' '}
                </span>
              </div>
            </FieldTitle>
          </Field>
        </FieldLabel>
      ))}
    </FieldGroup>
  );
}
