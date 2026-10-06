'use client';
import { useId } from 'react';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription,
  FieldErrorPrimitive as FieldError,
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

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes', disabled: true },
  { label: 'Pineapple', value: 'pineapple' }
];
const sizes = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra large', value: 'xl' }
];
const bins = Array.from({ length: 100 }, (_, i) => ({
  label: `Bin ${i + 1}`,
  value: `bin-${i + 1}`
}));

function Options({ items }) {
  return (
    <SelectGroup>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  );
}

// An order form covering the field states: label and description, a disabled
// option, the small trigger, a long list aligned to the selected item, and the
// invalid and disabled fields.
export function Pattern() {
  const id = useId();
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <Field>
        <FieldLabel htmlFor={`${id}-select-fruit`}>Fruit</FieldLabel>
        <Select>
          <SelectTrigger id={`${id}-select-fruit`} className='w-full'>
            <SelectValue placeholder='Select a fruit' />
          </SelectTrigger>
          <SelectContent position='popper'>
            <Options items={fruits} />
          </SelectContent>
        </Select>
        <FieldDescription>Grapes are out of season.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-select-size`}>Box size</FieldLabel>
        <Select defaultValue='md'>
          <SelectTrigger id={`${id}-select-size`} size='sm' className='w-full'>
            <SelectValue placeholder='Select a size' />
          </SelectTrigger>
          <SelectContent position='popper'>
            <Options items={sizes} />
          </SelectContent>
        </Select>
        <FieldDescription>Small trigger for dense forms.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-select-bin`}>Storage bin</FieldLabel>
        <Select defaultValue='bin-42'>
          <SelectTrigger id={`${id}-select-bin`} className='w-full'>
            <SelectValue placeholder='Select a bin' />
          </SelectTrigger>
          {/* Item-aligned (the default) opens over the trigger at the selected row. */}
          <SelectContent>
            <Options items={bins} />
          </SelectContent>
        </Select>
        <FieldDescription>100 bins; opens at the selected one.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor={`${id}-select-ripeness`}>Ripeness</FieldLabel>
        <Select>
          <SelectTrigger id={`${id}-select-ripeness`} aria-invalid className='w-full'>
            <SelectValue placeholder='Select ripeness' />
          </SelectTrigger>
          <SelectContent position='popper'>
            <Options
              items={[
                { label: 'Ripe', value: 'ripe' },
                { label: 'Ripening', value: 'ripening' }
              ]}
            />
          </SelectContent>
        </Select>
        <FieldError>Choose how ripe the fruit should be.</FieldError>
      </Field>
      <Field data-disabled className='sm:col-span-2'>
        <FieldLabel htmlFor={`${id}-select-warehouse`}>Warehouse</FieldLabel>
        <Select disabled defaultValue='berlin'>
          <SelectTrigger id={`${id}-select-warehouse`} className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper'>
            <Options items={[{ label: 'Berlin', value: 'berlin' }]} />
          </SelectContent>
        </Select>
        <FieldDescription>Set by your delivery address.</FieldDescription>
      </Field>
    </div>
  );
}
