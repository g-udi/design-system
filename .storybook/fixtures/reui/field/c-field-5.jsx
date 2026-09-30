// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  const [cpuLimit, setCpuLimit] = useState([75]);
  return (
    <div className='mx-auto w-full max-w-xs'>
      <FieldGroup>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle>High Performance Mode</FieldTitle>
            <FieldDescription>
              Prioritize speed over battery life for intensive tasks.
            </FieldDescription>
          </FieldContent>
          <Switch
            aria-label='High Performance Mode'
            id='high-performance'
            defaultChecked
          />
        </Field>
        <Field>
          <div className='flex items-center justify-between'>
            <FieldLabel htmlFor='cpu-allocation'>CPU Allocation</FieldLabel>
            <span className='text-ui-muted-foreground text-xs font-medium'>
              {cpuLimit[0]}%
            </span>
          </div>
          <Slider
            id='cpu-allocation'
            value={cpuLimit}
            onValueChange={(value) => setCpuLimit(value)}
            max={100}
            step={5}
          />
          <FieldDescription>
            Limit the maximum CPU resources used by the application.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
