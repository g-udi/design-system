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
        <Button variant='outline'>Task Status</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent>
        <div className='flex items-center gap-3 py-1'>
          <div className='rounded-full flex size-10 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-300'>
            <RegistryIcon lucide='CheckIcon' className='size-5' />
          </div>
          <div className='flex flex-col justify-center gap-1'>
            <DialogConfirmationTitle className='text-sm font-semibold'>
              Task successful
            </DialogConfirmationTitle>
            <DialogConfirmationDescription className='text-ui-muted-foreground text-sm'>
              Your task has been completed successfully.
            </DialogConfirmationDescription>
          </div>
        </div>
        <DialogConfirmationFooter className='items-center gap-4 sm:justify-between'>
          <div className='flex items-center gap-2'>
            <Checkbox id='show-again' />
            <Label
              htmlFor='show-again'
              className='text-ui-muted-foreground font-normal'
            >
              Don&apos;t show again
            </Label>
          </div>
          <div className='flex items-center gap-2'>
            <DialogConfirmationCancel>Cancel</DialogConfirmationCancel>
            <DialogConfirmationAction>Confirm</DialogConfirmationAction>
          </div>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
