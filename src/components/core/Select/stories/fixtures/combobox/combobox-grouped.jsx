'use client';
import { useId } from 'react';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator
} from '@gaudi/design-system/core/Select';
import { FieldRoot as Field, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';

// Grouped, long enough to scroll: the popup caps its height and each group label names its region.
const timezones = [
  {
    value: 'Americas',
    items: ['(GMT-5) New York', '(GMT-8) Los Angeles', '(GMT-6) Chicago', '(GMT-5) Toronto', '(GMT-8) Vancouver', '(GMT-3) São Paulo', '(GMT-6) Mexico City', '(GMT-3) Buenos Aires']
  },
  {
    value: 'Europe',
    items: ['(GMT+0) London', '(GMT+1) Paris', '(GMT+1) Berlin', '(GMT+1) Rome', '(GMT+1) Madrid', '(GMT+1) Amsterdam', '(GMT+2) Athens', '(GMT+2) Helsinki']
  },
  {
    value: 'Asia/Pacific',
    items: ['(GMT+9) Tokyo', '(GMT+8) Shanghai', '(GMT+8) Singapore', '(GMT+4) Dubai', '(GMT+11) Sydney', '(GMT+9) Seoul', '(GMT+5:30) Mumbai', '(GMT+13) Auckland']
  }
];

export function Pattern() {
  const id = useId();
  return (
    <Field className='mx-auto w-full max-w-xs'>
      <FieldLabel htmlFor={`${id}-combobox-timezone`}>Time zone</FieldLabel>
      <Combobox items={timezones}>
        <ComboboxInput id={`${id}-combobox-timezone`} placeholder='Select a time zone' />
        <ComboboxContent>
          <ComboboxEmpty>No time zones found.</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                <ComboboxSeparator className='group-last/combobox-group:hidden' />
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
