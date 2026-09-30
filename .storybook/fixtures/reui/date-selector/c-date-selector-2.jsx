// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useEffect, useState } from 'react';
import {
  DateSelector,
  formatDateValue
} from '../../../../src/components/core/Calendar/parts/date-selector-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [value, setValue] = useState();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const formattedValue = value ? formatDateValue(value) : '';
  const displayText = formattedValue || 'Select a date';
  useEffect(() => {
    if (open) {
      setInternalValue(value);
    }
  }, [open, value]);
  const handleApply = () => {
    setValue(internalValue);
    setOpen(false);
  };
  const handleCancel = () => {
    setInternalValue(value);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-56 justify-start'>
          <RegistryIcon lucide='CalendarIcon' />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto gap-3 p-0' align='start' sideOffset={4}>
        <div className='p-3'>
          <DateSelector
            value={internalValue}
            onChange={setInternalValue}
            allowRange={true}
            label='Due date'
            inputHint='Try: 2025, Q4, 05/10/2025'
          />
        </div>
        <Separator className='p-0' />
        <div className='flex justify-end gap-2 p-3 pt-0'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
