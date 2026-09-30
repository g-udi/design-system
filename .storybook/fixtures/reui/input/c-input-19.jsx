// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  return (
    <Field className='w-full max-w-xs'>
      <div className='flex items-center justify-between'>
        <FieldLabel htmlFor='password-link'>Password</FieldLabel>
        <a
          href='#'
          className='text-ui-primary text-xs font-medium hover:underline'
        >
          Forgot password?
        </a>
      </div>
      <div className='relative'>
        <Input
          id='password-link'
          type={isVisible ? 'text' : 'password'}
          className='pe-9'
        />
        <button
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className='text-ui-muted-foreground hover:text-ui-foreground focus-visible:border-ui-ring focus-visible:ring-ui-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          onClick={toggleVisibility}
          type='button'
        >
          {isVisible ? (
            <RegistryIcon lucide='EyeOffIcon' aria-hidden='true' />
          ) : (
            <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
          )}
        </button>
      </div>
    </Field>
  );
}
