'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const metadata = [
  { id: 'status', label: 'Status', value: 'planned', options: [['backlog', 'Backlog'], ['planned', 'Planned'], ['active', 'In progress']] },
  { id: 'priority', label: 'Priority', value: 'high', options: [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['urgent', 'Urgent']] },
  { id: 'lead', label: 'Lead', value: 'maya', options: [['maya', 'Maya Patel'], ['leo', 'Leo Martins'], ['ana', 'Ana Costa']] }
];

export function Pattern() {
  const [closeButton, setCloseButton] = useState(true);
  const [target, setTarget] = useState(new Date(2026, 10, 28));
  return (
    <div className='flex flex-wrap items-center justify-center gap-3'>
      <Sheet>
        <SheetTrigger asChild>
          <Button size='sm' variant='outline'>
            <RegistryIcon lucide='FolderPlusIcon' aria-hidden='true' />
            New project
          </Button>
        </SheetTrigger>
        <SheetContent size='md' showCloseButton={closeButton}>
          <SheetHeader>
            <SheetTitle>New project</SheetTitle>
            <SheetDescription>Name it, set who leads it and when it should land.</SheetDescription>
          </SheetHeader>
          <FieldGroup className='min-h-0 flex-1 overflow-y-auto px-3'>
            <Field>
              <FieldLabel htmlFor='project-name'>Name</FieldLabel>
              <Input id='project-name' defaultValue='Reader onboarding' />
            </Field>
            <Field>
              <FieldLabel htmlFor='project-summary'>Summary</FieldLabel>
              <Textarea id='project-summary' rows={3} defaultValue='A guided first week for new subscribers: welcome email, reading list and a feedback check-in.' />
            </Field>
            {/* Metadata sits inline, one compact select each. */}
            <div className='grid gap-3 sm:grid-cols-3'>
              {metadata.map((item) => (
                <Field key={item.id}>
                  <FieldLabel htmlFor={`project-${item.id}`}>{item.label}</FieldLabel>
                  <Select defaultValue={item.value}>
                    <SelectTrigger id={`project-${item.id}`} className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position='popper'>
                      {item.options.map(([value, text]) => (
                        <SelectItem key={value} value={value}>{text}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              ))}
            </div>
            <Field>
              <FieldLabel htmlFor='project-target'>Target date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id='project-target' variant='outline' className='w-full justify-between'>
                    {target ? format(target, 'EEE, LLL d, y') : 'Pick a date'}
                    <RegistryIcon lucide='CalendarIcon' aria-hidden='true' className='text-text-muted' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-auto p-0'>
                  <Calendar mode='single' selected={target} onSelect={setTarget} defaultMonth={target} />
                </PopoverContent>
              </Popover>
            </Field>
          </FieldGroup>
          <SheetFooter className='flex-row justify-end border-t'>
            <SheetClose asChild>
              <Button variant='outline'>Cancel</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button type='submit'>Create project</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <div className='flex items-center gap-2'>
        <Switch id='sheet-close-button' size='sm' checked={closeButton} onCheckedChange={setCloseButton} />
        <Label htmlFor='sheet-close-button'>Close button</Label>
      </div>
    </div>
  );
}
