'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const statuses = [
  { value: 'ready', label: 'Ready', color: 'bg-emerald-400' },
  { value: 'error', label: 'Error', color: 'bg-red-500' },
  { value: 'building', label: 'Building', color: 'bg-amber-500' },
  { value: 'queued', label: 'Queued', color: 'bg-blue-500' },
  { value: 'initializing', label: 'Initializing', color: 'bg-ui-primary' },
  { value: 'canceled', label: 'Canceled', color: 'bg-fuchsia-500' }
];
export function Pattern() {
  const [selected, setSelected] = useState(statuses[0].value);
  return (
    <Field className='max-w-xs'>
      <Select value={selected} onValueChange={(val) => setSelected(val)}>
        <SelectTrigger
          aria-label='Select status'
          className='w-full justify-between'
        >
          <SelectValue placeholder='Select status' />
        </SelectTrigger>
        <SelectContent position='popper' className='min-w-48'>
          <SelectGroup>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className='flex items-center gap-2'>
                  <div className={cn('size-2 rounded-full', status.color)} />
                  <span>{status.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
