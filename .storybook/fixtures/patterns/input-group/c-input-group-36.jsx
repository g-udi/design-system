'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
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
const httpMethodColors = {
  GET: 'text-emerald-700 dark:text-emerald-300 dark:text-emerald-400',
  POST: 'text-blue-700 dark:text-blue-300',
  PUT: 'text-amber-800 dark:text-amber-300',
  PATCH: 'text-violet-700 dark:text-violet-300',
  DELETE: 'text-ui-danger-ink'
};
const httpMethods = Object.keys(httpMethodColors);
export function Pattern() {
  const [method, setMethod] = useState('GET');
  return (
    <Field className='max-w-md'>
      <InputGroup>
        <InputGroupAddon>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant='ghost'
                className={cn(
                  'gap-1.5 font-mono text-xs',
                  httpMethodColors[method]
                )}
                aria-label={`HTTP method: ${method}`}
              >
                {method}
                <RegistryIcon
                  lucide='ChevronDownIcon'
                  className='size-3 opacity-60'
                  aria-hidden='true'
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-28'>
              <DropdownMenuGroup>
                {httpMethods.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    className={cn(
                      'font-mono text-xs font-semibold',
                      httpMethodColors[item]
                    )}
                    onSelect={() => setMethod(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>

        <InputGroupInput
          defaultValue='/v1/agents/run'
          className='font-mono text-xs'
          aria-label='API endpoint path'
        />

        <InputGroupAddon align='inline-end'>
          <InputGroupButton size='xs' aria-label='Send request'>
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
