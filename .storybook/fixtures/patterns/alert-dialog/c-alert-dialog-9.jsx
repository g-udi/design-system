import {
  DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationTitle,
  DialogConfirmationTrigger
} from '../../../../src/components/core/Dialog/parts/dialog-confirmation.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <DialogConfirmation>
      <DialogConfirmationTrigger asChild>
        <Button variant='outline'>Discard Changes</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent className='gap-0 overflow-hidden p-0 sm:max-w-md'>
        <div className='flex items-start gap-3 p-4'>
          <div className='rounded-full flex size-10 shrink-0 items-center justify-center border border-amber-100 bg-amber-50 text-amber-500 dark:bg-amber-950 dark:text-amber-300'>
            <RegistryIcon lucide='CardSimIcon' className='size-5' />
          </div>
          <div className='flex flex-col justify-center gap-1'>
            <DialogConfirmationTitle className='text-sm font-semibold'>
              Unsaved changes
            </DialogConfirmationTitle>
            <DialogConfirmationDescription className='text-ui-muted-foreground text-sm'>
              You have unsaved changes in this form. If you leave now, your
              progress will be lost.
            </DialogConfirmationDescription>
          </div>
        </div>
        <DialogConfirmationFooter className='mx-0 mb-0 items-center gap-4 border-t p-4 sm:justify-between'>
          <div className='flex items-center gap-2'>
            <Checkbox id='dont-ask-again' />
            <Label
              htmlFor='dont-ask-again'
              className='text-ui-muted-foreground font-normal'
            >
              Don&apos;t ask again
            </Label>
          </div>
          <div className='flex items-center gap-2'>
            <DialogConfirmationCancel>Stay</DialogConfirmationCancel>
            <DialogConfirmationAction>Discard Changes</DialogConfirmationAction>
          </div>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
