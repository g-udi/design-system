'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
const roles = ['Admin', 'Member', 'Viewer'];
export function Pattern() {
  const [role, setRole] = useState('Admin');
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupAddon className='pr-1'>
          <Avatar className='size-5'>
            <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='Avatar' />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </InputGroupAddon>

        <InputGroupInput
          aria-label='Member username'
          defaultValue='@alexjohnson'
          className='pl-1!'
        />

        <InputGroupAddon align='inline-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                aria-label='Show options'
                variant='ghost'
                className='h-7 text-xs'
              >
                {role}
                <RegistryIcon
                  lucide='ChevronDownIcon'
                  className='size-3.5 opacity-60'
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-32'>
              {roles.map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
