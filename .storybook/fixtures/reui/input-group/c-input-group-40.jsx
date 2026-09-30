// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
const visibilityOptions = ['Private', 'Team', 'Public'];
export function Pattern() {
  const [visibility, setVisibility] = useState(visibilityOptions[0]);
  return (
    <Field className='max-w-sm'>
      <InputGroup>
        <InputGroupAddon align='inline-start'>
          <RegistryIcon
            lucide='LinkIcon'
            className='size-4 opacity-60'
            aria-hidden='true'
          />
        </InputGroupAddon>

        <InputGroupInput
          defaultValue='agentflow.ai/runbooks/q2-review'
          aria-label='Share link'
        />

        <InputGroupAddon align='inline-end' className='gap-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant='ghost'
                size='xs'
                className='gap-1.5'
                aria-label='Select visibility'
              >
                {visibility}
                <RegistryIcon
                  lucide='ChevronDownIcon'
                  className='size-3 opacity-60'
                  aria-hidden='true'
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-28'>
              <DropdownMenuGroup>
                {visibilityOptions.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onSelect={() => setVisibility(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroupButton
            variant='ghost'
            size='icon-xs'
            aria-label='Copy link'
          >
            <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
