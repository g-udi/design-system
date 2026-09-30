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
const regions = ['Global', 'United States', 'Europe', 'APAC'];
export function Pattern() {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState(regions[0]);
  return (
    <Field className='max-w-sm'>
      <InputGroup>
        <InputGroupAddon align='inline-start'>
          <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
        </InputGroupAddon>

        <InputGroupInput
          aria-label='Search companies...'
          placeholder='Search companies...'
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <InputGroupAddon align='inline-end' className='gap-1'>
          {searchQuery.length > 0 ? (
            <InputGroupButton
              aria-label='Clear search'
              size='icon-xs'
              variant='ghost'
              onClick={() => setSearchQuery('')}
            >
              <RegistryIcon lucide='XIcon' aria-hidden='true' />
            </InputGroupButton>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant='ghost'
                size='xs'
                className='gap-1.5'
                aria-label='Select region'
              >
                <RegistryIcon
                  lucide='GlobeIcon'
                  className='size-3.5'
                  aria-hidden='true'
                />
                {region}
                <RegistryIcon
                  lucide='ChevronDownIcon'
                  className='size-3 opacity-60'
                  aria-hidden='true'
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-32'>
              <DropdownMenuGroup>
                {regions.map((item) => (
                  <DropdownMenuItem key={item} onSelect={() => setRegion(item)}>
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
