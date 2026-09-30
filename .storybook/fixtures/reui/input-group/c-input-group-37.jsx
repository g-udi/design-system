// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
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
const statuses = ['Pending', 'Shipped', 'Cancelled'];
function toggleStatus(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
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
          aria-label='Search orders...'
          placeholder='Search orders...'
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
                aria-label='Filter order status'
              >
                <RegistryIcon
                  lucide='ListFilterIcon'
                  className='size-3.5'
                  aria-hidden='true'
                />
                Status
                {selectedStatuses.length > 0 ? (
                  <span className='text-ui-muted-foreground tabular-nums'>
                    {selectedStatuses.length}
                  </span>
                ) : null}
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-40 p-3'>
              <div className='flex flex-col gap-2'>
                {statuses.map((status) => (
                  <div key={status} className='flex items-center gap-2.5'>
                    <Checkbox
                      id={`order-status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          toggleStatus(previous, status)
                        )
                      }
                    />
                    <Label
                      htmlFor={`order-status-${status}`}
                      className='text-sm font-normal'
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
