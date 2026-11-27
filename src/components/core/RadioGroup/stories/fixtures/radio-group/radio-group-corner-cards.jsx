import { IconTile } from '@gaudi/design-system/core/Icon';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '@gaudi/design-system/core/Field';
import {
  RadioGroupRoot as RadioGroup,
  RadioGroupItem
} from '@gaudi/design-system/core/RadioGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const modules = [
  { value: 'payments', title: 'Payments', description: 'Sell memberships to readers', icon: 'CircleDollarSignIcon' },
  { value: 'invoices', title: 'Invoices', description: 'Bill sponsors for placements', icon: 'FileTextIcon' },
  { value: 'billing', title: 'Billing', description: 'Run a paid newsletter', icon: 'CreditCardIcon' },
  { value: 'reports', title: 'Reports', description: 'Track income by post', icon: 'ChartNoAxesColumnDecreasingIcon' }
];

const cards = [
  { value: 'visa', title: 'Visa ending in 4242', meta: 'Expires 12/28' },
  { value: 'mastercard', title: 'Mastercard ending in 8888', meta: 'Expires 09/27' }
];


export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-sm gap-4'>
      <FieldSet className='gap-2'>
        <FieldLegend variant='label'>Start with</FieldLegend>
        <RadioGroup defaultValue='payments' aria-label='Start with' className='grid grid-cols-2 gap-2'>
          {modules.map((item) => (
            <FieldLabel key={item.value} htmlFor={`module-${item.value}`} className='relative p-0!'>
              <Field orientation='horizontal'>
                <RadioGroupItem value={item.value} id={`module-${item.value}`} className='absolute top-2.5 right-2.5' />
                <FieldTitle className='flex flex-col items-start gap-2 pe-6'>
                  <IconTile size='sm'>
                    <RegistryIcon lucide={item.icon} aria-hidden='true' className='size-4' />
                  </IconTile>
                  <span className='flex flex-col items-start gap-0.5'>
                    <span className='text-sm font-semibold'>{item.title}</span>
                    <span className='text-xs font-normal text-text-muted'>{item.description}</span>
                  </span>
                </FieldTitle>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>
      <FieldSet className='gap-2'>
        <FieldLegend variant='label'>Payment method</FieldLegend>
        <RadioGroup defaultValue='visa' aria-label='Payment method' className='gap-2'>
          {cards.map(({ value, title, meta }) => (
            <FieldLabel key={value} htmlFor={`pay-${value}`} className='relative p-0!'>
              <Field orientation='horizontal'>
                <RadioGroupItem value={value} id={`pay-${value}`} className='absolute top-2.5 right-2.5' />
                <FieldTitle className='flex items-center gap-2 pe-6'>
                  <IconTile size='sm'>
                    <RegistryIcon lucide='CreditCard' aria-hidden='true' />
                  </IconTile>
                  <span className='flex flex-col items-start gap-0.5'>
                    <span className='text-sm font-medium'>{title}</span>
                    <span className='text-xs font-normal text-text-muted'>{meta}</span>
                  </span>
                </FieldTitle>
              </Field>
            </FieldLabel>
          ))}
          <FieldLabel htmlFor='pay-new' className='relative p-0!'>
            <Field orientation='horizontal'>
              <RadioGroupItem value='new' id='pay-new' className='absolute top-2.5 right-2.5' />
              <FieldTitle className='flex items-center gap-2 text-text-muted'>
                <RegistryIcon lucide='PlusIcon' aria-hidden='true' className='size-4' />
                Add new payment method
              </FieldTitle>
            </Field>
          </FieldLabel>
        </RadioGroup>
      </FieldSet>
    </div>
  );
}
