import { useId, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DialogRoot as Dialog,
  DialogClosePrimitive as DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@gaudi/design-system/core/Dialog';
import {
  FieldRoot as Field,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
export function Pattern() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({ name: 'Maya Patel', username: '@maya' });
  const [saved, setSaved] = useState(false);
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline'>Basic Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <form className='grid gap-4' onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setProfile({ name: data.get('name'), username: data.get('username') });
              setSaved(true);
              setOpen(false);
            }}>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done. Changes remain in this local demo.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
                <Input id={`${id}-name`} name='name' defaultValue={profile.name} required />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-username`}>Username</FieldLabel>
                <Input
                  id={`${id}-username`}
                  name='username'
                  defaultValue={profile.username}
                  required
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
      {saved && <p role='status' className='text-sm text-text-muted'>Saved {profile.name} ({profile.username}) in this demo.</p>}
    </div>
  );
}
