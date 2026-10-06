'use client';
import { useId } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DialogRoot as Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@gaudi/design-system/core/Dialog';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import {
  SelectRoot as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';

const roles = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' }
];

// The popup layers above the dialog and stays inside its focus trap.
export function Pattern() {
  const id = useId();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>Choose the role they join with.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor={`${id}-select-dialog-role`}>Role</FieldLabel>
          <Select defaultValue='editor'>
            <SelectTrigger id={`${id}-select-dialog-role`} className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectGroup>
                {roles.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </DialogContent>
    </Dialog>
  );
}
