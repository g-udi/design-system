import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const modules = [
  { value: 'payments', title: 'Payments', description: 'Receive payments from customers', icon: 'CircleDollarSignIcon' },
  { value: 'invoices', title: 'Invoices', description: 'Create and send invoices', icon: 'FileTextIcon' },
  { value: 'billing', title: 'Billing', description: 'Manage subscriptions', icon: 'CreditCardIcon' },
  { value: 'reports', title: 'Reports', description: 'Revenue and analytics', icon: 'ChartNoAxesColumnDecreasingIcon' }
];

const VisaIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' {...props}>
    <path
      d='M9.5 8L7 16H5L3 8H5L6.25 13.5L8 8H9.5ZM11 8H12.5V16H11V8ZM16.5 10.5C16.5 9.7 15.8 9.2 14.8 9.2C14 9.2 13.3 9.5 12.8 10L12 9C12.8 8.3 13.8 8 15 8C16.8 8 18 9 18 10.5C18 13.5 14 12.5 14 14.2C14 14.8 14.5 15 15.2 15C16 15 16.7 14.7 17.2 14.2L18 15.2C17.2 15.9 16.2 16.2 15 16.2C13.5 16.2 12.5 15.3 12.5 14C12.5 11.2 16.5 12 16.5 10.5ZM21 16H19.5L22 8H23.5L21 16Z'
      fill='#1A1F71'
    />
  </svg>
);
const MastercardIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' {...props}>
    <circle cx='9' cy='12' r='5' fill='#EB001B' />
    <circle cx='15' cy='12' r='5' fill='#F79E1B' />
    <path d='M12 15.5C13.2 14.5 14 13.3 14 12C14 10.7 13.2 9.5 12 8.5C10.8 9.5 10 10.7 10 12C10 13.3 10.8 14.5 12 15.5Z' fill='#FF5F00' />
  </svg>
);
const cards = [
  { value: 'visa', title: 'Visa ending in 4242', meta: 'Expires 12/28', Icon: VisaIcon },
  { value: 'mastercard', title: 'Mastercard ending in 8888', meta: 'Expires 09/27', Icon: MastercardIcon }
];

// Brand marks keep a white tile so their colours read in both themes.
function Tile({ brand, children }) {
  return (
    <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-border ${brand ? 'bg-white' : 'bg-surface'}`}>
      {children}
    </span>
  );
}

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
                  <Tile>
                    <RegistryIcon lucide={item.icon} aria-hidden='true' className='size-4' />
                  </Tile>
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
          {cards.map(({ value, title, meta, Icon }) => (
            <FieldLabel key={value} htmlFor={`pay-${value}`} className='relative p-0!'>
              <Field orientation='horizontal'>
                <RadioGroupItem value={value} id={`pay-${value}`} className='absolute top-2.5 right-2.5' />
                <FieldTitle className='flex items-center gap-2 pe-6'>
                  <Tile brand>
                    <Icon className='size-6' />
                  </Tile>
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
