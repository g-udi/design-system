'use client';
import { useEffect, useState } from 'react';
import {
  DateSelector,
  formatDateValue
} from '../../../../src/components/core/Calendar/parts/date-selector-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
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
    if (internalValue) {
      setValue(internalValue);
    }
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-56 justify-start'>
          <RegistryIcon lucide='CalendarIcon' />
          {displayText}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Select Due Date</DialogTitle>
        </DialogHeader>

        <DateSelector
          value={internalValue}
          onChange={setInternalValue}
          showInput={true}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
