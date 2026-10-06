'use client';
import { useId, useState } from 'react';
import { format } from 'date-fns';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import {
  FieldRoot as Field,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import { Label } from '@gaudi/design-system/core/Field';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@gaudi/design-system/core/Sheet';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const metadata = [
  { id: 'status', label: 'Status', value: 'planned', options: [['backlog', 'Backlog'], ['planned', 'Planned'], ['active', 'In progress']] },
  { id: 'priority', label: 'Priority', value: 'high', options: [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['urgent', 'Urgent']] },
  { id: 'lead', label: 'Lead', value: 'maya', options: [['maya', 'Maya Patel'], ['leo', 'Leo Martins'], ['ana', 'Ana Costa']] }
];

export function Pattern() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState('');
  const [closeButton, setCloseButton] = useState(true);
  const [target, setTarget] = useState(new Date(2026, 10, 28));
  return (
    <div className='flex flex-wrap items-center justify-center gap-3'>
      <Sheet open={open} onOpenChange={setOpen}>
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
          <form className='flex min-h-0 flex-1 flex-col' onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setCreated(`Created local project: ${data.get('name')}`);
            setOpen(false);
          }}>
          <FieldGroup className='min-h-0 flex-1 overflow-y-auto px-3'>
            <Field>
              <FieldLabel htmlFor={`${id}-project-name`}>Name</FieldLabel>
              <Input name='name' required id={`${id}-project-name`} defaultValue='Reader onboarding' />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-project-summary`}>Summary</FieldLabel>
              <Textarea name='summary' id={`${id}-project-summary`} rows={3} defaultValue='A guided first week for new subscribers: welcome email, reading list and a feedback check-in.' />
            </Field>
            {/* Metadata sits inline, one compact select each. */}
            <div className='grid gap-3 sm:grid-cols-3'>
              {metadata.map((item) => (
                <Field key={item.id}>
                  <FieldLabel htmlFor={`${id}-project-${item.id}`}>{item.label}</FieldLabel>
                  <Select name={item.id} defaultValue={item.value}>
                    <SelectTrigger id={`${id}-project-${item.id}`} className='w-full'>
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
              <FieldLabel htmlFor={`${id}-project-target`}>Target date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type='button' id={`${id}-project-target`} variant='outline' className='w-full justify-between'>
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
              <Button type='button' variant='outline'>Cancel</Button>
            </SheetClose>
            <Button type='submit'>Create project</Button>
          </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {created ? <p role='status' className='w-full text-center text-sm text-text-muted'>{created}</p> : null}
      <div className='flex items-center gap-2'>
        <Switch id={`${id}-sheet-close-button`} size='sm' checked={closeButton} onCheckedChange={setCloseButton} />
        <Label htmlFor={`${id}-sheet-close-button`}>Close button</Label>
      </div>
    </div>
  );
}
