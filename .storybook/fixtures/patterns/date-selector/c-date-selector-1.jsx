'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  DateSelector,
  formatDateValue
} from '../../../../src/components/core/Calendar/parts/date-selector-extended.jsx';
import { Card, CardContent } from '../../../../src/components/core/Card/parts/card.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';

const options = [
  { key: 'allowRange', label: 'Allow ranges' },
  { key: 'showInput', label: 'Text input' }
];

export function Pattern() {
  const [value, setValue] = useState();
  const [flags, setFlags] = useState({ allowRange: true, showInput: true });
  const summary = value ? formatDateValue(value) : '';
  return (
    <div className='mx-auto flex w-fit max-w-full flex-col gap-3'>
      <div role='group' aria-label='Selector options' className='flex flex-wrap gap-x-4 gap-y-2'>
        {options.map((option) => (
          <Label key={option.key} className='gap-2 text-sm font-normal'>
            <Switch
              size='sm'
              checked={flags[option.key]}
              onCheckedChange={(checked) =>
                setFlags((current) => ({ ...current, [option.key]: checked }))
              }
            />
            {option.label}
          </Label>
        ))}
      </div>
      <Card className='p-0'>
        <CardContent className='p-3'>
          <DateSelector
            key={flags.allowRange ? 'range' : 'single'}
            value={value}
            onChange={setValue}
            label='Due date'
            inputHint='Try: 2025, Q4, 05/10/2025'
            {...flags}
          />
        </CardContent>
      </Card>
      <div role='status' className='flex flex-col gap-1 text-sm'>
        <p className='text-text-muted'>
          {summary || 'Nothing selected yet.'}
        </p>
        {summary && (
          <pre className='overflow-auto rounded-md bg-surface-muted p-2 font-mono text-xs'>
            {JSON.stringify(
              value,
              (key, val) =>
                key && /date$/i.test(key) && val ? format(new Date(val), 'MM/dd/yyyy') : val,
              2
            )}
          </pre>
        )}
      </div>
    </div>
  );
}
