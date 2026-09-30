'use client';
import { useState } from 'react';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [value, setValue] = useState('');
  const maxLength = 140;
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupTextarea
          aria-label='Description...'
          placeholder='Description...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          className='min-h-16 pb-12'
        />
        <InputGroupAddon align='block-end'>
          <InputGroupText className='text-ui-muted-foreground text-xs'>
            {value.length}/{maxLength} characters
          </InputGroupText>
          <RegistryIcon
            lucide='InfoIcon'
            className='text-ui-muted-foreground ml-auto'
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
