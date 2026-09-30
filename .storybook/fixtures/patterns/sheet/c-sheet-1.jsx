import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Dialog/parts/sheet.jsx';

export function Pattern() {
  const [closeButton, setCloseButton] = useState(true);
  return (
    <div className='flex flex-wrap items-center justify-center gap-3'>
      <Sheet>
        <SheetTrigger asChild>
          <Button size='sm' variant='outline'>Edit profile</Button>
        </SheetTrigger>
        <SheetContent showCloseButton={closeButton}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </SheetDescription>
          </SheetHeader>
          <div className='p-3'>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='sheet-name'>Name</FieldLabel>
                <Input id='sheet-name' defaultValue='Maya Patel' />
              </Field>
              <Field>
                <FieldLabel htmlFor='sheet-username'>Username</FieldLabel>
                <Input id='sheet-username' defaultValue='@maya' />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type='submit'>Save changes</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant='outline'>Cancel</Button>
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
