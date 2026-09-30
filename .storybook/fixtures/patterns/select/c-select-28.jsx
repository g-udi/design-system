import { Fragment } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';

const regions = [
  {
    label: 'Americas',
    zones: [
      { value: 'est', label: 'Eastern', offset: 'UTC-5' },
      { value: 'cst', label: 'Central', offset: 'UTC-6' },
      { value: 'pst', label: 'Pacific', offset: 'UTC-8' }
    ]
  },
  {
    label: 'Europe',
    zones: [
      { value: 'gmt', label: 'Greenwich', offset: 'UTC+0' },
      { value: 'cet', label: 'Central European', offset: 'UTC+1' }
    ]
  },
  {
    label: 'Asia',
    zones: [
      { value: 'ist', label: 'India', offset: 'UTC+5:30' },
      { value: 'jst', label: 'Japan', offset: 'UTC+9' }
    ]
  }
];

// Labelled groups split by separators, each option with a muted offset.
export function Pattern() {
  return (
    <Field className='mx-auto w-full max-w-xs'>
      <FieldLabel htmlFor='select-timezone'>Time zone</FieldLabel>
      <Select defaultValue='cet'>
        <SelectTrigger id='select-timezone' className='w-full'>
          <SelectValue placeholder='Select a time zone' />
        </SelectTrigger>
        <SelectContent position='popper'>
          {regions.map((region, index) => (
            <Fragment key={region.label}>
              {index > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{region.label}</SelectLabel>
                {region.zones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    <span className='flex items-center gap-2'>
                      <span>{zone.label}</span>
                      <span className='text-xs text-text-muted'>{zone.offset}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </Fragment>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
