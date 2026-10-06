'use client';
import { useRef, useState } from 'react';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { FieldRoot as Field } from '@gaudi/design-system/core/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const statuses = ['Active', 'Lead', 'Prospect'];
const statusCounts = {
  Active: 12,
  Lead: 7,
  Prospect: 5
};
export function Pattern() {
  const searchRef = useRef(null);
  const [feedback, setFeedback] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  return (
    <Field className='mx-auto w-full max-w-sm'>
      <InputGroup>
        <InputGroupAddon align='inline-start'>
          <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
        </InputGroupAddon>

        <InputGroupInput
          ref={searchRef}
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
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
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
                Status
                {selectedStatuses.length > 0 ? (
                  <span className='tabular-nums text-text-muted'>
                    {selectedStatuses.length}
                  </span>
                ) : null}
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
                      <span className='text-text-muted text-xs'>
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
                <DropdownMenuItem onSelect={() => setFeedback('Bulk email prepared in this demo. No email was sent.')}>Bulk email</DropdownMenuItem>
                <DropdownMenuItem asChild><a href={`data:text/csv;charset=utf-8,${encodeURIComponent('status,count\n' + (selectedStatuses.length ? selectedStatuses : statuses).map((status) => `${status},${statusCounts[status]}`).join('\n'))}`} download='contact-summary.csv'>Export CSV</a></DropdownMenuItem>
                <DropdownMenuItem asChild><a href='/contacts/new'>Add contact</a></DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <p role='status' className='text-xs text-text-muted'>{feedback}</p>
    </Field>
  );
}
