'use client';
import { useId } from 'react';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import {
  SelectRoot as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';

const accessLevels = [
  { value: 'full', label: 'Full access', description: 'Can manage writers, editors and billing' },
  { value: 'edit', label: 'Read and write', description: 'Can edit and publish posts' },
  { value: 'view', label: 'Read only', description: 'Can read drafts and leave comments' },
  { value: 'none', label: 'No access', description: 'Cannot open this publication' }
];
const plans = [
  { value: 'starter', label: 'Starter', description: 'For a single author' },
  { value: 'team', label: 'Team', description: 'For editorial teams of up to 25' },
  { value: 'enterprise', label: 'Enterprise', description: 'Unlimited writers and single sign-on' }
];

function TwoLine({ item }) {
  return (
    <span className='flex flex-col items-start gap-px text-left'>
      <span className='font-medium'>{item.label}</span>
      <small className='text-xs text-text-muted'>{item.description}</small>
    </span>
  );
}

// Options with a second line. The access trigger hides the description to stay
// one line; the plan trigger grows to show both lines.
export function Pattern() {
  const id = useId();
  return (
    <div className='mx-auto grid w-full max-w-sm gap-y-6'>
      <Field>
        <FieldLabel htmlFor={`${id}-select-access`}>Access level</FieldLabel>
        <Select defaultValue='edit'>
          <SelectTrigger id={`${id}-select-access`} className='w-full [&_small]:hidden'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              {accessLevels.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <TwoLine item={item} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-select-plan`}>Plan</FieldLabel>
        <Select defaultValue='team'>
          <SelectTrigger id={`${id}-select-plan`} className='h-auto! w-full py-1.5'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              {plans.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <TwoLine item={item} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
