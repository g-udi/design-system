import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const modules = [
  { title: 'Payments', description: 'Receive payments from customers', icon: 'CircleDollarSignIcon', checked: true },
  { title: 'Invoices', description: 'Create and send invoices', icon: 'FileTextIcon', checked: false },
  { title: 'Billing', description: 'Manage subscriptions', icon: 'CreditCardIcon', checked: false },
  { title: 'Reports', description: 'Revenue and analytics', icon: 'ChartNoAxesColumnDecreasingIcon', checked: false }
];
const tags = [
  { title: 'Billings', checked: true },
  { title: 'Payments', checked: false },
  { title: 'Invoices', checked: false }
];
const corner = 'absolute top-2.5 right-2.5 size-5 rounded-full';

const MastercardIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <circle cx='7' cy='12' r='7' fill='#EB001B' />
    <circle cx='17' cy='12' r='7' fill='#F79E1B' />
    <path d='M12 17.5C13.5 16.2 14.5 14.2 14.5 12C14.5 9.8 13.5 7.8 12 6.5C10.5 7.8 9.5 9.8 9.5 12C9.5 14.2 10.5 16.2 12 17.5Z' fill='#FF5F00' />
  </svg>
);

function Tile({ children }) {
  return <span className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface'>{children}</span>;
}

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-sm gap-3'>
      {/* Icon cards with a round check in the corner. */}
      <FieldGroup className='grid grid-cols-2 gap-2'>
        {modules.map((item) => (
          <FieldLabel key={item.title} className='relative p-0'>
            <Field orientation='horizontal'>
              <Checkbox defaultChecked={item.checked} className={corner} />
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
      </FieldGroup>
      {/* A saved payment method. */}
      <FieldLabel htmlFor='cb-mastercard' className='relative p-0!'>
        <Field orientation='horizontal'>
          <Checkbox id='cb-mastercard' defaultChecked className={corner} />
          <FieldTitle className='flex items-center gap-2'>
            <Tile>
              <MastercardIcon className='size-5' />
            </Tile>
            <span className='flex flex-col items-start gap-0.5'>
              <span className='text-sm font-medium'>Mastercard ending in 8888</span>
              <span className='text-xs font-normal text-text-muted'>Expires 09/28</span>
            </span>
          </FieldTitle>
        </Field>
      </FieldLabel>
      {/* Compact tag chips with a corner badge. */}
      <div className='flex flex-wrap gap-3 pt-2'>
        {tags.map((item) => (
          <FieldLabel key={item.title} className='relative w-auto! p-0'>
            <Field orientation='horizontal' className='justify-center'>
              <Checkbox defaultChecked={item.checked} className='absolute -top-2 -right-2 size-5 rounded-full border-none shadow-none data-[state=unchecked]:opacity-0' />
              <FieldTitle className='justify-center'>{item.title}</FieldTitle>
            </Field>
          </FieldLabel>
        ))}
      </div>
    </div>
  );
}
