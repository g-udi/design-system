import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant='outline'>Custom Close Button</Button>
          </DialogTrigger>
          <DialogContent
            className={cn(
              '[&>[data-slot=dialog-close]]:bg-ui-background [&>[data-slot=dialog-close]]:-end-6 [&>[data-slot=dialog-close]]:-top-6',
              '[&>[data-slot=dialog-close]]:size-7 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:shadow-sm'
            )}
          >
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done. Your profile will be updated immediately.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name-1'>Name</FieldLabel>
                <Input id='name-1' name='name' defaultValue='Albert Einstein' />
              </Field>
              <Field>
                <FieldLabel htmlFor='username-1'>Username</FieldLabel>
                <Input id='username-1' name='username' defaultValue='@albert' />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
