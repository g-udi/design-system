'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [country, setCountry] = useState('+1');
  return (
    <Field className='w-full max-w-xs'>
      <InputGroup>
        <InputGroupAddon>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton aria-label='Show options' variant='ghost'>
                <span className='tabular-nums'>{country}</span>
                <RegistryIcon lucide='ChevronDownIcon' />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='min-w-24'>
              <DropdownMenuItem onClick={() => setCountry('+1')}>
                +1 (US)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCountry('+44')}>
                +44 (UK)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCountry('+61')}>
                +61 (AU)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
        <InputGroupInput
          aria-label='123 456 7890'
          type='tel'
          placeholder='123 456 7890'
        />
      </InputGroup>
    </Field>
  );
}
