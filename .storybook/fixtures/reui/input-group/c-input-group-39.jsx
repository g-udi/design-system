// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
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
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const statuses = ['Active', 'Lead', 'Prospect'];
const statusCounts = {
  Active: 12,
  Lead: 7,
  Prospect: 5
};
export function Pattern() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  return (
    <Field className='max-w-sm'>
      <InputGroup>
        <InputGroupAddon align='inline-start'>
          <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
        </InputGroupAddon>

        <InputGroupInput
          aria-label='Search contacts...'
          placeholder='Search contacts...'
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

          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant='ghost'
                size='xs'
                className='gap-1.5'
                aria-label='Filter contacts'
              >
                <RegistryIcon
                  lucide='ListFilterIcon'
                  className='size-3.5'
                  aria-hidden='true'
                />
                {selectedStatuses.length > 0 ? (
                  <span className='tabular-nums'>
                    {selectedStatuses.length}
                  </span>
                ) : (
                  'Status'
                )}
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-44 p-3'>
              <div className='flex flex-col gap-2'>
                {statuses.map((status) => (
                  <div key={status} className='flex items-center gap-2.5'>
                    <Checkbox
                      id={`contact-status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          previous.includes(status)
                            ? previous.filter((item) => item !== status)
                            : [...previous, status]
                        )
                      }
                    />
                    <Label
                      htmlFor={`contact-status-${status}`}
                      className='flex grow items-center justify-between gap-1.5 font-normal'
                    >
                      {status}
                      <span className='text-ui-muted-foreground text-xs'>
                        {statusCounts[status]}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant='ghost'
                size='icon-xs'
                aria-label='More actions'
              >
                <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-36'>
              <DropdownMenuGroup>
                <DropdownMenuItem>Bulk email</DropdownMenuItem>
                <DropdownMenuItem>Export CSV</DropdownMenuItem>
                <DropdownMenuItem>Add contact</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
