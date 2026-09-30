'use client';
import { useState } from 'react';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupAddon>
          <RegistryIcon
            lucide='LockIcon'
            className='text-ui-muted-foreground size-4'
          />
        </InputGroupAddon>
        <InputGroupInput
          aria-label='Enter password'
          type={showPassword ? 'text' : 'password'}
          placeholder='Enter password'
        />
        <InputGroupButton
          aria-label='Hide'
          variant='ghost'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <RegistryIcon
              lucide='EyeOffIcon'
              className='text-ui-muted-foreground size-4'
            />
          ) : (
            <RegistryIcon
              lucide='EyeIcon'
              className='text-ui-muted-foreground size-4'
            />
          )}
        </InputGroupButton>
      </InputGroup>
    </Field>
  );
}
