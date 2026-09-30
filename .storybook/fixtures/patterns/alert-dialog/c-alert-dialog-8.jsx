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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <DialogConfirmation>
      <DialogConfirmationTrigger asChild>
        <Button variant='destructive'>Deactivate Account</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent>
        <div className='flex items-start gap-3 py-1'>
          <div className='bg-ui-destructive/10 dark:bg-ui-destructive/10 rounded-full flex size-10 shrink-0 items-center justify-center'>
            <RegistryIcon
              lucide='CircleAlertIcon'
              className='text-ui-destructive size-5'
            />
          </div>
          <div className='flex flex-col justify-center gap-1'>
            <DialogConfirmationTitle className='text-sm font-semibold'>
              Deactivate your account?
            </DialogConfirmationTitle>
            <DialogConfirmationDescription className='text-ui-muted-foreground text-sm'>
              This will disable your account and remove your profile from all
              active searches.
            </DialogConfirmationDescription>
          </div>
        </div>
        <DialogConfirmationFooter>
          <DialogConfirmationCancel>Keep My Account</DialogConfirmationCancel>
          <DialogConfirmationAction variant='destructive'>
            Deactivate Anyway
          </DialogConfirmationAction>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
