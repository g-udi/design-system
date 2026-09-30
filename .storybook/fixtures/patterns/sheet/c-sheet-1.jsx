import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
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
  return (
    <div className='flex items-center justify-center'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline'>Show Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div className='p-3'>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name'>Name</FieldLabel>
                <Input id='name' defaultValue='John Doe' />
              </Field>
              <Field>
                <FieldLabel htmlFor='username'>Username</FieldLabel>
                <Input id='username' defaultValue='@john-doe' />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type='submit'>Save changes</Button>
            <SheetClose asChild>
              <Button variant='outline'>Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
